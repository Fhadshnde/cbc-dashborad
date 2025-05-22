import React, { useState, useEffect } from "react";

const AccessReports = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [username, setUsername] = useState("");
  const [filteredReports, setFilteredReports] = useState([]);

  const reports = [
    { name: "أحمد", nameEn: "Ahmed", phone: "07891234567", quantity: "250", paid: "150", remaining: "100", address: "Baghdad", ministry: "Education", date: "2025-03-15" },
    { name: "أحمد", nameEn: "Ahmed", phone: "07891234567", quantity: "250", paid: "150", remaining: "100", address: "Baghdad", ministry: "Education", date: "2025-06-22" },
    { name: "أحمد", nameEn: "Ahmed", phone: "07891234567", quantity: "250", paid: "150", remaining: "100", address: "Baghdad", ministry: "Education", date: "2025-06-27" },
    { name: "فاطمة", nameEn: "Fatima", phone: "07712345678", quantity: "300", paid: "200", remaining: "100", address: "Basra", ministry: "Health", date: "2025-03-20" },
    { name: "حسين", nameEn: "Hussein", phone: "07987654321", quantity: "150", paid: "100", remaining: "50", address: "Najaf", ministry: "Interior", date: "2025-03-22" },
    { name: "زهراء", nameEn: "Zahraa", phone: "07512398765", quantity: "500", paid: "300", remaining: "200", address: "Karbala", ministry: "Electricity", date: "2025-03-25" },
    { name: "سعد", nameEn: "Saad", phone: "07894561230", quantity: "400", paid: "250", remaining: "150", address: "Mosul", ministry: "Defense", date: "2025-03-28" },
    { name: "ليلى", nameEn: "Layla", phone: "07765432109", quantity: "320", paid: "220", remaining: "100", address: "Sulaymaniyah", ministry: "Agriculture", date: "2025-03-30" },
    { name: "كرار", nameEn: "Karrar", phone: "07911223344", quantity: "180", paid: "120", remaining: "60", address: "Diwaniya", ministry: "Finance", date: "2025-04-01" },
    { name: "نور", nameEn: "Noor", phone: "07899887766", quantity: "220", paid: "180", remaining: "40", address: "Amara", ministry: "Planning", date: "2025-04-02" },
    { name: "محمد", nameEn: "Mohammed", phone: "07722334455", quantity: "350", paid: "300", remaining: "50", address: "Erbil", ministry: "Transport", date: "2025-04-03" },
    { name: "رنا", nameEn: "Rana", phone: "07933445566", quantity: "270", paid: "170", remaining: "100", address: "Duhok", ministry: "Youth", date: "2025-04-04" },
  ];


  useEffect(() => {
    handleSearch();
  }, [startDate, endDate, username]);

  const handleSearch = () => {
    let result = reports.filter(report => {
      const nameMatch = username.trim() === "" || report.name.includes(username) || report.nameEn.toLowerCase().includes(username.toLowerCase());
      const reportDate = new Date(report.date);
      const start = startDate ? new Date(startDate) : new Date(0);
      const end = endDate ? new Date(endDate) : new Date(8640000000000000);
      const dateMatch = reportDate >= start && reportDate <= end;
      return nameMatch && dateMatch;
    });

    setFilteredReports(result);
  };

  return (
    <div className="m-4 p-4 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-gray-700 text-right">تقارير الوصول</h2>
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border px-3 py-2 rounded w-full md:w-auto" />
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border px-3 py-2 rounded w-full md:w-auto" />
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="border px-3 py-2 rounded w-full md:w-auto" placeholder="اسم المستخدم" />
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 text-gray-600 font-bold">
            <tr>
              <th className="px-4 py-2">الاسم بالعربي</th>
              <th className="px-4 py-2">الاسم بالإنجليزي</th>
              <th className="px-4 py-2">رقم الهاتف</th>
              <th className="px-4 py-2">العنوان</th>
              <th className="px-4 py-2">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length ? (
              filteredReports.map((report, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{report.name}</td>
                  <td className="px-4 py-2">{report.nameEn}</td>
                  <td className="px-4 py-2">{report.phone}</td>
                  <td className="px-4 py-2">{report.address}</td>
                  <td className="px-4 py-2">{report.date}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="px-4 py-4 text-center text-gray-500">لا توجد نتائج مطابقة لبحثك</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccessReports;
