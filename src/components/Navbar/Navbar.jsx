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
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white gap-4 md:gap-0">
            <div className="w-full md:w-auto flex-1 max-w-full md:max-w-xl relative">
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FiSearch size={18} />
                </div>

                <input
                    type="text"
                    placeholder="ما الذي تبحث عنه..."
                    className="w-full md:w-[430px] px-4 py-2 pr-24 text-right border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    dir="rtl"
                />

                <button className="absolute left-[10px] md:left-[155px] top-1/2 transform -translate-y-1/2 bg-[#25BC9D] text-white px-3 py-1 rounded-md flex items-center hover:bg-blue-600 transition-colors">
                    <span className="ml-1">ابحث الان</span>
                    <HiOutlineSearch size={16} className="mr-1" />
                </button>
            </div>

            <div className="flex flex-wrap md:flex-nowrap items-center justify-between md:justify-end gap-4 w-full md:w-auto" dir="rtl">
                <FaBell className="text-gray-700" />

                <img
                    src={iraqIcon}
                    className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 mr-2"
                    alt="Iraq Flag"
                />

                <div className="relative">
                    <button
                        onClick={toggleLanguageDropdown}
                        className="flex items-center px-3 py-1 rounded-md cursor-pointer hover:bg-gray-50"
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
                                    className={`px-4 py-2  cursor-pointer ${selectedLanguage === language.name ? 'bg-blue-50 text-blue-600' : ''
                                        }`}
                                >
                                    {language.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex items-center ml-[28px]">
                    <div className='flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 mr-2'>
                        <FaUser className="text-gray-600 text-xl" size={24} />
                    </div>
                    <div className="flex flex-col items-end mr-2">
                        <span className="font-medium text-gray-800">احمد</span>
                        <span className="text-sm text-gray-500">مسؤول النظام</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
