import React, { useState } from 'react';
import {
  FaUser,
  FaCog,
  FaBell,
  FaPalette,
  FaSignOutAlt,
  FaAngleDown,
} from 'react-icons/fa';

const PanelWrapper = ({ title, icon, isOpen, onClose, children }) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 w-96 shadow-lg transform transition-transform duration-300 z-50 p-6 rtl ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col`}
      style={{
        background: 'linear-gradient(to bottom, #eff8f7, #c1e0e8)',
        borderRadius: '0 1.5rem 1.5rem 0',
      }}
    >
      <div className="absolute top-0 left-0 h-full w-2 rounded-tl-3xl rounded-bl-3xl bg-gradient-to-b from-teal-400 to-green-400"></div>
      <div
        className="relative px-6 py-4 flex items-center justify-between"
        style={{
          background: 'linear-gradient(to left, #e8f5f2, #d1e7e4)',
          borderRadius: '1.5rem 0 0 0',
          marginTop: '-1.5rem',
          marginLeft: '-1.5rem',
          marginRight: '-1.5rem',
        }}
      >
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          {title} <span className="mr-2 text-[#2EC19F]">{icon}</span>
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto pt-6 px-4">{children}</div>
    </div>
  );
};

const ProfilePage = () => {
  const [activePanel, setActivePanel] = useState(null);

  const handlePanelOpen = (panelName) => setActivePanel(panelName);
  const handlePanelClose = () => setActivePanel(null);

  return (
    <div className="w-full h-screen bg-gray-100 flex justify-start items-start overflow-hidden relative" style={{ direction: 'rtl' }}>
      <div className="w-full h-full flex flex-col bg-white shadow-lg z-10 overflow-auto">
        <div className="relative h-36 bg-gradient-to-r from-[#21C59F] to-[#2EC19F]">
          <div className="absolute -bottom-16 right-1/2 transform translate-x-1/2 w-32 h-32 rounded-full overflow-hidden border-[6px] border-white shadow-md">
            <img src="https://via.placeholder.com/150/f0f0f0?text=صورة+شخصية" alt="صورة الملف الشخصي" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="flex flex-col items-center mt-20 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">محمد احمد</h2>
          <p className="text-gray-500 text-base mt-1">مسؤول النظام</p>
        </div>
        <div className="px-8 pb-8 space-y-4 flex-grow">
          {[
            { id: 'profile', title: 'الملف الشخصي', icon: <FaUser /> },
            { id: 'accounts', title: 'إدارة الحسابات', icon: <FaCog /> },
            { id: 'notifications', title: 'إعدادات التنبيهات', icon: <FaBell /> },
            { id: 'customization', title: 'تخصيص الواجهة', icon: <FaPalette /> },
          ].map((item) => (
            <div
              key={item.id}
              className={`flex items-center justify-between bg-white p-4 rounded-lg border cursor-pointer ${
                activePanel === item.id ? 'border-[#2EC19F] bg-teal-50' : 'border-gray-200'
              }`}
              onClick={() => handlePanelOpen(item.id)}
            >
              <div className="flex items-center">
                <div className="ml-3 text-[#2EC19F]">{item.icon}</div>
                <span className="text-gray-700 font-medium text-base">{item.title}</span>
              </div>
              <FaAngleDown className="text-gray-400" />
            </div>
          ))}
          <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-red-200 cursor-pointer hover:bg-red-50">
            <div className="flex items-center">
              <FaSignOutAlt className="ml-3 text-red-500" />
              <span className="text-red-600 font-medium text-base">تسجيل الخروج</span>
            </div>
          </div>
        </div>
      </div>

      {activePanel && <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={handlePanelClose}></div>}

      {activePanel === 'profile' && (
        <PanelWrapper title="الملف الشخصي" icon={<FaUser />} isOpen={true} onClose={handlePanelClose}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الاول</label>
            <input readOnly value="محمد" className="w-full pr-4 py-2 rounded-lg bg-[#eaf4f7] text-right" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
            <input readOnly value="1234567654" className="w-full pr-4 py-2 rounded-lg bg-[#eaf4f7] text-right" />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الاخير</label>
            <input readOnly value="احمد" className="w-full pr-4 py-2 rounded-lg bg-[#eaf4f7] text-right" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">البريد الالكتروني</label>
            <input placeholder="ادخل البريد" className="w-full pr-4 py-2 rounded-lg bg-[#eaf4f7] text-right" />
          </div>
        </PanelWrapper>
      )}

{activePanel === 'accounts' && (
  <PanelWrapper title="إدارة الحسابات" icon={<FaCog />} isOpen={true} onClose={handlePanelClose}>
    <div className="mb-6">
      <label className="block text-gray-700 text-sm font-medium mb-2 text-right">البحث عن مستخدم</label>
      <input
        type="text"
        placeholder="ابحث عن..."
        className="w-full pr-4 py-2 rounded-lg text-right bg-[#eaf4f7] border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2EC19F]"
      />
    </div>

    <div className="space-y-6">
  {['مسؤول النظام', 'مسؤول المبيعات', 'مسؤول العلاقات', 'مسؤول'].map((section) => (
    <div key={section}>
      <h4 className="text-gray-700 font-medium mb-2 text-right">{section}</h4>
      <div className="space-y-3">
        {['مدير', 'مشرف', 'مشاهد فقط'].map((role, index) => (
          <label key={role} className="flex items-center justify-start text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              className="accent-[#2EC19F] h-5 w-5"
              defaultChecked={index === 0}
            />
            <span className="mr-2">{role}</span>
          </label>
        ))}
      </div>
    </div>
  ))}
</div>


    <div className="flex justify-between mt-8">
      <button
        onClick={handlePanelClose}
        className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
      >
        إلغاء
      </button>
      <button
        className="px-6 py-2 rounded-lg bg-[#2EC19F] text-white hover:bg-[#27b08f] transition"
      >
        تطبيق (3)
      </button>
    </div>
  </PanelWrapper>
)}


      {activePanel === 'notifications' && (
        <PanelWrapper title="إعدادات التنبيهات" icon={<FaBell />} isOpen={true} onClose={handlePanelClose}>
          <div className="space-y-6">
            {[
              { label: 'رسالة نصية', checked: true },
              { label: 'البريد الالكتروني', checked: false },
              { label: 'تنبيهات التطبيق', checked: false },
            ].map(({ label, checked }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-gray-700 font-medium text-lg">{label}</span>
                <label className="inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={checked} />
                  <div className="w-12 h-6 bg-gray-200 rounded-full peer peer-checked:bg-teal-500 relative transition-all duration-300">
                    <div className="absolute top-0.5 right-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-6 transition-transform duration-300"></div>
                  </div>
                </label>
              </div>
            ))}
          </div>
        </PanelWrapper>
      )}

      {activePanel === 'customization' && (
        <PanelWrapper title="تخصيص الواجهة" icon={<FaPalette />} isOpen={true} onClose={handlePanelClose}>
          <p className="text-gray-700 text-base">اختر الألوان والتخطيطات التي تفضلها لتخصيص تجربتك في النظام.</p>
        </PanelWrapper>
      )}
    </div>
  );
};

export default ProfilePage;
