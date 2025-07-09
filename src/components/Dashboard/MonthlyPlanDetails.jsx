// MonthlyPlanDetails.jsx
import React from "react";
import { useParams } from "react-router-dom";

function MonthlyPlanDetails() {
  const { employeeName } = useParams();

  const contracts = [
    { date: "2025-07-01", title: "عقد مشروع ألف", type: "جديد" },
    { date: "2025-07-05", title: "عقد مشروع باء", type: "متجدد" },
    { date: "2025-07-10", title: "عقد مشروع جيم", type: "جديد" },
  ];

  const followUps = [
    { date: "2025-07-03", title: "متابعة مشروع ألف" },
    { date: "2025-07-07", title: "متابعة مشروع باء" },
    { date: "2025-07-15", title: "متابعة مشروع جيم" },
  ];

  return (
    <div className="rtl bg-white rounded-xl shadow-sm p-6 max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-teal-800 text-center mb-6">
        خطة {employeeName} الشهرية
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">العقود</h3>
          <table className="w-full text-right border rounded">
            <thead className="bg-gray-50 text-sm text-gray-600">
              <tr>
                <th className="p-2 border">التاريخ</th>
                <th className="p-2 border">العنوان</th>
                <th className="p-2 border">النوع</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((c, i) => (
                <tr key={i} className="text-sm">
                  <td className="p-2 border">{c.date}</td>
                  <td className="p-2 border">{c.title}</td>
                  <td className="p-2 border">{c.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">المتابعات</h3>
          <table className="w-full text-right border rounded">
            <thead className="bg-gray-50 text-sm text-gray-600">
              <tr>
                <th className="p-2 border">التاريخ</th>
                <th className="p-2 border">العنوان</th>
              </tr>
            </thead>
            <tbody>
              {followUps.map((f, i) => (
                <tr key={i} className="text-sm">
                  <td className="p-2 border">{f.date}</td>
                  <td className="p-2 border">{f.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <button className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">تحميل PDF</button>
        <button className="bg-teal-100 text-teal-800 px-4 py-2 rounded hover:bg-teal-200">تصدير Excel</button>
        <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded hover:bg-gray-200">حفظ كصورة</button>
      </div>
    </div>
  );
}

export default MonthlyPlanDetails;
