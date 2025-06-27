import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name_ar: "",        // Changed from 'name'
    name_en: "",        // Changed from 'nameEn'
    phoneNumber: "",    // Changed from 'phone'
    quantity: "",
    moneyPaid: "",      // Changed from 'paid'
    moneyRemain: "",    // Changed from 'remaining'
    address: "",
    ministry: "",
    date: "",           // This will be YYYY-MM-DD for input, converted to YYYY/MM for API
    admin: "",
    cardCategory: {
      oneYear: 0,
      twoYears: 0,
      virtual: 0,
    },
    notes: "",
    onPayroll: false,
  });

  const [status, setStatus] = useState("idle"); // idle, loading, succeeded, failed
  const [error, setError] = useState(""); // For displaying error messages in the UI

  // Function to get the authorization header with the token
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("توكن المصادقة غير موجود. يرجى تسجيل الدخول."); // Set error in UI
      throw new Error("توكن المصادقة غير موجود");
    }
    return { Authorization: `Bearer ${token}` };
  };

  // Effect to fetch report data when the component mounts or ID changes
  useEffect(() => {
    const fetchReport = async () => {
      setStatus("loading"); // Set loading status
      setError(""); // Clear previous errors
      try {
        const headers = { headers: getAuthHeader() };
        const response = await axios.get(`https://hawkama.cbc-api.app/api/reports/${id}`, headers);
        if (response.data) {
          const fetchedData = response.data;

          // Convert 'YYYY/MM' date from backend to 'YYYY-MM-DD' for date input
          const formattedDateForInput = fetchedData.date
            ? `${fetchedData.date.substring(0, 4)}-${fetchedData.date.substring(5, 7)}-01` // Append '-01' for a valid date string
            : "";

          setForm({
            name_ar: fetchedData.name_ar || "",
            name_en: fetchedData.name_en || "",
            phoneNumber: fetchedData.phoneNumber || "",
            quantity: fetchedData.quantity || "",
            moneyPaid: fetchedData.moneyPaid || "",
            moneyRemain: fetchedData.moneyRemain || "",
            address: fetchedData.address || "",
            ministry: fetchedData.ministry || "",
            date: formattedDateForInput,
            admin: fetchedData.admin || "",
            cardCategory: fetchedData.cardCategory || {
              oneYear: 0,
              twoYears: 0,
              virtual: 0,
            },
            notes: fetchedData.notes || "",
            onPayroll: typeof fetchedData.onPayroll === "boolean" ? fetchedData.onPayroll : false,
          });
          setStatus("succeeded"); // Set success status
        } else {
          setError("التقرير غير موجود"); // Set error in UI
          navigate("/supervisor/reports"); // Navigate back if report not found
        }
      } catch (err) {
        setStatus("failed"); // Set failed status
        setError("فشل في تحميل التقرير: " + (err.response?.data?.message || err.message)); // Set error in UI
        console.error("Error fetching report:", err);
      }
    };

    fetchReport();
  }, [id, navigate]); // Dependencies for useEffect

  // Handler for form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (["oneYear", "twoYears", "virtual"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        cardCategory: {
          ...prev.cardCategory,
          [name]: Number(value), // Convert to number
        },
      }));
    } else if (name === "onPayroll") {
      setForm((prev) => ({ ...prev, [name]: checked })); // Handle checkbox
    } else {
      setForm((prev) => ({ ...prev, [name]: value })); // Handle other text inputs
    }
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading"); // Set loading status for submission
    setError(""); // Clear previous errors

    try {
      const headers = { headers: getAuthHeader() };

      // Prepare data for submission, converting date back to YYYY/MM format
      const dataToSend = {
        ...form,
        date: form.date ? `${form.date.substring(0, 4)}/${form.date.substring(5, 7)}` : "", // Convert YYYY-MM-DD to YYYY/MM
      };

      await axios.put(`https://hawkama.cbc-api.app/api/reports/${id}`, dataToSend, headers);
      setStatus("succeeded"); // Set success status
      // Use a custom message box or toast notification instead of alert()
      console.log("تم تحديث التقرير بنجاح"); // Log success
      navigate("/supervisor/reports"); // Navigate back to reports list
    } catch (err) {
      setStatus("failed"); // Set failed status
      setError("حدث خطأ أثناء تحديث التقرير: " + (err.response?.data?.message || err.message)); // Set error in UI
      console.error("Error updating report:", err);
    }
  };

  // Conditional rendering based on status
  if (status === "loading") {
    return <p className="text-center mt-8 text-gray-600">جاري التحميل...</p>;
  }
  if (status === "failed") {
    return <p className="text-center mt-8 text-red-600">حدث خطأ: {error}</p>;
  }

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white rounded-lg shadow-lg mt-10 text-right font-sans">
      <h1 className="text-2xl font-bold mb-6 text-gray-700">تعديل التقرير</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1 font-medium text-gray-600">الاسم بالعربي</label>
          <input name="name_ar" value={form.name_ar} onChange={handleChange} placeholder="الاسم بالعربي" className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-600">الاسم بالإنجليزي</label>
          <input name="name_en" value={form.name_en} onChange={handleChange} placeholder="الاسم بالإنجليزي" className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-600">رقم الهاتف</label>
          <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="رقم الهاتف" className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-600">المبلغ الكامل</label>
          <input name="quantity" type="number" value={form.quantity} onChange={handleChange} placeholder="المبلغ الكامل" className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-600">المدفوع</label>
          <input name="moneyPaid" type="number" value={form.moneyPaid} onChange={handleChange} placeholder="المدفوع" className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-600">المتبقي</label>
          <input name="moneyRemain" type="number" value={form.moneyRemain} onChange={handleChange} placeholder="المتبقي" className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-600">العنوان</label>
          <input name="address" value={form.address} onChange={handleChange} placeholder="العنوان" className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-600">الوزارة</label>
          <input name="ministry" value={form.ministry} onChange={handleChange} placeholder="الوزارة" className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-600">التاريخ (سنة/شهر)</label>
          <input name="date" type="date" value={form.date} onChange={handleChange} placeholder="التاريخ" className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-600">اسم المسؤول</label>
          <input name="admin" value={form.admin} onChange={handleChange} placeholder="اسم المسؤول" className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>

        {/* Removed Governorate field as it's not in the AccessReportSchema */}
        {/*
        <div>
          <label className="block mb-1 font-medium text-gray-600">المحافظة</label>
          <input name="governorate" value={form.governorate} onChange={handleChange} placeholder="المحافظة" className="border p-2 rounded w-full" required />
        </div>
        */}

        <div className="sm:col-span-2">
          <label className="block mb-1 font-medium text-gray-600">الملاحظات</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="أضف أي ملاحظات هنا..."
            className="w-full border border-gray-300 rounded px-4 py-2 h-24 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div className="sm:col-span-2 flex items-center mb-4">
          <label htmlFor="onPayroll" className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="onPayroll"
              name="onPayroll"
              checked={form.onPayroll}
              onChange={handleChange}
              className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" // Changed color to blue for consistency
            />
            <span className="mr-2 text-gray-700 font-medium">على الراتب</span>
          </label>
        </div>

        <div className="sm:col-span-2">
          <label className="block mb-3 font-medium text-gray-600">فئات البطاقات:</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 font-medium text-gray-600">بطاقات سنة واحدة</label>
              <input name="oneYear" type="number" min="0" value={form.cardCategory.oneYear} onChange={handleChange} className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-600">بطاقات سنتين</label>
              <input name="twoYears" type="number" min="0" value={form.cardCategory.twoYears} onChange={handleChange} className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-600">بطاقات افتراضية</label>
              <input name="virtual" type="number" min="0" value={form.cardCategory.virtual} onChange={handleChange} className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {error && <p className="sm:col-span-2 text-center text-red-600 text-sm">{error}</p>}

        <div className="sm:col-span-2 text-left mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition w-full sm:w-auto"
            disabled={status === "loading"} // Disable button during loading
          >
            {status === "loading" ? "جاري التحديث..." : "تحديث التقرير"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditReport;
