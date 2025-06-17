import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const FollowUpSurveyEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await axios.get(`https://hawkama.cbc-api.app/api/followupsurveys/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData(res.data.data);
      } catch (error) {
        alert("فشل في جلب البيانات: " + error.message);
      }
    };

    fetchSurvey();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://hawkama.cbc-api.app/api/followupsurveys/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(`/followupsurveys/${id}`);
    } catch (error) {
      alert("خطأ في التعديل: " + error.message);
    }
  };

  if (!formData) return <p>جارٍ تحميل البيانات...</p>;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">تعديل الاستبيان</h2>
      <form onSubmit={handleSubmit} className="grid gap-3">
        <input name="storeName" value={formData.storeName} onChange={handleChange} required />
        <select name="storeAddress" value={formData.storeAddress} onChange={handleChange} required>
          <option>كرخ</option><option>رصافة</option><option>بصرة</option><option>كربلاء</option><option>انبار</option><option>اربيل</option>
        </select>
        <input name="section" value={formData.section} onChange={handleChange} required />
        <input name="storeRepresentativeName" value={formData.storeRepresentativeName} onChange={handleChange} required />
        <select name="cbcCardHoldersVisits" value={formData.cbcCardHoldersVisits} onChange={handleChange} required>
          <option>اقل من 10</option><option>من 10 الى 50</option><option>من 50 الى 100</option><option>من 100 الى 1000</option><option>اكثر من 1000</option>
        </select>
        <label><input type="checkbox" name="promotionalVideoShot" checked={formData.promotionalVideoShot} onChange={handleChange} /> فيديو إعلاني</label>
        <label><input type="checkbox" name="promotionalDesignPublished" checked={formData.promotionalDesignPublished} onChange={handleChange} /> تصميم منشور</label>
        <select name="companyCommunicationRating" value={formData.companyCommunicationRating} onChange={handleChange} required>
          <option>ضعيف</option><option>جيد</option><option>جيد جدا</option><option>ممتاز</option>
        </select>
        <select name="customerQualitySatisfaction" value={formData.customerQualitySatisfaction} onChange={handleChange} required>
          <option>ضعيف</option><option>جيد</option><option>جيد جدا</option><option>ممتاز</option>
        </select>
        <select name="storeBehaviorRating" value={formData.storeBehaviorRating} onChange={handleChange} required>
          <option>ضعيف</option><option>جيد</option><option>جيد جدا</option><option>ممتاز</option>
        </select>
        <textarea name="notes" value={formData.notes} onChange={handleChange} />
        <textarea name="internalNotes" value={formData.internalNotes} onChange={handleChange} />
        <textarea name="followUpNotes" value={formData.followUpNotes} onChange={handleChange} />
        <button className="bg-yellow-600 text-white px-4 py-2 rounded">حفظ التعديلات</button>
      </form>
    </div>
  );
};

export default FollowUpSurveyEdit;
