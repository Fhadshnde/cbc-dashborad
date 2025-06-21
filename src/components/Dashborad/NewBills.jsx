import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

const API_URL = "https://hawkama.cbc-api.app/api/reports";

const NewBills = () => {
  const [latestBills, setLatestBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  }, [navigate]);

  const getStatusText = (status) => {
    switch (status) {
      case "pending": return "بانتظار المراجعة";
      case "rejected": return "مرفوضة";
      case "canceled": return "ملغاة";
      case "received": return "تم الاستلام";
      case "processing": return "قيد التنفيذ";
      default: return "غير معروف";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "#FFC107";
      case "rejected": return "#DC3545";
      case "canceled": return "#6C757D";
      case "received": return "#28A745";
      case "processing": return "#007BFF";
      default: return "#ADB5BD";
    }
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `منذ ${diffMinutes} دقيقة`;
    } else if (diffHours < 24) {
      return `منذ ${diffHours} ساعة`;
    } else if (diffDays === 1) {
      return "أمس";
    } else {
      const options = { day: 'numeric', month: 'long', year: 'numeric' };
      return date.toLocaleDateString('ar-EG', options);
    }
  };

  const fetchLatestBills = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getAuthHeader();
      if (!headers) return;

      const response = await axios.get(API_URL, { headers });
      
      const sortedReports = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      const mappedBills = sortedReports.map(report => ({
        code: report._id.slice(-6),
        status: getStatusText(report.status),
        time: getRelativeTime(report.createdAt),
        color: getStatusColor(report.status),
        adminName: report.admin
      }));
      setLatestBills(mappedBills);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/login');
      } else {
        setError("حدث خطأ أثناء جلب الفواتير الجديدة: " + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  }, [getAuthHeader, navigate]);

  useEffect(() => {
    fetchLatestBills();
  }, [fetchLatestBills]);

  return (
    <div
      className="
        p-4 rounded-lg bg-white shadow-md overflow-y-auto
        w-[560px] max-w-[420px] min-w-[360px] h-auto md:h-[450px] mx-auto
        transition-all duration-300
        [@media(max-width:600px)]:w-[320px]
        [@media(max-width:600px)]:max-w-[100vw]
        [@media(max-width:600px)]:min-w-0
        [@media(max-width:600px)]:mr-[36px]
      "
    >
      <h2 className="text-lg font-bold text-center mb-6">الفواتير المضافة حديثاً</h2>
      
      {loading && <div className="text-center text-gray-600 py-4">جاري تحميل الفواتير...</div>}
      {error && <div className="text-center text-red-600 py-4">{error}</div>}

      {!loading && !error && latestBills.length === 0 && (
        <div className="text-center text-gray-500 py-4">لا توجد فواتير مضافة حديثاً.</div>
      )}

      <div className="flex flex-col gap-4 px-2">
        {!loading && !error && latestBills.map((bill, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-100">
              <FaBell className="text-gray-400 text-lg" />
            </div>

            <div className="flex flex-col text-right flex-1">
              <span className="text-sm font-semibold text-gray-700">{bill.status}</span>
              <span className="text-sm text-gray-500">تمت إضافة فاتورة جديدة بواسطة {bill.adminName}</span>
              <span className="text-xs text-gray-400">{bill.time}</span>
            </div>

            <div className="flex flex-col items-end flex-shrink-0">
              <div className="flex items-center">
                <span
                  className="w-2 h-2 rounded-full ml-2"
                  style={{ backgroundColor: bill.color }}
                ></span>
                <span className="text-sm text-gray-500">{bill.code}</span>
              </div>
              <FontAwesomeIcon
                icon={faAngleLeft}
                className="text-gray-400 text-sm cursor-pointer hover:text-gray-600 mt-1"
                onClick={() => console.log("Navigate to bill details", bill.code)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewBills;
