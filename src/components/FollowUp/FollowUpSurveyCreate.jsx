// FollowUpSurveyCreate.jsx

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StepIndicator from "../common/StepIndicator";

const FollowUpSurveyCreate = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    storeName: "",
    storeAddress: "",
    section: "",
    storeRepresentativeName: "",
    cbcCardHoldersVisits: "",
    promotionalVideoShot: false,
    promotionalDesignPublished: false,
    companyCommunicationRating: "",
    customerQualitySatisfaction: "",
    storeBehaviorRating: "",
    notes: "",
    internalNotes: "",
    followUpNotes: "",
    followUpEmployee: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://hawkama.cbc-api.app/api/followupsurveys", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/followupsurveys");
    } catch (error) {
      alert("خطأ في الإضافة: " + error.response?.data?.message || error.message);
    }
  };

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">إضافة استبيان جديد</h2>

      {/* Stepper */}
      <div className="flex justify-between mb-8">
        <StepIndicator stepNumber={1} label="بيانات المتجر" isActive={step === 1} isCompleted={step > 1} />
        <StepIndicator stepNumber={2} label="الملاحظات" isActive={step === 2} isCompleted={step > 2} />
        <StepIndicator stepNumber={3} label="موظف المتابعة" isActive={step === 3} isCompleted={false} />
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        {step === 1 && (
          <>
            <input name="storeName" placeholder="اسم المتجر" value={formData.storeName} onChange={handleChange} required />
            <select name="storeAddress" value={formData.storeAddress} onChange={handleChange} required>
              <option value="">اختر العنوان</option>
              <option>كرخ</option><option>رصافة</option><option>بصرة</option><option>كربلاء</option><option>انبار</option><option>اربيل</option>
            </select>
            <input name="section" placeholder="القسم" value={formData.section} onChange={handleChange} required />
            <input name="storeRepresentativeName" placeholder="ممثل المتجر" value={formData.storeRepresentativeName} onChange={handleChange} required />
            <select name="cbcCardHoldersVisits" value={formData.cbcCardHoldersVisits} onChange={handleChange} required>
              <option value="">عدد زيارات حاملي CBC</option>
              <option>اقل من 10</option><option>من 10 الى 50</option><option>من 50 الى 100</option><option>من 100 الى 1000</option><option>اكثر من 1000</option>
            </select>

            <select name="promotionalVideoShot" value={formData.promotionalVideoShot ? "yes" : "no"} onChange={(e) => {
              setFormData({ ...formData, promotionalVideoShot: e.target.value === "yes" });
            }} required>
              <option value="">هل تم عمل فيديو إعلاني؟</option>
              <option value="yes">نعم</option>
              <option value="no">لا</option>
            </select>

            <select name="promotionalDesignPublished" value={formData.promotionalDesignPublished ? "yes" : "no"} onChange={(e) => {
              setFormData({ ...formData, promotionalDesignPublished: e.target.value === "yes" });
            }} required>
              <option value="">هل تم تصميم إعلان؟</option>
              <option value="yes">نعم</option>
              <option value="no">لا</option>
            </select>

            <select name="companyCommunicationRating" value={formData.companyCommunicationRating} onChange={handleChange} required>
              <option value="">تقييم تواصل الشركة</option>
              <option>ضعيف</option><option>جيد</option><option>جيد جدا</option><option>ممتاز</option>
            </select>
            <select name="customerQualitySatisfaction" value={formData.customerQualitySatisfaction} onChange={handleChange} required>
              <option value="">رضا الزبائن</option>
              <option>ضعيف</option><option>جيد</option><option>جيد جدا</option><option>ممتاز</option>
            </select>
            <select name="storeBehaviorRating" value={formData.storeBehaviorRating} onChange={handleChange} required>
              <option value="">سلوك المتجر</option>
              <option>ضعيف</option><option>جيد</option><option>جيد جدا</option><option>ممتاز</option>
            </select>
          </>
        )}

        {step === 2 && (
          <>
            <textarea name="notes" placeholder="ملاحظات" value={formData.notes} onChange={handleChange} />
            <textarea name="internalNotes" placeholder="ملاحظات داخلية" value={formData.internalNotes} onChange={handleChange} />
            <textarea name="followUpNotes" placeholder="ملاحظات متابعة" value={formData.followUpNotes} onChange={handleChange} />
          </>
        )}

        {step === 3 && (
          <>
            <input name="followUpEmployee" placeholder="اسم موظف المتابعة" value={formData.followUpEmployee} onChange={handleChange} required />
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-4">
          {step > 1 && <button type="button" onClick={prev} className="px-4 py-2 bg-gray-300 rounded">السابق</button>}
          {step < 3 ? (
            <button type="button" onClick={next} className="px-4 py-2 bg-blue-600 text-white rounded">التالي</button>
          ) : (
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">إنشاء</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FollowUpSurveyCreate;
