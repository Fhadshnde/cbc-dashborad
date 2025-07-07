import React, { useState } from "react";
import { Search } from "lucide-react";
import { FaFilter, FaChevronDown } from "react-icons/fa";

const NotificationsPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const notifications = [
    {
      priority: "هام",
      sender: "مسؤول المبيعات",
      date: "12/2/22025",
      message: "يرجى استكمال العقود الناقصه",
      category: "العقود الناقصة",
    },
    {
      priority: "أقل اهميه",
      sender: "مسؤول المبيعات",
      date: "12/2/22025",
      message: "يرجى استكمال العقود الناقصه",
      category: "متاجر بحاجة زيارة",
    },
    {
      priority: "متوسط",
      sender: "مسؤول المبيعات",
      date: "12/2/22025",
      message: "يرجى استكمال العقود الناقصه",
      category: "متاجر خاملة",
    },
    {
      priority: "هام",
      sender: "مسؤول المبيعات",
      date: "12/2/22025",
      message: "يرجى استكمال العقود الناقصه",
      category: "إشعارات منتهية الصلاحية",
    },
  ];

  const getPriorityDot = (priority) => {
    switch (priority) {
      case "هام":
        return <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>;
      case "متوسط":
        return <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span>;
      case "أقل اهميه":
        return <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>;
      default:
        return <span className="w-3 h-3 rounded-full bg-gray-500 inline-block"></span>;
    }
  };

  return (
    <div className="flex min-h-screen rtl font-sans bg-gray-100">
      <div className={`flex-1 p-6 transition-all duration-300 ${isFilterOpen ? "ml-80" : "ml-0"}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-1/3">
            <input
              type="text"
              placeholder="ماذا نبحث عن..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring text-right"
            />
            <Search className="absolute right-96 top-2.5 h-5 w-5 text-[#25BC9D]" />
          </div>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-sm hover:bg-gray-100 transition-colors"
            style={{ borderRadius: "0.5rem", background: "#e0f2f7" }}
          >
            <FaFilter className="text-xl text-[#25BC9D] ml-2" />
            <span className="text-teal-700 font-semibold">تصفية</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded shadow bg-white">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="text-sm bg-gray-50">
                <th className="px-4 py-3 text-center border-b">العنوان</th>
                <th className="px-4 py-3 text-center border-b">الرسالة</th>
                <th className="px-4 py-3 text-center border-b">التاريخ</th>
                <th className="px-4 py-3 text-center border-b">المستخدم</th>
                <th className="px-4 py-3 text-center border-b">الحالة</th>
                <th className="px-4 py-3 text-center border-b">تفعيل</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notification, index) => (
                <tr key={index} className="text-sm hover:bg-gray-50 border-b">
                  <td className="px-4 py-3 text-center">{notification.category}</td>
                  <td className="px-4 py-3 text-center">{notification.message}</td>
                  <td className="px-4 py-3 text-center">{notification.date}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center items-center gap-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A4 4 0 018 16h8a4 4 0 012.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{notification.sender}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center items-center gap-1">
                      {getPriorityDot(notification.priority)}
                      <span className="text-sm font-medium">{notification.priority}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-teal-500 relative">
                        <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full shadow peer-checked:translate-x-full transition-transform"></div>
                      </div>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className={`fixed inset-y-0 left-0 w-80 shadow-lg transform transition-transform duration-300 z-50 p-6 rtl
        ${isFilterOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col`}
        style={{
          background: "linear-gradient(to bottom, #eff8f7, #c1e0e8)",
          borderRadius: "0 1.5rem 1.5rem 0",
        }}
      >
        <div className="absolute top-0 left-0 h-full w-2 rounded-tl-3xl rounded-bl-3xl bg-gradient-to-b from-teal-400 to-green-400"></div>

        <div
          className="relative px-6 py-4 flex items-center justify-between"
          style={{
            background: "linear-gradient(to left, #e8f5f2, #d1e7e4)",
            borderRadius: "1.5rem 0 0 0",
            marginTop: "-1.5rem",
            marginLeft: "-1.5rem",
            marginRight: "-1.5rem",
          }}
        >
          <h2 className="text-xl font-bold text-gray-800">الفلاتر</h2>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pt-6 px-4">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">البحث</label>
            <input
              type="text"
              placeholder="ابحث عن..."
              className="w-full pr-4 py-2 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-teal-500"
              style={{ background: "#eaf4f7", border: "none" }}
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-gray-700 text-sm font-medium">الموظفة</label>
              <button className="text-gray-400 text-xs hover:text-gray-600">مسح</button>
            </div>
            <select className="w-full p-2 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-teal-500 appearance-none" style={{ background: "#eaf4f7", border: "none" }}>
              <option>اختر</option>
              <option>مسؤول المبيعات</option>
            </select>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-gray-700 text-sm font-medium">التاريخ</label>
              <button className="text-gray-400 text-xs hover:text-gray-600">مسح</button>
            </div>
            <input type="date" className="w-full p-2 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-teal-500" style={{ background: "#eaf4f7", border: "none" }} />
          </div>

          <div className="mb-8">
            <label className="block text-gray-700 text-sm font-medium mb-2">نوع التنبيه</label>
            <div className="space-y-3">
              {[
                { label: "هام", color: "bg-red-500", checked: true },
                { label: "متوسط", color: "bg-yellow-400", checked: false },
                { label: "أقل اهميه", color: "bg-green-500", checked: true },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
                    <span>{item.label}</span>
                  </div>
                  <input type="checkbox" defaultChecked={item.checked} className="form-checkbox h-5 w-5 text-blue-600 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 flex justify-between space-x-4 space-x-reverse border-t border-gray-200">
          <button className="w-1/2 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors" style={{ background: "#eaf4f7", border: "none" }}>مسح الكل</button>
          <button className="w-1/2 py-2 bg-gradient-to-r from-teal-400 to-green-500 text-white rounded-lg shadow-md hover:from-teal-500 hover:to-green-600 transition-colors">تطبيق (3)</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
