// UrgentComplaintsPage.jsx
import React, { useState } from "react";
import * as XLSX from "xlsx";

function UrgentComplaintsPage() {
  const [complaints, setComplaints] = useState([
    { message: "يرجى التوجه نحو متجر الكرادة فورًا", date: "2025-07-08 10:15 AM", level: "red" },
    { message: "انقطاع الكهرباء في متجر الأعظمية", date: "2025-07-08 11:00 AM", level: "yellow" },
    { message: "عميل غير راضٍ عن الخدمة في المنصور", date: "2025-07-07 01:30 PM", level: "yellow" },
    { message: "تسرب مياه في فرع الشعلة", date: "2025-07-07 03:00 PM", level: "red" },
    { message: "خلل في نظام الحاسوب بفرع الدورة", date: "2025-07-06 09:20 AM", level: "yellow" },
    { message: "تأخر تسليم الطرود في فرع السيدية", date: "2025-07-06 10:45 AM", level: "yellow" },
    { message: "بلاغ بسرقة معدات في فرع الزعفرانية", date: "2025-07-05 04:15 PM", level: "red" },
    { message: "شكاوى من ارتفاع الأسعار في فرع بغداد الجديدة", date: "2025-07-05 12:10 PM", level: "yellow" },
    { message: "زحمة شديدة في فرع الكاظمية", date: "2025-07-04 01:00 PM", level: "yellow" },
    { message: "خلاف بين موظفين في فرع الحرية", date: "2025-07-03 09:45 AM", level: "red" },
    { message: "توقف التكييف في فرع الحارثية", date: "2025-07-03 11:30 AM", level: "yellow" },
    { message: "حريق بسيط في مستودع فرع المشتل", date: "2025-07-02 02:00 PM", level: "red" },
    { message: "نقص في البضائع في فرع البياع", date: "2025-07-02 10:00 AM", level: "yellow" },
    { message: "شكوى من سوء تعامل أحد الموظفين", date: "2025-07-01 03:20 PM", level: "red" },
    { message: "عطل في الكاميرات الأمنية بفرع الكرخ", date: "2025-07-01 08:30 AM", level: "yellow" },
  ]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      const data = XLSX.utils.sheet_to_json(ws);
      const formatted = data.map((row) => ({
        message: row.message || "",
        date: row.date || "",
        level: row.level === "عالي" ? "red" : "yellow",
      }));

      setComplaints(formatted);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="rtl bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-teal-800 text-center mb-8">
          جميع الشكاوي العاجلة
        </h2>



        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {complaints.map((note, index) => (
            <div
              key={index}
              className={`${
                note.level === "red"
                  ? "bg-red-50 border-red-300 text-red-800"
                  : "bg-yellow-50 border-yellow-300 text-yellow-800"
              } border-l-4 rounded-xl p-5 shadow-sm flex gap-4 items-start`}
            >
              <svg
                className={`w-6 h-6 flex-shrink-0 mt-1 ${
                  note.level === "red" ? "text-red-500" : "text-yellow-600"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <div>
                <p className="text-sm font-medium leading-relaxed">{note.message}</p>
                <p className="text-gray-500 text-xs mt-2">{note.date}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mb-8 flex justify-center">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="block w-full mt-10 max-w-sm text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>
    </div>
  );
}

export default UrgentComplaintsPage;
