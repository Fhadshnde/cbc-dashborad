import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NotificationIcon from '../../assets/NotificationIcon.jpeg';
import { FaUsers } from 'react-icons/fa';

const API_URL = "https://hawkama.cbc-api.app/api/reports";

const TotalBills = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalBillsDisplayData, setTotalBillsDisplayData] = useState([]);

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

  const calculateAndSetTotalBillsData = useCallback(() => {
    const now = new Date();
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    let weeklyBills = 0;
    let weeklyCount = 0;
    let monthlyBills = 0;
    let monthlyCount = 0;
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
      if (report.status === "received") {
        paidBills += quantity;
        paidCount++;
      } else {
        if (remaining > 0) {
          unpaidBills += remaining;
          unpaidCount++;
        }
      }
    });

    setTotalBillsDisplayData([
      {
        title: 'فواتير هذا الأسبوع',
        icon: <img src={NotificationIcon} alt="Notification" className="w-12 h-12" />,
        bills: `${weeklyBills.toLocaleString('ar-IQ')} IQD`,
        numberOfInvoices: weeklyCount,
        titleColor: "#25BC9D"
      },
      {
        title: 'فواتير هذا الشهر',
        icon: <FaUsers className="text-[#b51a00] text-3xl w-12 h-12" />,
        bills: `${monthlyBills.toLocaleString('ar-IQ')} IQD`,
        numberOfInvoices: monthlyCount,
        titleColor: "#b51a00"
      },
      {
        title: 'فواتير مدفوعة',
        icon: <img src={NotificationIcon} alt="Notification" className="w-12 h-12" />,
        bills: `${paidBills.toLocaleString('ar-IQ')} IQD`,
        numberOfInvoices: paidCount,
        titleColor: "#25BC9D"
      },
      {
        title: 'فواتير غير مدفوعة',
        icon: <FaUsers className="text-[#b51a00] text-3xl w-12 h-12" />,
        bills: `${unpaidBills.toLocaleString('ar-IQ')} IQD`,
        numberOfInvoices: unpaidCount,
        titleColor: "#b51a00"
      },
    ]);
  }, [reports]);

  useEffect(() => {
    if (reports.length > 0) {
      calculateAndSetTotalBillsData();
    } else {
      setTotalBillsDisplayData([]);
    }
  }, [reports, calculateAndSetTotalBillsData]);

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
      {totalBillsDisplayData.map((item, index) => (
        <div
          key={index}
          className="bg-white flex-1 min-w-[200px] h-[150px] rounded-lg p-4 shadow flex flex-col items-center"
        >
          <div className="flex flex-col items-center w-full">
            <div className="mb-2">{item.icon}</div>
            <div className="text-sm text-gray-500 text-center">{item.title}</div>
            <div className="w-full text-center text-xl mt-2">
              <div className="font-bold" style={{ color: item.titleColor }}>{item.bills}</div>
              <div className="text-sm text-gray-500 mt-1">{item.numberOfInvoices} فواتير</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TotalBills;
