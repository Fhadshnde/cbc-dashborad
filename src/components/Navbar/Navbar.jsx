import React, { useState } from 'react';
import { FiSearch, FiChevronDown } from 'react-icons/fi';
import { HiOutlineSearch } from 'react-icons/hi';
import { FaBell, FaUser } from 'react-icons/fa';
import iraqIcon from '../../assets/iraq.jpg';

const Navbar = () => {
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('العربية');

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

  return (
<div className="w-full bg-white shadow-sm p-[60px] md:p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between" dir="rtl">
{/* Search Box */}
      <div className="relative w-full md:w-[430px]">
        <input
          type="text"
          placeholder="ما الذي تبحث عنه..."
          className="w-full pr-12 pl-4 py-2 text-right border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir="rtl"
        />
        {/* أيقونة البحث على اليمين */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          <FiSearch size={18} />
        </div>
        {/* زر البحث على اليسار */}
        <button className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-[#25BC9D] text-white px-3 py-1 rounded-md flex items-center hover:bg-blue-600 transition-colors whitespace-nowrap">
          <HiOutlineSearch size={16} className="ml-1" />
          <span className="hidden sm:inline">ابحث الان</span>
        </button>
      </div>

      {/* القسم الأيمن */}
      <div className="flex flex-wrap md:flex-nowrap items-center justify-between md:justify-end gap-4">
        {/* أيقونة الجرس */}
        <FaBell className="text-gray-700" />

        {/* علم العراق */}
        <img
          src={iraqIcon}
          className="w-7 h-7 rounded-full bg-gray-200"
          alt="علم العراق"
        />

        {/* قائمة اختيار اللغة */}
        <div className="relative">
          <button
            onClick={toggleLanguageDropdown}
            className="flex items-center px-3 py-1 rounded-md hover:bg-gray-50"
          >
            <span className="text-gray-700">{selectedLanguage}</span>
            <FiChevronDown className="mr-1 text-gray-500" />
          </button>
          {isLanguageOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              {languages.map((language) => (
                <div
                  key={language.code}
                  onClick={() => selectLanguage(language)}
                  className={`px-4 py-2 cursor-pointer ${
                    selectedLanguage === language.name
                      ? 'bg-blue-50 text-blue-600'
                      : ''
                  }`}
                >
                  {language.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* معلومات المستخدم */}
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200">
            <FaUser className="text-gray-600 text-xl" />
          </div>
          <div className="flex flex-col text-right">
            <span className="font-medium text-gray-800 text-sm">احمد</span>
            <span className="text-sm text-gray-500">مسؤول النظام</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
