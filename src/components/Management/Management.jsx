import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

const Management = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('لم يتم العثور على رمز المصادقة. يرجى تسجيل الدخول.');
        setLoading(false);
        navigate('/login');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      };

      const usersResponse = await axios.get('https://hawkama.cbc-api.app/api/users', config);
      setAllUsers(usersResponse.data);
      setLoading(false);
      setError(null);
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setError(err.response.data.message || 'غير مصرح لك بالوصول. يرجى تسجيل الدخول بدور مناسب.');
      } else {
        setError(err.response?.data?.message || 'فشل جلب بيانات المستخدمين');
      }
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    let filtered = allUsers;

    if (startDate && endDate) {
      const startMoment = moment(startDate).startOf('day');
      const endMoment = moment(endDate).endOf('day');
      filtered = filtered.filter(user => {
        const hireDateMoment = moment(user.hireDate);
        return hireDateMoment.isBetween(startMoment, endMoment, null, '[]');
      });
    }

    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(lowercasedSearchTerm)
      );
    }

    setDisplayedUsers(filtered);
  }, [allUsers, startDate, endDate, searchTerm]);

  const handleAddNewUser = () => {
    navigate('/management/add-user');
  };

  const handleEdit = (userId) => {
    navigate(`/management/edit-user/${userId}`);
  };

  const handleViewDetails = (userId) => {
    navigate(`/management/details/${userId}`);
  };

  return (
    <div className="p-5 font-sans rtl text-right bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className='flex justify-between items-center mb-4'>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">قسم الإدارة</h2>
          <button
            style={{ background: 'linear-gradient(180deg, #00ACC1 0%, #25BC9D 100%)' }}
            className="text-white rounded-md px-6 py-3 text-base flex items-center hover:opacity-90 transition-opacity duration-200 shadow-lg"
            onClick={handleAddNewUser}
          >
            <svg className="ml-2 -mt-0.5" xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
            </svg>
            إضافة مستخدم جديد
          </button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-end justify-end gap-4 w-full">
            <div className="flex items-end gap-4">
              <div className="flex flex-col">
                <label htmlFor="startDate" className="text-sm text-gray-600 mb-1">من تاريخ</label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate ? moment(startDate).format('YYYY-MM-DD') : ''}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border px-3 py-2 rounded w-[180px]"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="endDate" className="text-sm text-gray-600 mb-1">إلى تاريخ</label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate ? moment(endDate).format('YYYY-MM-DD') : ''}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border px-3 py-2 rounded w-[180px]"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1 invisible">.</label>
              <div className="relative w-[220px]">
                <input
                  type="text"
                  placeholder="البحث بالاسم..."
                  className="p-2 pr-10 border border-gray-300 rounded-md text-sm w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.085.12l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.12-.085zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && <div className="text-center p-5 text-gray-600">جاري تحميل البيانات...</div>}
      {error && <div className="text-red-500 text-center p-5">خطأ: {error}</div>}

      {!loading && !error && (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
                <th className="py-3 px-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">الاسم بالكامل</th>
                <th className="py-3 px-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">تاريخ المباشرة</th>
                <th className="py-3 px-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">القسم المعني</th>
                <th className="py-3 px-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">العنوان الوظيفي</th>
                <th className="py-3 px-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">ذمة الموظف</th>
                <th className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayedUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">لا توجد بيانات متاحة لعرضها.</td>
                </tr>
              ) : (
                displayedUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="py-3 px-4 text-sm text-gray-800">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-green-600 rounded" />
                    </td>
                    <td className="py-3 px-4 text-sm font-medium">{user.username}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{moment(user.hireDate).format('YYYY-MM-DD')}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{user.department}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{user.jobTitle}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">{user.employeeDebt}</td>
                    <td className="py-3 px-4 text-center text-sm">
                      <div className="flex items-center justify-center space-x-2 space-x-reverse">
                        <button
                          className="text-gray-400 hover:text-blue-800 transition-colors duration-200 flex items-center"
                          onClick={() => handleViewDetails(user._id)}
                          title="عرض"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                          <span className="mr-1">عرض</span>
                        </button>
                        <button
                          className="text-gray-400 transition-colors duration-200 flex items-center"
                          onClick={() => handleEdit(user._id)}
                          title="تعديل"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                          </svg>
                          <span className="mr-1">تعديل</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Management;
