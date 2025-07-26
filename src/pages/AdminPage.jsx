import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [activeTab, setActiveTab] = useState('profileList'); // New state for active tab
  const navigate = useNavigate();

  const API_BASE_URL = 'https://hawkama.cbc-api.app/api'; // تأكد من هذا العنوان

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!token || !user || user.role !== 'admin') {
      navigate('/login');
      toast.error('غير مصرح لك بالوصول إلى هذه الصفحة.');
    } else {
      fetchAllProfiles();
    }
  }, [token, user, navigate]);

  useEffect(() => {
    const results = profiles.filter(profile =>
      profile.fullName && profile.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.user && profile.user.username && profile.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.user && profile.user.email && profile.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProfiles(results);
  }, [searchTerm, profiles]);

  const fetchAllProfiles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/profile/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfiles(response.data);
      setFilteredProfiles(response.data);
    } catch (error) {
      toast.error('خطأ في جلب جميع الملفات الشخصية.');
    }
  };

  const handleProfileSelect = async (userId) => {
    setSelectedProfileId(userId);
    setProfileData(null);
    setCompletionPercentage(0);

    if (userId) {
      try {
        const profileResponse = await axios.get(`${API_BASE_URL}/profile/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfileData(profileResponse.data);

        const completionResponse = await axios.get(`${API_BASE_URL}/profile/${userId}/completion`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCompletionPercentage(completionResponse.data.completionPercentage);

      } catch (error) {
        toast.error('خطأ في جلب بيانات الملف الشخصي أو نسبة الاكتمال.');
        console.error('Error fetching profile data:', error);
      }
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        fullName: profileData.fullName,
        jobTitle: profileData.jobTitle,
        department: profileData.department,
        internalPhone: profileData.internalPhone,
        email: profileData.email,
        startDate: profileData.startDate,
        profileImageUrl: profileData.profileImageUrl,
        qualification: profileData.qualification,
        skillTags: profileData.skillTags,
        isPromotionCandidate: profileData.isPromotionCandidate,
      };

      await axios.put(`${API_BASE_URL}/profile/${selectedProfileId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('تم تحديث الملف الشخصي بنجاح!');
      handleProfileSelect(selectedProfileId); // Refresh data
    } catch (error) {
      toast.error('فشل تحديث الملف الشخصي.');
      console.error('Error updating profile:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePromotionCandidateChange = (e) => {
    setProfileData(prev => ({
      ...prev,
      isPromotionCandidate: e.target.checked
    }));
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', e.target.name.value);
    formData.append('provider', e.target.provider.value);
    formData.append('date', e.target.date.value);
    if (e.target.expiryDate.value) formData.append('expiryDate', e.target.expiryDate.value);
    if (e.target.file.files[0]) formData.append('file', e.target.file.files[0]);

    try {
      await axios.post(`${API_BASE_URL}/profile/${selectedProfileId}/courses`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('تمت إضافة الدورة بنجاح!');
      handleProfileSelect(selectedProfileId); // Refresh profile data
    } catch (error) {
      toast.error('فشل إضافة الدورة.');
      console.error('Error adding course:', error);
    }
  };

  const handleAddDocument = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', e.target.name.value);
    formData.append('type', e.target.type.value);
    formData.append('date', e.target.date.value);
    if (e.target.expiryDate.value) formData.append('expiryDate', e.target.expiryDate.value);
    if (e.target.file.files[0]) formData.append('file', e.target.file.files[0]);

    try {
      await axios.post(`${API_BASE_URL}/profile/${selectedProfileId}/documents`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('تمت إضافة المستند بنجاح!');
      handleProfileSelect(selectedProfileId); // Refresh profile data
    } catch (error) {
      toast.error('فشل إضافة المستند.');
      console.error('Error adding document:', error);
    }
  };

  const handleAddAchievement = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/profile/${selectedProfileId}/achievements`, {
        title: e.target.title.value,
        description: e.target.description.value,
        type: e.target.type.value,
        date: e.target.date.value,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('تمت إضافة الإنجاز بنجاح!');
      handleProfileSelect(selectedProfileId);
    } catch (error) {
      toast.error('فشل إضافة الإنجاز.');
      console.error('Error adding achievement:', error);
    }
  };

  const handleAddEvaluation = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/profile/${selectedProfileId}/evaluations`, {
        score: e.target.score.value,
        notes: e.target.notes.value,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('تمت إضافة التقييم بنجاح!');
      handleProfileSelect(selectedProfileId);
    } catch (error) {
      toast.error('فشل إضافة التقييم.');
      console.error('Error adding evaluation:', error);
    }
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/profile/${selectedProfileId}/records`, {
        type: e.target.type.value,
        details: e.target.details.value,
        date: e.target.date.value,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('تمت إضافة السجل بنجاح!');
      handleProfileSelect(selectedProfileId);
    } catch (error) {
      toast.error('فشل إضافة السجل.');
      console.error('Error adding record:', error);
    }
  };

  const handleDeleteAchievement = async (achievementId) => {
    if (window.confirm('هل أنت متأكد أنك تريد حذف هذا الإنجاز؟')) {
      try {
        await axios.delete(`${API_BASE_URL}/profile/${selectedProfileId}/achievements/${achievementId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('تم حذف الإنجاز بنجاح!');
        handleProfileSelect(selectedProfileId);
      } catch (error) {
        toast.error('فشل حذف الإنجاز.');
        console.error('Error deleting achievement:', error);
      }
    }
  };

  const handleDeleteRecord = async (recordId) => {
    if (window.confirm('هل أنت متأكد أنك تريد حذف هذا السجل؟')) {
      try {
        await axios.delete(`${API_BASE_URL}/profile/${selectedProfileId}/records/${recordId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('تم حذف السجل بنجاح!');
        handleProfileSelect(selectedProfileId);
      } catch (error) {
        toast.error('فشل حذف السجل.');
        console.error('Error deleting record:', error);
      }
    }
  };

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>صفحة الإدارة</h1>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setActiveTab('profileList')} style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: activeTab === 'profileList' ? '#007bff' : '#f0f0f0', color: activeTab === 'profileList' ? 'white' : 'black', border: 'none', borderRadius: '5px' }}>
          قائمة الملفات الشخصية
        </button>
        <button onClick={() => setActiveTab('manageProfile')} style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: activeTab === 'manageProfile' ? '#007bff' : '#f0f0f0', color: activeTab === 'manageProfile' ? 'white' : 'black', border: 'none', borderRadius: '5px' }} disabled={!selectedProfileId}>
          إدارة الملف الشخصي المحدد
        </button>
      </div>

      {activeTab === 'profileList' && (
        <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
          <h2>جميع الملفات الشخصية</h2>
          <input
            type="text"
            placeholder="بحث بالاسم، اسم المستخدم أو البريد الإلكتروني..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '8px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          <select
            onChange={(e) => handleProfileSelect(e.target.value)}
            value={selectedProfileId}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="">اختر ملف شخصي لعرضه/إدارته</option>
            {filteredProfiles.map((profile) => (
              <option key={profile._id} value={profile.user._id}>
                {profile.fullName || profile.user.username} ({profile.user.email})
              </option>
            ))}
          </select>
        </div>
      )}

      {activeTab === 'manageProfile' && selectedProfileId && profileData && (
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h2>تفاصيل الملف الشخصي: {profileData.fullName || profileData.user.username}</h2>
          <p>نسبة اكتمال الملف الشخصي: {completionPercentage.toFixed(2)}%</p>

          <form onSubmit={handleUpdateProfile} style={{ display: 'grid', gap: '15px', marginBottom: '30px' }}>
            <h3>تعديل المعلومات الأساسية</h3>
            <div>
              <label>الاسم الكامل:</label>
              <input type="text" name="fullName" value={profileData.fullName || ''} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>
            <div>
              <label>المسمى الوظيفي:</label>
              <input type="text" name="jobTitle" value={profileData.jobTitle || ''} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>
            <div>
              <label>القسم:</label>
              <input type="text" name="department" value={profileData.department || ''} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>
            <div>
              <label>رقم الهاتف الداخلي:</label>
              <input type="text" name="internalPhone" value={profileData.internalPhone || ''} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>
            <div>
              <label>البريد الإلكتروني:</label>
              <input type="email" name="email" value={profileData.email || ''} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>
            <div>
              <label>تاريخ البدء:</label>
              <input type="date" name="startDate" value={profileData.startDate ? new Date(profileData.startDate).toISOString().split('T')[0] : ''} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>
            <div>
              <label>رابط صورة الملف الشخصي:</label>
              <input type="text" name="profileImageUrl" value={profileData.profileImageUrl || ''} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>
            <div>
              <label>الدرجة العلمية:</label>
              <input type="text" name="qualification.degree" value={profileData.qualification.degree || ''} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>
            <div>
              <label>الجامعة:</label>
              <input type="text" name="qualification.university" value={profileData.qualification.university || ''} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>
            <div>
              <label>سنة التخرج:</label>
              <input type="number" name="qualification.year" value={profileData.qualification.year || ''} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>
            <div>
              <label>التخصص:</label>
              <input type="text" name="qualification.specialization" value={profileData.qualification.specialization || ''} onChange={handleInputChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>
            <div>
              <label>المهارات (افصل بفاصلة):</label>
              <input type="text" name="skillTags" value={profileData.skillTags ? profileData.skillTags.join(',') : ''} onChange={(e) => setProfileData(prev => ({ ...prev, skillTags: e.target.value.split(',').map(tag => tag.trim()) }))} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            </div>
            <div>
              <label>
                <input
                  type="checkbox"
                  name="isPromotionCandidate"
                  checked={profileData.isPromotionCandidate}
                  onChange={handlePromotionCandidateChange}
                />
                مرشح للترقية
              </label>
            </div>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>تحديث الملف الشخصي</button>
          </form>

          <h3>الدورات التدريبية</h3>
          {profileData.courses && profileData.courses.length > 0 ? (
            <ul>
              {profileData.courses.map((course, index) => (
                <li key={course._id || index} style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                  <p><strong>اسم الدورة:</strong> {course.name}</p>
                  <p><strong>المزود:</strong> {course.provider}</p>
                  <p><strong>تاريخ الحصول:</strong> {new Date(course.date).toLocaleDateString()}</p>
                  {course.expiryDate && <p><strong>تاريخ الانتهاء:</strong> {new Date(course.expiryDate).toLocaleDateString()}</p>}
                  <p><strong>الحالة:</strong> {course.status}</p>
                  {course.adminNote && <p><strong>ملاحظة الإدارة:</strong> {course.adminNote}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p>لا توجد دورات تدريبية.</p>
          )}
          <form onSubmit={handleAddCourse} style={{ display: 'grid', gap: '10px', marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <h4>إضافة دورة جديدة</h4>
            <input type="text" name="name" placeholder="اسم الدورة" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            <input type="text" name="provider" placeholder="المزود" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            <input type="date" name="date" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            <input type="date" name="expiryDate" placeholder="تاريخ الانتهاء (اختياري)" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            <input type="file" name="file" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>إضافة دورة</button>
          </form>

          <h3>المستندات</h3>
          {profileData.documents && profileData.documents.length > 0 ? (
            <ul>
              {profileData.documents.map((doc, index) => (
                <li key={doc._id || index} style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                  <p><strong>اسم المستند:</strong> {doc.name}</p>
                  <p><strong>النوع:</strong> {doc.type}</p>
                  <p><strong>تاريخ الإصدار:</strong> {new Date(doc.date).toLocaleDateString()}</p>
                  {doc.expiryDate && <p><strong>تاريخ الانتهاء:</strong> {new Date(doc.expiryDate).toLocaleDateString()}</p>}
                  <p><strong>الحالة:</strong> {doc.status}</p>
                  {doc.adminNote && <p><strong>ملاحظة الإدارة:</strong> {doc.adminNote}</p>}
                </li>
              ))}
            </ul>
          ) : (
            <p>لا توجد مستندات.</p>
          )}
          <form onSubmit={handleAddDocument} style={{ display: 'grid', gap: '10px', marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <h4>إضافة مستند جديد</h4>
            <input type="text" name="name" placeholder="اسم المستند" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            <input type="text" name="type" placeholder="نوع المستند" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            <input type="date" name="date" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            <input type="date" name="expiryDate" placeholder="تاريخ الانتهاء (اختياري)" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            <input type="file" name="file" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>إضافة مستند</button>
          </form>

          <h3>الإنجازات</h3>
          {profileData.achievements && profileData.achievements.length > 0 ? (
            <ul>
              {profileData.achievements.map((achievement, index) => (
                <li key={achievement._id || index} style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                  <p><strong>العنوان:</strong> {achievement.title}</p>
                  <p><strong>الوصف:</strong> {achievement.description}</p>
                  <p><strong>النوع:</strong> {achievement.type}</p>
                  <p><strong>التاريخ:</strong> {new Date(achievement.date).toLocaleDateString()}</p>
                  <button onClick={() => handleDeleteAchievement(achievement._id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>حذف</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>لا توجد إنجازات.</p>
          )}
          <form onSubmit={handleAddAchievement} style={{ display: 'grid', gap: '10px', marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <h4>إضافة إنجاز جديد</h4>
            <input type="text" name="title" placeholder="العنوان" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            <input type="text" name="description" placeholder="الوصف" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            <input type="text" name="type" placeholder="النوع" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            <input type="date" name="date" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>إضافة إنجاز</button>
          </form>

          <h3>التقييمات</h3>
          {profileData.evaluations && profileData.evaluations.length > 0 ? (
            <ul>
              {profileData.evaluations.map((evaluation, index) => (
                <li key={evaluation._id || index} style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                  <p><strong>الدرجة:</strong> {evaluation.score}</p>
                  <p><strong>الملاحظات:</strong> {evaluation.notes}</p>
                  <p><strong>التاريخ:</strong> {new Date(evaluation.date).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>لا توجد تقييمات.</p>
          )}
          <form onSubmit={handleAddEvaluation} style={{ display: 'grid', gap: '10px', marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <h4>إضافة تقييم جديد</h4>
            <input type="number" name="score" placeholder="الدرجة" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            <textarea name="notes" placeholder="الملاحظات" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}></textarea>
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>إضافة تقييم</button>
          </form>

          <h3>السجلات</h3>
          {profileData.records && profileData.records.length > 0 ? (
            <ul>
              {profileData.records.map((record, index) => (
                <li key={record._id || index} style={{ marginBottom: '10px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                  <p><strong>النوع:</strong> {record.type}</p>
                  <p><strong>التفاصيل:</strong> {record.details}</p>
                  <p><strong>التاريخ:</strong> {new Date(record.date).toLocaleDateString()}</p>
                  <button onClick={() => handleDeleteRecord(record._id)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>حذف</button>
                </li>
              ))}
            </ul>
          ) : (
            <p>لا توجد سجلات.</p>
          )}
          <form onSubmit={handleAddRecord} style={{ display: 'grid', gap: '10px', marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <h4>إضافة سجل جديد</h4>
            <input type="text" name="type" placeholder="النوع" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            <textarea name="details" placeholder="التفاصيل" style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}></textarea>
            <input type="date" name="date" required style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }} />
            <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>إضافة سجل</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminPage;