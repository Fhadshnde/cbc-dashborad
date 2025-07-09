import React, { useState, useEffect } from 'react';
import { FiSearch, FiChevronDown } from 'react-icons/fi';
import { HiOutlineSearch } from 'react-icons/hi';
import { FaBell, FaUser, FaFilter, FaAngleLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const Navbar = ({ setIsAuthenticated, onSearchChange }) => {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('العربية');
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState(''); // حالة لتخزين دور المستخدم
  const [localSearchText, setLocalSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // جلب بيانات المستخدم من التخزين المحلي عند تحميل المكون
    const storedUserData = localStorage.getItem('userData');
    // جلب الدور المخزن مباشرة من 'selectedDepartment' في localStorage
    const storedSelectedDepartment = localStorage.getItem('selectedDepartment');

    let roleToSet = 'مستخدم'; // الدور الافتراضي

    // لغرض التصحيح: اطبع القيم التي يتم جلبها من localStorage
    console.log("Navbar useEffect - storedUserData:", storedUserData);
    console.log("Navbar useEffect - storedSelectedDepartment:", storedSelectedDepartment);

    // الأولوية الأولى: إذا كان selectedDepartment موجودًا، استخدمه كدور أساسي
    if (storedSelectedDepartment) {
      roleToSet = storedSelectedDepartment;
    } else if (storedUserData && storedUserData !== "undefined") {
      // الأولوية الثانية: إذا كان userData موجودًا، حاول تحليل الدور منه
      try {
        const userData = JSON.parse(storedUserData);
        setUsername(userData?.username || 'مسؤول النظام');
        roleToSet = userData?.role || 'مستخدم'; // استخدام الدور من userData
      } catch (error) {
        console.error("خطأ في تحليل بيانات المستخدم في Navbar:", error);
        setUsername('مسؤول النظام');
        roleToSet = 'مستخدم'; // في حالة فشل التحليل
      }
    } else {
      // إذا لم تكن هناك بيانات مخزنة على الإطلاق
      setUsername('مسؤول النظام');
      roleToSet = 'مستخدم';
    }
    
    setUserRole(roleToSet); // تعيين الدور النهائي للحالة
    // لغرض التصحيح: اطبع الدور النهائي الذي تم تعيينه
    console.log("Navbar useEffect - Final userRole set to:", roleToSet);

    // تحديث اسم المستخدم بشكل منفصل لضمان أنه يتم تعيينه دائمًا من userData إذا كان متاحًا
    if (storedUserData && storedUserData !== "undefined") {
        try {
            const userData = JSON.parse(storedUserData);
            setUsername(userData?.username || 'مسؤول النظام');
        } catch (error) {
            console.error("خطأ في تحليل اسم المستخدم في Navbar:", error);
            setUsername('مسؤول النظام');
        }
    } else {
        setUsername('مسؤول النظام');
    }

  }, []); // يتم تشغيل هذا التأثير مرة واحدة عند تحميل المكون

  // قائمة اللغات المتاحة
  const languages = [
    { name: 'العربية', code: 'ar' },
    { name: 'English', code: 'en' },
    { name: 'كوردي', code: 'ku' },
  ];

  // تبديل حالة قائمة اللغات المنسدلة
  const toggleLanguageDropdown = () => {
    setIsLanguageOpen(!isLanguageOpen);
  };

  // اختيار لغة وتحديث الحالة وإغلاق القائمة المنسدلة
  const selectLanguage = (language) => {
    setSelectedLanguage(language.name);
    setIsLanguageOpen(false);
  };

  // معالجة تسجيل الخروج: مسح بيانات المستخدم من التخزين المحلي وإعادة التوجيه لصفحة تسجيل الدخول
  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('selectedDepartment'); // مسح الدور المخزن أيضًا
    setIsAuthenticated(false);
    navigate("/login");
  };

  // معالجة تغيير نص البحث المحلي
  const handleLocalSearchChange = (e) => {
    setLocalSearchText(e.target.value);
  };

  // معالجة النقر على زر البحث وتمرير النص إلى المكون الأب
  const handleSearchButtonClick = () => {
    if (onSearchChange) {
      onSearchChange(localSearchText);
    }
  };

  // معالجة الضغط على مفتاح Enter في حقل البحث
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchButtonClick();
    }
  };

  return (
    <div className="w-full bg-white shadow-sm p-[60px] md:p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between" dir="rtl">
      <div className="relative w-full md:w-[430px]">
        {/* حقل البحث (معطل حاليًا في التصميم الأصلي) */}
        {/* <input
          type="text"
          placeholder="ما الذي تبحث عنه..."
          className="w-full pr-12 pl-4 py-2 text-right border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={localSearchText}
          onChange={handleLocalSearchChange}
          onKeyPress={handleKeyPress}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          <FiSearch size={18} />
        </div>
        <button
          onClick={handleSearchButtonClick}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-[#25BC9D] text-white px-3 py-1 rounded-md flex items-center hover:bg-blue-600 transition-colors whitespace-nowrap"
        >
          <HiOutlineSearch size={16} className="ml-1" />
          <span className="hidden sm:inline">ابحث الان</span>
        </button> */}
      </div>

      <div className="flex flex-wrap md:flex-nowrap items-center justify-between md:justify-end gap-4">
        {/* زر الإشعارات - يظهر فقط إذا كان دور المستخدم "followup" */}
        {/* الشرط هنا يتحقق من أن userRole يساوي "followup" بالضبط. */}
        {userRole === "followup" && (
          <Link to="/notification" className="relative">
                      <button className="text-gray-700 hover:text-gray-900 transition-colors">
            <FaBell className="text-2xl" />
          </button>
          </Link>
        )}

        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="w-10 h-10 flex items-center justify-center rounded-full ml-5 bg-gray-200">
            <FaUser className="text-gray-600 text-xl" />
          </div>
          <div className="flex flex-col text-right">
            <span className="font-medium text-gray-800 text-sm">{username}</span>
            {/* عرض دور المستخدم بناءً على القيمة المخزنة */}
            <span className="text-sm text-gray-500">
              {userRole === "followup" ? "موظف علاقات" : userRole === "sales" ? "موظف مبيعات" : "مندوب"}
            </span>
            <button
              onClick={handleLogout}
              className="text-gray-800 text-xs underline mt-1"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
