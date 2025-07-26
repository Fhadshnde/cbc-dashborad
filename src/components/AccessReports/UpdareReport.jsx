import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = "https://hawkama.cbc-api.app/api/reports";

const EditReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    nameEn: "",
    phone: "",
    quantity: "",
    paid: "",
    remaining: "",
    address: "",
    ministry: "",
    notes: "",
    onPayroll: false,
    cardCategory: {
      oneYear: 0,
      twoYears: 0,
      virtual: 0
    }
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [createdAt, setCreatedAt] = useState(null); // لتخزين وقت الإنشاء

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { Authorization: `Bearer ${token}` };
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData && storedUserData !== "undefined") {
      try {
        const userData = JSON.parse(storedUserData);
        setUserRole(userData?.role);
      } catch {
        setUserRole(null);
      }
    }

    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}`, {
          headers: getAuthHeader()
        });
        const found = response.data.find((r) => r._id === id);
        if (found) {
          setReport(found);
          setCreatedAt(found.date || null);
          setFormData({
            name: found.name || "",
            nameEn: found.nameEn || "",
            phone: found.phone || "",
            quantity: found.quantity || "",
            paid: found.paid || "",
            remaining: found.remaining || "",
            address: found.address || "",
            ministry: found.ministry || "",
            notes: found.notes || "",
            onPayroll: found.onPayroll || false,
            cardCategory: found.cardCategory || {
              oneYear: 0,
              twoYears: 0,
              virtual: 0
            }
          });
        } else {
          setError("لم يتم العثور على الفاتورة");
        }
      } catch (err) {
        setError("حدث خطأ أثناء تحميل الفاتورة");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("cardCategory.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        cardCategory: {
          ...prev.cardCategory,
          [key]: Number(value)
        }
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userRole === "admin" && createdAt) {
      const createdDate = new Date(createdAt);
      const now = new Date();
      const diffMs = now - createdDate;
      const diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours > 6) {
        setError("لا يمكنك تعديل الفاتورة بعد مرور 6 ساعات من إنشائها");
        return;
      }
    }

    try {
      setLoading(true);
      await axios.put(`${API_URL}/${id}`, formData, {
        headers: getAuthHeader()
      });
      navigate("/access-reports");
    } catch (err) {
      setError("فشل في تحديث الفاتورة");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-4">...جاري التحميل</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!report) return null;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-12">
      <h2 className="text-2xl font-bold mb-6">تعديل الفاتورة</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="الاسم بالعربي" className="w-full border p-2 rounded" />
        <input name="nameEn" value={formData.nameEn} onChange={handleChange} placeholder="الاسم بالإنجليزي" className="w-full border p-2 rounded" />
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="رقم الهاتف" className="w-full border p-2 rounded" />
        <input name="quantity" value={formData.quantity} onChange={handleChange} placeholder="المبلغ الكامل" className="w-full border p-2 rounded" />
        <input name="paid" value={formData.paid} onChange={handleChange} placeholder="المدفوع" className="w-full border p-2 rounded" />
        <input name="remaining" value={formData.remaining} onChange={handleChange} placeholder="المتبقي" className="w-full border p-2 rounded" />
        <input name="address" value={formData.address} onChange={handleChange} placeholder="العنوان" className="w-full border p-2 rounded" />
        <input name="ministry" value={formData.ministry} onChange={handleChange} placeholder="عنوان الوزارة" className="w-full border p-2 rounded" />
        <textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="ملاحظات" className="w-full border p-2 rounded" />
        <div className="flex gap-4">
          <label>
            <input type="checkbox" name="onPayroll" checked={formData.onPayroll} onChange={handleChange} />
            على الراتب
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input type="number" name="cardCategory.oneYear" value={formData.cardCategory.oneYear} onChange={handleChange} placeholder="بطاقة سنة" className="border p-2 rounded" />
          <input type="number" name="cardCategory.twoYears" value={formData.cardCategory.twoYears} onChange={handleChange} placeholder="بطاقة سنتين" className="border p-2 rounded" />
          <input type="number" name="cardCategory.virtual" value={formData.cardCategory.virtual} onChange={handleChange} placeholder="بطاقة 6 اشهر" className="border p-2 rounded" />
        </div>
        <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded hover:bg-teal-700 transition">حفظ التعديلات</button>
      </form>
    </div>
  );
};

export default EditReport;
