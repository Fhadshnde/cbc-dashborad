import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

const EmployeeReports = () => {
  const { adminUsername } = useParams();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchEmployeeReports = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('لم يتم العثور على رمز المصادقة. يرجى تسجيل الدخول.');
        setLoading(false);
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get('https://hawkama.cbc-api.app/api/reports', config);
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
    fetchEmployeeReports();
  }, [fetchEmployeeReports]);

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
          <svg
            className="w-4 h-4 ml-2 rtl:rotate-180"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
          لوحة التحكم
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">التقرير الخاص بـ {decodeURIComponent(adminUsername)}</h1>
        <div className="text-gray-500">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            ></path>
          </svg>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between mb-5 gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="startDate" className="font-bold text-gray-700 whitespace-nowrap">
            يبدأ في
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate ? moment(startDate).format('YYYY-MM-DD') : ''}
            onChange={(e) => setStartDate(moment(e.target.value).startOf('day').toISOString())}
            className="p-2 border border-gray-300 rounded-md text-sm w-40"
          />
          <label htmlFor="endDate" className="font-bold text-gray-700 whitespace-nowrap">
            ينتهي في
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate ? moment(endDate).format('YYYY-MM-DD') : ''}
            onChange={(e) => setEndDate(moment(e.target.value).endOf('day').toISOString())}
            className="p-2 border border-gray-300 rounded-md text-sm w-40"
          />
          <div className="flex flex-col mr-20">
            <label htmlFor="statusFilter" className="font-bold text-gray-700 whitespace-nowrap">
              الحالة
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border border-gray-300 rounded-md text-sm w-40"
            >
              <option value="">كل الحالات</option>
              <option value="pending">قيد الانتظار</option>
              <option value="rejected">مرفوضة</option>
              <option value="canceled">ملغاة</option>
              <option value="received">مستلمة</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 ml-2">
          <button
            className="bg-gray-100 text-gray-800 border border-gray-300 rounded-md px-4 py-2 text-sm flex items-center hover:bg-gray-200 transition-colors duration-200"
            onClick={handleExport}
          >
            <svg
              className="ml-2"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
              <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V5.5a.5.5 0 0 0-1 0v4.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
            </svg>
            تصدير
          </button>

          <button
            className="bg-green-500 text-white rounded-md px-4 py-2 text-sm hover:bg-green-600 transition-colors duration-200"
            onClick={handleSearch}
          >
            بحث
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        {['daily', 'weekly', 'monthly', 'halfYearly', 'yearly'].map((period) => {
          const labels = {
            daily: 'يومي',
            weekly: 'أسبوعي',
            monthly: 'شهري',
            halfYearly: 'نصف سنوي',
            yearly: 'سنوي',
          };
          return (
            <button
              key={period}
              className={`px-4 py-2 text-sm rounded-md transition-colors duration-200 ${
                selectedPeriod === period ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => handlePeriodChange(period)}
            >
              {labels[period]}
            </button>
          );
        })}
      </div>

      {!loading && !error && reports.length === 0 ? (
        <p className="text-center text-gray-500 p-5">لا توجد تقارير لهذا الموظف في الفترة المحددة.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-4 border-b border-gray-300 font-semibold text-gray-700 text-right">اسم الزبون</th>
                <th className="py-3 px-4 border-b border-gray-300 font-semibold text-gray-700 text-right">رقم الهاتف</th>
                <th className="py-3 px-4 border-b border-gray-300 font-semibold text-gray-700 text-right">المقدمات</th>
                <th className="py-3 px-4 border-b border-gray-300 font-semibold text-gray-700 text-right">المتبقي</th>
                <th className="py-3 px-4 border-b border-gray-300 font-semibold text-gray-700 text-right">المبالغ الكلية</th>
                <th className="py-3 px-4 border-b border-gray-300 font-semibold text-gray-700 text-right">البطاقات المستلمة</th>
                <th className="py-3 px-4 border-b border-gray-300 font-semibold text-gray-700 text-right">البطاقات المرفوضة</th>
                <th className="py-3 px-4 border-b border-gray-300 font-semibold text-gray-700 text-right">البطاقات الملغاة</th>
                <th className="py-3 px-4 border-b border-gray-300 font-semibold text-gray-700 text-right">بانتظار المراجعة</th>
                <th className="py-3 px-4 border-b border-gray-300 font-semibold text-gray-700 text-right">تاريخ التقرير</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id} className="border-b border-gray-200 hover:bg-gray-50">
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
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeReports;
