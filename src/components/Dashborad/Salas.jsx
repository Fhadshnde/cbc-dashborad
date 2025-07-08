import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/ar-sa';

const API_BASE_URL = "https://hawkama.cbc-api.app/api/reports";

const Salas = () => {
  const [allReports, setAllReports] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [totalReports, setTotalReports] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("monthly");
  const [currentMonthName, setCurrentMonthName] = useState("");

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
    labelOffset: 10,
  });

  const getAuthData = () => {
    const token = localStorage.getItem("token");
    if (!token) return { headers: {} };
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    moment.locale('ar-sa');

    const fetchAllReports = async () => {
      setLoading(true);
      setError(null);
      try {
        const { headers } = getAuthData();
        const response = await axios.get(API_BASE_URL, { headers });
        setAllReports(response.data);
      } catch (err) {
        setError("حدث خطأ أثناء جلب البيانات: " + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchAllReports();

    const handleResize = () => {
      if (window.innerWidth <= 360) {
        setDimensions({ innerRadius: 20, outerRadius: 40, fontSize: 9, lineLength1: 10, lineLength2: 15, textOffsetY: 10, centerTextBigFontSize: 14, centerTextSmallFontSize: 8, labelOffset: 5 });
      } else if (window.innerWidth <= 600) {
        setDimensions({ innerRadius: 40, outerRadius: 70, fontSize: 11, lineLength1: 15, lineLength2: 20, textOffsetY: 12, centerTextBigFontSize: 18, centerTextSmallFontSize: 10, labelOffset: 8 });
      } else {
        setDimensions({ innerRadius: 60, outerRadius: 90, fontSize: 13, lineLength1: 20, lineLength2: 30, textOffsetY: 14, centerTextBigFontSize: 24, centerTextSmallFontSize: 14, labelOffset: 10 });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (allReports.length === 0) {
      setChartData([]);
      setTotalReports(0);
      setCurrentMonthName("");
      return;
    }

    const now = moment();

    const filteredReports = allReports.filter(report => {
      const createdAt = moment(report.createdAt);
      switch (filter) {
        case 'daily':
          return createdAt.isSame(now, 'day');
        case 'weekly':
          return createdAt.isSame(now, 'week');
        case 'monthly':
          return createdAt.isSame(now, 'month');
        case 'half-year':
          return createdAt.isAfter(now.clone().subtract(6, 'months'));
        case 'yearly':
          return createdAt.isSame(now, 'year');
        default:
          return true;
      }
    });

    const counts = { pending: 0, rejected: 0, received: 0 };
    filteredReports.forEach(r => {
      if (r.status === 'pending') counts.pending++;
      else if (r.status === 'rejected') counts.rejected++;
      else if (r.status === 'received') counts.received++;
    });

    const totalFiltered = counts.pending + counts.rejected + counts.received;

    setTotalReports(filteredReports.length);

    const data = totalFiltered > 0
      ? [
          { name: 'بانتظار المراجعة', value: counts.pending, color: '#66B3F1' },
          { name: 'مرفوضة', value: counts.rejected, color: '#ADD8E6' },
          { name: 'تم الاستلام  ', value: counts.received, color: '#E0E0E0' }
        ]
      : [{ name: 'بدون بيانات', value: 1, color: '#CCCCCC' }];

    const dataWithPercentages = data.map(item => ({
      ...item,
      percentage: totalFiltered > 0 ? parseFloat(((item.value / totalFiltered) * 100).toFixed(0)) : (item.name === 'بدون بيانات' ? 100 : 0),
    }));

    let sumPercentages = dataWithPercentages.reduce((sum, item) => sum + item.percentage, 0);
    if (sumPercentages !== 100 && totalFiltered > 0) {
      let largestValueIndex = dataWithPercentages.findIndex(item => item.value === Math.max(...dataWithPercentages.map(d => d.value)));
      if (largestValueIndex !== -1) {
        dataWithPercentages[largestValueIndex].percentage += (100 - sumPercentages);
      }
    }

    setChartData(dataWithPercentages);

    if (filter === "monthly") {
      setCurrentMonthName(now.format('MMMM'));
    } else if (filter === "yearly") {
      setCurrentMonthName(now.format('YYYY'));
    } else {
      setCurrentMonthName("");
    }
  }, [allReports, filter]);

  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, index }) => {
    if (!chartData[index] || chartData[index].percentage === 0) return null;

    const angle = -midAngle * RADIAN;
    const startX = cx + outerRadius * Math.cos(angle);
    const startY = cy + outerRadius * Math.sin(angle);

    const midX = cx + (outerRadius + dimensions.lineLength1) * Math.cos(angle);
    const midY = cy + (outerRadius + dimensions.lineLength1) * Math.sin(angle);

    const endX = midX + (Math.cos(angle) >= 0 ? dimensions.lineLength2 : -dimensions.lineLength2);
    const endY = midY;

    const textAnchor = Math.cos(angle) >= 0 ? "start" : "end";

    const labelX = endX + (Math.cos(angle) >= 0 ? dimensions.labelOffset : -dimensions.labelOffset);
    const labelY = endY;

    return (
      <g>
        <line x1={startX} y1={startY} x2={midX} y2={midY} stroke="#888" strokeWidth={1} />
        <line x1={midX} y1={midY} x2={endX} y2={endY} stroke="#888" strokeWidth={1} />
        <circle cx={endX} cy={endY} r={3} fill={chartData[index].color} />
        <text x={labelX} y={labelY - 5} textAnchor={textAnchor} dominantBaseline="baseline" fill="#000" fontSize={dimensions.fontSize} fontWeight="500">
          {chartData[index].name}
        </text>
        <text x={labelX} y={labelY + 15} textAnchor={textAnchor} dominantBaseline="hanging" fill="#000" fontSize={dimensions.fontSize} fontWeight="bold">
          {chartData[index].percentage}%
        </text>
      </g>
    );
  };

  return (
    <div className="salas-chart-container">
      <div className="salas-header">
        <h3 className="salas-chart-title">الفواتير</h3>
        <select className="salas-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="daily">يومي</option>
          <option value="weekly">أسبوعي</option>
          <option value="monthly">شهري</option>
          <option value="half-year">نصف سنوي</option>
          <option value="yearly">سنوي</option>
        </select>
      </div>
      <div className="salas-chart-inner">
        {loading ? <div className="text-center">...تحميل</div> : error ? <div className="text-red-500">{error}</div> : (
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
                label={renderCustomizedLabel}
                isAnimationActive={false}
              >
                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" fontSize={dimensions.centerTextBigFontSize} fontWeight="bold" fill="#000">
                {totalReports} فاتورة
              </text>
              {filter === "monthly" && currentMonthName && (
                <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" fontSize={dimensions.centerTextSmallFontSize} fill="#666">
                  شهر {currentMonthName}
                </text>
              )}
              {filter === "yearly" && currentMonthName && (
                <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" fontSize={dimensions.centerTextSmallFontSize} fill="#666">
                  سنة {currentMonthName}
                </text>
              )}
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
      <style>{`
        .salas-chart-container {
          width: 600px;
          max-width: 600px;
          min-width: 320px;
          height: 340px;
          background-color: white;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          direction: rtl;
        }
        .salas-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .salas-chart-title {
          font-weight: bold;
          font-size: 18px;
        }
        .salas-select {
          padding: 6px 12px;
          border-radius: 6px;
          border: 1px solid #ccc;
          font-size: 14px;
        }
        .salas-chart-inner {
          width: 100%;
          height: calc(100% - 40px);
        }
        .text-center {
          text-align: center;
        }
        .text-red-500 {
          color: #ef4444;
          text-align: center;
        }
        @media (max-width: 600px) {
          .salas-chart-container {
            width: 320px;
            max-width: 100vw;
            min-width: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Salas;
