import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    nameEn: "",
    phone: "",
    quantity: "",
    paid: "",
    remaining: "",
    address: "",
    ministry: "",
    date: "",
    admin: "",
    cardCategory: {
      oneYear: 0,
      twoYears: 0,
      virtual: 0,
    },
    notes: "", 
    onPayroll: false, 
  });

  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("خطأ: توكن المصادقة غير موجود. يرجى تسجيل الدخول.");
      throw new Error("توكن المصادقة غير موجود");
    }
    return { Authorization: `Bearer ${token}` };
  };

  useEffect(() => {
    const fetchReport = async () => {
      setStatus("loading");
      try {
        const headers = { headers: getAuthHeader() }; 
        const response = await axios.get(`https://hawkama.cbc-api.app/api/reports/${id}`, headers); // إرسال الترويسة
        if (response.data) {
          setForm({
            ...response.data,
            cardCategory: response.data.cardCategory || {
              oneYear: 0,
              twoYears: 0,
              virtual: 0,
            },
            notes: response.data.notes || "", 
            onPayroll: typeof response.data.onPayroll === 'boolean' ? response.data.onPayroll : false, // تهيئة على الراتب
          });
          setStatus("succeeded");
        } else {
          alert("التقرير غير موجود");
          navigate("/supervisor/reports");
        }
      } catch (err) {
        setStatus("failed");
        setError("فشل في تحميل التقرير: " + (err.response?.data?.message || err.message));
        console.error(err);
      }
    };

    fetchReport();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target; 

    if (["oneYear", "twoYears", "virtual"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        cardCategory: {
          ...prev.cardCategory,
          [name]: Number(value),
        },
      }));
    } else if (name === "onPayroll") { 
      setForm((prev) => ({ ...prev, [name]: checked }));
    }
    else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = { headers: getAuthHeader() }
      await axios.put(`https://hawkama.cbc-api.app/api/reports/${id}`, form, headers); 
      alert("تم تحديث التقرير بنجاح");
      navigate("/supervisor/reports");
    } catch (err) {
      alert("حدث خطأ أثناء تحديث التقرير: " + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  if (status === "loading") return <p className="text-center mt-8">جاري التحميل...</p>;
  if (status === "failed") return <p className="text-center mt-8 text-red-600">حدث خطأ: {error}</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white rounded-lg shadow-lg mt-10 text-right">
      <h1 className="text-2xl font-bold mb-6 text-gray-700">تعديل التقرير</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1 font-medium text-gray-600">الاسم بالعربي</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="الاسم" className="border p-2 rounded w-full" required />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-600">الاسم بالإنجليزي</label>
          <input name="nameEn" value={form.nameEn} onChange={handleChange} placeholder="Name EN" className="border p-2 rounded w-full" required />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-600">رقم الهاتف</label>
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="الهاتف" className="border p-2 rounded w-full" required />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-600">المبلغ الكامل</label>
          <input name="quantity" type="number" value={form.quantity} onChange={handleChange} placeholder="الكمية" className="border p-2 rounded w-full" required />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-600">المدفوع</label>
          <input name="paid" type="number" value={form.paid} onChange={handleChange} placeholder="المدفوع" className="border p-2 rounded w-full" required />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-600">المتبقي</label>
          <input name="remaining" type="number" value={form.remaining} onChange={handleChange} placeholder="المتبقي" className="border p-2 rounded w-full" required />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-600">العنوان</label>
          <input name="address" value={form.address} onChange={handleChange} placeholder="العنوان" className="border p-2 rounded w-full" required />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-600">الوزارة</label>
          <input name="ministry" value={form.ministry} onChange={handleChange} placeholder="الوزارة" className="border p-2 rounded w-full" required />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-600">التاريخ</label>
          <input name="date" type="date" value={form.date} onChange={handleChange} placeholder="التاريخ" className="border p-2 rounded w-full" required />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-600">اسم المسؤول</label>
          <input name="admin" value={form.admin} onChange={handleChange} placeholder="اسم المندوب" className="border p-2 rounded w-full" required />
        </div>

        <div className="sm:col-span-2">
          <label className="block mb-1 font-medium text-gray-600">الملاحظات</label> 
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="أضف أي ملاحظات هنا..."
            className="w-full border border-gray-300 rounded px-4 py-2 h-24 resize-y"
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
              className="form-checkbox h-5 w-5 text-teal-600 rounded"
            />
            <span className="mr-2 text-gray-700 font-medium">على الراتب</span>
          </label>
        </div>

        <div className="sm:col-span-2">
          <label className="block mb-3 font-medium text-gray-600">فئات البطاقات:</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 font-medium text-gray-600">بطاقات سنة واحدة</label>
              <input name="oneYear" type="number" min="0" value={form.cardCategory.oneYear} onChange={handleChange} className="border p-2 rounded w-full" />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-600">بطاقات سنتين</label>
              <input name="twoYears" type="number" min="0" value={form.cardCategory.twoYears} onChange={handleChange} className="border p-2 rounded w-full" />
            </div>
            <div>
              <label className="block mb-1 font-medium text-gray-600">بطاقات افتراضية</label>
              <input name="virtual" type="number" min="0" value={form.cardCategory.virtual} onChange={handleChange} className="border p-2 rounded w-full" />
            </div>
          </div>
        </div>

        <div className="sm:col-span-2 text-left mt-4">
          <button type="submit" className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition w-full sm:w-auto">تحديث التقرير</button>
        </div>
      </form>
    </div>
  );
};

export default EditReport;