import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CardsSection = () => {
  const [userReports, setUserReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const fetchUserReports = async () => {
      setReportsLoading(true);
      setReportsError(null);

      try {
        const headers = { headers: getAuthHeader() };
        const res = await axios.get("https://hawkama.cbc-api.app/api/reports/my-reports", headers);
        setUserReports(res.data);
      } catch (err) {
        setReportsError("حدث خطأ أثناء جلب تقارير البطاقات: " + (err.response?.data?.message || err.message));
      } finally {
        setReportsLoading(false);
      }
    };

    fetchUserReports();
  }, []);

  const totalOneYearReports = userReports.reduce((sum, report) => sum + (report.cardCategory?.oneYear || 0), 0);
  const totalTwoYearsReports = userReports.reduce((sum, report) => sum + (report.cardCategory?.twoYears || 0), 0);
  const totalVirtualReports = userReports.reduce((sum, report) => sum + (report.cardCategory?.virtual || 0), 0);
  const totalAllCards = totalOneYearReports + totalTwoYearsReports + totalVirtualReports;

  if (reportsLoading) {
    return <div className="text-center p-5 text-gray-600">جاري تحميل فواتير البطاقات...</div>;
  }

  if (reportsError) {
    return <div className="text-red-500 text-center p-5">خطأ في جلب فواتير البطاقات: {reportsError}</div>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-medium text-gray-700">فواتير البطاقات الصادرة</h4>
      </div>

      {userReports.length === 0 ? (
        <p className="text-gray-500 text-center py-4">لا توجد فواتير بطاقات لهذا المستخدم.</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200 mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-3 text-right text-xs font-semibold text-gray-600 uppercase">إجمالي البطاقات</th>
              <th className="py-2 px-3 text-right text-xs font-semibold text-gray-600 uppercase">بطاقة فئة السنتين</th>
              <th className="py-2 px-3 text-right text-xs font-semibold text-gray-600 uppercase">بطاقة فئة السنة</th>
              <th className="py-2 px-3 text-right text-xs font-semibold text-gray-600 uppercase">بطاقة Virtual</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {userReports.map((report, index) => (
              <tr key={report._id || index} className="hover:bg-gray-50">
                <td className="py-2 px-3 text-sm text-gray-800">
                  {(report.cardCategory?.oneYear || 0) +
                   (report.cardCategory?.twoYears || 0) +
                   (report.cardCategory?.virtual || 0)}
                </td>
                <td className="py-2 px-3 text-sm text-gray-800">{report.cardCategory?.twoYears || 0}</td>
                <td className="py-2 px-3 text-sm text-gray-800">{report.cardCategory?.oneYear || 0}</td>
                <td className="py-2 px-3 text-sm text-gray-800">{report.cardCategory?.virtual || 0}</td>
              </tr>
            ))}
            <tr className="bg-gray-100 font-bold">
              <td className="py-2 px-3 text-sm text-gray-800">{totalAllCards}</td>
              <td className="py-2 px-3 text-sm text-gray-800">{totalTwoYearsReports}</td>
              <td className="py-2 px-3 text-sm text-gray-800">{totalOneYearReports}</td>
              <td className="py-2 px-3 text-sm text-gray-800">{totalVirtualReports}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CardsSection;
