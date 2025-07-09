import React from 'react';

const ContractDetails = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6 rtl font-sans">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4 space-x-reverse text-gray-600 text-sm">
          <span>لوحة التحكم</span>
          <span className="mx-2">/</span>
          <span>قسم العلاقات</span>
          <span className="mx-2">/</span>
          <span className="text-teal-600">تفاصيل العقد</span>
        </div>
        {/* <div className="flex space-x-3 space-x-reverse">
          <button className="px-4 py-2 bg-blue-500 text-gray-800 rounded-lg shadow-md hover:bg-gray-400 transition-colors flex items-center">
            <span>تعديل</span>
          </button>
        </div> */}
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">تفاصيل العقد</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">معلومات العقد</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label htmlFor="contractNumber" className="block text-gray-700 text-sm font-medium mb-2">رقم العقد*</label>
            <input
              type="text"
              id="contractNumber"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
              placeholder="ادخل رقم العقد"
              value="CON-2025-001"
              readOnly
            />
          </div>
          <div>
            <label htmlFor="contractType" className="block text-gray-700 text-sm font-medium mb-2">نوع العقد*</label>
            <div className="relative">
              <select id="contractType" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right appearance-none bg-white" value="عقد سنوي" readOnly>
                <option>اختر</option>
                <option>عقد سنوي</option>
                <option>عقد شهري</option>
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="periodType" className="block text-gray-700 text-sm font-medium mb-2">مدة العقد*</label>
            <div className="relative">
              <select id="periodType" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right appearance-none bg-white" value="سنة" readOnly>
                <option>اختر</option>
                <option>سنة</option>
                <option>شهر</option>
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="signDate" className="block text-gray-700 text-sm font-medium mb-2">تاريخ توقيع العقد*</label>
            <input
              type="date"
              id="signDate"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
              value="2025-01-15"
              readOnly
            />
          </div>
          <div>
            <label htmlFor="expirationDate" className="block text-gray-700 text-sm font-medium mb-2">تاريخ انتهاء العقد*</label>
            <input
              type="date"
              id="expirationDate"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
              value="2026-01-14"
              readOnly
            />
          </div>
        </div>
        <div className="mt-6">
          <label htmlFor="contractLocation" className="block text-gray-700 text-sm font-medium mb-2">موقع العقد*</label>
          <div className="border border-gray-300 object-cover rounded-lg h-64 bg-gray-50 flex items-center justify-center text-gray-400">
            <img
              src="https://wpdatatables.com/wp-content/uploads/2019/07/store.jpg"
              alt="Store Locations Map"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="flex items-center mt-2">
            <input type="checkbox" id="updateLocation" className="form-checkbox h-4 w-4 text-teal-600 rounded mr-2" checked readOnly/>
            <label htmlFor="updateLocation" className="text-gray-700 text-sm">تحديد الموقع الجغرافي</label>
          </div>
        </div>
      </div>

      {/* معلومات الطرف الثاني */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">معلومات الطرف الثاني</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="secondPartyId" className="block text-gray-700 text-sm font-medium mb-2">رقم هوية الطرف الثاني*</label>
            <input
              type="text"
              id="secondPartyId"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
              placeholder="*1347"
              value="987654321"
              readOnly
            />
          </div>
          <div>
            <label htmlFor="fullName" className="block text-gray-700 text-sm font-medium mb-2">الاسم الكامل* / اسم الملك*</label>
            <input
              type="text"
              id="fullName"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
              placeholder="الاسم الكامل"
              value="علي أحمد محمود"
              readOnly
            />
          </div>
          <div>
            <label htmlFor="contactType" className="block text-gray-700 text-sm font-medium mb-2">نوع النشاط التجاري*</label>
            <div className="relative">
              <select id="contactType" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right appearance-none bg-white" value="متجر ملابس" readOnly>
                <option>ادخل نوع النشاط التجاري</option>
                <option>متجر ملابس</option>
                <option>مطعم</option>
                <option>خدمات</option>
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="governorate" className="block text-gray-700 text-sm font-medium mb-2">المحافظة*</label>
            <div className="relative">
              <select id="governorate" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right appearance-none bg-white" value="بغداد" readOnly>
                <option>المحافظة</option>
                <option>بغداد</option>
                <option>البصرة</option>
                <option>أربيل</option>
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="serviceType" className="block text-gray-700 text-sm font-medium mb-2">نوع خدمة "براء"*</label>
            <div className="relative">
              <select id="serviceType" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right appearance-none bg-white" value="خدمة أ" readOnly>
                <option>اختر نوع خدمة “براء”</option>
                <option>خدمة أ</option>
                <option>خدمة ب</option>
                <option>خدمة ج</option>
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="officialAddress" className="block text-gray-700 text-sm font-medium mb-2">رقم الهاتف الرسمي للملك*</label>
            <input
              type="text"
              id="officialAddress"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
              placeholder="+964 رقم الهاتف الرسمي للمالك"
              value="+964 770 123 4567"
              readOnly
            />
          </div>
          <div>
            <label htmlFor="instagram" className="block text-gray-700 text-sm font-medium mb-2">البريد الإلكتروني للمتجر</label>
            <input
              type="text"
              id="instagram"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
              placeholder="Instagram - Instagram"
              value="shop_name@instagram.com"
              readOnly
            />
          </div>
          <div>
            <label htmlFor="facebook" className="block text-gray-700 text-sm font-medium mb-2">العنوان الكامل</label>
            <input
              type="text"
              id="facebook"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
              placeholder="فيسبوك - Facebook"
              value="بغداد، حي المنصور، شارع 10، عمارة 5"
              readOnly
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">توقيعات إلكترونية</label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
              placeholder="ادخل توقيعات الكترونية"
              value="signature@example.com"
              readOnly
            />
          </div>
          <div>
            <label htmlFor="signatures" className="block text-gray-700 text-sm font-medium mb-2">عنوان بريد إلكتروني</label>
            <input
              type="text"
              id="signatures"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
              placeholder="ادخل بريد الكتروني او اخرى"
              value="info@yourcompany.com"
              readOnly
            />
          </div>
        </div>
        <p className="text-gray-500 text-sm mt-4">
          يمكنك تحديد الرسم على الشاشة باستخدام قلمك للتوقيع.
        </p>
      </div>

      {/* الخدمات المقدمة من قبل الطرف الثاني */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">الخدمات المقدمة من قبل الطرف الثاني</h2>
          <div className="flex space-x-3 space-x-reverse">
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="secondPartyService" className="block text-gray-700 text-sm font-medium mb-2">اسم الخدمة/الأول*</label>
            <input
              type="text"
              id="secondPartyService"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
              placeholder="ادخل اسم الخدمة"
              value="خدمة تصميم شعار"
              readOnly
            />
          </div>
          <div>
            <label htmlFor="serviceDetails" className="block text-gray-700 text-sm font-medium mb-2">تفاصيل الخدمة / الأول*</label>
            <input
              type="text"
              id="serviceDetails"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
              placeholder="ادخل تفاصيل الخدمة / الاول"
              value="تصميم شعار احترافي للعلامة التجارية"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* قائمة الافرع */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">قائمة الافرع</h2>
          <div className="flex space-x-3 space-x-reverse">
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="mainBranchName" className="block text-gray-700 text-sm font-medium mb-2">اسم الفرع الرئيسي</label>
            <input
              type="text"
              id="mainBranchName"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
              placeholder="ادخل اسم الفرع"
              value="الفرع الرئيسي - المنصور"
              readOnly
            />
          </div>
          <div>
            <label htmlFor="mainBranchAddress" className="block text-gray-700 text-sm font-medium mb-2">عنوان الفرع</label>
            <input
              type="text"
              id="mainBranchAddress"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
              placeholder="ادخل عنوان الفرع"
              value="بغداد، شارع الزوراء، مبنى 123"
              readOnly
            />
          </div>
          <div>
            <label htmlFor="mainBranchPhone" className="block text-gray-700 text-sm font-medium mb-2">رقم الاتصال للفرع</label>
            <input
              type="text"
              id="mainBranchPhone"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
              placeholder="+964"
              value="+964 780 987 6543"
              readOnly
            />
          </div>
        </div>
      </div>

      {/* الخدمات المقدمة من شركتنا */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">الخدمات المقدمة من شركتنا</h2>
          <div className="flex space-x-3 space-x-reverse">

          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="ourServiceName" className="block text-gray-700 text-sm font-medium mb-2">اسم مقدم الخدمة *</label>
            <div className="relative">
              <select id="ourServiceName" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right appearance-none bg-white" value="خدمة 1" readOnly>
                <option>اختر</option>
                <option>خدمة 1</option>
                <option>خدمة 2</option>
                <option>خدمة 3</option>
              </select>
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="subscriptionAmount" className="block text-gray-700 text-sm font-medium mb-2">مبلغ الاشتراك</label>
            <input
              type="text"
              id="subscriptionAmount"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
              placeholder="ادخل مبلغ الاشتراك"
              value="500,000 دينار عراقي"
              readOnly
            />
          </div>
          <div>
            <label htmlFor="notes" className="block text-gray-700 text-sm font-medium mb-2">ملاحظات</label>
            <input
              type="text"
              id="notes"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-right"
              placeholder="ادخل الملاحظات"
              value="ملاحظات إضافية حول العقد."
              readOnly
            />
          </div>
        </div>
        <div className="mt-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">صورة العقد</label>
          <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
            <p className="text-gray-500 text-sm mb-2">يمكنك تحميل ما يصل إلى 5 ملفات صور للعقد، الحجم الأقصى هو 5 GB لكل ملف.</p>
            <button className="px-4 py-2 bg-teal-100 text-teal-700 rounded-lg hover:bg-teal-200 transition-colors">
              أرفق الملف
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetails;