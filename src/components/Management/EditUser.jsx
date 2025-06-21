import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '', // تمت إضافة حقل رقم الهاتف
    password: '',
    role: 'supervisor',
    hireDate: moment().format('YYYY-MM-DD'),
    department: '',
    jobTitle: '',
    employeeDebt: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('لم يتم العثور على رمز المصادقة. يرجى تسجيل الدخول.');
          setLoading(false);
          navigate('/login');
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const response = await axios.get(`https://hawkama.cbc-api.app/api/users/${id}`, config);
        const userData = response.data;

        setFormData({
          username: userData.username || '',
          email: userData.email || '',
          phoneNumber: userData.phoneNumber || '', // جلب رقم الهاتف من بيانات المستخدم
          password: '',
          role: userData.role || 'supervisor',
          hireDate: userData.hireDate ? moment(userData.hireDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'),
          department: userData.department || '',
          jobTitle: userData.jobTitle || '',
          employeeDebt: userData.employeeDebt || 0,
        });

        setCurrentImageUrl(userData.imageUrl ? `https://hawkama.cbc-api.app/api${userData.imageUrl}` : '');
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'فشل جلب بيانات المستخدم.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('لم يتم العثور على رمز المصادقة. يرجى تسجيل الدخول.');
        setSubmitting(false);
        navigate('/login');
        return;
      }

      const formDataToSend = new FormData();
      for (const key in formData) {
        if (key === 'password' && formData[key] === '') continue;
        formDataToSend.append(key, formData[key]);
      }

      if (imageFile) {
        formDataToSend.append('imageUrl', imageFile);
      } else if (currentImageUrl) {
        const filename = currentImageUrl.split('/').pop();
        formDataToSend.append('imageUrl', filename);
      } else {
        formDataToSend.append('imageUrl', '');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.put(`https://hawkama.cbc-api.app/api/users/${id}`, formDataToSend, config);

      setSuccess('تم تحديث المستخدم بنجاح!');
      setSubmitting(false);
      navigate('/management');
    } catch (err) {
      setError(err.response?.data?.message || 'فشل تحديث المستخدم.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-5 font-sans rtl text-right bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center text-lg text-gray-700">جاري تحميل بيانات المستخدم...</div>
      </div>
    );
  }

  const displayImageUrl = imageFile
    ? URL.createObjectURL(imageFile)
    : currentImageUrl || 'https://via.placeholder.com/150';

  return (
    <div className="p-5 font-sans rtl text-right bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">تعديل المستخدم: {formData.username}</h2>

        {submitting && <div className="text-center p-4 text-blue-600">جاري التحديث...</div>}
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{success}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">اسم المستخدم:</label>
            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">البريد الإلكتروني:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">رقم الهاتف:</label>
            <input type="text" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">كلمة المرور (اتركها فارغة لعدم التغيير):</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" placeholder="••••••••" />
          </div>

          <div>
            <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">الدور:</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-gray-700" required>
              <option value="supervisor">مشرف</option>
              <option value="manager">مدير</option>
              <option value="admin">مسؤول</option>
            </select>
          </div>

          <div>
            <label htmlFor="hireDate" className="block text-gray-700 text-sm font-bold mb-2">تاريخ المباشرة:</label>
            <input type="date" id="hireDate" name="hireDate" value={formData.hireDate} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
          </div>

          <div>
            <label htmlFor="department" className="block text-gray-700 text-sm font-bold mb-2">القسم:</label>
            <input type="text" id="department" name="department" value={formData.department} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
          </div>

          <div>
            <label htmlFor="jobTitle" className="block text-gray-700 text-sm font-bold mb-2">العنوان الوظيفي:</label>
            <input type="text" id="jobTitle" name="jobTitle" value={formData.jobTitle} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
          </div>

          <div>
            <label htmlFor="employeeDebt" className="block text-gray-700 text-sm font-bold mb-2">ذمة الموظف:</label>
            <input type="number" id="employeeDebt" name="employeeDebt" value={formData.employeeDebt} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
          </div>

          <div className="col-span-1 md:col-span-2 flex flex-col items-center">
            <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-bold mb-2">صورة المستخدم:</label>
            {displayImageUrl && (
              <img src={displayImageUrl} alt="صورة المستخدم الحالية" className="w-32 h-32 rounded-full object-cover mb-4 border-2 border-gray-300 shadow-md" />
            )}
            <input type="file" id="imageUrl" name="imageUrl" accept="image/*" onChange={handleImageChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 mt-6">
            <button type="button" onClick={() => navigate('/management')} className="bg-gray-300 text-gray-800 rounded-md px-6 py-3 hover:bg-gray-400 transition-colors">إلغاء</button>
            <button type="submit" className="bg-blue-600 text-white rounded-md px-6 py-3 hover:bg-blue-700 transition-colors shadow-lg" disabled={submitting}>
              {submitting ? 'جاري التحديث...' : 'تحديث المستخدم'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;