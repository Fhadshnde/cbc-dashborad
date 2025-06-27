import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

const AddUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'supervisor',
    hireDate: moment().format('YYYY-MM-DD'),
    department: '',
    jobTitle: '',
    employeeDebt: 0,
    governorate: '', // المحافظة
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const governorates = [
    "بغداد",
    "بابل",
    "البصرة",
    "الأنبار",
    "كركوك",
    "نينوى",
    "ديالى",
    "ذي قار",
    "صلاح الدين",
    "المثنى",
    "ميسان",
    "النجف",
    "القادسية",
    "كربلاء",
    "واسط",
    "أربيل",
    "السليمانية",
    "دهوك",
  ];

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
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('لم يتم العثور على رمز المصادقة. يرجى تسجيل الدخول.');
        setLoading(false);
        navigate('/login');
        return;
      }

      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      if (imageFile) {
        formDataToSend.append('imageUrl', imageFile);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      const response = await axios.post(
        'https://hawkama.cbc-api.app/api/users/register',
        formDataToSend,
        config
      );

      setSuccess('تمت إضافة المستخدم بنجاح!');
      setLoading(false);
      setFormData({
        username: '',
        email: '',
        password: '',
        phoneNumber: '',
        role: 'supervisor',
        hireDate: moment().format('YYYY-MM-DD'),
        department: '',
        jobTitle: '',
        employeeDebt: 0,
        governorate: '',
      });
      setImageFile(null);
      navigate('/management');
    } catch (err) {
      setError(err.response?.data?.message || 'فشل إضافة المستخدم.');
      setLoading(false);
    }
  };

  return (
    <div className="p-5 font-sans rtl text-right bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">إضافة مستخدم جديد</h2>

        {loading && (
          <div className="text-center p-4 text-blue-600">جاري إضافة المستخدم...</div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
              اسم المستخدم:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              البريد الإلكتروني:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              كلمة المرور:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-bold mb-2">
              رقم الهاتف:
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
              الدور:
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="supervisor">supervisor</option>
              <option value="manager">manager</option>
              <option value="admin">admin</option>
            </select>
          </div>

          <div>
            <label htmlFor="hireDate" className="block text-gray-700 text-sm font-bold mb-2">
              تاريخ المباشرة:
            </label>
            <input
              type="date"
              id="hireDate"
              name="hireDate"
              value={formData.hireDate}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div>
            <label htmlFor="department" className="block text-gray-700 text-sm font-bold mb-2">
              القسم:
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div>
            <label htmlFor="jobTitle" className="block text-gray-700 text-sm font-bold mb-2">
              العنوان الوظيفي:
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div>
            <label htmlFor="employeeDebt" className="block text-gray-700 text-sm font-bold mb-2">
              ذمة الموظف:
            </label>
            <input
              type="number"
              id="employeeDebt"
              name="employeeDebt"
              value={formData.employeeDebt}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div>
            <label htmlFor="governorate" className="block text-gray-700 text-sm font-bold mb-2">
              المحافظة:
            </label>
            <select
              id="governorate"
              name="governorate"
              value={formData.governorate}
              onChange={handleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="" disabled>اختر المحافظة</option>
              {governorates.map((gov) => (
                <option key={gov} value={gov}>
                  {gov}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="imageUrl" className="block text-gray-700 text-sm font-bold mb-2">
              صورة المستخدم:
            </label>
            <input
              type="file"
              id="imageUrl"
              name="imageUrl"
              accept="image/*"
              onChange={handleImageChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => navigate('/management')}
              className="bg-gray-300 text-gray-800 rounded-md px-6 py-3 text-base hover:bg-gray-400 transition-colors duration-200"
            >
              إلغاء
            </button>
            <button
              style={{
                background: 'linear-gradient(180deg, #00ACC1 0%, #25BC9D 100%)',
              }}
              type="submit"
              className=" text-white rounded-md px-6 py-3 text-base flex items-center hover:bg-green-700 transition-colors duration-200 shadow-lg"
              disabled={loading}
            >
              {loading ? 'جاري الإضافة...' : 'إضافة المستخدم'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
