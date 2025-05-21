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
        { name: 'كوردي', code: 'ku' }
    ];

    const toggleLanguageDropdown = () => {
        setIsLanguageOpen(!isLanguageOpen);
    };

    const selectLanguage = (language) => {
        setSelectedLanguage(language.name);
        setIsLanguageOpen(false);
    };

    return (
        <div className="w-full bg-white shadow-sm p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search Box */}
            <div className="relative w-full md:w-[430px]">
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FiSearch size={18} />
                </div>
                <input
                    type="text"
                    placeholder="ما الذي تبحث عنه..."
                    className="w-full px-4 py-2 pr-24 text-right border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    dir="rtl"
                />
                <button className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-[#25BC9D] text-white px-3 py-1 rounded-md flex items-center hover:bg-blue-600 transition-colors">
                    <span className="ml-1 hidden sm:inline">ابحث الان</span>
                    <HiOutlineSearch size={16} className="mr-1" />
                </button>
            </div>

            {/* Right Section */}
            <div className="flex flex-wrap md:flex-nowrap items-center justify-between md:justify-end gap-4" dir="rtl">
                {/* Bell Icon */}
                <FaBell className="text-gray-700" />

                {/* Iraq Flag */}
                <img
                    src={iraqIcon}
                    className="w-7 h-7 rounded-full bg-gray-200"
                    alt="Iraq Flag"
                />

                {/* Language Dropdown */}
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

                {/* User Info */}
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
