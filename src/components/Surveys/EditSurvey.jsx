import React, { useState, useEffect } from 'react';
import { FaHome, FaAngleRight, FaUpload } from 'react-icons/fa';

const EditSurvey = () => {
  // Dummy data for editing, mimicking a pre-filled form
  const [storeName, setStoreName] = useState('اسم المتجر الحالي');
  const [contractDate, setContractDate] = useState('قسم المبيعات');
  const [classification, setClassification] = useState('تاج');
  const [status, setStatus] = useState('قيد المتابعة');
  const [initialRating, setInitialRating] = useState('4');
  const [uploadFiles, setUploadFiles] = useState([
    { name: 'contract1.pdf', url: '/placeholder-pdf.png' }, // Placeholder for uploaded file
    { name: 'contract2.jpg', url: '/placeholder-jpg.png' },
  ]);

  const [hasDesign, setHasDesign] = useState('نعم');
  const [hasPOS, setHasPOS] = useState('نعم');
  const [deliveryRating, setDeliveryRating] = useState('جيد جداً');
  const [recommendationSource, setRecommendationSource] = useState('ممتاز');
  const [employeeName, setEmployeeName] = useState('منتهى كاظم');
  const [managementNotes, setManagementNotes] = useState('ملاحظات موجودة مسبقًا حول فائدة المتجر داخل التطبيق.');
  const [futureVision, setFutureVision] = useState('المشكلة هي نقص التوعية بالبرنامج والحل هو حملات تسويقية أوسع.');

  const [customerVisits, setCustomerVisits] = useState('من 50 الى 100');
  const [hasSignaturePhoto, setHasSignaturePhoto] = useState('نعم');

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setUploadFiles((prevFiles) => [
      ...prevFiles,
      ...files.map(file => ({ name: file.name, url: URL.createObjectURL(file) }))
    ].slice(0, 5)); // Limit to 5 files
  };

  const handleRemoveFile = (index) => {
    setUploadFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Update Survey Data:', {
      storeName,
      contractDate,
      classification,
      status,
      initialRating,
      uploadFiles,
      hasDesign,
      hasPOS,
      deliveryRating,
      recommendationSource,
      employeeName,
      managementNotes,
      futureVision,
      customerVisits,
      hasSignaturePhoto,
    });
    // Add logic to send updated data to backend or state management
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">


      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Survey of Store Results */}
        <div className="bg-white p-6 rounded-lg shadow-sm" style={{ direction: 'rtl' }}>
          <div className="flex justify-end mb-6">
            <button type="submit" className="flex items-center px-6 py-2 bg-[#25BC9D] text-white rounded-md hover:bg-blue-700 transition">
              حفظ ومتابعة
            </button>
            <button type="button" className="flex items-center px-6 py-2 mr-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition">
              إلغاء
            </button>
          </div>

          <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-3">استبيان متاجر</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
                اسم الممثل من المتجر <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="storeName"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-right"
                placeholder="ادخل اسم الممثل من المتجر"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                حالة المتابعة <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-right bg-white"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">اختر حالة المتابعة</option>
                <option value="قيد المتابعة">قيد المتابعة</option>
                <option value="منجز">منجز</option>
                <option value="مرفوض">مرفوض</option>
              </select>
            </div>
            <div>
              <label htmlFor="contractDate" className="block text-sm font-medium text-gray-700 mb-1">
                القسم التابع له <span className="text-red-500">*</span>
              </label>
              <select
                id="contractDate"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-right bg-white"
                value={contractDate}
                onChange={(e) => setContractDate(e.target.value)}
              >
                <option value="">اختر القسم</option>
                <option value="قسم التقنية">قسم التقنية</option>
                <option value="قسم المبيعات">قسم المبيعات</option>
              </select>
            </div>
            <div>
              <label htmlFor="initialRating" className="block text-sm font-medium text-gray-700 mb-1">
                تقييم اولي <span className="text-red-500">*</span>
              </label>
              <select
                id="initialRating"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-right bg-white"
                value={initialRating}
                onChange={(e) => setInitialRating(e.target.value)}
              >
                <option value="">اختر تقييم</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <div>
              <label htmlFor="classification" className="block text-sm font-medium text-gray-700 mb-1">
                التصنيف <span className="text-red-500">*</span>
              </label>
              <select
                id="classification"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-right bg-white"
                value={classification}
                onChange={(e) => setClassification(e.target.value)}
              >
                <option value="">اختر التصنيف</option>
                <option value="تاج">تاج</option>
                <option value="مرصافة">مرصافة</option>
              </select>
            </div>
          </div>

          {/* Upload Contract Section */}
          <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center mb-6">
            <h4 className="text-lg font-bold text-gray-800 mb-3">عقود العميل</h4>
            <p className="text-sm text-gray-600 mb-4">
              يمكنك تحميل ما يصل إلى 5 ملفات من نفس العقد. الأقصى هو 100 ميغابايت لكل ملف.
            </p>
            <div className="flex justify-center space-x-4 space-x-reverse mb-4">
              {uploadFiles.map((file, index) => (
                <div key={index} className="relative w-24 h-24 border border-gray-300 rounded-md flex items-center justify-center overflow-hidden bg-gray-50">
                  <img src={file.url} alt="preview" className="object-cover w-full h-full" />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    X
                  </button>
                </div>
              ))}
              {uploadFiles.length < 5 && (
                <label className="w-24 h-24 border border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                  <FaUpload className="text-blue-500 text-xl mb-1" />
                  <span className="text-xs text-gray-600">ارفع ملف</span>
                  <input type="file" className="hidden" multiple onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
                </label>
              )}
            </div>
            <label className="inline-flex items-center px-4 py-2 bg-[#25BC9D] text-white rounded-md cursor-pointer hover:bg-blue-700 transition">
              ارفع ملف
              <input type="file" className="hidden" multiple onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
            </label>
          </div>
        </div>

        {/* Section 2: Other Party Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm" style={{ direction: 'rtl' }}>
          <div className="flex justify-end mb-6">
            <button type="submit" className="flex items-center px-6 py-2 bg-[#25BC9D] text-white rounded-md hover:bg-blue-700 transition">
              حفظ ومتابعة
            </button>
            <button type="button" className="flex items-center px-6 py-2 mr-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition">
              إلغاء
            </button>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-6 border-b pb-3">معلومات الطرف الثاني</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                هل تم تصميم البوستر الخاص بك <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="hasDesign"
                    value="نعم"
                    checked={hasDesign === 'نعم'}
                    onChange={(e) => setHasDesign(e.target.value)}
                    className="form-radio text-blue-600 h-4 w-4"
                  />
                  <span className="mr-2 text-gray-700">نعم</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="hasDesign"
                    value="لا"
                    checked={hasDesign === 'لا'}
                    onChange={(e) => setHasDesign(e.target.value)}
                    className="form-radio text-blue-600 h-4 w-4"
                  />
                  <span className="mr-2 text-gray-700">لا</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                عدد زيارات الزبائن ببطاقة عينك <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="customerVisits"
                    value="اقل من 50"
                    checked={customerVisits === 'اقل من 50'}
                    onChange={(e) => setCustomerVisits(e.target.value)}
                    className="form-radio text-blue-600 h-4 w-4"
                  />
                  <span className="mr-2 text-gray-700">اقل من 50</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="customerVisits"
                    value="من 50 الى 100"
                    checked={customerVisits === 'من 50 الى 100'}
                    onChange={(e) => setCustomerVisits(e.target.value)}
                    className="form-radio text-blue-600 h-4 w-4"
                  />
                  <span className="mr-2 text-gray-700">من 50 الى 100</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="customerVisits"
                    value="من 100 الى 150"
                    checked={customerVisits === 'من 100 الى 150'}
                    onChange={(e) => setCustomerVisits(e.target.value)}
                    className="form-radio text-blue-600 h-4 w-4"
                  />
                  <span className="mr-2 text-gray-700">من 100 الى 150</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="customerVisits"
                    value="اكثر من 150"
                    checked={customerVisits === 'اكثر من 150'}
                    onChange={(e) => setCustomerVisits(e.target.value)}
                    className="form-radio text-blue-600 h-4 w-4"
                  />
                  <span className="mr-2 text-gray-700">اكثر من 150</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                هل ترغب بالحصول على جهاز دمج الكتروني POS <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="hasPOS"
                    value="نعم"
                    checked={hasPOS === 'نعم'}
                    onChange={(e) => setHasPOS(e.target.value)}
                    className="form-radio text-blue-600 h-4 w-4"
                  />
                  <span className="mr-2 text-gray-700">نعم</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="hasPOS"
                    value="لا"
                    checked={hasPOS === 'لا'}
                    onChange={(e) => setHasPOS(e.target.value)}
                    className="form-radio text-blue-600 h-4 w-4"
                  />
                  <span className="mr-2 text-gray-700">لا</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                هل تم تصوير المتجر بالكامل <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="hasSignaturePhoto"
                    value="نعم"
                    checked={hasSignaturePhoto === 'نعم'}
                    onChange={(e) => setHasSignaturePhoto(e.target.value)}
                    className="form-radio text-blue-600 h-4 w-4"
                  />
                  <span className="mr-2 text-gray-700">نعم</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="hasSignaturePhoto"
                    value="لا"
                    checked={hasSignaturePhoto === 'لا'}
                    onChange={(e) => setHasSignaturePhoto(e.target.value)}
                    className="form-radio text-blue-600 h-4 w-4"
                  />
                  <span className="mr-2 text-gray-700">لا</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                كيف تقيم توصيل الشنطة <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="deliveryRating"
                    value="ضعيف"
                    checked={deliveryRating === 'ضعيف'}
                    onChange={(e) => setDeliveryRating(e.target.value)}
                    className="form-radio text-blue-600 h-4 w-4"
                  />
                  <span className="mr-2 text-gray-700">ضعيف</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="deliveryRating"
                    value="جيد"
                    checked={deliveryRating === 'جيد'}
                    onChange={(e) => setDeliveryRating(e.target.value)}
                    className="form-radio text-blue-600 h-4 w-4"
                  />
                  <span className="mr-2 text-gray-700">جيد</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="deliveryRating"
                    value="جيد جداً"
                    checked={deliveryRating === 'جيد جداً'}
                    onChange={(e) => setDeliveryRating(e.target.value)}
                    className="form-radio text-blue-600 h-4 w-4"
                  />
                  <span className="mr-2 text-gray-700">جيد جداً</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="deliveryRating"
                    value="ممتاز"
                    checked={deliveryRating === 'ممتاز'}
                    onChange={(e) => setDeliveryRating(e.target.value)}
                    className="form-radio text-blue-600 h-4 w-4"
                  />
                  <span className="mr-2 text-gray-700">ممتاز</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                مقدم التوصية من توصية الروابط <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="recommendationSource"
                    value="ضعيف"
                    checked={recommendationSource === 'ضعيف'}
                    onChange={(e) => setRecommendationSource(e.target.value)}
                    className="form-radio text-blue-600 h-4 w-4"
                  />
                  <span className="mr-2 text-gray-700">ضعيف</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="recommendationSource"
                    value="جيد"
                    checked={recommendationSource === 'جيد'}
                    onChange={(e) => setRecommendationSource(e.target.value)}
                    className="form-radio text-blue-600 h-4 w-4"
                  />
                  <span className="mr-2 text-gray-700">جيد</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="recommendationSource"
                    value="جيد جداً"
                    checked={recommendationSource === 'جيد جداً'}
                    onChange={(e) => setRecommendationSource(e.target.value)}
                    className="form-radio text-blue-600 h-4 w-4"
                  />
                  <span className="mr-2 text-gray-700">جيد جداً</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="recommendationSource"
                    value="ممتاز"
                    checked={recommendationSource === 'ممتاز'}
                    onChange={(e) => setRecommendationSource(e.target.value)}
                    className="form-radio text-blue-600 h-4 w-4"
                  />
                  <span className="mr-2 text-gray-700">ممتاز</span>
                </label>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700 mb-1">
                اسم الموظف <span className="text-red-500">*</span>
              </label>
              <select
                id="employeeName"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-right bg-white"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
              >
                <option value="">اختر اسم الموظف</option>
                <option value="منتهى كاظم">منتهى كاظم</option>
                <option value="علياء احمد">علياء احمد</option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label htmlFor="managementNotes" className="block text-sm font-medium text-gray-700 mb-1">
                ملاحظات مناقشات عن الفائدة الخاصة بالمتجر داخل التطبيق <span className="text-red-500">*</span>
              </label>
              <textarea
                id="managementNotes"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-right resize-y"
                rows="4"
                placeholder="ادخل الملاحظات"
                value={managementNotes}
                onChange={(e) => setManagementNotes(e.target.value)}
              ></textarea>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label htmlFor="futureVision" className="block text-sm font-medium text-gray-700 mb-1">
                ماهي المشاكل في رايك وماهي الحلول لزياده الزبائن <span className="text-red-500">*</span>
              </label>
              <textarea
                id="futureVision"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-right resize-y"
                rows="4"
                placeholder="ادخل الحلول"
                value={futureVision}
                onChange={(e) => setFutureVision(e.target.value)}
              ></textarea>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditSurvey;