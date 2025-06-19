import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import FloatingInput from "../common/FloatingInput";
import FloatingSelect from "../common/FloatingSelect";
import StepIndicator from "../common/StepIndicator";

const FollowUpSurveyCreate = () => {
  const navigate = useNavigate();
  const { contractId } = useParams();
  const location = useLocation();
  const { storeName: initialStoreName } = location.state || {};

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    storeName: initialStoreName || "",
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
    followUpEmployee: "",
    contractId: contractId || null
  });
  const [loadingContractData, setLoadingContractData] = useState(true);
  const [contractError, setContractError] = useState('');

  const getToken = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      throw new Error("No token found");
    }
    return token;
  }, [navigate]);

  useEffect(() => {
    const fetchContractData = async () => {
      if (contractId) {
        setLoadingContractData(true);
        try {
          const response = await axios.get(`https://hawkama.cbc-api.app/api/merchant/contracts/${contractId}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          });
          const contract = response.data;
          setFormData(prev => ({
            ...prev,
            storeName: contract.storeName || prev.storeName,
            storeAddress: contract.contractFullAddress || prev.storeAddress,
            section: contract.commercialActivityType || prev.section,
          }));
        } catch (error) {
          setContractError("فشل جلب بيانات العقد: " + (error.response?.data?.message || error.message));
        } finally {
          setLoadingContractData(false);
        }
      } else {
        setLoadingContractData(false);
      }
    };
    fetchContractData();
  }, [contractId, getToken]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loadingContractData) {
      alert("الرجاء انتظار تحميل بيانات العقد.");
      return;
    }
    try {
      await axios.post("https://hawkama.cbc-api.app/api/followupsurveys", formData, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      navigate("/followupsurveys");
    } catch (error) {
      alert("خطأ في الإضافة: " + (error.response?.data?.message || error.message));
    }
  };

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  if (loadingContractData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">جاري تحميل بيانات المتجر...</div>
      </div>
    );
  }

  if (contractError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-500">{contractError}</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        إضافة استبيان جديد {formData.storeName && `للمتجر: ${formData.storeName}`}
      </h2>

      <div className="flex justify-between mb-8">
        <StepIndicator stepNumber={1} label="بيانات المتجر" isActive={step === 1} isCompleted={step > 1} />
        <StepIndicator stepNumber={2} label="تقييم المتابعة" isActive={step === 2} isCompleted={step > 2} />
        <StepIndicator stepNumber={3} label="الملاحظات" isActive={step === 3} isCompleted={step > 3} />
        <StepIndicator stepNumber={4} label="الموظف" isActive={step === 4} isCompleted={false} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FloatingInput
              label="اسم المتجر *"
              name="storeName"
              value={formData.storeName}
              onChange={handleChange}
              required
            />
            <FloatingSelect
              label="عنوان المتجر *"
              name="storeAddress"
              value={formData.storeAddress}
              onChange={handleChange}
              required
            >
              <option value="">اختر العنوان</option>
              <option>كرخ</option><option>رصافة</option><option>بصرة</option>
              <option>كربلاء</option><option>انبار</option><option>اربيل</option>
            </FloatingSelect>
            <FloatingInput
              label="القسم *"
              name="section"
              value={formData.section}
              onChange={handleChange}
              required
            />
            <FloatingInput
              label="ممثل المتجر *"
              name="storeRepresentativeName"
              value={formData.storeRepresentativeName}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FloatingSelect
              label="عدد زيارات حاملي CBC *"
              name="cbcCardHoldersVisits"
              value={formData.cbcCardHoldersVisits}
              onChange={handleChange}
              required
            >
              <option value="">اختر عدد الزيارات</option>
              <option>اقل من 10</option><option>من 10 الى 50</option>
              <option>من 50 الى 100</option><option>من 100 الى 1000</option>
              <option>اكثر من 1000</option>
            </FloatingSelect>

            <FloatingSelect
              label="هل تم عمل فيديو إعلاني؟ *"
              name="promotionalVideoShot"
              value={formData.promotionalVideoShot ? "yes" : "no"}
              onChange={(e) =>
                setFormData({ ...formData, promotionalVideoShot: e.target.value === "yes" })
              }
              required
            >
              <option value="">اختر</option>
              <option value="yes">نعم</option>
              <option value="no">لا</option>
            </FloatingSelect>

            <FloatingSelect
              label="هل تم نشر تصميم إعلاني؟ *"
              name="promotionalDesignPublished"
              value={formData.promotionalDesignPublished ? "yes" : "no"}
              onChange={(e) =>
                setFormData({ ...formData, promotionalDesignPublished: e.target.value === "yes" })
              }
              required
            >
              <option value="">اختر</option>
              <option value="yes">نعم</option>
              <option value="no">لا</option>
            </FloatingSelect>

            <FloatingSelect
              label="تقييم تواصل الشركة *"
              name="companyCommunicationRating"
              value={formData.companyCommunicationRating}
              onChange={handleChange}
              required
            >
              <option value="">اختر التقييم</option>
              <option>ضعيف</option><option>جيد</option>
              <option>جيد جدا</option><option>ممتاز</option>
            </FloatingSelect>

            <FloatingSelect
              label="رضا الزبائن *"
              name="customerQualitySatisfaction"
              value={formData.customerQualitySatisfaction}
              onChange={handleChange}
              required
            >
              <option value="">اختر الرضا</option>
              <option>ضعيف</option><option>جيد</option>
              <option>جيد جدا</option><option>ممتاز</option>
            </FloatingSelect>

            <FloatingSelect
              label="سلوك المتجر *"
              name="storeBehaviorRating"
              value={formData.storeBehaviorRating}
              onChange={handleChange}
              required
            >
              <option value="">اختر السلوك</option>
              <option>ضعيف</option><option>جيد</option>
              <option>جيد جدا</option><option>ممتاز</option>
            </FloatingSelect>
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 gap-6">
          <FloatingInput
            label="ملاحظات عن النافذة الخاصة بالمتجر داخل التطبيق"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            textarea
          />
          <FloatingInput
            label="المشاكل التي واجهتها خلال فتره التعاون"
            name="internalNotes"
            value={formData.internalNotes}
            onChange={handleChange}
            textarea
          />
          <FloatingInput
            label="ملاحظات متابعة"
            name="followUpNotes"
            value={formData.followUpNotes}
            onChange={handleChange}
            textarea
          />
        </div>
        )}

        {step === 4 && (
          <FloatingInput
            label="اسم موظف المتابعة *"
            name="followUpEmployee"
            value={formData.followUpEmployee}
            onChange={handleChange}
            required
          />
        )}

        <div className="flex justify-between pt-6">
          {step > 1 && (
            <button type="button" onClick={prev} className="bg-gray-300 text-black px-4 py-2 rounded-lg">السابق</button>
          )}
          {step < 4 ? (
            <button type="button" onClick={next} className="bg-blue-600 text-white px-4 py-2 rounded-lg">التالي</button>
          ) : (
            <button type="submit" className="bg-[#25BC9D] text-white px-4 py-2 rounded-lg">إنشاء</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FollowUpSurveyCreate;