import React, { useState } from "react";
import TotalBills from './TotalBills'
const AccessReports = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [admin, setAdmin] = useState("");
  const [filteredReports, setFilteredReports] = useState([]);

  const reports = [
    { name: "أحمد", nameEn: "Ahmed", phone: "07891234567", quantity: "250", paid: "150", remaining: "100", address: "Baghdad", ministry: "Education", date: "2025-05-15", admin: "Admin1" },
    { name: "أحمد", nameEn: "Ahmed", phone: "07891234567", quantity: "250", paid: "150", remaining: "100", address: "Baghdad", ministry: "Education", date: "2025-05-22", admin: "Admin2" },
    { name: "أحمد", nameEn: "Ahmed", phone: "07891234567", quantity: "250", paid: "150", remaining: "100", address: "Baghdad", ministry: "Education", date: "2025-05-27", admin: "Admin1" },
    { name: "فاطمة", nameEn: "Fatima", phone: "07712345678", quantity: "300", paid: "200", remaining: "100", address: "Basra", ministry: "Health", date: "2025-05-03", admin: "Admin2" },
    { name: "حسين", nameEn: "Hussein", phone: "07987654321", quantity: "150", paid: "100", remaining: "50", address: "Najaf", ministry: "Interior", date: "2025-05-05", admin: "Admin3" },
    { name: "زهراء", nameEn: "Zahraa", phone: "07512398765", quantity: "500", paid: "300", remaining: "200", address: "Karbala", ministry: "Electricity", date: "2025-05-07", admin: "Admin1" },
    { name: "سعد", nameEn: "Saad", phone: "07894561230", quantity: "400", paid: "250", remaining: "150", address: "Mosul", ministry: "Defense", date: "2025-05-10", admin: "Admin2" },
    { name: "ليلى", nameEn: "Layla", phone: "07765432109", quantity: "320", paid: "220", remaining: "100", address: "Sulaymaniyah", ministry: "Agriculture", date: "2025-05-12", admin: "Admin3" },
    { name: "كرار", nameEn: "Karrar", phone: "07911223344", quantity: "180", paid: "120", remaining: "60", address: "Diwaniya", ministry: "Finance", date: "2025-05-14", admin: "Admin1" },
    { name: "نور", nameEn: "Noor", phone: "07899887766", quantity: "220", paid: "180", remaining: "40", address: "Amara", ministry: "Planning", date: "2025-05-18", admin: "Admin2" },
    { name: "محمد", nameEn: "Mohammed", phone: "07722334455", quantity: "350", paid: "300", remaining: "50", address: "Erbil", ministry: "Transport", date: "2025-05-20", admin: "Admin3" },
    { name: "رنا", nameEn: "Rana", phone: "07933445566", quantity: "270", paid: "170", remaining: "100", address: "Duhok", ministry: "Youth", date: "2025-05-25", admin: "Admin1" },
    { name: "علي", nameEn: "Ali", phone: "07811223344", quantity: "190", paid: "140", remaining: "50", address: "Kirkuk", ministry: "Commerce", date: "2025-05-28", admin: "Admin2" },
    { name: "هناء", nameEn: "Hanaa", phone: "07799887766", quantity: "230", paid: "180", remaining: "50", address: "Samawa", ministry: "Industry", date: "2025-05-30", admin: "Admin3" },
  ];

  const handleSearch = () => {
    let result = reports;

    if (admin.trim() || startDate || endDate) {
      result = reports.filter((report) => {
        const adminMatch = admin.trim() === "" || 
          report.admin.toLowerCase().includes(admin.toLowerCase().trim());
        
        let dateMatch = true;
        if (startDate || endDate) {
          const reportDate = new Date(report.date);
          reportDate.setHours(0, 0, 0, 0); 
          
          const start = startDate ? new Date(startDate) : null;
          if (start) start.setHours(0, 0, 0, 0);
          
          const end = endDate ? new Date(endDate) : null;
          if (end) end.setHours(23, 59, 59, 999); 
          
          if (start && end) {
            dateMatch = reportDate >= start && reportDate <= end;
          } else if (start) {
            dateMatch = reportDate >= start;
          } else if (end) {
            dateMatch = reportDate <= end;
          }
        }
        
        return adminMatch && dateMatch;
      });
    }

    setFilteredReports(result);
  };

  return (
    <div className="m-4 sm:m-16 p-4 sm:p-6 bg-gray-50 min-h-screen text-right font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
        <h2 className="text-2xl font-bold text-gray-700">تقارير الوصول</h2>
      </div>

      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-end flex-wrap">
          <div className="flex flex-col">
            <label htmlFor="startDate" className="text-sm text-gray-600 mb-1">من تاريخ</label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border px-3 py-2 rounded w-full md:w-auto"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="endDate" className="text-sm text-gray-600 mb-1">إلى تاريخ</label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border px-3 py-2 rounded w-full md:w-auto"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="admin" className="text-sm text-gray-600 mb-1">اسم المسؤول</label>
            <input
              id="admin"
              type="text"
              value={admin}
              onChange={(e) => setAdmin(e.target.value)}
              className="border px-3 py-2 rounded w-full md:w-auto"
              placeholder="ابحث باسم المسؤول"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition w-full md:w-auto self-end mt-6"
          >
            بحث
          </button>
        </div>
      </div>
      <div className="w-full mb-8">
        <TotalBills />
      </div>
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full sm:min-w-[700px] text-sm text-right border-collapse">
          <thead className="bg-gray-100 text-gray-600 font-bold">
            <tr>
              <th className="px-4 py-2 whitespace-nowrap">الاسم بالعربي</th>
              <th className="px-4 py-2 whitespace-nowrap">الاسم بالإنجليزي</th>
              <th className="px-4 py-2 whitespace-nowrap">رقم الهاتف</th>
              <th className="px-4 py-2 whitespace-nowrap">المبلغ الكامل</th>
              <th className="px-4 py-2 whitespace-nowrap">المدفوع</th>
              <th className="px-4 py-2 whitespace-nowrap">المتبقي</th>
              <th className="px-4 py-2 whitespace-nowrap">العنوان</th>
              <th className="px-4 py-2 whitespace-nowrap">عنوان الوزارة</th>
              <th className="px-4 py-2 whitespace-nowrap">المسؤول</th>
              <th className="px-4 py-2 whitespace-nowrap">أنشأ في</th>

            </tr>
          </thead>
          <tbody>
            {(filteredReports.length ? filteredReports : reports).length > 0 ? (
              (filteredReports.length ? filteredReports : reports).map((report, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap">{report.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{report.nameEn}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{report.phone}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{report.quantity}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{report.paid}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{report.remaining}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{report.address}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{report.ministry}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{report.admin}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{report.date}</td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="px-4 py-4 text-center text-gray-500">
                  لا توجد نتائج مطابقة لبحثك
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AccessReports;