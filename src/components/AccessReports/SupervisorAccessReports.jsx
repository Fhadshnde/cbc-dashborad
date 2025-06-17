import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "https://hawkama.cbc-api.app/api/reports";

const initialForm = {
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
  status: "pending",
  cardCategory: {
    oneYear: 0,
    twoYears: 0,
    virtual: 0,
  },
};

const SupervisorAccessReports = () => {
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData && storedUserData !== "undefined") {
      try {
        const userData = JSON.parse(storedUserData);
        setUserRole(userData?.role);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        setUserRole(null);
      }
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

  const fetchReports = async () => {
    try {
      setLoading(true);
      const headers = { headers: getAuthHeader() };
      const res = await axios.get("https://hawkama.cbc-api.app/api/reports", headers);
      setReports(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("خطأ في جلب التقارير:", err.response?.data?.message || err.message);
      alert("فشل في جلب التقارير: " + (err.response?.data?.message || err.message));
    }
  };

  useEffect(() => {
    if (userRole !== null) {
      fetchReports();
    }
  }, [userRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const headers = { headers: getAuthHeader() };

      const formDataToSend = { ...form };

      if (!isEditing && userRole !== "supervisor") {
          formDataToSend.cardCategory = { oneYear: 0, twoYears: 0, virtual: 0 };
      }

      if (isEditing && userRole !== "supervisor") {
          delete formDataToSend.cardCategory;
          delete formDataToSend.status;
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
      console.error("خطأ في حفظ التقرير:", err.response?.data?.message || err.message);
      alert("فشل في حفظ التقرير: " + (err.response?.data?.message || err.message));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["oneYear", "twoYears", "virtual"].includes(name)) {
      if (userRole === "supervisor" || isReportEditableForLimitedRoles(form)) {
        setForm({
          ...form,
          cardCategory: {
            ...form.cardCategory,
            [name]: parseInt(value) || 0,
          },
        });
      }
    }
    else if (name === "status") {
        if (userRole === "supervisor") {
            setForm({ ...form, [name]: value });
        }
    }
    else {
        if (userRole === "supervisor" || isReportEditableForLimitedRoles(form)) {
            setForm({ ...form, [name]: value });
        }
    }
  };

  const handleStatusChange = async (id, currentStatus, newStatus) => {
    if (userRole === "supervisor") {
      const validStatusesForSupervisor = ["pending", "rejected", "canceled", "received","processing"];
      if (!validStatusesForSupervisor.includes(newStatus)) {
        alert("المشرف لا يمكنه تغيير الحالة إلى هذه القيمة.");
        return;
      }
    } else if (userRole === "admin") {
      if (newStatus !== "canceled") {
        alert("المدير يمكنه تغيير الحالة إلى 'ملغاة' فقط.");
        return;
      }
    } else {
      alert("ليس لديك صلاحية لتغيير حالة التقرير.");
      return;
    }

    if (currentStatus === newStatus) return;

    if (!window.confirm(`هل أنت متأكد من تغيير حالة التقرير إلى "${newStatus}"؟`)) return;

    try {
      setLoading(true);
      const headers = { headers: getAuthHeader() };
      await axios.patch(`${API_URL}/${id}/status`, { status: newStatus }, headers);
      await fetchReports();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("خطأ في تحديث الحالة:", err.response?.data?.message || err.message);
      alert("فشل في تحديث حالة التقرير: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (report) => {
    if (userRole === "supervisor" || isReportEditableForLimitedRoles(report)) {
      setForm(report);
      setIsEditing(true);
      setEditId(report._id);
    } else {
      alert("لا يمكن تعديل هذا التقرير: انتهت فترة التعديل أو تغيرت حالته.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف التقرير؟")) return;
    if (userRole !== "supervisor") {
      alert("ليس لديك صلاحية لحذف التقرير.");
      return;
    }
    try {
      setLoading(true);
      const headers = { headers: getAuthHeader() };
      await axios.delete(`${API_URL}/${id}`, headers);
      await fetchReports();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("فشل في الحذف:", err.response?.data?.message || err.message);
      alert("فشل في حذف التقرير: " + (err.response?.data?.message || err.message));
    }
  };

  const isReportEditableForLimitedRoles = (report) => {
    const now = Date.now();
    const createdTime = new Date(report.createdAt).getTime();
    const ALLOWED_EDIT_HOURS = 6 * 60 * 60 * 1000;
    return report.status === "pending" && (now - createdTime <= ALLOWED_EDIT_HOURS);
  };

  const isFormFieldDisabled = () => {
    if (!isEditing) return false;
    if (userRole === "supervisor") return false;
    return !isReportEditableForLimitedRoles(form);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">تقارير الوصول</h1>

      {loading && <p>جاري التحميل...</p>}

      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="الاسم" className="border p-2" required disabled={isFormFieldDisabled()} />
        <input name="nameEn" value={form.nameEn} onChange={handleChange} placeholder="Name EN" className="border p-2" required disabled={isFormFieldDisabled()} />
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="الهاتف" className="border p-2" required disabled={isFormFieldDisabled()} />
        <input name="quantity" value={form.quantity} onChange={handleChange} placeholder="الكمية" className="border p-2" required disabled={isFormFieldDisabled()} />
        <input name="paid" value={form.paid} onChange={handleChange} placeholder="المدفوع" className="border p-2" required disabled={isFormFieldDisabled()} />
        <input name="remaining" value={form.remaining} onChange={handleChange} placeholder="المتبقي" className="border p-2" required disabled={isFormFieldDisabled()} />
        <input name="address" value={form.address} onChange={handleChange} placeholder="العنوان" className="border p-2" required disabled={isFormFieldDisabled()} />
        <input name="ministry" value={form.ministry} onChange={handleChange} placeholder="الوزارة" className="border p-2" required disabled={isFormFieldDisabled()} />
        <input name="date" value={form.date} onChange={handleChange} type="date" placeholder="التاريخ" className="border p-2" required disabled={isFormFieldDisabled()} />
        <input name="admin" value={form.admin} onChange={handleChange} placeholder="اسم المندوب" className="border p-2" required disabled={isFormFieldDisabled()} />

        <select name="status" value={form.status} onChange={handleChange} className="border p-2" required disabled={userRole !== "supervisor"}>
          <option value="pending">قيد الانتظار</option>
          <option value="rejected">مرفوضة</option>
          <option value="canceled">ملغاة</option>
          <option value="received">تم الاستلام</option>
          <option value="processing">قيد المعالجة</option>
        </select>

        <input
          name="oneYear"
          value={form.cardCategory.oneYear}
          onChange={handleChange}
          type="number"
          placeholder="بطاقات سنة"
          className="border p-2"
          disabled={isFormFieldDisabled()}
        />
        <input
          name="twoYears"
          value={form.cardCategory.twoYears}
          onChange={handleChange}
          type="number"
          placeholder="بطاقات سنتين"
          className="border p-2"
          disabled={isFormFieldDisabled()}
        />
        <input
          name="virtual"
          value={form.cardCategory.virtual}
          onChange={handleChange}
          type="number"
          placeholder="بطاقات افتراضية"
          className="border p-2"
          disabled={isFormFieldDisabled()}
        />

        <button type="submit" className="col-span-1 md:col-span-2 bg-blue-600 text-white p-2 rounded" disabled={isFormFieldDisabled()}>
          {isEditing ? "تحديث التقرير" : "إضافة تقرير"}
        </button>
        {isEditing && (
            <button
              type="button"
              onClick={() => { setIsEditing(false); setForm(initialForm); setEditId(null); }}
              className="col-span-1 md:col-span-2 bg-gray-500 text-white p-2 rounded mt-2"
            >
              إلغاء التعديل
            </button>
          )}
      </form>

      <div className="overflow-auto">
        <table className="min-w-full border">
          <thead>
            <tr className="bg-gray-100 text-right">
              <th className="p-2 border">الاسم</th>
              <th className="p-2 border">الهاتف</th>
              <th className="p-2 border">الكمية</th>
              <th className="p-2 border">المدفوع</th>
              <th className="p-2 border">المتبقي</th>
              <th className="p-2 border">الوزارة</th>
              <th className="p-2 border">التاريخ</th>
              <th className="p-2 border">المندوب</th>
              <th className="p-2 border">الحالة</th>
              <th className="p-2 border">بطاقة سنة</th>
              <th className="p-2 border">بطاقة سنتين</th>
              <th className="p-2 border">بطاقة افتراضية</th>
              <th className="p-2 border">التحكم</th>
              <th className="p-2 border">تغيير الحالة</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r._id} className="border-t text-sm text-right">
                <td className="p-2 border">{r.name}</td>
                <td className="p-2 border">{r.phone}</td>
                <td className="p-2 border">{r.quantity}</td>
                <td className="p-2 border">{r.paid}</td>
                <td className="p-2 border">{r.remaining}</td>
                <td className="p-2 border">{r.ministry}</td>
                <td className="p-2 border">{r.date}</td>
                <td className="p-2 border">{r.admin}</td>
                <td className="p-2 border">{r.status}</td>
                <td className="p-2 border">{r.cardCategory?.oneYear}</td>
                <td className="p-2 border">{r.cardCategory?.twoYears}</td>
                <td className="p-2 border">{r.cardCategory?.virtual}</td>
                <td className="p-2 border flex gap-2">
                  <button
                    onClick={() => handleEdit(r)}
                    className={`px-2 rounded ${userRole === "supervisor" || isReportEditableForLimitedRoles(r) ? "bg-yellow-500 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
                    disabled={userRole !== "supervisor" && !isReportEditableForLimitedRoles(r)}
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(r._id)}
                    className={`px-2 rounded ${userRole === "supervisor" ? "bg-red-600 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"}`}
                    disabled={userRole !== "supervisor"}
                  >
                    حذف
                  </button>
                </td>
                <td className="p-2 border">
                  {(userRole === "supervisor" || userRole === "admin") ? (
                    <select
                      value={r.status}
                      onChange={(event) => {
                          const { value } = event.target;
                          handleStatusChange(r._id, r.status, value);
                      }}
                      className="border p-1 rounded text-sm"
                    >
                      {userRole === "supervisor" && <option value="pending">قيد الانتظار</option>}
                      {userRole === "supervisor" && <option value="rejected">مرفوضة</option>}
                      <option value="canceled">ملغاة</option>
                      {userRole === "supervisor" && <option value="received">تم الاستلام</option>}
                      {userRole === "supervisor" && <option value="processing">قيد المعالجة</option>}
                      {userRole === "admin" && r.status !== "canceled" && (
                        <option value={r.status} disabled>{r.status}</option>
                      )}
                    </select>
                  ) : (
                    <span className="text-gray-500">{r.status}</span>
                  )}
                </td>
              </tr>
            ))}
            {reports.length === 0 && !loading && (
              <tr>
                <td colSpan="14" className="p-4 text-center">لا توجد تقارير</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupervisorAccessReports;