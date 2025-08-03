import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

const API_URL = "https://hawkama.cbc-api.app/api/reports";

const EmployeeReports = () => {
  const { adminUsername } = useParams();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const [statusFilter, setStatusFilter] = useState('');
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData && storedUserData !== "undefined") {
      try {
        const userData = JSON.parse(storedUserData);
        setUserRole(userData?.role);
      } catch {
        setUserRole(null);
      }
    }
  }, []);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('لم يتم العثور على رمز المصادقة. يرجى تسجيل الدخول.');
      throw new Error('توكن غير موجود');
    }
    return { Authorization: `Bearer ${token}` };
  };

  const fetchEmployeeReports = useCallback(async () => {
    try {
      setLoading(true);
      const config = { headers: getAuthHeader() };
      const response = await axios.get(API_URL, config);
      let filteredReports = response.data.filter(report => report.admin === decodeURIComponent(adminUsername));
      if (startDate && endDate) {
        const startMoment = moment(startDate);
        const endMoment = moment(endDate);
        filteredReports = filteredReports.filter(report => {
          const reportDate = moment(report.createdAt);
          return reportDate.isBetween(startMoment, endMoment, undefined, '[]');
        });
      }
      if (statusFilter) {
        filteredReports = filteredReports.filter(report => report.status === statusFilter);
      }
      setReports(filteredReports);
      setLoading(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || `فشل جلب تقارير الموظف ${decodeURIComponent(adminUsername)}`);
      setLoading(false);
    }
  }, [adminUsername, startDate, endDate, statusFilter]);

  useEffect(() => {
    if (userRole !== null) {
      fetchEmployeeReports();
    }
  }, [fetchEmployeeReports, userRole]);

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    const now = moment();
    let start = '';
    let end = '';
    switch (period) {
      case 'daily':
        start = now.startOf('day').toISOString();
        end = now.endOf('day').toISOString();
        break;
      case 'weekly':
        start = now.startOf('week').toISOString();
        end = now.endOf('week').toISOString();
        break;
      case 'monthly':
        start = now.startOf('month').toISOString();
        end = now.endOf('month').toISOString();
        break;
      case 'halfYearly':
        start = now.subtract(6, 'months').startOf('month').toISOString();
        end = moment().endOf('month').toISOString();
        break;
      case 'yearly':
        start = now.startOf('year').toISOString();
        end = now.endOf('year').toISOString();
        break;
      default:
        break;
    }
    setStartDate(start);
    setEndDate(end);
  };

  const handleSearch = () => {
    fetchEmployeeReports();
  };

  const handleExport = () => {
    alert('سيتم تطبيق وظيفة التصدير لتقارير الموظفين قريباً!');
  };

  const handleStatusChange = async (id, currentStatus, newStatus) => {
    if (userRole === "supervisor") {
      const validStatuses = ["pending", "rejected", "canceled", "received", "processing", "approved"];
      if (!validStatuses.includes(newStatus)) {
        setError("المشرف لا يمكنه تغيير الحالة إلى هذه القيمة.");
        return;
      }
    } else if (userRole === "admin") {
      if (newStatus !== "canceled") {
        setError("المدير يمكنه تغيير الحالة إلى 'ملغاة' فقط.");
        return;
      }
    } else {
      setError("ليس لديك صلاحية لتغيير حالة التقرير.");
      return;
    }
    if (currentStatus === newStatus) return;
    if (!window.confirm(`هل أنت متأكد من تغيير حالة التقرير إلى "${newStatus}"؟`)) return;
    try {
      setLoading(true);
      const headers = { headers: getAuthHeader() };
      await axios.patch(`${API_URL}/${id}/status`, { status: newStatus }, headers);
      await fetchEmployeeReports();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("فشل في تحديث حالة التقرير: " + (err.response?.data?.message || err.message));
    }
  };

  const getDeliveredCards = (report) => {
    return (
      (parseFloat(report.cardCategory?.oneYear) || 0) +
      (parseFloat(report.cardCategory?.twoYears) || 0) +
      (parseFloat(report.cardCategory?.virtual) || 0)
    );
  };

  const getRejectedCards = (report) => {
    return report.status === 'rejected' ? getDeliveredCards(report) : 0;
  };

  const getReceivedCards = (report) => {
    return report.status === 'received' ? getDeliveredCards(report) : 0;
  };

  const getCanceledCards = (report) => {
    return report.status === 'canceled' ? getDeliveredCards(report) : 0;
  };

  const getPendingCards = (report) => {
    return report.status === 'pending' ? getDeliveredCards(report) : 0;
  };

  const getPaidAmount = (report) => {
    return parseFloat(report.moneyPaid) || 0;
  };

  const getTotalAmount = (report) => {
    return parseFloat(report.quantity) || 0;
  };

  const getRemainingAmount = (report) => {
    if (report.moneyRemain !== undefined && report.moneyRemain !== null) {
      return parseFloat(report.moneyRemain);
    }
    return getTotalAmount(report) - getPaidAmount(report);
  };

  const calculateTotals = () => {
    return reports.reduce(
      (acc, report) => {
        acc.paidAmount += getPaidAmount(report);
        acc.remainingAmount += getRemainingAmount(report);
        acc.totalAmount += getTotalAmount(report);
        acc.receivedCards += getReceivedCards(report);
        acc.rejectedCards += getRejectedCards(report);
        acc.canceledCards += getCanceledCards(report);
        acc.pendingCards += getPendingCards(report);
        return acc;
      },
      {
        paidAmount: 0,
        remainingAmount: 0,
        totalAmount: 0,
        receivedCards: 0,
        rejectedCards: 0,
        canceledCards: 0,
        pendingCards: 0,
      }
    );
  };

  const totals = calculateTotals();

  return (
    <div className="p-5 font-sans rtl text-right">
      <div className="flex items-center justify-between mb-6">
        <Link to="/summary-reports" className="text-blue-600 hover:underline flex items-center">
          <svg className="w-4 h-4 ml-2 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
          لوحة التحكم
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">التقرير الخاص بـ {decodeURIComponent(adminUsername)}</h1>
        <div className="text-gray-500">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between mb-5 gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="startDate" className="font-bold text-gray-700 whitespace-nowrap">يبدأ في</label>
          <input type="date" id="startDate" value={startDate ? moment(startDate).format('YYYY-MM-DD') : ''} onChange={(e) => setStartDate(moment(e.target.value).startOf('day').toISOString())} className="p-2 border border-gray-300 rounded-md text-sm w-40"/>
          <label htmlFor="endDate" className="font-bold text-gray-700 whitespace-nowrap">ينتهي في</label>
          <input type="date" id="endDate" value={endDate ? moment(endDate).format('YYYY-MM-DD') : ''} onChange={(e) => setEndDate(moment(e.target.value).endOf('day').toISOString())} className="p-2 border border-gray-300 rounded-md text-sm w-40"/>
          <div className="flex flex-col mr-20">
            <label htmlFor="statusFilter" className="font-bold text-gray-700 whitespace-nowrap">الحالة</label>
            <select id="statusFilter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="p-2 border border-gray-300 rounded-md text-sm w-40">
              <option value="">كل الحالات</option>
              <option value="pending">قيد الانتظار</option>
              <option value="rejected">مرفوضة</option>
              <option value="canceled">ملغاة</option>
              <option value="received">مستلمة</option>
              <option value="processing">قيد المعالجة</option>
              <option value="approved">موافقة</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2 ml-2">
          <button className="bg-gray-100 text-gray-800 border border-gray-300 rounded-md px-4 py-2 text-sm hover:bg-gray-200" onClick={handleExport}>تصدير</button>
          <button className="bg-green-500 text-white rounded-md px-4 py-2 text-sm hover:bg-green-600" onClick={handleSearch}>بحث</button>
        </div>
      </div>

      {!loading && !error && reports.length === 0 ? (
        <p className="text-center text-gray-500 p-5">لا توجد تقارير لهذا الموظف في الفترة المحددة.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden text-sm">
            <thead className="bg-gray-200 text-gray-700 font-bold">
              <tr>
                <th className="py-3 px-4 border">اسم الزبون</th>
                <th className="py-3 px-4 border">رقم الهاتف</th>
                <th className="py-3 px-4 border">المقدمات</th>
                <th className="py-3 px-4 border">المتبقي</th>
                <th className="py-3 px-4 border">المبالغ الكلية</th>
                <th className="py-3 px-4 border">البطاقات المستلمة</th>
                <th className="py-3 px-4 border">البطاقات المرفوضة</th>
                <th className="py-3 px-4 border">البطاقات الملغاة</th>
                <th className="py-3 px-4 border">بانتظار المراجعة</th>
                <th className="py-3 px-4 border">تاريخ التقرير</th>
                <th className="py-3 px-4 border">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4">{report.name_ar || 'غير متوفر'}</td>
                  <td className="py-2 px-4">{report.phoneNumber || 'غير متوفر'}</td>
                  <td className="py-2 px-4">{getPaidAmount(report).toLocaleString('en-US')}</td>
                  <td className="py-2 px-4">{getRemainingAmount(report).toLocaleString('en-US')}</td>
                  <td className="py-2 px-4">{getTotalAmount(report).toLocaleString('en-US')}</td>
                  <td className="py-2 px-4">{getReceivedCards(report)}</td>
                  <td className="py-2 px-4">{getRejectedCards(report)}</td>
                  <td className="py-2 px-4">{getCanceledCards(report)}</td>
                  <td className="py-2 px-4">{getPendingCards(report)}</td>
                  <td className="py-2 px-4">{moment(report.createdAt).format('YYYY-MM-DD')}</td>
                  <td className="py-2 px-4">
                    {(userRole === "supervisor" || userRole === "admin") ? (
                      <select
                        value={report.status}
                        onChange={(e) => handleStatusChange(report._id, report.status, e.target.value)}
                        className="border p-1 rounded text-sm w-full"
                      >
                        {userRole === "supervisor" && <option value="pending">قيد الانتظار</option>}
                        {userRole === "supervisor" && <option value="rejected">مرفوضة</option>}
                        <option value="canceled">ملغاة</option>
                        {userRole === "supervisor" && <option value="received">تم الاستلام</option>}
                        {userRole === "supervisor" && <option value="processing">قيد المعالجة</option>}
                        {userRole === "supervisor" && <option value="approved">موافقة</option>}
                        {userRole === "admin" && report.status !== "canceled" && (
                          <option value={report.status} disabled>{report.status}</option>
                        )}
                      </select>
                    ) : (
                      <span className="text-gray-500">{report.status}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-100 font-bold">
              <tr>
                <td className="py-3 px-4"></td>
                <td className="py-3 px-4"></td>
                <td className="py-3 px-4">{totals.paidAmount.toLocaleString('en-US')}</td>
                <td className="py-3 px-4">{totals.remainingAmount.toLocaleString('en-US')}</td>
                <td className="py-3 px-4">{totals.totalAmount.toLocaleString('en-US')}</td>
                <td className="py-3 px-4">{totals.receivedCards}</td>
                <td className="py-3 px-4">{totals.rejectedCards}</td>
                <td className="py-3 px-4">{totals.canceledCards}</td>
                <td className="py-3 px-4">{totals.pendingCards}</td>
                <td className="py-3 px-4">الإجمالي:</td>
                <td className="py-3 px-4"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeReports;
