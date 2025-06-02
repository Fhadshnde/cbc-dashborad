import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = "api/reports";

const ArchiveReports = () => {
    const [reports, setReports] = useState([]);
    const [filteredReports, setFilteredReports] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [admin, setAdmin] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState(null);

    const getAuthHeader = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("خطأ: توكن المصادقة غير موجود. يرجى تسجيل الدخول.");
            throw new Error("توكن المصادقة غير موجود");
        }
        return { Authorization: `Bearer ${token}` };
    };

    useEffect(() => {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData && storedUserData !== "undefined") {
            try {
                const userData = JSON.parse(storedUserData);
                setUserRole(userData?.role);
            } catch (error) {
                console.error("Error parsing user data from localStorage:", error);
                setUserRole(null);
            }
        }

        const fetchReports = async () => {
            setLoading(true);
            setError(null);
            try {
                const headers = { headers: getAuthHeader() };
                const response = await axios.get(API_URL, headers);
                setReports(response.data);
                setFilteredReports(response.data);
            } catch (err) {
                setError("حدث خطأ أثناء جلب البيانات: " + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const handleSearch = () => {
        let result = reports;

        if (searchTerm.trim()) {
            result = result.filter((report) =>
                (report.name && report.name.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
                (report.phone && report.phone.includes(searchTerm.trim())) ||
                (report.admin && report.admin.toLowerCase().includes(searchTerm.toLowerCase().trim()))
            );
        }

        if (admin.trim()) {
            result = result.filter((report) =>
                report.admin.toLowerCase().includes(admin.toLowerCase().trim())
            );
        }

        if (startDate || endDate) {
            result = result.filter((report) => {
                const reportDate = new Date(report.date);
                reportDate.setHours(0, 0, 0, 0);

                const start = startDate ? new Date(startDate) : null;
                if (start) start.setHours(0, 0, 0, 0);

                const end = endDate ? new Date(endDate) : null;
                if (end) end.setHours(23, 59, 59, 999);

                if (start && end) {
                    return reportDate >= start && reportDate <= end;
                } else if (start) {
                    return reportDate >= start;
                } else if (end) {
                    return reportDate <= end;
                }
                return true;
            });
        }

        if (statusFilter) {
            result = result.filter((report) => report.status === statusFilter);
        }

        setFilteredReports(result);
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "pending":
                return "bg-[#F59E2D] text-white";
            case "rejected":
                return "bg-red-600 text-white";
            case "canceled":
                return "bg-[#C56E21] text-white";
            case "received":
                return "bg-[#25BC9D] text-white";
            default:
                return "bg-gray-200 text-gray-800";
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case "pending":
                return "قيد الانتظار";
            case "rejected":
                return "مرفوضة";
            case "canceled":
                return "ملغاة";
            case "received":
                return "مستلمة";
            default:
                return "غير محدد";
        }
    };

    return (
        <div className="m-4 sm:m-16 p-4 sm:p-6 bg-gray-50 min-h-screen text-right font-sans">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
                <h2 className="text-2xl font-bold text-gray-700">الأرشيف</h2>
                <div className="relative w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="ماذا الذي تبحث عنه..."
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
                    <div className="flex flex-col">
                        <label htmlFor="admin" className="text-sm text-gray-600 mb-1">
                            اسم المسؤول
                        </label>
                        <input
                            id="admin"
                            type="text"
                            value={admin}
                            onChange={(e) => setAdmin(e.target.value)}
                            className="border px-3 py-2 rounded w-full md:w-auto"
                            placeholder="ابحث باسم المسؤول"
                        />
                    </div>
                    <div className="flex flex-col space-y-2 w-full md:w-64">
                        <label htmlFor="statusFilter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            الحالة
                        </label>
                        <select
                            id="statusFilter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none px-4 py-2 transition-all duration-200"
                        >
                            <option value="">كل الحالات</option>
                            <option value="pending">قيد الانتظار</option>
                            <option value="rejected">مرفوضة</option>
                            <option value="canceled">ملغاة</option>
                            <option value="received">مستلمة</option>
                        </select>
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
                                <th className="px-4 py-2 whitespace-nowrap">الاسم الزبون</th>
                                <th className="px-4 py-2 whitespace-nowrap">رقم الهاتف</th>
                                <th className="px-4 py-2 whitespace-nowrap">الموظف المسؤول</th>
                                <th className="px-4 py-2 whitespace-nowrap">تاريخ</th>
                                <th className="px-4 py-2 whitespace-nowrap">الحالة</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredReports.length > 0 ? (
                                filteredReports.map((report, i) => (
                                    <tr key={i} className="border-t hover:bg-gray-50">
                                        <td className="px-4 py-2 whitespace-nowrap">{report.name}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">{report.phone}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">{report.admin}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">{report.date}</td>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(report.status)}`}>
                                                {getStatusText(report.status)}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                                        لا توجد نتائج مطابقة لبحثك
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {/* <div className="flex justify-center items-center py-4 border-t border-gray-200">
                        <nav className="relative z-0 inline-flex shadow-sm -space-x-px" aria-label="Pagination">
                            <button
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                السابق
                            </button>
                            <button
                                aria-current="page"
                                className="z-10 bg-teal-50 border-teal-500 text-teal-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                            >
                                1
                            </button>
                            <button
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                2
                            </button>
                            <button
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                3
                            </button>
                            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                ...
                            </span>
                            <button
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                24
                            </button>
                            <button
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                            >
                                التالي
                            </button>
                        </nav>
                    </div> */}
                </div>
            )}
        </div>
    );
};

export default ArchiveReports;