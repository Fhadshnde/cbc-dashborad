// src/pages/AccessReports.jsx
import React from "react";

const AccessReports = () => {
  const reports = Array(8).fill({
    name: "علي",
    nameEn: "Ali",
    phone: "1234567890",
    quantity: "100",
    paid: "120...",
    remaining: "80...",
    address: "Al- Harrya",
    ministry: "Al- Harrya",
    date: "٢١ إبريل",
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-right font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">تقارير الوصول</h2>
      </div>

      <div className="bg-white shadow rounded-lg p-4 mb-6">
  {/* <div className="flex justify-end mb-4">
    <input
      type="text"
      placeholder="ماذا تبحث عن..."
      className="border rounded px-4 py-2 text-right w-full md:w-1/3"
    />
  </div> */}

  {/* <div className="flex gap-4">
    <input type="date" className="border rounded px-4 py-2 text-right w-full" />
    <input type="date" className="border rounded px-4 py-2 text-right w-full" />
  </div> */}

  <div className="flex gap-4 justify-end mt-4">
    <button className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700">
      البحث
    </button>
    <button className="border border-teal-600 text-teal-600 px-6 py-2 rounded hover:bg-teal-50">
      تصدير
    </button>
  </div>
</div>


      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm text-right">
          <thead className="bg-gray-100 text-gray-600 font-bold">
            <tr>
              <th className="px-4 py-2">الاسم بالعربي</th>
              <th className="px-4 py-2">الاسم بالإنجليزي</th>
              <th className="px-4 py-2">رقم الهاتف</th>
              <th className="px-4 py-2">الكمية</th>
              <th className="px-4 py-2">المدفوع</th>
              <th className="px-4 py-2">المتبقي</th>
              <th className="px-4 py-2">العنوان</th>
              <th className="px-4 py-2">عنوان الوزارة</th>
              <th className="px-4 py-2">أنشأ في</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{report.name}</td>
                <td className="px-4 py-2">{report.nameEn}</td>
                <td className="px-4 py-2">{report.phone}</td>
                <td className="px-4 py-2">{report.quantity}</td>
                <td className="px-4 py-2">{report.paid}</td>
                <td className="px-4 py-2">{report.remaining}</td>
                <td className="px-4 py-2">{report.address}</td>
                <td className="px-4 py-2">{report.ministry}</td>
                <td className="px-4 py-2">{report.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccessReports;
