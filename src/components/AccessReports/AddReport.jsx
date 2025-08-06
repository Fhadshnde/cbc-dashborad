import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://hawkama.cbc-api.app/api/reports";

const AddReportForm = () => {
  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    phoneNumber: "",
    quantity: "",
    moneyPaid: "",
    moneyRemain: "",
    address: "",
    ministry: "",
    admin: "",
    region: "",
    gender: "",
    cardCategory: {
      oneYear: 0,
      twoYears: 0,
      virtual: 0,
    },
    notes: "",
    onPayroll: false,
  });

  const [regions, setRegions] = useState([]);
  const [governorate, setGovernorate] = useState("");
  const [loadingRegions, setLoadingRegions] = useState(false);
  const [regionsError, setRegionsError] = useState("");

  const [specialPrices, setSpecialPrices] = useState({
    oneYear: 45000,
    twoYears: 65000,
    virtual: 30000,
  });
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [pricesError, setPricesError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData && storedUserData !== "undefined") {
      try {
        const userData = JSON.parse(storedUserData);
        const username = userData?.username || "غير معروف";
        const userGovernorate = userData?.governorate || "";
        setFormData((prev) => ({ ...prev, admin: username }));
        setGovernorate(userGovernorate);
      } catch (e) {
        setFormData((prev) => ({ ...prev, admin: "غير معروف" }));
        setGovernorate("");
      }
    } else {
      setFormData((prev) => ({ ...prev, admin: "غير معروف" }));
      setGovernorate("");
    }
  }, []);

  useEffect(() => {
    const fetchRegions = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("توكن المصادقة غير موجود. يرجى تسجيل الدخول.");
        navigate("/login");
        return;
      }

      if (!governorate) {
        setRegions([]);
        return;
      }

      setLoadingRegions(true);
      setRegionsError("");

      try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(`${API_URL}/regions/my-governorate`, { headers });
        setRegions(response.data.regions);
      } catch (error) {
        setRegions([]);
        setRegionsError(
          "فشل في جلب المناطق: " + (error.response?.data?.message || "الرجاء تسجيل الدخول مرة أخرى.")
        );
        if (error.response?.status === 401) {
          alert("انتهت صلاحية جلستك. يرجى تسجيل الدخول مرة أخرى.");
          navigate("/login");
        }
      } finally {
        setLoadingRegions(false);
      }
    };

    fetchRegions();
  }, [governorate, navigate]);

  useEffect(() => {
    const fetchPrices = async () => {
      setLoadingPrices(true);
      setPricesError("");
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("توكن المصادقة غير موجود");
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(`${API_URL}/special-prices`, { headers });
        setSpecialPrices({
          oneYear: response.data.prices["1Y"]?.price || 45000,
          twoYears: response.data.prices["2Y"]?.price || 65000,
          virtual: response.data.prices["6M"]?.price || 30000,
        });
      } catch (error) {
        setPricesError("فشل في جلب الأسعار");
      } finally {
        setLoadingPrices(false);
      }
    };

    fetchPrices();
  }, []);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("توكن المصادقة غير موجود");
      navigate("/login");
      throw new Error("توكن المصادقة غير موجود");
    }
    return { Authorization: `Bearer ${token}` };
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "cardType") {
      let newQuantity = "";
      if (value === "oneYear") newQuantity = specialPrices.oneYear.toString();
      else if (value === "twoYears") newQuantity = specialPrices.twoYears.toString();
      else if (value === "virtual") newQuantity = specialPrices.virtual.toString();

      setFormData((prev) => ({
        ...prev,
        cardCategory: {
          oneYear: value === "oneYear" ? 1 : 0,
          twoYears: value === "twoYears" ? 1 : 0,
          virtual: value === "virtual" ? 1 : 0,
        },
        quantity: newQuantity,
      }));
    } else if (name === "onPayroll") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let card_id = "5";
    if (formData.cardCategory.oneYear === 1) card_id = "1";
    else if (formData.cardCategory.twoYears === 1) card_id = "2";
    else if (formData.cardCategory.virtual === 1) card_id = "7";

    const fullData = {
      ...formData,
      card_id,
      quantity: Number(formData.quantity) || 0,
      moneyPaid: String(formData.moneyPaid),
      moneyRemain: String(formData.moneyRemain),
    };

    try {
      const headers = { headers: getAuthHeader() };
      await axios.post(API_URL, fullData, headers);
      alert("تم إضافة الفاتورة بنجاح");
      navigate("/accessreports");
    } catch (error) {
      alert(
        "حدث خطأ: " +
          (error.response?.data?.message ||
            error.message ||
            "الرجاء التحقق من البيانات أو تسجيل الدخول مرة أخرى.")
      );
      if (error.response?.status === 401) {
        navigate("/login");
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10 font-sans text-right">
      <h2 className="text-2xl font-bold mb-6 text-gray-700">إضافة فاتورة جديدة</h2>
      <p className="mb-4 text-gray-600 text-sm">
        المستخدم الحالي: <strong>{formData.admin || "غير مسجل"}</strong> (المحافظة:{" "}
        <strong>{governorate || "غير محددة"}</strong>)
      </p>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
            type="text"
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
        <div>
          <label className="block mb-1 text-gray-600">الجنس</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
          >
            <option value="">اختر الجنس</option>
            <option value="ذكر">ذكر</option>
            <option value="أنثى">أنثى</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-gray-600">المنطقة</label>
          <select
            name="region"
            value={formData.region}
            onChange={handleChange}
            className="w-full border rounded px-4 py-2"
            required
            disabled={loadingRegions || regions.length === 0 || !governorate}
          >
            <option value="">اختر منطقة</option>
            {regions.map((reg) => (
              <option key={reg} value={reg}>
                {reg}
              </option>
            ))}
          </select>
          {loadingRegions && <p className="text-gray-500 text-sm mt-1">جاري جلب المناطق...</p>}
          {regionsError && <p className="text-red-500 text-sm mt-1">{regionsError}</p>}
          {!governorate && !loadingRegions && !regionsError && (
            <p className="text-gray-500 text-sm mt-1">المحافظة غير محددة بعد، أو توكن المصادقة مفقود.</p>
          )}
          {governorate && !loadingRegions && regions.length === 0 && !regionsError && (
            <p className="text-red-500 text-sm mt-1">لا توجد مناطق متاحة لمحافظتك {governorate}.</p>
          )}
        </div>
        <div className="sm:col-span-2">
          <label className="block mb-1 text-gray-600">فئة البطاقة</label>
          {loadingPrices && <p className="text-gray-500 text-sm mb-2">جاري جلب الأسعار...</p>}
          {pricesError && <p className="text-red-500 text-sm mb-2">{pricesError}</p>}
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
              <span>بطاقة سنة واحدة - {specialPrices.oneYear.toLocaleString()} د.ع</span>
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
              <span>بطاقة سنتين - {specialPrices.twoYears.toLocaleString()} د.ع</span>
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
              <span>بطاقة 6 اشهر - {specialPrices.virtual.toLocaleString()} د.ع</span>
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
