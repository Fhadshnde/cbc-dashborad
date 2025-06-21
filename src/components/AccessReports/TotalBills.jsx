import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// استيراد الأيقونات مباشرة في هذا المكون بما أنه سيقوم بحساب وعرض البيانات بنفسه
import NotificationIcon from '../../assets/NotificationIcon.jpeg'; // تأكد أن هذا المسار صحيح
import { FaUsers } from 'react-icons/fa'; // استيراد FaUsers

const API_URL = "https://hawkama.cbc-api.app/api/reports"; // نقطة نهاية API لجلب التقارير

const TotalBills = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalBillsDisplayData, setTotalBillsDisplayData] = useState([]); // لبيانات العرض النهائية

  const navigate = useNavigate();

  // دالة للحصول على التوكن من Local Storage (منطق الحماية من الباك إند)
  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // إذا لم يكن هناك توكن، قم بإعادة التوجيه لصفحة تسجيل الدخول
      navigate("/login");
      return null; // ارجع null للإشارة إلى عدم وجود توكن
    }
    return { Authorization: `Bearer ${token}` };
  }, [navigate]);

  // دالة لجلب التقارير من API
  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getAuthHeader();
      if (!headers) { // تحقق إذا كانت getAuthHeader أعادت null
        setLoading(false);
        return;
      }
      const response = await axios.get(API_URL, { headers });
      setReports(response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/login'); // إعادة توجيه إذا كان التوكن غير صالح أو منتهي الصلاحية
      } else {
        setError("حدث خطأ أثناء جلب البيانات: " + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  }, [getAuthHeader, navigate]);

  // useEffect لجلب البيانات عند تحميل المكون
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // دالة لحساب إجماليات الفواتير بناءً على التقارير المجلبة
  const calculateAndSetTotalBillsData = useCallback(() => {
    const now = new Date();
    // الحصول على بداية ونهاية الأسبوع الحالي
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    // الحصول على بداية ونهاية الشهر الحالي
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    let weeklyBills = 0;
    let weeklyCount = 0;
    let monthlyBills = 0;
    let monthlyCount = 0;
    let paidBills = 0; // إجمالي الفواتير المدفوعة (حالتها "received")
    let paidCount = 0; // عدد الفواتير المدفوعة
    let unpaidBills = 0; // إجمالي المبلغ المتبقي للفواتير غير المدفوعة
    let unpaidCount = 0; // عدد الفواتير غير المدفوعة

    reports.forEach(report => {
      // تحويل التاريخ من String إلى Date للمقارنة (كما هو مخزن في الموديل)
      const reportDate = new Date(report.date);
      reportDate.setHours(0, 0, 0, 0);

      // تحويل الكميات والمبالغ من String إلى Number قبل إجراء العمليات الحسابية
      const quantity = parseFloat(report.quantity) || 0;
      const remaining = parseFloat(report.remaining) || 0;

      // حساب فواتير الأسبوع
      if (reportDate >= startOfWeek && reportDate <= endOfWeek) {
        weeklyBills += quantity;
        weeklyCount++;
      }

      // حساب فواتير الشهر
      if (reportDate >= startOfMonth && reportDate <= endOfMonth) {
        monthlyBills += quantity;
        monthlyCount++;
      }

      // حساب الفواتير المدفوعة وغير المدفوعة بناءً على التعريفات الجديدة
      if (report.status === "received") { // الفاتورة مدفوعة إذا كانت حالتها "received"
        paidBills += quantity; // نجمع المبلغ الكلي للفواتير المدفوعة
        paidCount++;
      } else { // الفاتورة غير مدفوعة (أو جزء منها) إذا لم تكن "received" ولها مبلغ متبقي
        if (remaining > 0) { // تأكد من وجود مبلغ متبقي
          unpaidBills += remaining; // نجمع المبلغ المتبقي للفواتير غير المدفوعة
          unpaidCount++;
        }
      }
    });

    // إعداد البيانات التي سيتم عرضها
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
  }, [reports]); // تعتمد هذه الدالة على 'reports' لتُعاد حسابها عند تغير البيانات

  // useEffect لحساب البيانات المعروضة كلما تغيرت التقارير
  useEffect(() => {
    if (reports.length > 0) { // تأكد من أن هناك تقارير للحساب
      calculateAndSetTotalBillsData();
    } else {
      // إذا لم تكن هناك تقارير، أعد تعيين البيانات إلى فارغة
      setTotalBillsDisplayData([]);
    }
  }, [reports, calculateAndSetTotalBillsData]); // إضافة calculateAndSetTotalBillsData كـ dependency

  if (loading) {
    return (
      <div className="text-center py-4 text-gray-600">...جاري تحميل ملخص الفواتير</div>
    );
  }

  if (error) {
    return <div className="text-center py-4 text-red-600">{error}</div>;
  }

  if (totalBillsDisplayData.length === 0 && !loading && !error) {
    return (
      <div className="text-center py-4 text-gray-500">
        لا توجد بيانات فواتير لعرض الملخص.
      </div>
    );
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
            <div className="text-sm text-gray-500 text-center">
              {item.title}
            </div>
            <div className="w-full text-center text-xl mt-2">
              <div className="font-bold" style={{ color: item.titleColor }}>
                {item.bills}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {item.numberOfInvoices} فواتير
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TotalBills;
