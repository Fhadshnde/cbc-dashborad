import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CardsSection from './CardsSection';
import BonusesSection from './BonusesSection';
import AdvancesSection from './AdvancesSection';
import DeductionsSection from './DeductionsSection';
import VacationsSection from './VacationsSection';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('cards');

  // جلب بيانات المستخدم كاملة مع كل البيانات (بطاقات، مكافآت، ... الخ)
  const fetchUserDetails = useCallback(async () => {
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
        },
      };

      // جلب بيانات المستخدم
      const response = await axios.get(`https://hawkama.cbc-api.app/api/users/${id}`, config);

      // ننتظر إذا أردت أن تجلب بيانات أخرى مرتبطة هنا، مثلاً تقارير البطاقات (لو غير موجودة ضمن بيانات المستخدم)
      // افتراضياً البيانات كلها ضمن response.data حسب كودك السابق

      setUser(response.data);
      setLoading(false);
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        setError(err.response.data.message || 'غير مصرح لك بالوصول. يرجى تسجيل الدخول بدور مناسب.');
      } else if (err.response && err.response.status === 404) {
        setError(err.response.data.message || 'المستخدم غير موجود.');
      } else {
        setError(err.response?.data?.message || 'فشل جلب بيانات المستخدم.');
      }
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  if (loading) {
    return <div className="text-center p-5 font-sans rtl">جاري تحميل تفاصيل المستخدم...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-right rtl font-sans">
        خطأ: {error}
        <button
          onClick={() => navigate(-1)}
          className="mr-4 px-3 py-1 bg-red-700 text-white rounded hover:bg-red-800"
        >
          العودة
        </button>
      </div>
    );
  }

  if (!user) {
    return <div className="text-center p-5 font-sans rtl">لا توجد بيانات مستخدم لعرضها.</div>;
  }

  const userImageSrc = user.imageUrl
    ? `https://hawkama.cbc-api.app/${user.imageUrl}`
    : 'https://via.placeholder.com/150';

  return (
    <div className="p-5 font-sans rtl text-right bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between space-y-4 md:space-y-0 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 md:space-x-reverse">
            <img
              src={userImageSrc}
              alt="صورة المستخدم"
              className="w-24 h-24 rounded-full object-cover shadow-lg border-2 ml-7 border-green-500"
            />
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-1">{user.username}</h2>
              <p className="text-gray-600 text-lg">{user.jobTitle}</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              style={{ background: 'linear-gradient(180deg, #00ACC1 0%, #25BC9D 100%)' }}
              className=" text-white rounded-md px-5 py-2 text-base flex items-center hover:bg-green-700 transition-colors duration-200 shadow-lg"
              onClick={() => navigate(`/management/edit-user/${user._id}`)}
            >
              تعديل
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-6">
          <nav
            className="-mb-px flex space-x-8 space-x-reverse"
            aria-label="Tabs"
          >
            {/* <button
              onClick={() => setActiveTab('cards')}
              className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'cards'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              البطاقات
            </button> */}
            <button
              onClick={() => setActiveTab('bonuses')}
              className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'bonuses'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              المكافآت
            </button>
            <button
              onClick={() => setActiveTab('advances')}
              className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'advances'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              السلف
            </button>
            <button
              onClick={() => setActiveTab('deductions')}
              className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'deductions'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              الخصومات
            </button>
            <button
              onClick={() => setActiveTab('vacations')}
              className={`whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'vacations'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              الإجازات
            </button>
          </nav>
        </div>

        <div className="tab-content">
          {/* {activeTab === 'cards' && (
            <CardsSection
              cardsData={{
                cardsIssued: user.cardsIssued,
                cardsCategoryA: user.cardsCategoryA,
                cardsVirtual: user.cardsVirtual,
                employeeDebt: user.employeeDebt,
              }}
              userReports={user.userReports || []} // إذا كانت موجودة ضمن بيانات المستخدم
            />
          )} */}
          {activeTab === 'bonuses' && <BonusesSection bonuses={user.bonuses || []} />}
          {activeTab === 'advances' && <AdvancesSection salaryAdvances={user.salaryAdvances || []} />}
          {activeTab === 'deductions' && <DeductionsSection deductions={user.deductions || []} />}
          {activeTab === 'vacations' && <VacationsSection vacations={user.vacations || []} />}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
