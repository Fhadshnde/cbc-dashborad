import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = "https://hawkama.cbc-api.app/api/reports";

const initialForm = {
  name_ar: "",
  name_en: "",
  phoneNumber: "",
  quantity: 0,
  moneyPaid: "0",
  moneyRemain: "0",
  address: "",
  ministry: "",
  date: "",
  admin: "",
  status: "pending",
  cardCategory: {
    oneYear: 0,
    twoYears: 0,
    virtual: 0,
  },
  notes: "",
  onPayroll: false,
};

const SupervisorAccessReports = () => {
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData && storedUserData !== "undefined") {
      try {
        const userData = JSON.parse(storedUserData);
        setUserRole(userData?.role);
      } catch {
        setUserRole(null);
      }
    }
  }, []);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("توكن المصادقة غير موجود. يرجى تسجيل الدخول.");
      throw new Error("توكن المصادقة غير موجود");
    }
    return { Authorization: `Bearer ${token}` };
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError(null);
      const headers = { headers: getAuthHeader() };
      const res = await axios.get(API_URL, headers);
      setReports(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("فشل في جلب التقارير: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    if (userRole !== null) {
      fetchReports();
    }
  }, [userRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const headers = { headers: getAuthHeader() };
      const formDataToSend = { ...form };

      formDataToSend.date = formDataToSend.date
        ? `${formDataToSend.date.substring(0, 4)}/${formDataToSend.date.substring(5, 7)}`
        : "";

      formDataToSend.quantity = Number(formDataToSend.quantity);
      formDataToSend.moneyPaid = String(formDataToSend.moneyPaid);
      formDataToSend.moneyRemain = String(formDataToSend.moneyRemain);

      if (!isEditing && userRole !== "supervisor") {
      }

      if (isEditing && userRole !== "supervisor") {
        const { cardCategory, status, ...rest } = formDataToSend;
        Object.assign(formDataToSend, rest);
      }

      if (isEditing) {
        await axios.put(`${API_URL}/${editId}`, formDataToSend, headers);
      } else {
        await axios.post(API_URL, formDataToSend, headers);
      }

      await fetchReports();
      setForm(initialForm);
      setIsEditing(false);
      setEditId(null);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("فشل في حفظ التقرير: " + (err.response?.data?.message || err.message));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (["oneYear", "twoYears", "virtual"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        cardCategory: {
          ...prev.cardCategory,
          [name]: parseInt(value) || 0,
        },
      }));
    } else if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleStatusChange = async (id, currentStatus, newStatus) => {
    if (userRole === "supervisor") {
      const validStatusesForSupervisor = ["pending", "rejected", "canceled", "received", "processing", "approved"];
      if (!validStatusesForSupervisor.includes(newStatus)) {
        setError("المشرف لا يمكنه تغيير الحالة إلى هذه القيمة.");
        return;
      }
    } else if (userRole === "admin") {
      if (newStatus !== "canceled") {
        setError("المدير يمكنه تغيير الحالة إلى 'ملغاة' فقط.");
        return;
      }
    } else {
      setError("ليس لديك صلاحية لتغيير حالة التقرير.");
      return;
    }

    if (currentStatus === newStatus) return;

    if (!window.confirm(`هل أنت متأكد من تغيير حالة التقرير إلى "${newStatus}"؟`)) return;

    try {
      setLoading(true);
      setError(null);
      const headers = { headers: getAuthHeader() };
      await axios.patch(`${API_URL}/${id}/status`, { status: newStatus }, headers);
      await fetchReports();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("فشل في تحديث حالة التقرير: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (report) => {
    const formattedDateForInput = report.date
      ? `${report.date.substring(0, 4)}-${report.date.substring(5, 7)}-01`
      : "";

    setForm({
      ...report,
      date: formattedDateForInput,
      moneyPaid: String(report.moneyPaid),
      moneyRemain: String(report.moneyRemain),
      cardCategory: report.cardCategory || { oneYear: 0, twoYears: 0, virtual: 0 },
      notes: report.notes || "",
      onPayroll: typeof report.onPayroll === "boolean" ? report.onPayroll : false,
    });
    setIsEditing(true);
    setEditId(report._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف التقرير؟")) return;
    if (userRole !== "supervisor") {
      setError("ليس لديك صلاحية لحذف التقرير.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const headers = { headers: getAuthHeader() };
      await axios.delete(`${API_URL}/${id}`, headers);
      await fetchReports();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("فشل في حذف التقرير: " + (err.response?.data?.message || err.message));
    }
  };

  const isReportEditableForLimitedRoles = (report) => {
    const now = Date.now();
    const createdTime = new Date(report.createdAt).getTime();
    const ALLOWED_EDIT_HOURS = 6 * 60 * 60 * 1000;
    return report.status === "pending" && (now - createdTime <= ALLOWED_EDIT_HOURS);
  };

  const isFormFieldDisabled = (fieldName) => {
    if (!isEditing) return false;
    if (userRole === "supervisor") return false;
    const baseDisabled = !isReportEditableForLimitedRoles(form);
    if (isReportEditableForLimitedRoles(form)) {
      const alwaysEditableFields = ["name_ar", "name_en", "phoneNumber", "quantity", "moneyPaid", "moneyRemain", "address", "ministry", "date", "admin", "notes", "onPayroll"];
      if (alwaysEditableFields.includes(fieldName)) {
        return false;
      }
      if (["oneYear", "twoYears", "virtual"].includes(fieldName)) {
        return true;
      }
      if (fieldName === "status") {
        return true;
      }
    }
    return baseDisabled;
  };

  const formatNumber = (number) => {
    if (isNaN(number)) return number;
    return Number(number).toLocaleString("en-US");
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen text-right font-sans">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">تقارير المشرف</h1>

      {loading && <p className="text-center py-4 text-gray-600">جاري التحميل...</p>}
      {error && <div className="text-center py-4 text-red-600">{error}</div>}

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full border-collapse text-sm">
          <thead className="bg-gray-100 text-gray-600 font-bold">
            <tr>
              <th className="p-2 border">الاسم بالعربي</th>
              <th className="p-2 border">الاسم بالإنجليزي</th>
              <th className="p-2 border">رقم الهاتف</th>
              <th className="p-2 border">المبلغ الكامل</th>
              <th className="p-2 border">المدفوع</th>
              <th className="p-2 border">المتبقي</th>
              <th className="p-2 border">العنوان</th>
              <th className="p-2 border">الوزارة</th>
              <th className="p-2 border">التاريخ</th>
              <th className="p-2 border">المندوب</th>
              <th className="p-2 border">الحالة</th>
              <th className="p-2 border">بطاقة سنة</th>
              <th className="p-2 border">بطاقة سنتين</th>
              <th className="p-2 border">بطاقة افتراضية</th>
              <th className="p-2 border">تغيير الحالة</th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? (
              reports.map((r) => (
                <tr key={r._id} className="border-t hover:bg-gray-50">
                  <td className="p-2 border">{r.name_ar}</td>
                  <td className="p-2 border">{r.name_en}</td>
                  <td className="p-2 border">{r.phoneNumber}</td>
                  <td className="p-2 border">{formatNumber(r.quantity)}</td>
                  <td className="p-2 border">{formatNumber(r.moneyPaid)}</td>
                  <td className="p-2 border">{formatNumber(r.moneyRemain)}</td>
                  <td className="p-2 border">{r.address}</td>
                  <td className="p-2 border">{r.ministry}</td>
                  <td className="p-2 border">{r.date}</td>
                  <td className="p-2 border">{r.admin}</td>
                  <td className="p-2 border">{r.status}</td>
                  <td className="p-2 border">{r.cardCategory?.oneYear}</td>
                  <td className="p-2 border">{r.cardCategory?.twoYears}</td>
                  <td className="p-2 border">{r.cardCategory?.virtual}</td>
                  <td className="p-2 border">
                    {(userRole === "supervisor" || userRole === "admin") ? (
                      <select
                        value={r.status}
                        onChange={(event) => {
                          const { value } = event.target;
                          handleStatusChange(r._id, r.status, value);
                        }}
                        className="border p-1 rounded text-sm w-full"
                      >
                        {userRole === "supervisor" && <option value="pending">قيد الانتظار</option>}
                        {userRole === "supervisor" && <option value="rejected">مرفوضة</option>}
                        <option value="canceled">ملغاة</option>
                        {userRole === "supervisor" && <option value="received">تم الاستلام</option>}
                        {userRole === "supervisor" && <option value="processing">قيد المعالجة</option>}
                        {userRole === "supervisor" && <option value="approved">موافق عليها</option>}
                        {userRole === "admin" && r.status !== "canceled" && (
                          <option value={r.status} disabled>{r.status}</option>
                        )}
                      </select>
                    ) : (
                      <span className="text-gray-500">{r.status}</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="16" className="p-4 text-center text-gray-500">لا توجد تقارير</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupervisorAccessReports;
