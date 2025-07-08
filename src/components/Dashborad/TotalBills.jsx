import React, { useEffect, useState } from 'react';
import { FaUsers } from 'react-icons/fa';
import NotificationIcon from '../../assets/NotificationIcon.jpeg';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/ar-sa';

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

  const getAuthData = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      return { headers: {} };
    }

    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    moment.locale('ar-sa');

    const fetchBillsData = async () => {
      setLoading(true);
      setError(null);

      const { headers } = getAuthData();

      try {
        const response = await axios.get(`${API_BASE_URL}/`, { headers });
        const allReports = response.data;

        const now = moment();
        const startOfWeek = now.clone().startOf('week');
        const startOfMonth = now.clone().startOf('month');

        let totalWeeklyAmount = 0;
        let countWeeklyInvoices = 0;
        let totalMonthlyAmount = 0;
        let countMonthlyInvoices = 0;

        allReports.forEach(report => {
          const reportDate = moment(report.createdAt);
          const isReceived = report.status === 'received'; // التحقق من الحالة "مستلمة"
          const reportQuantity = parseFloat(report.quantity || 0);

          if (reportDate.isSameOrAfter(startOfWeek, 'day') && isReceived) {
            totalWeeklyAmount += reportQuantity;
            countWeeklyInvoices += 1;
          }

          if (reportDate.isSameOrAfter(startOfMonth, 'day') && isReceived) {
            totalMonthlyAmount += reportQuantity;
            countMonthlyInvoices += 1;
          }
        });

        setWeeklyBills({
          Bills: `${totalWeeklyAmount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} IQ`,
          NumberOfInvoices: countWeeklyInvoices
        });

        setMonthlyBills({
          Bills: `${totalMonthlyAmount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} IQ`,
          NumberOfInvoices: countMonthlyInvoices
        });

      } catch (err) {
        console.error("خطأ في جلب بيانات الفواتير:", err);
        setError("حدث خطأ أثناء جلب البيانات. يرجى المحاولة مرة أخرى.");
      } finally {
        setLoading(false);
      }
    };

    fetchBillsData();
  }, []);

  if (loading) {
    return (
      <div className="total-bills-container text-center p-5 text-gray-600">
        جاري التحميل...
      </div>
    );
  }

  if (error) {
    return (
      <div className="total-bills-container text-red-500 text-center p-5">
        {error}
      </div>
    );
  }

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
                <div className="font-bold whitespace-nowrap" style={{ color: item.titleBills }}>
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
