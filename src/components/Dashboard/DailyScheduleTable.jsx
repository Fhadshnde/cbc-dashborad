import React, { useState } from "react";

const employeesList = ["علي", "محمد", "فهد", "مرتضى", "سارة", "بشرى"];

const contractTypes = ["متجدد", "جديد"]; // أنواع عقود جديدة ومتجددة

function DailyScheduleTable() {
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedEmployeeFilter, setSelectedEmployeeFilter] = useState("");
  const [selectedContractFilter, setSelectedContractFilter] = useState("");

  const data = [
    { date: "2025 أبريل / 25", contractType: "جديد", title: "Al-Harrya", total: "80", relationsEmployee: "علي" },
    { date: "2025 أبريل / 25", contractType: "جديد", title: "Al-Harrya", total: "70", relationsEmployee: "محمد" },
    { date: "2025 أبريل / 25", contractType: "جديد", title: "Al-Harrya", total: "90", relationsEmployee: "فهد" },
    { date: "2025 أبريل / 26", contractType: "متجدد", title: "Al-Harrya", total: "40", relationsEmployee: "بشرى" },
    { date: "2025 أبريل / 26", contractType: "متجدد", title: "Al-Harrya", total: "30", relationsEmployee: "سارة" },
    { date: "2025 أبريل / 27", contractType: "متجدد", title: "Al-Harrya", total: "85", relationsEmployee: "مرتضى" },
    { date: "2025 أبريل / 27", contractType: "جديد", title: "Al-Harrya", total: "20", relationsEmployee: "علي" },
    { date: "2025 أبريل / 28", contractType: "متجدد", title: "Al-Harrya", total: "95", relationsEmployee: "محمد" },
  ];

  // تصفية البيانات حسب الموظف ونوع العقد المحددين (إذا تم تحديد أي منهما)
  const filteredData = data.filter((row) => {
    const employeeMatch = selectedEmployeeFilter ? row.relationsEmployee === selectedEmployeeFilter : true;
    const contractMatch = selectedContractFilter ? row.contractType === selectedContractFilter : true;
    return employeeMatch && contractMatch;
  });

  // تبديل عرض الفلتر عند الضغط على الثلاث نقاط
  const toggleFilter = () => {
    setFilterVisible(!filterVisible);
  };

  // عند اختيار موظف للعلاقات من الفلتر
  const handleEmployeeFilterSelect = (employee) => {
    setSelectedEmployeeFilter(employee);
  };

  // عند اختيار نوع العقد من الفلتر
  const handleContractFilterSelect = (contractType) => {
    setSelectedContractFilter(contractType);
  };

  // مسح كل الفلاتر
  const clearFilters = () => {
    setSelectedEmployeeFilter("");
    setSelectedContractFilter("");
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full h-[430px] flex flex-col text-right rtl overflow-x-auto relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">جدول اليوم</h3>
        <span
          onClick={toggleFilter}
          className="text-gray-400 text-2xl leading-none cursor-pointer select-none"
          title="فتح / غلق الفلتر"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") toggleFilter();
          }}
        >
          ...
        </span>
      </div>

      {/* قائمة الفلترة */}
      {filterVisible && (
        <div className="absolute top-14 right-6 z-20 w-56 bg-white border border-gray-300 rounded shadow-lg p-4">
          <div className="mb-3">
            <div className="font-semibold mb-1">تصفية موظف العلاقات</div>
            <ul className="max-h-32 overflow-auto border rounded border-gray-200">
              <li
                onClick={() => handleEmployeeFilterSelect("")}
                className={`cursor-pointer px-3 py-1 hover:bg-teal-100 ${
                  selectedEmployeeFilter === "" ? "bg-teal-200 font-semibold" : ""
                }`}
              >
                الكل
              </li>
              {employeesList.map((emp) => (
                <li
                  key={emp}
                  onClick={() => handleEmployeeFilterSelect(emp)}
                  className={`cursor-pointer px-3 py-1 hover:bg-teal-100 ${
                    selectedEmployeeFilter === emp ? "bg-teal-200 font-semibold" : ""
                  }`}
                >
                  {emp}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-3">
            <div className="font-semibold mb-1">تصفية نوع العقد</div>
            <ul className="max-h-32 overflow-auto border rounded border-gray-200">
              <li
                onClick={() => handleContractFilterSelect("")}
                className={`cursor-pointer px-3 py-1 hover:bg-teal-100 ${
                  selectedContractFilter === "" ? "bg-teal-200 font-semibold" : ""
                }`}
              >
                الكل
              </li>
              {contractTypes.map((type) => (
                <li
                  key={type}
                  onClick={() => handleContractFilterSelect(type)}
                  className={`cursor-pointer px-3 py-1 hover:bg-teal-100 ${
                    selectedContractFilter === type ? "bg-teal-200 font-semibold" : ""
                  }`}
                >
                  {type}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={clearFilters}
            className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition"
          >
            مسح الفلاتر
          </button>
        </div>
      )}

      <table className="min-w-full divide-y divide-gray-200 table-fixed">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              تاريخ التوقيع
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              نوع العقد
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              العنوان
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              مجموع البطاقات
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              موظف العلاقات
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-gray-500 text-sm">
                لا توجد بيانات مطابقة للفلتر
              </td>
            </tr>
          ) : (
            filteredData.map((row, idx) => (
              <tr key={idx}>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{row.date}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{row.contractType}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{row.title}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{row.total}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{row.relationsEmployee}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DailyScheduleTable;
