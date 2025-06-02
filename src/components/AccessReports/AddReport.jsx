import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "/api/reports"; 

const AddReportForm = () => {
  const [formData, setFormData] = useState({
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
      virtual: 0
    }
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
  
    if (storedUserData && storedUserData !== "undefined") {
      try {
        const userData = JSON.parse(storedUserData);
        const username = userData?.username || 'مسؤول النظام';
        setFormData(prev => ({ ...prev, admin: username }));
      } catch (error) {
        console.error("Error parsing user data:", error);
        setFormData(prev => ({ ...prev, admin: 'مسؤول النظام' }));
      }
    } else {
      setFormData(prev => ({ ...prev, admin: 'مسؤول النظام' }));
    }
  }, []);
  
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("خطأ: توكن المصادقة غير موجود. يرجى تسجيل الدخول.");
      throw new Error("توكن المصادقة غير موجود");
    }
    return { Authorization: `Bearer ${token}` };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "cardType") {
      setFormData(prev => ({
        ...prev,
        cardCategory: {
          oneYear: value === "oneYear" ? 1 : 0,
          twoYears: value === "twoYears" ? 1 : 0,
          virtual: value === "virtual" ? 1 : 0
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = { headers: getAuthHeader() }; // <--- استخدام getAuthHeader
      await axios.post(API_URL, formData, headers); // <--- استخدام API_URL وإرسال الترويسات
      alert("تم إضافة الفاتورة بنجاح!");
      navigate("/accessreports"); // توجيه لصفحة عرض التقارير
    } catch (error) {
      alert("حدث خطأ أثناء الإضافة: " + (error.response?.data?.message || error.message));
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10 font-sans text-right">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">إضافة فاتورة جديدة</h2>

      <p className="mb-4 text-gray-600 text-sm">
        المستخدم الحالي: <strong>{formData.admin || "غير مسجل"}</strong>
      </p>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1 font-medium text-gray-600">الاسم بالعربي</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="الاسم بالعربي"
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-600">الاسم بالإنجليزي</label>
          <input
            name="nameEn"
            value={formData.nameEn}
            onChange={handleChange}
            placeholder="الاسم بالإنجليزي"
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-600">رقم الهاتف</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="رقم الهاتف"
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-600">المبلغ الكامل</label>
          <input
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="المبلغ الكامل"
            type="number"
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-600">المدفوع</label>
          <input
            name="paid"
            value={formData.paid}
            onChange={handleChange}
            placeholder="المدفوع"
            type="number"
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-600">المتبقي</label>
          <input
            name="remaining"
            value={formData.remaining}
            onChange={handleChange}
            placeholder="المتبقي"
            type="number"
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-600">العنوان</label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="العنوان"
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-600">عنوان الوزارة</label>
          <input
            name="ministry"
            value={formData.ministry}
            onChange={handleChange}
            placeholder="عنوان الوزارة"
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-600">التاريخ</label>
          <input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block mb-3 font-medium text-gray-600">فئة البطاقة</label>
          <div className="flex flex-wrap gap-4 justify-end">
            <label className="flex items-center space-x-2 space-x-reverse">
              <input
                type="radio"
                name="cardType"
                value="oneYear"
                onChange={handleChange}
                checked={formData.cardCategory.oneYear === 1}
                className="form-radio text-teal-600"
                required
              />
              <span>بطاقة سنة واحدة</span>
            </label>
            
            <label className="flex items-center space-x-2 space-x-reverse">
              <input
                type="radio"
                name="cardType"
                value="twoYears"
                onChange={handleChange}
                checked={formData.cardCategory.twoYears === 1}
                className="form-radio text-teal-600"
              />
              <span>بطاقة سنتين</span>
            </label>
            
            <label className="flex items-center space-x-2 space-x-reverse">
              <input
                type="radio"
                name="cardType"
                value="virtual"
                onChange={handleChange}
                checked={formData.cardCategory.virtual === 1}
                className="form-radio text-teal-600"
              />
              <span>بطاقة افتراضية</span>
            </label>
          </div>
        </div>

        <div className="sm:col-span-2 text-left">
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded shadow transition"
          >
            إضافة فاتورة جديدة
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddReportForm;