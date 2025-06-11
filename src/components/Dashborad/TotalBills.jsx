import React, { useEffect, useState } from 'react';
import { FaUsers } from 'react-icons/fa';
import NotificationIcon from '../../assets/NotificationIcon.jpeg';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/ar-sa'; // لضمان التاريخ باللغة العربية
// تأكد أن هذا السطر غير موجود أو معلق بشكل صحيح: // import jwtDecode from 'jwt-decode';

const API_BASE_URL = "https://hawkama.cbc-api.app/api/reports";

const TotalBills = () => {
  const [weeklyBills, setWeeklyBills] = useState({
    Bills: "0 IQ",
    NumberOfInvoices: 0
  });
  const [monthlyBills, setMonthlyBills] = useState({
    Bills: "0 IQ",
    NumberOfInvoices: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // دالة لجلب توكن المصادقة واسم المستخدم من localStorage
  const getAuthData = () => {
    const token = localStorage.getItem("token");
    const userDataString = localStorage.getItem("userData"); // جلب بيانات المستخدم كـ string

    if (!token) {
      console.error("خطأ: توكن المصادقة غير موجود. يرجى تسجيل الدخول.");
      return { headers: {}, username: null };
    }

    let username = null;
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        username = userData.username; // افترض أن اسم المستخدم مخزن في خاصية 'username'
      } catch (e) {
        console.error("خطأ في تحليل بيانات المستخدم المخزنة في localStorage:", e);
      }
    }

    return { headers: { Authorization: `Bearer ${token}` }, username: username };
  };

  useEffect(() => {
    moment.locale('ar-sa'); // تفعيل اللغة العربية لـ moment

    const fetchBillsData = async () => {
      setLoading(true);
      setError(null);
      const { headers, username } = getAuthData();

      if (!username) {
        setError("اسم المستخدم غير متوفر. يرجى التأكد من تسجيل الدخول بشكل صحيح.");
        setLoading(false);
        return;
      }

      try {
        // جلب جميع التقارير لهذا المستخدم
        const response = await axios.get(`${API_BASE_URL}/by-admin/${username}`, { headers });
        const allReports = response.data;

        const now = moment();
        const startOfWeek = now.clone().startOf('week'); // بداية هذا الأسبوع
        const startOfMonth = now.clone().startOf('month'); // بداية هذا الشهر

        let totalWeeklyAmount = 0;
        let countWeeklyInvoices = 0;
        let totalMonthlyAmount = 0;
        let countMonthlyInvoices = 0;

        allReports.forEach(report => {
          const reportDate = moment(report.createdAt); // تاريخ إنشاء التقرير
          
          // ***** التعديل الجديد هنا: إضافة شرط لحالة الفاتورة *****
          // يجب عليك استبدال 'received' بالقيمة الفعلية للحالة التي تدل على أن الفاتورة "مستلمة" في الباك إند الخاص بك.
          // على سبيل المثال: 'completed', 'delivered', 'paid', 'approved', 'تم الاستلام', 'Received'
          // إذا كان حقل الحالة مختلفًا، قم بتعديل report.status هنا.
          const isReceived = report.status === 'received'; // <-- قم بتعديل 'received' إذا كانت الحالة مختلفة

          const reportAmount = parseFloat(report.quantity || 0); // استخدم report.quantity كالمبلغ، وافترض 0 إذا كانت غير موجودة أو غير صالحة

          // إذا كان التقرير ضمن هذا الأسبوع وكان "مستلمًا"
          if (reportDate.isSameOrAfter(startOfWeek, 'day') && isReceived) {
            totalWeeklyAmount += reportAmount;
            countWeeklyInvoices += 1;
          }

          // إذا كان التقرير ضمن هذا الشهر وكان "مستلمًا"
          if (reportDate.isSameOrAfter(startOfMonth, 'day') && isReceived) {
            totalMonthlyAmount += reportAmount;
            countMonthlyInvoices += 1;
          }
        });
        
        // تحديث حالات المكون
        setWeeklyBills({
          Bills: `${totalWeeklyAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })} IQ`, // تنسيق المبلغ كعملة
          NumberOfInvoices: countWeeklyInvoices
        });

        setMonthlyBills({
          Bills: `${totalMonthlyAmount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })} IQ`, // تنسيق المبلغ كعملة
          NumberOfInvoices: countMonthlyInvoices
        });

      } catch (err) {
        setError("حدث خطأ أثناء جلب بيانات الفواتير: " + (err.response?.data?.message || err.message));
        console.error("تفاصيل الخطأ:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBillsData();
  }, []); 

  if (loading) {
    return <div className="total-bills-container text-center p-5 text-gray-600">جاري تحميل إحصائيات الفواتير...</div>;
  }

  if (error) {
    return <div className="total-bills-container text-red-500 text-center p-5">خطأ: {error}</div>;
  }

  // البيانات التي سيتم عرضها، تستخدم الآن الحالات المستجلبة
  const dataToRender = [
    {
      title: 'فواتير هذا الأسبوع',
      icon: <img src={NotificationIcon} alt="Notification" className="w-16 h-16 mt-[-5px] md:mt-[-20px] mr-[-5px] md:mr-[-12px]" />,
      Bills: weeklyBills.Bills,
      Numberofinvoices: weeklyBills.NumberOfInvoices,
      titleBills: "#25BC9D"
    },
    {
      title: 'فواتير هذا الشهر',
      icon: <FaUsers className="text-[#b51a00] text-3xl w-12 h-12 mt-[-5px] md:mt-[-15px]" />,
      Bills: monthlyBills.Bills,
      Numberofinvoices: monthlyBills.NumberOfInvoices,
      titleBills: "#b51a00"
    },
  ];

  return (
    <div className="total-bills-container w-full sm:w-[70px] flex flex-wrap justify-center gap-4 mb-8">
      {dataToRender.map((item, index) => (
        <div
          key={index}
          className="bg-white w-full h-[150px] sm:w-[70px] md:flex-1 rounded-lg p-4 flex flex-col shadow pb-[100px]"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start text-sm text-gray-700 mb-3">
            <div className="flex flex-col items-center md:items-start">
              <div className="mt-2">{item.icon}</div>
              <div className="text-sm mt-4 text-gray-500 text-center md:text-right">
                {item.title}
              </div>
              <div className="w-full text-center md:text-left text-xl flex justify-around mt-2">
                <div className="font-bold" style={{ color: item.titleBills }}>
                  {item.Bills}
                </div>
                <div className="md:mr-[120px]">
                  {item.Numberofinvoices}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <style>{`
        /* حجم الحاوية في اللابتوب */
        @media (min-width: 768px) {
          .total-bills-container {
            width: 600px !important;
            height: 130px !important;
          }
        }

        @media (max-width: 768px) {
          .total-bills-container {
            width: 320px !important;
            height: auto !important;
            margin-right: 36px;
          }
        }

        @media (max-width: 600px) {
          .total-bills-scale {
            transform: scale(0.85);
          }
        }

        @media (max-width: 450px) {
          .total-bills-scale {
            transform: scale(0.75);
          }
        }
      `}</style>
    </div>
  );
};

export default TotalBills;