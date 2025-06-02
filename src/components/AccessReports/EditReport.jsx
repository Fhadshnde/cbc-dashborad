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
  });

  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      setStatus("loading");
      try {
        const response = await axios.get(`/api/reports/${id}`);
        if (response.data) {
          setForm(response.data);
          setStatus("succeeded");
        } else {
          alert("التقرير غير موجود");
          navigate("/supervisor/reports");
        }
      } catch (err) {
        setStatus("failed");
        setError("فشل في تحميل التقرير");
        console.error(err);
      }
    };

    fetchReport();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["oneYear", "twoYears", "virtual"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        cardCategory: {
          ...prev.cardCategory,
          [name]: Number(value),
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/reports/${id}`, form);
      alert("تم تحديث التقرير بنجاح");
      navigate("/supervisor/reports");
    } catch (err) {
      alert("حدث خطأ أثناء تحديث التقرير");
      console.error(err);
    }
  };

  if (status === "loading") return <p>جاري التحميل...</p>;
  if (status === "failed") return <p>حدث خطأ: {error}</p>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">تعديل التقرير</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="الاسم" className="border p-2 rounded" required />
        <input name="nameEn" value={form.nameEn} onChange={handleChange} placeholder="Name EN" className="border p-2 rounded" required />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="الهاتف" className="border p-2 rounded" required />
        <input name="quantity" type="number" value={form.quantity} onChange={handleChange} placeholder="الكمية" className="border p-2 rounded" required />
        <input name="paid" type="number" value={form.paid} onChange={handleChange} placeholder="المدفوع" className="border p-2 rounded" required />
        <input name="remaining" type="number" value={form.remaining} onChange={handleChange} placeholder="المتبقي" className="border p-2 rounded" required />
        <input name="address" value={form.address} onChange={handleChange} placeholder="العنوان" className="border p-2 rounded" required />
        <input name="ministry" value={form.ministry} onChange={handleChange} placeholder="الوزارة" className="border p-2 rounded" required />
        <input name="date" type="date" value={form.date} onChange={handleChange} placeholder="التاريخ" className="border p-2 rounded" required />
        <input name="admin" value={form.admin} onChange={handleChange} placeholder="اسم المندوب" className="border p-2 rounded" required />

        <input name="oneYear" type="number" min="0" value={form.cardCategory.oneYear} onChange={handleChange} placeholder="بطاقات سنة" className="border p-2 rounded" />
        <input name="twoYears" type="number" min="0" value={form.cardCategory.twoYears} onChange={handleChange} placeholder="بطاقات سنتين" className="border p-2 rounded" />
        <input name="virtual" type="number" min="0" value={form.cardCategory.virtual} onChange={handleChange} placeholder="بطاقات افتراضية" className="border p-2 rounded" />

        <button type="submit" className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition">تحديث التقرير</button>
      </form>
    </div>
  );
};

export default EditReport;
