import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateRequest, setUpdateRequest] = useState({
    fullName: '',
    jobTitle: '',
    department: '',
    email: '',
    qualification: {
      degree: '',
      university: '',
      year: ''
    }
  });
  const [courses, setCourses] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [newCourse, setNewCourse] = useState({
    name: '',
    provider: '',
    date: '',
    expiryDate: ''
  });
  const [newDocument, setNewDocument] = useState({
    name: '',
    type: '',
    date: '',
    expiryDate: ''
  });
  const [newAchievement, setNewAchievement] = useState({
    title: '',
    description: '',
    type: '',
    date: new Date().toISOString().split('T')[0],
    status: 'completed'
  });
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [skillTags, setSkillTags] = useState([]);
  const [isPromotionCandidate, setIsPromotionCandidate] = useState(false);
  const [requests, setRequests] = useState([]);

  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get(`https://hawkama.cbc-api.app/api/profile/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProfile(response.data);
        setCourses(response.data.courses || []);
        setDocuments(response.data.documents || []);
        setAchievements(response.data.achievements || []);
        setIsPromotionCandidate(response.data.isPromotionCandidate || false);
        setSkillTags(response.data.skillTags || []);
        
        // Calculate completion percentage
        const completionResponse = await axios.get(`https://hawkama.cbc-api.app/api/profile/${userId}/completion`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCompletionPercentage(completionResponse.data.completionPercentage);
        
        // Fetch update requests
        const requestsResponse = await axios.get(`https://hawkama.cbc-api.app/api/profile/requests/all`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setRequests(requestsResponse.data);
      } catch (err) {
        setError('فشل في تحميل البيانات. يرجى المحاولة مرة أخرى.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, token, navigate]);

  const handleUpdateRequestChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('qualification.')) {
      const qualField = name.split('.')[1];
      setUpdateRequest(prev => ({
        ...prev,
        qualification: {
          ...prev.qualification,
          [qualField]: value
        }
      }));
    } else {
      setUpdateRequest(prev => ({ ...prev, [name]: value }));
    }
  };

  const submitUpdateRequest = async () => {
    try {
      await axios.post(`https://hawkama.cbc-api.app/api/profile/${userId}/request-update`, updateRequest, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('تم إرسال طلب التحديث بنجاح. سيتم مراجعته من قبل المشرف.');
    } catch (err) {
      setError('فشل في إرسال طلب التحديث.');
      console.error(err);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', newCourse.name);
      formData.append('provider', newCourse.provider);
      formData.append('date', newCourse.date);
      formData.append('expiryDate', newCourse.expiryDate);
      if (e.target.file.files[0]) {
        formData.append('file', e.target.file.files[0]);
      }

      const response = await axios.post(`https://hawkama.cbc-api.app/api/profile/${userId}/courses`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setCourses([...courses, response.data.course]);
      setNewCourse({
        name: '',
        provider: '',
        date: '',
        expiryDate: ''
      });
      alert('تم إضافة الدورة بنجاح وتحتاج إلى موافقة المشرف.');
    } catch (err) {
      setError('فشل في إضافة الدورة.');
      console.error(err);
    }
  };

  const handleAddDocument = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', newDocument.name);
      formData.append('type', newDocument.type);
      formData.append('date', newDocument.date);
      formData.append('expiryDate', newDocument.expiryDate);
      if (e.target.file.files[0]) {
        formData.append('file', e.target.file.files[0]);
      }

      const response = await axios.post(`https://hawkama.cbc-api.app/api/profile/${userId}/documents`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setDocuments([...documents, response.data.document]);
      setNewDocument({
        name: '',
        type: '',
        date: '',
        expiryDate: ''
      });
      alert('تم رفع المستند بنجاح وتحتاج إلى موافقة المشرف.');
    } catch (err) {
      setError('فشل في رفع المستند.');
      console.error(err);
    }
  };

  const handleAddAchievement = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`https://hawkama.cbc-api.app/api/profile/${userId}/achievements`, newAchievement, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setAchievements([...achievements, response.data.achievement]);
      setNewAchievement({
        title: '',
        description: '',
        type: '',
        date: new Date().toISOString().split('T')[0],
        status: 'completed'
      });
      alert('تم إضافة الإنجاز بنجاح.');
    } catch (err) {
      setError('فشل في إضافة الإنجاز.');
      console.error(err);
    }
  };

  const generatePdf = async () => {
    try {
      const response = await axios.get(`https://hawkama.cbc-api.app/api/profile/${userId}/pdf`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `profile_${userId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      setError('فشل في توليد ملف PDF.');
      console.error(err);
    }
  };

  const generateSkillTags = async () => {
    try {
      const response = await axios.get(`https://hawkama.cbc-api.app/api/profile/${userId}/generate-skills`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSkillTags(response.data.skills);
      alert('تم توليد المهارات بنجاح. يرجى حفظ التغييرات إذا كنت ترغب في الاحتفاظ بها.');
    } catch (err) {
      setError('فشل في توليد المهارات.');
      console.error(err);
    }
  };

  const checkPromotionCandidate = async () => {
    try {
      const response = await axios.get(`https://hawkama.cbc-api.app/api/profile/${userId}/check-promotion-candidate`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIsPromotionCandidate(response.data.isPromotionCandidate);
      alert(`حالة الترشيح للترقية: ${response.data.isPromotionCandidate ? 'مرشح' : 'غير مرشح'}`);
    } catch (err) {
      setError('فشل في التحقق من حالة الترقية.');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">خطأ!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">الملف الشخصي</h1>
            <div className="flex space-x-4 space-x-reverse">
              <button
                onClick={generatePdf}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                توليد PDF
              </button>
              <button
                onClick={generateSkillTags}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg"
              >
                توليد المهارات
              </button>
              <button
                onClick={checkPromotionCandidate}
                className={`${isPromotionCandidate ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white px-4 py-2 rounded-lg`}
              >
                {isPromotionCandidate ? 'مرشح للترقية' : 'التحقق من الترقية'}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-teal-500 h-4 rounded-full"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">اكتمال الملف الشخصي: {completionPercentage}%</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">المعلومات الأساسية</h2>
              <div className="space-y-3">
                <p><span className="font-semibold">الاسم الكامل:</span> {profile.fullName || 'غير محدد'}</p>
                <p><span className="font-semibold">المسمى الوظيفي:</span> {profile.jobTitle || 'غير محدد'}</p>
                <p><span className="font-semibold">القسم:</span> {profile.department || 'غير محدد'}</p>
                <p><span className="font-semibold">البريد الإلكتروني:</span> {profile.email || 'غير محدد'}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">المؤهلات العلمية</h2>
              <div className="space-y-3">
                <p><span className="font-semibold">الدرجة العلمية:</span> {profile.qualification?.degree || 'غير محدد'}</p>
                <p><span className="font-semibold">الجامعة:</span> {profile.qualification?.university || 'غير محدد'}</p>
                <p><span className="font-semibold">سنة التخرج:</span> {profile.qualification?.year || 'غير محدد'}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">المهارات</h2>
            <div className="flex flex-wrap gap-2">
              {skillTags.length > 0 ? (
                skillTags.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">لا توجد مهارات مسجلة</p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* طلب تحديث الملف الشخصي */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">طلب تحديث الملف الشخصي</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
                <input
                  type="text"
                  name="fullName"
                  value={updateRequest.fullName}
                  onChange={handleUpdateRequestChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">المسمى الوظيفي</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={updateRequest.jobTitle}
                  onChange={handleUpdateRequestChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">القسم</label>
                <input
                  type="text"
                  name="department"
                  value={updateRequest.department}
                  onChange={handleUpdateRequestChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  name="email"
                  value={updateRequest.email}
                  onChange={handleUpdateRequestChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الدرجة العلمية</label>
                <input
                  type="text"
                  name="qualification.degree"
                  value={updateRequest.qualification.degree}
                  onChange={handleUpdateRequestChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الجامعة</label>
                <input
                  type="text"
                  name="qualification.university"
                  value={updateRequest.qualification.university}
                  onChange={handleUpdateRequestChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <button
                onClick={submitUpdateRequest}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-lg"
              >
                إرسال طلب التحديث
              </button>
            </div>
          </div>

          {/* إضافة دورة تدريبية */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">إضافة دورة تدريبية</h2>
            <form onSubmit={handleAddCourse}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">اسم الدورة</label>
                  <input
                    type="text"
                    name="name"
                    value={newCourse.name}
                    onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">الجهة المقدمة</label>
                  <input
                    type="text"
                    name="provider"
                    value={newCourse.provider}
                    onChange={(e) => setNewCourse({...newCourse, provider: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ الدورة</label>
                  <input
                    type="date"
                    name="date"
                    value={newCourse.date}
                    onChange={(e) => setNewCourse({...newCourse, date: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ انتهاء الصلاحية</label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={newCourse.expiryDate}
                    onChange={(e) => setNewCourse({...newCourse, expiryDate: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ملف الشهادة (اختياري)</label>
                  <input
                    type="file"
                    name="file"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"
                >
                  إضافة الدورة
                </button>
              </div>
            </form>

            <h2 className="text-xl font-semibold mt-6 mb-4">الدورات التدريبية</h2>
            <div className="space-y-3">
              {courses.length > 0 ? (
                courses.map((course, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <p className="font-semibold">{course.name}</p>
                    <p className="text-sm text-gray-600">{course.provider}</p>
                    <p className="text-sm text-gray-600">الحالة: <span className={`${course.status === 'accepted' ? 'text-green-500' : course.status === 'rejected' ? 'text-red-500' : 'text-yellow-500'}`}>
                      {course.status === 'accepted' ? 'مقبولة' : course.status === 'rejected' ? 'مرفوضة' : 'قيد المراجعة'}
                    </span></p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">لا توجد دورات مسجلة</p>
              )}
            </div>
          </div>

          {/* إضافة مستند وإنجاز */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">رفع مستند</h2>
              <form onSubmit={handleAddDocument}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">اسم المستند</label>
                    <input
                      type="text"
                      name="name"
                      value={newDocument.name}
                      onChange={(e) => setNewDocument({...newDocument, name: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">نوع المستند</label>
                    <select
                      name="type"
                      value={newDocument.type}
                      onChange={(e) => setNewDocument({...newDocument, type: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    >
                      <option value="">اختر نوع المستند</option>
                      <option value="هوية">هوية</option>
                      <option value="شهادة">شهادة</option>
                      <option value="عقد">عقد</option>
                      <option value="آخر">آخر</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ المستند</label>
                    <input
                      type="date"
                      name="date"
                      value={newDocument.date}
                      onChange={(e) => setNewDocument({...newDocument, date: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">تاريخ انتهاء الصلاحية</label>
                    <input
                      type="date"
                      name="expiryDate"
                      value={newDocument.expiryDate}
                      onChange={(e) => setNewDocument({...newDocument, expiryDate: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ملف المستند</label>
                    <input
                      type="file"
                      name="file"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
                  >
                    رفع المستند
                  </button>
                </div>
              </form>

              <h2 className="text-xl font-semibold mt-6 mb-4">المستندات</h2>
              <div className="space-y-3">
                {documents.length > 0 ? (
                  documents.map((doc, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <p className="font-semibold">{doc.name}</p>
                      <p className="text-sm text-gray-600">النوع: {doc.type}</p>
                      <p className="text-sm text-gray-600">الحالة: <span className={`${doc.status === 'accepted' ? 'text-green-500' : doc.status === 'rejected' ? 'text-red-500' : 'text-yellow-500'}`}>
                        {doc.status === 'accepted' ? 'مقبول' : doc.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                      </span></p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">لا توجد مستندات مسجلة</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">إضافة إنجاز/مهمة</h2>
              <form onSubmit={handleAddAchievement}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">العنوان</label>
                    <input
                      type="text"
                      name="title"
                      value={newAchievement.title}
                      onChange={(e) => setNewAchievement({...newAchievement, title: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                    <textarea
                      name="description"
                      value={newAchievement.description}
                      onChange={(e) => setNewAchievement({...newAchievement, description: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      rows="3"
                      required
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">النوع</label>
                    <select
                      name="type"
                      value={newAchievement.type}
                      onChange={(e) => setNewAchievement({...newAchievement, type: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    >
                      <option value="">اختر نوع الإنجاز</option>
                      <option value="task">مهمة</option>
                      <option value="award">جائزة</option>
                      <option value="thank_letter">خطاب شكر</option>
                      <option value="other">آخر</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">التاريخ</label>
                    <input
                      type="date"
                      name="date"
                      value={newAchievement.date}
                      onChange={(e) => setNewAchievement({...newAchievement, date: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                    <select
                      name="status"
                      value={newAchievement.status}
                      onChange={(e) => setNewAchievement({...newAchievement, status: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      required
                    >
                      <option value="completed">مكتمل</option>
                      <option value="in_progress">قيد التنفيذ</option>
                      <option value="pending">معلق</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg"
                  >
                    إضافة الإنجاز
                  </button>
                </div>
              </form>

              <h2 className="text-xl font-semibold mt-6 mb-4">الإنجازات والمهام</h2>
              <div className="space-y-3">
                {achievements.length > 0 ? (
                  achievements.map((achievement, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <p className="font-semibold">{achievement.title}</p>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <p className="text-sm text-gray-600">النوع: {achievement.type === 'task' ? 'مهمة' : achievement.type === 'award' ? 'جائزة' : achievement.type === 'thank_letter' ? 'خطاب شكر' : 'آخر'}</p>
                      <p className="text-sm text-gray-600">الحkjknkedالة: {achievement.status === 'completed' ? 'مكتمل' : achievement.status === 'in_progress' ? 'قيد التنفيذ' : 'معلق'}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">لا توجد إنجازاdn c jud hsk sinت مسجلة</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* طلبات التحديث */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">طلبات تحديث الملف الشخصي</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التweqd.nweqednwqاريخ</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">التغwqedklnk/wqlkednwlkqjedييرات</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ملاحظات الweqdmnwdenw,jndwمشرف</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.length > 0 ? (
                  requests.map((request, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          request.status === 'approved' ? 'bg-green-100 text-green-800' : 
                          request.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {request.status === 'approved' ? 'مقبول' : request.status === 'rejected' ? 'مرفوض' : 'قيد المراجعة'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {Object.keys(request.changes).join('، ')}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {request.adminNote || 'لا توجد ملاحظات'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      لا توجد طلبات
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;