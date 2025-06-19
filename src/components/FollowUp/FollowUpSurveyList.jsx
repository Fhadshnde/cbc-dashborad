import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FollowUpSurveyList = () => {
  const [surveys, setSurveys] = useState([]);
  const [filteredSurveys, setFilteredSurveys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const navigate = useNavigate();

  const getToken = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      throw new Error("No token found");
    }
    return token;
  }, [navigate]);

  useEffect(() => {
    const fetchSurveys = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("https://hawkama.cbc-api.app/api/followupsurveys", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setSurveys(res.data.data);
        setFilteredSurveys(res.data.data);
      } catch (error) {
        setError("خطأ في تحميل الاستبيانات: " + (error.response?.data?.message || error.message));
        console.error("خطأ في تحميل الاستبيانات:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSurveys();
  }, [getToken]);

  const handleSearch = () => {
    let result = surveys;

    if (searchTerm.trim()) {
      result = result.filter((survey) =>
        (survey.storeName && survey.storeName.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
        (survey.storeAddress && survey.storeAddress.toLowerCase().includes(searchTerm.toLowerCase().trim()))
      );
    }

    if (startDate || endDate) {
      result = result.filter((survey) => {
        const surveyDate = new Date(survey.createdAt);
        surveyDate.setHours(0, 0, 0, 0);

        const start = startDate ? new Date(startDate) : null;
        if (start) start.setHours(0, 0, 0, 0);

        const end = endDate ? new Date(endDate) : null;
        if (end) end.setHours(23, 59, 59, 999);

        if (start && end) {
          return surveyDate >= start && surveyDate <= end;
        } else if (start) {
          return surveyDate >= start;
        } else if (end) {
          return surveyDate <= end;
        }
        return true;
      });
    }

    setFilteredSurveys(result);
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الاستبيان؟")) {
      try {
        await axios.delete(`https://hawkama.cbc-api.app/api/followupsurveys/${id}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setSurveys(surveys.filter(survey => survey._id !== id));
        setFilteredSurveys(filteredSurveys.filter(survey => survey._id !== id));
      } catch (error) {
        console.error("خطأ في حذف الاستبيان:", error);
        alert("حدث خطأ أثناء حذف الاستبيان");
      }
    }
  };

  return (
    <div className="m-4 sm:m-16 p-4 sm:p-6 bg-gray-50 min-h-screen text-right font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
        <h2 className="text-2xl font-bold text-gray-700">قائمة استبيانات المتابعة</h2>
        <div className="relative w-full sm:w-auto">
          <input
            type="text"
            placeholder="ابحث باسم المتجر أو العنوان..."
            className="border px-4 py-2 rounded-lg pr-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-end flex-wrap">
          <div className="flex flex-col">
            <label htmlFor="startDate" className="text-sm text-gray-600 mb-1">
              من تاريخ
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border px-3 py-2 rounded w-full md:w-auto"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="endDate" className="text-sm text-gray-600 mb-1">
              إلى تاريخ
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border px-3 py-2 rounded w-full md:w-auto"
            />
          </div>
          <button
            onClick={() => navigate("/select-store-for-survey")}
            className="text-white px-6 py-2 rounded bg-[#25BC9D] transition w-full md:w-auto self-end"
          >
            إضافة استبيان جديد لمتجر
          </button>
          <button
            onClick={handleSearch}
            className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition w-full md:w-auto self-end"
          >
            بحث
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-4 text-gray-600">...جاري تحميل البيانات</div>
      )}

      {error && <div className="text-center py-4 text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="w-full sm:min-w-[700px] text-sm text-right border-collapse">
            <thead className="bg-gray-100 text-gray-600 font-bold">
              <tr>
                <th className="px-4 py-2 whitespace-nowrap">اسم المتجر</th>
                <th className="px-4 py-2 whitespace-nowrap">عنوان المتجر</th>
                <th className="px-4 py-2 whitespace-nowrap">القسم</th>
                <th className="px-4 py-2 whitespace-nowrap">تاريخ الإنشاء</th>
                <th className="px-4 py-2 whitespace-nowrap">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredSurveys.length > 0 ? (
                filteredSurveys.map((survey) => (
                  <tr key={survey._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 whitespace-nowrap">{survey.storeName}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{survey.storeAddress}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{survey.section}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {new Date(survey.createdAt).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => navigate(`/followupsurveys/${survey._id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        عرض
                      </button>
                      <button
                        onClick={() => navigate(`/followupsurveys/${survey._id}/edit`)}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(survey._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                    لا توجد استبيانات متاحة
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FollowUpSurveyList;