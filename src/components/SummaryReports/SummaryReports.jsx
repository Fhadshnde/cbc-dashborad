import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SummaryReports = () => {
  const [adminStats, setAdminStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(""); // في صيغة yyyy-mm-dd
  const [endDate, setEndDate] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("daily");

  const navigate = useNavigate();

  const getStartOfDayBaghdadISO = (dateStr) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    const utcDate = new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
    utcDate.setHours(utcDate.getHours() - 3);
    return utcDate.toISOString();
  };

  const getEndOfDayBaghdadISO = (dateStr) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    const utcDate = new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999));
    utcDate.setHours(utcDate.getHours() - 3);
    return utcDate.toISOString();
  };

  const setPeriodDates = (period) => {
    const now = new Date();
    const nowBaghdad = new Date(now.getTime() + 3 * 60 * 60 * 1000);

    if (period === "daily") {
      const dayStr = nowBaghdad.toISOString().slice(0, 10);
      setStartDate(dayStr);
      setEndDate(dayStr);
    } else if (period === "weekly") {
      const dayOfWeek = nowBaghdad.getDay() || 7;
      const monday = new Date(nowBaghdad);
      monday.setDate(monday.getDate() - dayOfWeek + 1);
      const sunday = new Date(monday);
      sunday.setDate(sunday.getDate() + 6);
      setStartDate(monday.toISOString().slice(0, 10));
      setEndDate(sunday.toISOString().slice(0, 10));
    } else if (period === "monthly") {
      const firstDay = new Date(nowBaghdad.getFullYear(), nowBaghdad.getMonth(), 1);
      const lastDay = new Date(nowBaghdad.getFullYear(), nowBaghdad.getMonth() + 1, 0);
      setStartDate(firstDay.toISOString().slice(0, 10));
      setEndDate(lastDay.toISOString().slice(0, 10));
    } else if (period === "halfYearly") {
      const sixMonthsAgo = new Date(nowBaghdad);
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
      const firstDay = new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth(), 1);
      const lastDay = new Date(nowBaghdad.getFullYear(), nowBaghdad.getMonth() + 1, 0);
      setStartDate(firstDay.toISOString().slice(0, 10));
      setEndDate(lastDay.toISOString().slice(0, 10));
    } else if (period === "yearly") {
      const firstDay = new Date(nowBaghdad.getFullYear(), 0, 1);
      const lastDay = new Date(nowBaghdad.getFullYear(), 11, 31);
      setStartDate(firstDay.toISOString().slice(0, 10));
      setEndDate(lastDay.toISOString().slice(0, 10));
    }
  };

  const fetchAdminStats = async () => {
    if (!startDate || !endDate) return;
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("لا يوجد توكن، رجاءً سجل دخول.");

      const params = {
        startDate: getStartOfDayBaghdadISO(startDate),
        endDate: getEndOfDayBaghdadISO(endDate),
      };

      const res = await axios.get(
        "https://hawkama.cbc-api.app/api/reports/admins/stats/custom-period",
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );

      setAdminStats(
        res.data.stats.map((stat) => ({
          ...stat,
          totalCards:
            stat.oneYearCountInPeriod +
            stat.twoYearsCountInPeriod +
            stat.virtualCountInPeriod,
        }))
      );
    } catch (err) {
      setError(err.message || "فشل جلب البيانات");
      setAdminStats([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPeriodDates(selectedPeriod);
  }, []);

  useEffect(() => {
    fetchAdminStats();
  }, [startDate, endDate]);

  const handlePeriodClick = (period) => {
    setSelectedPeriod(period);
    setPeriodDates(period);
  };

  const handleSearchClick = () => {
    fetchAdminStats();
    setSelectedPeriod("");
  };

  const navigateToAdmin = (admin) => {
    navigate(`/reports/admin/${admin}`);
  };

  const totalCardsSum = adminStats.reduce((sum, stat) => sum + (stat.totalCards || 0), 0);

  return (
    <div className="p-5 rtl text-right font-sans">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
        <button
          onClick={() => alert("وظيفة التصدير غير مفعلة بعد")}
          className="bg-gray-100 border border-gray-300 rounded-md px-4 py-2 text-sm flex items-center hover:bg-gray-200 transition-colors"
        >
          تصدير
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
        </button>

        <div className="flex items-center gap-2 flex-wrap">
          <label htmlFor="startDate" className="font-bold whitespace-nowrap">
            يبدأ في
          </label>
          <input
            id="startDate"
            type="date"
            className="border border-gray-300 rounded-md p-2 w-40 text-sm"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <label htmlFor="endDate" className="font-bold whitespace-nowrap">
            ينتهي في
          </label>
          <input
            id="endDate"
            type="date"
            className="border border-gray-300 rounded-md p-2 w-40 text-sm"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button
            onClick={handleSearchClick}
            className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600 transition-colors"
          >
            بحث
          </button>
        </div>

        <div className="flex gap-2 flex-wrap mt-2 sm:mt-0">
          {["daily", "weekly", "monthly", "halfYearly", "yearly"].map((period) => (
            <button
              key={period}
              onClick={() => handlePeriodClick(period)}
              className={`px-4 py-2 rounded-md text-sm transition-colors ${
                selectedPeriod === period
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {{
                daily: "يومي",
                weekly: "أسبوعي",
                monthly: "شهري",
                halfYearly: "نصف سنوي",
                yearly: "سنوي",
              }[period]}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="text-center p-5 text-gray-600">جاري تحميل الإحصائيات...</div>}
      {error && <div className="text-red-500 text-center p-5">خطأ: {error}</div>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-3 px-4 border-b border-gray-300 font-semibold text-gray-700 text-right">
                  اسم موظف المبيعات
                </th>
                <th className="py-3 px-4 border-b border-gray-300 font-semibold text-gray-700 text-right">
                  مجموع البطاقات في الفترة المحددة
                </th>
              </tr>
            </thead>
            <tbody>
              {adminStats.length === 0 ? (
                <tr>
                  <td colSpan="2" className="text-center p-5 text-gray-500">
                    لا توجد تقارير متاحة لهذه الفترة.
                  </td>
                </tr>
              ) : (
                adminStats.map((stat) => (
                  <tr
                    key={stat.admin}
                    className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigateToAdmin(stat.admin)}
                    title={`عرض تقارير ${stat.admin}`}
                  >
                    <td className="py-3 px-4 font-bold">{stat.admin}</td>
                    <td className="py-3 px-4">{stat.totalCards || 0}</td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="bg-gray-100 font-bold">
                <td className="py-3 px-4 border-t border-gray-300 text-right">المجموع الكلي</td>
                <td className="py-3 px-4 border-t border-gray-300">{totalCardsSum}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default SummaryReports;
