import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://hawkama.cbc-api.app/api/reports";

const AddReportForm = () => {
  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    phoneNumber: "",
    quantity: "", // غيرنا القيمة الأولية إلى سلسلة فارغة للسماح بإدخال المستخدم أو البقاء فارغًا
    moneyPaid: "",
    moneyRemain: "",
    address: "",
    ministry: "",
    admin: "",
    cardCategory: {
      oneYear: 0,
      twoYears: 0,
      virtual: 0
    },
    notes: "",
    onPayroll: false
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData && storedUserData !== "undefined") {
      try {
        const userData = JSON.parse(storedUserData);
        const username = userData?.username || "مسؤول النظام";
        setFormData(prev => ({ ...prev, admin: username }));
      } catch {
        setFormData(prev => ({ ...prev, admin: "مسؤول النظام" }));
      }
    } else {
      setFormData(prev => ({ ...prev, admin: "مسؤول النظام" }));
    }
  }, []);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("توكن المصادقة غير موجود"); // استخدم واجهة مستخدم مخصصة بدلاً من alert
      throw new Error("توكن المصادقة غير موجود");
    }
    return { Authorization: `Bearer ${token}` };
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // التعامل مع فئة البطاقة
    if (name === "cardType") {
      setFormData(prev => ({
        ...prev,
        cardCategory: {
          oneYear: value === "oneYear" ? 1 : 0,
          twoYears: value === "twoYears" ? 1 : 0,
          virtual: value === "virtual" ? 1 : 0
        }
      }));
    }
    // التعامل مع حقل 'على الراتب' (Checkbox)
    else if (name === "onPayroll") {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    }
    // التعامل مع الحقول الرقمية ('quantity', 'moneyPaid', 'moneyRemain')
    else if (name === "quantity" || name === "moneyPaid" || name === "moneyRemain") {
      setFormData(prev => ({
        ...prev,
        // تحويل القيمة إلى رقم. إذا كانت فارغة، اجعلها فارغة بدلاً من 0 لتجنب التحويل التلقائي
        [name]: value === "" ? "" : Number(value)
      }));
    }
    // التعامل مع الحقول النصية الأخرى
    else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let card_id = "5";
    if (formData.cardCategory.oneYear === 1) card_id = "1";
    else if (formData.cardCategory.twoYears === 1) card_id = "2";
    else if (formData.cardCategory.virtual === 1) card_id = "3"; // تأكد من تعيين card_id للبطاقة الافتراضية

    const fullData = { ...formData, card_id };

    // إضافة console.log لتتبع البيانات المرسلة
    console.log("Data being sent to API:", fullData);

    try {
      const headers = { headers: getAuthHeader() };
      await axios.post(API_URL, fullData, headers);
      alert("تم إضافة الفاتورة بنجاح"); // استخدم واجهة مستخدم مخصصة بدلاً من alert
      navigate("/accessreports");
    } catch (error) {
      alert("حدث خطأ: " + (error.response?.data?.message || error.message)); // استخدم واجهة مستخدم مخصصة بدلاً من alert
      console.error("Error creating report:", error.response?.data || error.message);
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
          <label className="block mb-1 text-gray-600">الاسم بالعربي</label>
          <input
            name="name_ar"
            value={formData.name_ar}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-600">الاسم بالإنجليزي</label>
          <input
            name="name_en"
            value={formData.name_en}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-600">رقم الهاتف</label>
          <input
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-600">الكمية</label>
          <input
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            type="number"
            className="w-full border rounded px-4 py-2"
            // ملاحظة: لا تستخدم required هنا إذا كان يمكن أن تكون القيمة 0، 
            // لكن إذا أردت أن يجبر المستخدم على إدخال قيمة، فاجعلها true.
            // لكي يظهر 0 كقيمة افتراضية، يجب أن يرسل 0
            required 
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-600">المدفوع</label>
          <input
            name="moneyPaid"
            value={formData.moneyPaid}
            onChange={handleChange}
            type="number"
            className="w-full border rounded px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-600">المتبقي</label>
          <input
            name="moneyRemain"
            value={formData.moneyRemain}
            onChange={handleChange}
            type="number"
            className="w-full border rounded px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-600">العنوان</label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-600">عنوان الوزارة</label>
          <input
            name="ministry"
            value={formData.ministry}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block mb-1 text-gray-600">الملاحظات</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2 h-24"
          ></textarea>
        </div>
        <div className="sm:col-span-2 flex items-center mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="onPayroll"
              checked={formData.onPayroll}
              onChange={handleChange}
              className="h-5 w-5 text-teal-600"
            />
            <span className="mr-2 text-gray-700">على الراتب</span>
          </label>
        </div>
        <div className="sm:col-span-2">
          <label className="block mb-3 text-gray-600">فئة البطاقة</label>
          <div className="flex flex-wrap gap-4 justify-end">
            <label className="flex items-center space-x-reverse space-x-2">
              <input
                type="radio"
                name="cardType"
                value="oneYear"
                onChange={handleChange}
                checked={formData.cardCategory.oneYear === 1}
                className="text-teal-600"
                required
              />
              <span>بطاقة سنة واحدة</span>
            </label>
            <label className="flex items-center space-x-reverse space-x-2">
              <input
                type="radio"
                name="cardType"
                value="twoYears"
                onChange={handleChange}
                checked={formData.cardCategory.twoYears === 1}
                className="text-teal-600"
              />
              <span>بطاقة سنتين</span>
            </label>
            <label className="flex items-center space-x-reverse space-x-2">
              <input
                type="radio"
                name="cardType"
                value="virtual"
                onChange={handleChange}
                checked={formData.cardCategory.virtual === 1}
                className="text-teal-600"
              />
              <span>بطاقة افتراضية</span>
            </label>
          </div>
        </div>
        <div className="sm:col-span-2 text-left">
          <button
            type="submit"
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded"
          >
            إضافة فاتورة جديدة
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddReportForm;
