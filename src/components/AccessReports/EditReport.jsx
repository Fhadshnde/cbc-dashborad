import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://hawkama.cbc-api.app/api/reports";

const EditReportForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    number: "",
    name_ar: "",
    name_en: "",
    phoneNumber: "",
    quantity: 0,
    moneyPaid: "",
    moneyRemain: "",
    address: "",
    ministry: "",
    admin: "",
    cardCategory: { oneYear: 0, twoYears: 0, virtual: 0 },
    notes: "",
    onPayroll: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("يرجى تسجيل الدخول أولاً");
          navigate("/login");
          return;
        }
        const response = await axios.get(`${API_URL}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        if (!data.cardCategory) {
          data.cardCategory = { oneYear: 0, twoYears: 0, virtual: 0 };
        } else {
          if (typeof data.cardCategory.oneYear === "undefined") data.cardCategory.oneYear = 0;
          if (typeof data.cardCategory.twoYears === "undefined") data.cardCategory.twoYears = 0;
          if (typeof data.cardCategory.virtual === "undefined") data.cardCategory.virtual = 0;
        }
        setFormData(data);
        setLoading(false);
      } catch {
        alert("فشل في جلب بيانات التقرير");
        navigate("/accessreports");
      }
    };
    if (id) {
      fetchReport();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("cardCategory.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        cardCategory: { ...prev.cardCategory, [key]: Number(value) },
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("يرجى تسجيل الدخول أولاً");
        navigate("/login");
        return;
      }
      const payload = {
        ...formData,
        quantity: Number(formData.quantity) || 0,
        moneyPaid: formData.moneyPaid.toString(),
        moneyRemain: formData.moneyRemain.toString(),
        cardCategory: {
          oneYear: Number(formData.cardCategory.oneYear) || 0,
          twoYears: Number(formData.cardCategory.twoYears) || 0,
          virtual: Number(formData.cardCategory.virtual) || 0,
        },
      };
      if ("date" in payload) {
        delete payload.date;
      }
      await axios.put(`${API_URL}/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("تم تعديل التقرير بنجاح");
      navigate("/accessreports");
    } catch {
      setError("فشل في تعديل التقرير");
    }
  };

  if (loading) {
    return <p>جاري تحميل بيانات التقرير...</p>;
  }

  return (
    <div className="edit-report-form max-w-4xl mx-auto p-6 bg-white rounded shadow mt-10 font-sans text-right">
      <h2 className="text-xl font-bold mb-6">تعديل التقرير</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* <div>
          <label className="block mb-1">رقم التقرير:</label>
          <input
            type="text"
            name="number"
            value={formData.number || ""}
            disabled
            className="border rounded w-full px-3 py-2"
          />
        </div> */}
        <div>
          <label className="block mb-1">الاسم بالعربي:</label>
          <input
            type="text"
            name="name_ar"
            value={formData.name_ar}
            onChange={handleChange}
            required
            className="border rounded w-full px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1">الاسم بالإنجليزي:</label>
          <input
            type="text"
            name="name_en"
            value={formData.name_en}
            onChange={handleChange}
            required
            className="border rounded w-full px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1">رقم الهاتف:</label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="border rounded w-full px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1">المبلغ الكامل:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="0"
            required
            className="border rounded w-full px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1">المبلغ المدفوع:</label>
          <input
            type="text"
            name="moneyPaid"
            value={formData.moneyPaid}
            onChange={handleChange}
            required
            className="border rounded w-full px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1">المبلغ المتبقي:</label>
          <input
            type="text"
            name="moneyRemain"
            value={formData.moneyRemain}
            onChange={handleChange}
            required
            className="border rounded w-full px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1">العنوان:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="border rounded w-full px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1">الوزارة:</label>
          <input
            type="text"
            name="ministry"
            value={formData.ministry}
            onChange={handleChange}
            required
            className="border rounded w-full px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1">المسؤول:</label>
          <input
            type="text"
            name="admin"
            value={formData.admin}
            disabled
            className="border rounded w-full px-3 py-2 bg-gray-100"
          />
        </div>
        <fieldset className="border p-3 rounded">
  <legend className="font-semibold mb-2">فئة البطاقة:</legend>
  <select
    name="cardCategorySelect"
    value={
      formData.cardCategory.oneYear
        ? "oneYear"
        : formData.cardCategory.twoYears
        ? "twoYears"
        : formData.cardCategory.virtual
        ? "virtual"
        : "none"
    }
    onChange={(e) => {
      const val = e.target.value;
      let newCardCategory = { oneYear: 0, twoYears: 0, virtual: 0 };
      if (val === "oneYear") newCardCategory.oneYear = 1;
      else if (val === "twoYears") newCardCategory.twoYears = 1;
      else if (val === "virtual") newCardCategory.virtual = 1;
      setFormData((prev) => ({ ...prev, cardCategory: newCardCategory }));
    }}
    className="border rounded px-2 py-1 w-48"
  >
    <option value="none">لا يوجد</option>
    <option value="oneYear">سنة واحدة</option>
    <option value="twoYears">سنتان</option>
    <option value="virtual">6 اشهر</option>
  </select>
</fieldset>

        <div>
          <label className="block mb-1">ملاحظات:</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="border rounded w-full px-3 py-2"
          />
        </div>
        <div className="flex items-center gap-2">
          <label>على الراتب:</label>
          <input
            type="checkbox"
            name="onPayroll"
            checked={formData.onPayroll}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="bg-teal-600 text-white px-6 py-2 rounded hover:bg-teal-700 transition"
        >
          حفظ التعديلات
        </button>
      </form>
    </div>
  );
};

export default EditReportForm;
