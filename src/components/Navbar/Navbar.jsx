import React, { useState, useEffect } from 'react';
import { FiSearch, FiChevronDown } from 'react-icons/fi';
import { HiOutlineSearch } from 'react-icons/hi';
import { FaBell, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ setIsAuthenticated, onSearchChange }) => {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('العربية');
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('');
  const [localSearchText, setLocalSearchText] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');

    if (storedUserData && storedUserData !== "undefined") {
      try {
        const userData = JSON.parse(storedUserData);
        setUsername(userData?.username || 'مسؤول النظام');
        setUserRole(userData?.role || 'مستخدم');
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUsername('مسؤول النظام');
        setUserRole('مستخدم');
      }
    } else {
      setUsername('مسؤول النظام');
      setUserRole('مستخدم');
    }
  }, []);

  const languages = [
    { name: 'العربية', code: 'ar' },
    { name: 'English', code: 'en' },
    { name: 'كوردي', code: 'ku' },
  ];

  const toggleLanguageDropdown = () => {
    setIsLanguageOpen(!isLanguageOpen);
  };

  const selectLanguage = (language) => {
    setSelectedLanguage(language.name);
    setIsLanguageOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    localStorage.setItem('isLoggedIn', 'false');
    setIsAuthenticated(false);
    navigate("/login");
  };

  const handleLocalSearchChange = (e) => {
    setLocalSearchText(e.target.value);
  };

  const handleSearchButtonClick = () => {
    if (onSearchChange) {
      onSearchChange(localSearchText); // تمرير نص البحث إلى المكون الأب
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchButtonClick();
    }
  };

  return (
    <div className="w-full bg-white shadow-sm p-[60px] md:p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between" dir="rtl">
      <div className="relative w-full md:w-[430px]">
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
        {/* <FaBell className="text-gray-700" /> */}

        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="w-10 h-10 flex items-center justify-center rounded-full ml-5 bg-gray-200">
            <FaUser className="text-gray-600  text-xl" />
          </div>
          <div className="flex flex-col text-right">
            <span className="font-medium text-gray-800 text-sm">{username}</span>
            <span className="text-sm text-gray-500">{userRole === "supervisor" ? "مشرف" : userRole === "admin" ? "مندوب" : "مندوب"}</span>
            <button
              onClick={handleLogout}
              className="text-gray-800 text-xs underline  mt-1"
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
