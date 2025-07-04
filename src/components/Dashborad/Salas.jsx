import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/ar-sa';

const API_BASE_URL = "https://hawkama.cbc-api.app/api/reports";

const Salas = () => {
  const [chartData, setChartData] = useState([]);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUsername, setCurrentUsername] = useState(null); // لتخزين اسم المستخدم الحالي

  const RADIAN = Math.PI / 180;

  const [dimensions, setDimensions] = useState({
    innerRadius: 60,
    outerRadius: 90,
    fontSize: 13,
    lineLength1: 20,
    lineLength2: 30,
    textOffsetY: 14,
    centerTextBigFontSize: 24,
    centerTextSmallFontSize: 14,
  });

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
        const userData = JSON.parse(userDataString); // تحويل بيانات المستخدم من string إلى كائن JavaScript
        username = userData.username; // افترض أن اسم المستخدم مخزن في خاصية 'username'
        // تأكد من أن 'username' هو الاسم الصحيح للحقل الذي يحتوي على اسم المستخدم في كائن user
      } catch (e) {
        console.error("خطأ في تحليل بيانات المستخدم المخزنة في localStorage:", e);
      }
    }

    return { headers: { Authorization: `Bearer ${token}` }, username: username };
  };

  useEffect(() => {
    moment.locale('ar-sa'); // تفعيل اللغة العربية لـ moment

    // جلب بيانات المصادقة واسم المستخدم عند تحميل المكون
    const { headers, username } = getAuthData();
    if (username) {
      setCurrentUsername(username); // تخزين اسم المستخدم في حالة المكون
    } else {
      setLoading(false);
      setError("اسم المستخدم غير متوفر. يرجى التأكد من تسجيل الدخول بشكل صحيح.");
      return; // توقف عن جلب البيانات إذا لم يتوفر اسم المستخدم
    }

    const fetchChartData = async () => {
      setLoading(true);
      setError(null);
      try {
        // استخدام نقطة النهاية المخصصة لجلب تقارير المستخدم
        const API_URL_BY_ADMIN = `${API_BASE_URL}/by-admin/${username}`;
        
        const response = await axios.get(API_URL_BY_ADMIN, { headers });
        const userReports = response.data; // هذه هي التقارير الخاصة بالمستخدم الحالي

        // حساب الإجمالي لكل فئة بناءً على بيانات الـ API
        const totalPending = userReports.reduce((sum, report) => sum + (report.cardCategory?.oneYear || 0), 0);
        const totalApproved = userReports.reduce((sum, report) => sum + (report.cardCategory?.twoYears || 0), 0);
        const totalRejected = userReports.reduce((sum, report) => sum + (report.cardCategory?.virtual || 0), 0);

        const calculatedTotalOverall = totalPending + totalApproved + totalRejected;
        setTotalInvoices(calculatedTotalOverall); // تحديث حالة إجمالي الفواتير بالعدد الفعلي

        const dataForChart = [
          { name: 'بانتظار المراجعة', value: totalPending, color: '#34B3F1' },
          { name: 'تمت الموافقة', value: totalApproved, color: '#DEECF6' },
          { name: 'مرفوضة', value: totalRejected, color: '#ADD8E6' },
        ];

        const dataWithPercentages = dataForChart.map(item => ({
          ...item,
          percentage: calculatedTotalOverall > 0 ? parseFloat(((item.value / calculatedTotalOverall) * 100).toFixed(0)) : 0,
        }));

        setChartData(dataWithPercentages);

      } catch (err) {
        setError("حدث خطأ أثناء جلب بيانات الفواتير: " + (err.response?.data?.message || err.message));
        console.error("تفاصيل الخطأ:", err);
      } finally {
        setLoading(false);
      }
    };

    // تأكد من أن لدينا اسم مستخدم قبل محاولة جلب البيانات
    if (currentUsername) {
      fetchChartData();
    }


    // جزء التعامل مع حجم الشاشة (ريسبونسيف) - لم يتم تغييره
    function handleResize() {
      if (window.innerWidth <= 360) {
        setDimensions({
          innerRadius: 20, outerRadius: 40, fontSize: 9,
          lineLength1: 10, lineLength2: 15, textOffsetY: 10,
          centerTextBigFontSize: 14, centerTextSmallFontSize: 8,
        });
      } else if (window.innerWidth <= 600) {
        setDimensions({
          innerRadius: 40, outerRadius: 70, fontSize: 11,
          lineLength1: 15, lineLength2: 20, textOffsetY: 12,
          centerTextBigFontSize: 18, centerTextSmallFontSize: 10,
        });
      } else {
        setDimensions({
          innerRadius: 60, outerRadius: 90, fontSize: 13,
          lineLength1: 20, lineLength2: 30, textOffsetY: 14,
          centerTextBigFontSize: 24, centerTextSmallFontSize: 14,
        });
      }
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentUsername]); // أضف currentUsername كـ dependency ليتم إعادة تشغيل useEffect عند تحديثه

  // دالة لعرض النسبة المئوية داخل شريحة الدائرة - لم يتم تغييرها
  const renderValueInside = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }) => {
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#000"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={dimensions.fontSize}
        fontWeight="bold"
      >
        {percentage}%
      </text>
    );
  };

  // دالة لعرض أسماء الشرائح خارج الدائرة - لم يتم تغييرها
  const renderCustomNameLabels = ({ cx, cy, outerRadius, index }) => {
    if (!chartData[index]) return null;

    const isRightSide = chartData[index].name !== 'تمت الموافقة';

    const startX = isRightSide ? cx + outerRadius + 5 : cx - outerRadius - 5;
    const startY = cy - 40 + index * 40;

    const midX1 = isRightSide ? startX + dimensions.lineLength1 : startX - dimensions.lineLength1;
    const midY1 = startY;

    const midX2 = isRightSide ? midX1 + dimensions.lineLength2 : midX1 - dimensions.lineLength2;
    const midY2 = startY;

    const endX = midX2;
    const endY = startY + 10;

    const textX = endX;
    const textY = endY + dimensions.textOffsetY;
    const textAnchor = isRightSide ? 'start' : 'end';

    return (
      <g>
        <line x1={startX} y1={startY} x2={midX1} y2={midY1} stroke="#888" strokeWidth={1} />
        <line x1={midX1} y1={midY1} x2={midX2} y2={midY2} stroke="#888" strokeWidth={1} />
        <line x1={midX2} y1={midY2} x2={endX} y2={endY} stroke="#888" strokeWidth={1} />

        <text
          x={textX}
          y={textY}
          textAnchor={textAnchor}
          dominantBaseline="hanging"
          fill="#000"
          fontSize={dimensions.fontSize}
          fontWeight="500"
        >
          {chartData[index].name}
        </text>
      </g>
    );
  };

  if (loading) {
    return <div className="salas-chart-container text-center p-5 text-gray-600">جاري تحميل بيانات الفواتير...</div>;
  }

  if (error) {
    return <div className="salas-chart-container text-red-500 text-center p-5">خطأ: {error}</div>;
  }

  return (
    <div className="salas-chart-container">
      <h3 className="salas-chart-title">الفواتير</h3>
      <div className="salas-chart-inner">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={dimensions.innerRadius}
              outerRadius={dimensions.outerRadius}
              dataKey="value"
              labelLine={false}
              label={renderValueInside}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={dimensions.innerRadius}
              outerRadius={dimensions.outerRadius}
              dataKey="value"
              labelLine={false}
              label={renderCustomNameLabels}
              fill="transparent"
              isAnimationActive={false}
            />
            <text
              x="50%"
              y="48%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={dimensions.centerTextBigFontSize}
              fontWeight="bold"
              fill="#000"
            >
              {totalInvoices} فاتورة
            </text>
            <text
              x="50%"
              y="60%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={dimensions.centerTextSmallFontSize}
              fill="#666"
            >
              {moment().format('MMMM')}
            </text>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <style>{`
        .salas-chart-container {
          width: 600px;
          max-width: 600px;
          min-width: 320px;
          height: 320px;
          background-color: white;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          direction: rtl;
        }
        .salas-chart-title {
          text-align: right;
          font-weight: bold;
          font-size: 18px;
          margin-bottom: 16px;
        }
        .salas-chart-inner {
          width: 100%;
          height: calc(100% - 40px);
        }
        @media (max-width: 900px) {
          .salas-chart-container {
            width: 95vw;
            max-width: 95vw;
          }
        }
        @media (max-width: 600px) {
          .salas-chart-container {
            width: 320px;
            max-width: 100vw;
            min-width: 0;
            margin-right:36px;
          }
        }
      `}</style>
    </div>
  );
};

export default Salas;