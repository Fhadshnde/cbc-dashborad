import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  FaCalendarWeek,
  FaCalendarAlt,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaClock,
} from 'react-icons/fa';

const API_URL = "https://hawkama.cbc-api.app/api/reports";

const TotalBills = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalBillsDisplayData, setTotalBillsDisplayData] = useState([]);
  const [filterType, setFilterType] = useState({
    paid: 'monthly',
    unpaid: 'monthly',
    month: 'monthly'
  });

  const navigate = useNavigate();

  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  }, [navigate]);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getAuthHeader();
      if (!headers) {
        setLoading(false);
        return;
      }
      const response = await axios.get(API_URL, { headers });
      setReports(response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/login');
      } else {
        setError("حدث خطأ أثناء جلب البيانات: " + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  }, [getAuthHeader, navigate]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const getDateRange = (type) => {
    const now = new Date();
    let start = new Date();
    let end = new Date();
    switch (type) {
      case 'daily':
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'weekly':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        start.setHours(0, 0, 0, 0);
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 6);
        end.setHours(23, 59, 59, 999);
        break;
      case 'monthly':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        start.setHours(0, 0, 0, 0);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'quarter':
        start = new Date(now);
        start.setMonth(now.getMonth() - 3);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'semiannual':
        start = new Date(now);
        start.setMonth(now.getMonth() - 6);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'yearly':
        start = new Date(now.getFullYear(), 0, 1);
        start.setHours(0, 0, 0, 0);
        end = new Date(now.getFullYear(), 11, 31);
        end.setHours(23, 59, 59, 999);
        break;
      default:
        break;
    }
    return { start, end };
  };

  const calculateAndSetTotalBillsData = useCallback(() => {
    const now = new Date();

    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const { start: monthStart, end: monthEnd } = getDateRange(filterType.month);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    const { start: paidStart, end: paidEnd } = getDateRange(filterType.paid);
    const { start: unpaidStart, end: unpaidEnd } = getDateRange(filterType.unpaid);

    let weeklyBills = 0;
    let weeklyCount = 0;
    let monthlyBills = 0;
    let monthlyCount = 0;
    let filteredMonthBills = 0;
    let filteredMonthCount = 0;
    let paidBills = 0;
    let paidCount = 0;
    let unpaidBills = 0;
    let unpaidCount = 0;

    reports.forEach(report => {
      const reportDate = new Date(report.createdAt);
      reportDate.setHours(0, 0, 0, 0);
      const quantity = parseFloat(report.quantity) || 0;
      const remaining = parseFloat(report.moneyRemain) || 0;

      if (reportDate >= startOfWeek && reportDate <= endOfWeek) {
        weeklyBills += quantity;
        weeklyCount++;
      }

      if (reportDate >= startOfMonth && reportDate <= endOfMonth) {
        monthlyBills += quantity;
        monthlyCount++;
      }

      if (reportDate >= monthStart && reportDate <= monthEnd) {
        filteredMonthBills += quantity;
        filteredMonthCount++;
      }

      if (report.status === "received" && reportDate >= paidStart && reportDate <= paidEnd) {
        paidBills += quantity;
        paidCount++;
      }

      if (report.status !== "received" && remaining > 0 && reportDate >= unpaidStart && reportDate <= unpaidEnd) {
        unpaidBills += remaining;
        unpaidCount++;
      }
    });

    setTotalBillsDisplayData([
      {
        id: 'week',
        title: 'فواتير هذا الأسبوع',
        icon: <FaCalendarWeek className="text-[#25BC9D] text-4xl" />,
        bills: `${weeklyBills.toLocaleString('ar-IQ')} IQD`,
        numberOfInvoices: weeklyCount,
        titleColor: "#25BC9D"
      },
      // {
      //   id: 'monthFixed',
      //   title: 'فواتير الشهر الحالي (ثابت)',
      //   icon: <FaCalendarAlt className="text-[#b51a00] text-4xl" />,
      //   bills: `${monthlyBills.toLocaleString('ar-IQ')} IQD`,
      //   numberOfInvoices: monthlyCount,
      //   titleColor: "#b51a00"
      // },
      {
        id: 'month',
        title: 'فواتير الشهر الحالي',
        icon: <FaCalendarCheck className="text-[#b51a00] text-4xl" />,
        bills: `${filteredMonthBills.toLocaleString('ar-IQ')} IQD`,
        numberOfInvoices: filteredMonthCount,
        titleColor: "#b51a00"
      },
      {
        id: 'paid',
        title: 'فواتير مدفوعة',
        icon: <FaMoneyBillWave className="text-[#25BC9D] text-4xl" />,
        bills: `${paidBills.toLocaleString('ar-IQ')} IQD`,
        numberOfInvoices: paidCount,
        titleColor: "#25BC9D"
      },
      {
        id: 'unpaid',
        title: 'فواتير غير مدفوعة',
        icon: <FaClock className="text-[#b51a00] text-4xl" />,
        bills: `${unpaidBills.toLocaleString('ar-IQ')} IQD`,
        numberOfInvoices: unpaidCount,
        titleColor: "#b51a00"
      },
    ]);
  }, [reports, filterType]);

  useEffect(() => {
    if (reports.length > 0) {
      calculateAndSetTotalBillsData();
    } else {
      setTotalBillsDisplayData([]);
    }
  }, [reports, calculateAndSetTotalBillsData]);

  const handleFilterChange = (id, value) => {
    setFilterType(prev => ({ ...prev, [id]: value }));
  };

  if (loading) {
    return <div className="text-center py-4 text-gray-600">...جاري تحميل ملخص الفواتير</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">{error}</div>;
  }

  if (totalBillsDisplayData.length === 0) {
    return <div className="text-center py-4 text-gray-500">لا توجد بيانات فواتير لعرض الملخص.</div>;
  }

  return (
    <div className="w-full flex flex-wrap justify-between gap-4 mb-8">
      {totalBillsDisplayData.map((item) => (
        <div
          key={item.id}
          className="bg-white flex-1 min-w-[200px] h-[200px] rounded-lg p-4 shadow flex flex-col items-center"
        >
          <div className="flex flex-col items-center w-full">
            <div className="mb-2">{item.icon}</div>
            <div className="text-sm text-gray-500 text-center">{item.title}</div>
            <div className="w-full text-center text-xl mt-2">
              <div className="font-bold" style={{ color: item.titleColor }}>{item.bills}</div>
              <div className="text-sm text-gray-500 mt-1">{item.numberOfInvoices} فواتير</div>
            </div>

            {(item.id === 'paid' || item.id === 'unpaid' || item.id === 'month') && (
              <select
                className="mt-3 border border-gray-300 rounded p-1 text-sm w-full"
                value={filterType[item.id]}
                onChange={(e) => handleFilterChange(item.id, e.target.value)}
              >
                <option value="daily">يومي</option>
                <option value="weekly">أسبوعي</option>
                <option value="monthly">شهري</option>
                <option value="quarter">٣ أشهر</option>
                <option value="semiannual">نصف سنوي</option>
                <option value="yearly">سنوي</option>
              </select>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TotalBills;
