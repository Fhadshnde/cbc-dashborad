import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "moment/locale/ar";

moment.locale("ar");

const API_BASE_URL = "https://hawkama.cbc-api.app/api";

const SupervisorDashboard = ({ setIsAuthenticated }) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileUpdateRequests, setProfileUpdateRequests] = useState([]);
  const [courseRequests, setCourseRequests] = useState([]);
  const [documentRequests, setDocumentRequests] = useState([]);

  const [courseLoading, setCourseLoading] = useState(false);
  const [documentLoading, setDocumentLoading] = useState(false);
  const [evaluationLoading, setEvaluationLoading] = useState(false);
  const [recordLoading, setRecordLoading] = useState(false);
  const [editProfileLoading, setEditProfileLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [promotionLoading, setPromotionLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [achievementLoading, setAchievementLoading] = useState(false);
  const [autoPromotionCheckLoading, setAutoPromotionCheckLoading] = useState(false);

  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [courseFormData, setCourseFormData] = useState({
    name: "",
    provider: "",
    date: "",
    expiryDate: "",
    file: null,
  });
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);
  const [documentFormData, setDocumentFormData] = useState({
    name: "",
    type: "",
    date: "",
    expiryDate: "",
    file: null,
  });
  const [showAddEvaluationModal, setShowAddEvaluationModal] = useState(false);
  const [evaluationFormData, setEvaluationFormData] = useState({
    score: "",
    notes: "",
    skillEvaluations: [{ skillName: "", score: "", notes: "" }],
  });
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [recordFormData, setRecordFormData] = useState({
    type: "reward",
    details: "",
    date: "",
    signedBy: "",
    signatureImageUrl: "",
  });
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editProfileFormData, setEditProfileFormData] = useState({});

  const [showAddAchievementModal, setShowAddAchievementModal] = useState(false);
  const [achievementFormData, setAchievementFormData] = useState({
    title: "",
    description: "",
    type: "other",
    date: "",
    status: "pending",
  });
  const [showEditAchievementModal, setShowEditAchievementModal] = useState(false);
  const [editAchievementFormData, setEditAchievementFormData] = useState({});

  const [showEditRecordModal, setShowEditRecordModal] = useState(false);
  const [editRecordFormData, setEditRecordFormData] = useState({});

  const [searchTerm, setSearchTerm] = useState("");
  const [profileRequestSearchTerm, setProfileRequestSearchTerm] = useState("");
  const [courseRequestSearchTerm, setCourseRequestSearchTerm] = useState("");
  const [documentRequestSearchTerm, setDocumentRequestSearchTerm] = useState("");

  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterJobTitle, setFilterJobTitle] = useState("");

  const [expandedSection, setExpandedSection] = useState(null);
  const [activeTab, setActiveTab] = useState("معلومات أساسية");

  const [toasts, setToasts] = useState([]);

  const navigate = useNavigate();

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000);
  }, []);

  const memoizedToken = useMemo(() => localStorage.getItem("token"), []);
  const memoizedUserData = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("userData"));
    } catch (e) {
      console.error("فشل في تحليل بيانات المستخدم من التخزين المحلي:", e);
      return null;
    }
  }, []);

  const axiosInstance = useMemo(() => {
    return axios.create({
      baseURL: API_BASE_URL,
      headers: {
        Authorization: `Bearer ${memoizedToken}`,
        "Content-Type": "application/json",
      },
    });
  }, [memoizedToken]);

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/profiles/all");
      const profilesWithCompletion = await Promise.all(response.data.map(async (profile) => {
        try {
          if (!profile.user || !profile.user._id) {
            console.warn("Profile missing user ID:", profile);
            return { ...profile, completionPercentage: null };
          }
          const completionRes = await axiosInstance.get(`/profiles/${profile.user._id}/completion`);
          return { ...profile, completionPercentage: completionRes.data.completionPercentage };
        } catch (compErr) {
          console.error(`فشل في جلب نسبة الاكتمال لـ ${profile.fullName}:`, compErr.response?.data || compErr.message);
          return { ...profile, completionPercentage: null };
        }
      }));
      setProfiles(profilesWithCompletion);
    } catch (err) {
      setError("فشل في جلب ملفات الموظفين: " + (err.response?.data?.message || err.message));
      addToast("فشل في جلب ملفات الموظفين.", "error");
    } finally {
      setLoading(false);
    }
  }, [axiosInstance, addToast]);

  const fetchProfileUpdateRequests = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/profiles/requests/all");
      setProfileUpdateRequests(response.data);
    } catch (err) {
      setError("فشل في جلب طلبات تحديث الملفات الشخصية: " + (err.response?.data?.message || err.message));
      addToast("فشل في جلب طلبات تحديث الملفات الشخصية.", "error");
    }
  }, [axiosInstance, addToast]);

  const fetchCourseRequests = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/profiles/courses/requests/all");
      setCourseRequests(response.data);
    } catch (err) {
      setError("فشل في جلب طلبات الدورات التدريبية: " + (err.response?.data?.message || err.message));
      addToast("فشل في جلب طلبات الدورات التدريبية.", "error");
    }
  } , [axiosInstance, addToast]);

  const fetchDocumentRequests = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/profiles/documents/requests/all");
      setDocumentRequests(response.data);
    } catch (err) {
      setError("فشل في جلب طلبات المستندات: " + (err.response?.data?.message || err.message));
      addToast("فشل في جلب طلبات المستندات.", "error");
    }
  }, [axiosInstance, addToast]);

  useEffect(() => {
    if (!memoizedToken || !memoizedUserData || memoizedUserData.role !== "supervisor") {
      navigate("/login");
      setIsAuthenticated(false);
      return;
    }
    fetchProfiles();
    fetchProfileUpdateRequests();
    fetchCourseRequests();
    fetchDocumentRequests();
  }, [memoizedToken, memoizedUserData, navigate, setIsAuthenticated, fetchProfiles, fetchProfileUpdateRequests, fetchCourseRequests, fetchDocumentRequests]);

  const handleViewProfile = async (profileId, userId) => {
    setError("");
    try {
      if (!userId) {
        setError("معرف المستخدم مفقود لعرض الملف الشخصي.");
        addToast("معرف المستخدم مفقود لعرض الملف الشخصي.", "error");
        return;
      }
      const response = await axiosInstance.get(`/profiles/${userId}`);
      setSelectedProfile(response.data);
      setActiveTab("معلومات أساسية");
    } catch (err) {
      setError("فشل في جلب تفاصيل الملف الشخصي: " + (err.response?.data?.message || err.message));
      addToast("فشل في جلب تفاصيل الملف الشخصي.", "error");
    }
  };

  const handleReviewRequest = async (requestId, status, userId) => {
    setReviewLoading(true);
    try {
      if (!userId) {
        setError("معرف المستخدم مفقود لمراجعة الطلب.");
        addToast("معرف المستخدم مفقود لمراجعة الطلب.", "error");
        setReviewLoading(false);
        return;
      }
      await axiosInstance.put(`/profiles/requests/${requestId}/review`, { status, adminNote: "" });
      fetchProfileUpdateRequests();
      if (status === "approved") {
        const updatedProfile = await axiosInstance.get(`/profiles/${userId}`).then(res => res.data);
        setProfiles(prevProfiles =>
          prevProfiles.map(p => (p.user._id === updatedProfile.user._id ? updatedProfile : p))
        );
        if (selectedProfile && selectedProfile.user._id === updatedProfile.user._id) {
          setSelectedProfile(updatedProfile);
        }
        addToast("تمت الموافقة على الطلب بنجاح.", "success");
      } else {
        addToast("تم رفض الطلب بنجاح.", "success");
      }
    } catch (err) {
      setError("فشل في مراجعة الطلب: " + (err.response?.data?.message || err.message));
      addToast("فشل في مراجعة الطلب.", "error");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setCourseLoading(true);

    if (!selectedProfile?.user?._id) {
      setError("معرف المستخدم غير متاح لإضافة الدورة.");
      addToast("معرف المستخدم غير متاح لإضافة الدورة.", "error");
      setCourseLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    for (const key in courseFormData) {
      if (courseFormData[key] !== null) {
        formDataToSend.append(key, courseFormData[key]);
      }
    }

    axiosInstance.defaults.headers["Content-Type"] = undefined;
    try {
      await axiosInstance.post(`/profiles/${selectedProfile.user._id}/courses`, formDataToSend);
      addToast("تمت إضافة الدورة بنجاح. بانتظار الموافقة.", "success");
      setShowAddCourseModal(false);
      setCourseFormData({ name: "", provider: "", date: "", expiryDate: "", file: null });
      fetchProfiles();
      handleViewProfile(selectedProfile._id, selectedProfile.user._id);
      fetchCourseRequests();
    } catch (err) {
      setError("فشل في إضافة الدورة: " + (err.response?.data?.message || err.message));
      addToast("فشل في إضافة الدورة.", "error");
    } finally {
      setCourseLoading(false);
      axiosInstance.defaults.headers["Content-Type"] = "application/json";
    }
  };

  const handleApproveCourse = async (userId, courseId, status) => {
    setReviewLoading(true);
    try {
      if (!userId) {
        setError("معرف المستخدم مفقود للموافقة على الدورة.");
        addToast("معرف المستخدم مفقود للموافقة على الدورة.", "error");
        setReviewLoading(false);
        return;
      }
      await axiosInstance.put(`/profiles/${userId}/courses/${courseId}/approve`, { status });
      addToast(`تم ${status === 'accepted' ? 'قبول' : 'رفض'} الدورة.`, "success");
      fetchProfiles();
      handleViewProfile(selectedProfile._id, userId);
      fetchCourseRequests();
    } catch (err) {
      setError("فشل في تحديث حالة الدورة: " + (err.response?.data?.message || err.message));
      addToast("فشل في تحديث حالة الدورة.", "error");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleAddDocument = async (e) => {
    e.preventDefault();
    setDocumentLoading(true);

    if (!selectedProfile?.user?._id) {
      setError("معرف المستخدم غير متاح لإضافة المستند.");
      addToast("معرف المستخدم غير متاح لإضافة المستند.", "error");
      setDocumentLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    for (const key in documentFormData) {
      if (documentFormData[key] !== null) {
        formDataToSend.append(key, documentFormData[key]);
      }
    }

    axiosInstance.defaults.headers["Content-Type"] = undefined;
    try {
      await axiosInstance.post(`/profiles/${selectedProfile.user._id}/documents`, formDataToSend);
      addToast("تمت إضافة المستند بنجاح. بانتظار الموافقة.", "success");
      setShowAddDocumentModal(false);
      setDocumentFormData({ name: "", type: "", date: "", expiryDate: "", file: null });
      fetchProfiles();
      handleViewProfile(selectedProfile._id, selectedProfile.user._id);
      fetchDocumentRequests();
    } catch (err) {
      setError("فشل في إضافة المستند: " + (err.response?.data?.message || err.message));
      addToast("فشل في إضافة المستند.", "error");
    } finally {
      setDocumentLoading(false);
      axiosInstance.defaults.headers["Content-Type"] = "application/json";
    }
  };

  const handleApproveDocument = async (userId, docId, status) => {
    setReviewLoading(true);
    try {
      if (!userId) {
        setError("معرف المستخدم مفقود للموافقة على المستند.");
        addToast("معرف المستخدم مفقود للموافقة على المستند.", "error");
        setReviewLoading(false);
        return;
      }
      await axiosInstance.put(`/profiles/${userId}/documents/${docId}/approve`, { status });
      addToast(`تم ${status === 'accepted' ? 'قبول' : 'رفض'} المستند.`, "success");
      fetchProfiles();
      handleViewProfile(selectedProfile._id, userId);
      fetchDocumentRequests();
    } catch (err) {
      setError("فشل في تحديث حالة المستند: " + (err.response?.data?.message || err.message));
      addToast("فشل في تحديث حالة المستند.", "error");
    } finally {
      setReviewLoading(false);
    }
  };

  const handleAddEvaluation = async (e) => {
    e.preventDefault();
    setEvaluationLoading(true);
    if (!selectedProfile?.user?._id) {
      setError("معرف المستخدم غير متاح لإضافة التقييم.");
      addToast("معرف المستخدم غير متاح لإضافة التقييم.", "error");
      setEvaluationLoading(false);
      return;
    }
    try {
      await axiosInstance.post(`/profiles/${selectedProfile.user._id}/evaluations`, evaluationFormData);
      addToast("تمت إضافة التقييم بنجاح.", "success");
      setShowAddEvaluationModal(false);
      setEvaluationFormData({ score: "", notes: "", skillEvaluations: [{ skillName: "", score: "", notes: "" }] });
      fetchProfiles();
      handleViewProfile(selectedProfile._id, selectedProfile.user._id);
    } catch (err) {
      setError("فشل في إضافة التقييم: " + (err.response?.data?.message || err.message));
      addToast("فشل في إضافة التقييم.", "error");
    } finally {
      setEvaluationLoading(false);
    }
  };

  const handleSkillEvaluationChange = (index, field, value) => {
    const updatedSkills = [...evaluationFormData.skillEvaluations];
    updatedSkills[index][field] = value;
    setEvaluationFormData({ ...evaluationFormData, skillEvaluations: updatedSkills });
  };

  const addSkillEvaluationField = () => {
    setEvaluationFormData({
      ...evaluationFormData,
      skillEvaluations: [...evaluationFormData.skillEvaluations, { skillName: "", score: "", notes: "" }],
    });
  };

  const removeSkillEvaluationField = (index) => {
    const updatedSkills = evaluationFormData.skillEvaluations.filter((_, i) => i !== index);
    setEvaluationFormData({ ...evaluationFormData, skillEvaluations: updatedSkills });
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    setRecordLoading(true);
    if (!selectedProfile?.user?._id) {
      setError("معرف المستخدم غير متاح لإضافة السجل.");
      addToast("معرف المستخدم غير متاح لإضافة السجل.", "error");
      setRecordLoading(false);
      return;
    }
    try {
      await axiosInstance.post(`/profiles/${selectedProfile.user._id}/records`, recordFormData);
      addToast("تمت إضافة السجل الإداري بنجاح.", "success");
      setShowAddRecordModal(false);
      setRecordFormData({ type: "reward", details: "", date: "", signedBy: "", signatureImageUrl: "" });
      fetchProfiles();
      handleViewProfile(selectedProfile._id, selectedProfile.user._id);
    } catch (err) {
      setError("فشل في إضافة السجل الإداري: " + (err.response?.data?.message || err.message));
      addToast("فشل في إضافة السجل الإداري.", "error");
    } finally {
      setRecordLoading(false);
    }
  };

  const handleEditRecordClick = (record) => {
    setEditRecordFormData({
      ...record,
      date: record.date ? moment(record.date).format("YYYY-MM-DD") : "",
    });
    setShowEditRecordModal(true);
  };

  const handleUpdateRecord = async (e) => {
    e.preventDefault();
    setRecordLoading(true);
    if (!selectedProfile?.user?._id || !editRecordFormData?._id) {
      setError("معرف المستخدم أو معرف السجل غير متاح لتحديث السجل.");
      addToast("معرف المستخدم أو معرف السجل غير متاح لتحديث السجل.", "error");
      setRecordLoading(false);
      return;
    }
    try {
      await axiosInstance.put(`/profiles/${selectedProfile.user._id}/records/${editRecordFormData._id}`, editRecordFormData);
      addToast("تم تحديث السجل الإداري بنجاح.", "success");
      setShowEditRecordModal(false);
      setEditRecordFormData({});
      fetchProfiles();
      handleViewProfile(selectedProfile._id, selectedProfile.user._id);
    } catch (err) {
      setError("فشل في تحديث السجل الإداري: " + (err.response?.data?.message || err.message));
      addToast("فشل في تحديث السجل الإداري.", "error");
    } finally {
      setRecordLoading(false);
    }
  };

  const handleDeleteRecord = async (recordId) => {
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا السجل الإداري؟")) {
      return;
    }
    setRecordLoading(true);
    if (!selectedProfile?.user?._id || !recordId) {
      setError("معرف المستخدم أو معرف السجل غير متاح لحذف السجل.");
      addToast("معرف المستخدم أو معرف السجل غير متاح لحذف السجل.", "error");
      setRecordLoading(false);
      return;
    }
    try {
      await axiosInstance.delete(`/profiles/${selectedProfile.user._id}/records/${recordId}`);
      addToast("تم حذف السجل الإداري بنجاح.", "success");
      fetchProfiles();
      handleViewProfile(selectedProfile._id, selectedProfile.user._id);
    } catch (err) {
      setError("فشل في حذف السجل الإداري: " + (err.response?.data?.message || err.message));
      addToast("فشل في حذف السجل الإداري.", "error");
    } finally {
      setRecordLoading(false);
    }
  };

  const handleAddAchievement = async (e) => {
    e.preventDefault();
    setAchievementLoading(true);
    if (!selectedProfile?.user?._id) {
      setError("معرف المستخدم غير متاح لإضافة الإنجاز.");
      addToast("معرف المستخدم غير متاح لإضافة الإنجاز.", "error");
      setAchievementLoading(false);
      return;
    }
    try {
      await axiosInstance.post(`/profiles/${selectedProfile.user._id}/achievements`, achievementFormData);
      addToast("تمت إضافة الإنجاز بنجاح.", "success");
      setShowAddAchievementModal(false);
      setAchievementFormData({ title: "", description: "", type: "other", date: "", status: "pending" });
      fetchProfiles();
      handleViewProfile(selectedProfile._id, selectedProfile.user._id);
    } catch (err) {
      setError("فشل في إضافة الإنجاز: " + (err.response?.data?.message || err.message));
      addToast("فشل في إضافة الإنجاز.", "error");
    } finally {
      setAchievementLoading(false);
    }
  };

  const handleEditAchievementClick = (achievement) => {
    setEditAchievementFormData({
      ...achievement,
      date: achievement.date ? moment(achievement.date).format("YYYY-MM-DD") : "",
    });
    setShowEditAchievementModal(true);
  };

  const handleUpdateAchievement = async (e) => {
      e.preventDefault();
      setAchievementLoading(true);
      if (!selectedProfile?.user?._id || !editAchievementFormData?._id) {
        setError("معرف المستخدم أو معرف الإنجاز غير متاح لتحديث الإنجاز.");
        addToast("معرف المستخدم أو معرف الإنجاز غير متاح لتحديث الإنجاز.", "error");
        setAchievementLoading(false);
        return;
      }
      try {
        await axiosInstance.put(`/profiles/${selectedProfile.user._id}/achievements/${editAchievementFormData._id}`, editAchievementFormData);
        addToast("تم تحديث الإنجاز بنجاح.", "success");
        setShowEditAchievementModal(false);
        setEditAchievementFormData({});
        fetchProfiles();
        handleViewProfile(selectedProfile._id, selectedProfile.user._id);
      } catch (err) {
        setError("فشل في تحديث الإنجاز: " + (err.response?.data?.message || err.message));
        addToast("فشل في تحديث الإنجاز.", "error");
      } finally {
        setAchievementLoading(false);
      }
    };

  const handleDeleteAchievement = async (achievementId) => {
    if (!window.confirm("هل أنت متأكد أنك تريد حذف هذا الإنجاز؟")) {
      return;
    }
    setAchievementLoading(true);
    if (!selectedProfile?.user?._id || !achievementId) {
      setError("معرف المستخدم أو معرف الإنجاز غير متاح لحذف الإنجاز.");
      addToast("معرف المستخدم أو معرف الإنجاز غير متاح لحذف الإنجاز.", "error");
      setAchievementLoading(false);
      return;
    }
    try {
      await axiosInstance.delete(`/profiles/${selectedProfile.user._id}/achievements/${achievementId}`);
      addToast("تم حذف الإنجاز بنجاح.", "success");
      fetchProfiles();
      handleViewProfile(selectedProfile._id, selectedProfile.user._id);
    } catch (err) {
      setError("فشل في حذف الإنجاز: " + (err.response?.data?.message || err.message));
      addToast("فشل في حذف الإنجاز.", "error");
    } finally {
      setAchievementLoading(false);
    }
  };

  const handleMarkPromotionCandidate = async (userId, isCandidate) => {
    setPromotionLoading(true);
    try {
      if (!userId) {
        setError("معرف المستخدم مفقود لتحديد مرشح الترقية.");
        addToast("معرف المستخدم مفقود لتحديد مرشح الترقية.", "error");
        setPromotionLoading(false);
        return;
      }
      await axiosInstance.put(`/profiles/${userId}/promotion`, { isPromotionCandidate: isCandidate });
      addToast(`تم تحديث حالة مرشح الترقية بنجاح.`, "success");
      fetchProfiles();
      if (selectedProfile && selectedProfile.user._id === userId) {
        setSelectedProfile((prev) => ({ ...prev, isPromotionCandidate: isCandidate }));
      }
    } catch (err) {
      setError("فشل في تحديث حالة مرشح الترقية: " + (err.response?.data?.message || err.message));
      addToast("فشل في تحديث حالة مرشح الترقية.", "error");
    } finally {
      setPromotionLoading(false);
    }
  };

  const handleEditProfileClick = (profileData) => {
    setEditProfileFormData({
      ...profileData,
      userId: profileData.user._id,
      startDate: profileData.startDate ? moment(profileData.startDate).format("YYYY-MM-DD") : "",
      skillTags: profileData.skillTags?.join(", ") || "",
    });
    setShowEditProfileModal(true);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setEditProfileLoading(true);
    try {
      const { userId, skillTags, ...dataToUpdate } = editProfileFormData;

      const updatedSkillTags = skillTags ? skillTags.split(",").map(tag => tag.trim()) : [];

      const allowedUpdates = [
        "fullName", "jobTitle", "department", "internalPhone", "email", "startDate",
        "profileImageUrl", "qualification", "skillTags", "isPromotionCandidate"
      ];
      const filteredData = {};
      allowedUpdates.forEach(field => {
        if (dataToUpdate[field] !== undefined) {
          if (field === "qualification") {
            filteredData[field] = dataToUpdate[field];
          } else {
            filteredData[field] = dataToUpdate[field];
          }
        }
      });
      filteredData.skillTags = updatedSkillTags;

      await axiosInstance.put(`/profiles/${userId}`, filteredData);
      addToast("تم تحديث الملف الشخصي بنجاح.", "success");
      setShowEditProfileModal(false);
      fetchProfiles();
      if (selectedProfile && selectedProfile.user._id === userId) {
        handleViewProfile(selectedProfile._id, userId);
      }
    } catch (err) {
      setError("فشل في تحديث الملف الشخصي: " + (err.response?.data?.message || err.message));
      addToast("فشل في تحديث الملف الشخصي.", "error");
    } finally {
      setEditProfileLoading(false);
    }
  };

  const handleGeneratePdf = async (userId) => {
    setPdfLoading(true);
    try {
      if (!userId) {
        setError("معرف المستخدم مفقود لتوليد ملف PDF.");
        addToast("معرف المستخدم مفقود لتوليد ملف PDF.", "error");
        setPdfLoading(false);
        return;
      }
      const response = await axiosInstance.get(`/profiles/${userId}/pdf`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `profile_${selectedProfile.fullName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      addToast("تم توليد ملف PDF بنجاح.", "success");
    } catch (err) {
      setError("فشل في توليد ملف PDF: " + (err.response?.data?.message || err.message));
      addToast("فشل في توليد ملف PDF.", "error");
    } finally {
      setPdfLoading(false);
    }
  };

  const handlePrintProfile = () => {
    window.print();
  };

  const handleCopyProfileLink = () => {
    if (selectedProfile?.user?._id) {
      const profileLink = `${window.location.origin}/profile/${selectedProfile.user._id}`;
      navigator.clipboard.writeText(profileLink)
        .then(() => addToast("تم نسخ رابط الملف الشخصي بنجاح!", "success"))
        .catch(err => {
          console.error("فشل في نسخ الرابط:", err);
          addToast("فشل في نسخ الرابط.", "error");
        });
    } else {
      addToast("لا يوجد ملف شخصي محدد لنسخ الرابط.", "error");
    }
  };

  const handleAutoPromotionCheck = async (userId) => {
    setAutoPromotionCheckLoading(true);
    try {
      if (!userId) {
        setError("معرف المستخدم مفقود للتحقق من الترقية التلقائية.");
        addToast("معرف المستخدم مفقود للتحقق من الترقية التلقائية.", "error");
        setAutoPromotionCheckLoading(false);
        return;
      }
      const response = await axiosInstance.get(`/profiles/${userId}/check-promotion-candidate`);
      const isCandidate = response.data.isPromotionCandidate;
      addToast(`الموظف ${isCandidate ? 'مرشح' : 'غير مرشح'} للترقية التلقائية بناءً على المعايير.`, isCandidate ? "success" : "info");
      if (selectedProfile && selectedProfile.user._id === userId) {
        setSelectedProfile((prev) => ({ ...prev, isPromotionCandidate: isCandidate }));
      }
    } catch (err) {
      setError("فشل في التحقق من الترقية التلقائية: " + (err.response?.data?.message || err.message));
      addToast("فشل في التحقق من الترقية التلقائية.", "error");
    } finally {
      setAutoPromotionCheckLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("selectedDepartment");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const filteredProfiles = useMemo(() => {
    let currentProfiles = profiles;

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentProfiles = currentProfiles.filter(
        (profile) =>
          profile.user?.username?.toLowerCase().includes(lowerCaseSearchTerm) ||
          profile.fullName?.toLowerCase().includes(lowerCaseSearchTerm) ||
          profile.jobTitle?.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    if (filterDepartment) {
      currentProfiles = currentProfiles.filter(
        (profile) => profile.department?.toLowerCase() === filterDepartment.toLowerCase()
      );
    }

    if (filterJobTitle) {
      currentProfiles = currentProfiles.filter(
        (profile) => profile.jobTitle?.toLowerCase() === filterJobTitle.toLowerCase()
      );
    }

    return currentProfiles;
  }, [profiles, searchTerm, filterDepartment, filterJobTitle]);

  const filteredProfileUpdateRequests = useMemo(() => {
    if (!profileRequestSearchTerm) {
      return profileUpdateRequests;
    }
    const lowerCaseSearchTerm = profileRequestSearchTerm.toLowerCase();
    return profileUpdateRequests.filter(
      (request) =>
        request.profile?.fullName?.toLowerCase().includes(lowerCaseSearchTerm) ||
        request.requestedBy?.username?.toLowerCase().includes(lowerCaseSearchTerm) ||
        request.status?.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [profileUpdateRequests, profileRequestSearchTerm]);

  const filteredCourseRequests = useMemo(() => {
    if (!courseRequestSearchTerm) {
      return courseRequests;
    }
    const lowerCaseSearchTerm = courseRequestSearchTerm.toLowerCase();
    return courseRequests.filter(
      (request) =>
        request.profile?.fullName?.toLowerCase().includes(lowerCaseSearchTerm) ||
        request.user?.username?.toLowerCase().includes(lowerCaseSearchTerm) ||
        request.name?.toLowerCase().includes(lowerCaseSearchTerm) ||
        request.status?.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [courseRequests, courseRequestSearchTerm]);

  const filteredDocumentRequests = useMemo(() => {
    if (!documentRequestSearchTerm) {
      return documentRequests;
    }
    const lowerCaseSearchTerm = documentRequestSearchTerm.toLowerCase();
    return documentRequests.filter(
      (request) =>
        request.profile?.fullName?.toLowerCase().includes(lowerCaseSearchTerm) ||
        request.user?.username?.toLowerCase().includes(lowerCaseSearchTerm) ||
        request.name?.toLowerCase().includes(lowerCaseSearchTerm) ||
        request.type?.toLowerCase().includes(lowerCaseSearchTerm) ||
        request.status?.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [documentRequests, documentRequestSearchTerm]);

  const allDepartments = useMemo(() => {
    const departments = new Set(profiles.map(p => p.department).filter(Boolean));
    return ["", ...Array.from(departments).sort()];
  }, [profiles]);

  const allJobTitles = useMemo(() => {
    const jobTitles = new Set(profiles.map(p => p.jobTitle).filter(Boolean));
    return ["", ...Array.from(jobTitles).sort()];
  }, [profiles]);

  const getTimelineEvents = useMemo(() => {
    if (!selectedProfile) return [];

    let events = [];

    if (selectedProfile.startDate) {
      events.push({
        type: 'تعيين',
        date: selectedProfile.startDate,
        description: `تاريخ التعيين في الشركة`,
        icon: '💼'
      });
    }

    selectedProfile.courses.forEach(course => {
      events.push({
        type: 'دورة تدريبية',
        date: course.date,
        description: `${course.name} من ${course.provider} (الحالة: ${course.status})`,
        icon: '📚'
      });
    });

    selectedProfile.documents.forEach(doc => {
      events.push({
        type: 'وثيقة مرفقة',
        date: doc.date,
        description: `${doc.name} (${doc.type}) (الحالة: ${doc.status})`,
        icon: '📄'
      });
    });

    selectedProfile.achievements.forEach(ach => {
      events.push({
        type: 'إنجاز/مهمة',
        date: ach.date,
        description: `${ach.title}: ${ach.description} (الحالة: ${ach.status})`,
        icon: ach.type === 'award' ? '🏆' : ach.type === 'thank_letter' ? '💌' : '✨'
      });
    });

    selectedProfile.evaluations.forEach(evalItem => {
      events.push({
        type: 'تقييم أداء',
        date: evalItem.date,
        description: `تقييم بدرجة ${evalItem.score} - ملاحظات: ${evalItem.notes}`,
        icon: '📊'
      });
    });

    selectedProfile.records.forEach(record => {
      events.push({
        type: 'سجل إداري',
        date: record.date,
        description: `${record.type}: ${record.details} (بواسطة: ${record.signedBy})`,
        icon: record.type === 'reward' ? '⭐' : record.type === 'warning' ? '⚠️' : '📝'
      });
    });

    return events.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [selectedProfile]);

  const totalEmployees = profiles.length;
  const totalPendingRequests = profileUpdateRequests.filter(req => req.status === 'pending').length +
                               courseRequests.filter(req => req.status === 'pending').length +
                               documentRequests.filter(req => req.status === 'pending').length;
  const averageCompletion = profiles.length > 0
    ? (profiles.reduce((sum, p) => sum + (p.completionPercentage || 0), 0) / profiles.length).toFixed(2)
    : 0;

  if (loading && !selectedProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-xl text-gray-700">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-[100]">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`mb-2 p-3 rounded-lg shadow-md text-white flex items-center ${
              toast.type === "success" ? "bg-green-500" :
              toast.type === "error" ? "bg-red-500" :
              "bg-blue-500"
            }`}
            role="alert"
          >
            <span className="ml-2">{toast.message}</span>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="ml-auto text-white font-bold text-lg"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      <div className="min-h-screen bg-white font-sans flex flex-row-reverse" dir="rtl">
        {/* Right Sidebar for Employee List */}
        <div className="w-80 bg-gray-50 border-l border-gray-200 p-4 flex flex-col shadow-inner">
          <h2 className="text-xl font-bold text-gray-800 mb-4">قائمة الموظفين</h2>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="بحث عن موظف..."
              className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredProfiles.length === 0 ? (
              <p className="text-gray-500 text-sm">لا توجد نتائج مطابقة.</p>
            ) : (
              <ul>
                {filteredProfiles.map((profile) => (
                  <li key={profile._id} className="mb-2">
                    <button
                      onClick={() => handleViewProfile(profile._id, profile.user._id)}
                      className={`w-full text-right p-3 rounded-lg flex items-center transition duration-300 ${
                        selectedProfile?._id === profile._id ? "bg-teal-100 text-teal-800 font-semibold" : "bg-white hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <img
                        src={profile.profileImageUrl || "https://placehold.co/40x40/aabbcc/ffffff?text=صورة"}
                        alt={profile.fullName}
                        className="w-10 h-10 rounded-full object-cover ml-3 border border-gray-200"
                      />
                      <div>
                        <p className="font-semibold text-base">{profile.fullName}</p>
                        <p className="text-xs text-gray-500">{profile.jobTitle}</p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Left Content Area for Employee Details (Main View) */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">لوحة تحكم المشرف</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
            >
              تسجيل الخروج
            </button>
          </div>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}

          {/* KPI Cards - Top Layer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between border border-gray-200">
              <div>
                <p className="text-gray-500 text-sm">إجمالي الموظفين</p>
                <h3 className="text-3xl font-bold text-gray-800">{totalEmployees}</h3>
              </div>
              <div className="bg-teal-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h-1.586a1 1 0 01-.707-.293l-3.414-3.414a1 1 0 00-.707-.293H9m0 0a1 1 0 01-.707-.293l-3.414-3.414A1 1 0 003 10V6a1 1 0 011-1h16a1 1 0 011 1v10a1 1 0 01-1 1h-1.586a1 1 0 00-.707.293l-3.414 3.414a1 1 0 01-.707.293zM10 9a1 1 0 100 2 1 1 0 000-2z"></path></svg>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between border border-gray-200">
              <div>
                <p className="text-gray-500 text-sm">إجمالي الطلبات المعلقة</p>
                <h3 className="text-3xl font-bold text-gray-800">{totalPendingRequests}</h3>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 flex items-center justify-between border border-gray-200">
              <div>
                <p className="text-gray-500 text-sm">متوسط اكتمال الملفات</p>
                <h3 className="text-3xl font-bold text-gray-800">{averageCompletion}%</h3>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              </div>
            </div>
          </div>

          {/* Employee 360-Degree View - Main Content Area */}
          {selectedProfile ? (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="text-2xl font-bold text-gray-800">ملف {selectedProfile.fullName}</h3>
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="text-gray-500 hover:text-gray-800 text-3xl font-bold"
                >
                  &times;
                </button>
              </div>

              <div className="mb-6 text-center">
                <img
                  src={selectedProfile.profileImageUrl || "https://placehold.co/150x150/aabbcc/ffffff?text=صورة+الملف"}
                  alt="صورة الملف الشخصي"
                  className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-teal-200 mx-auto mb-4"
                />
                <h4 className="text-xl font-bold text-gray-800">{selectedProfile.fullName}</h4>
                <p className="text-gray-600">{selectedProfile.jobTitle} - {selectedProfile.department}</p>
                <p className="text-gray-600">تاريخ التعيين: {moment(selectedProfile.startDate).format("LL")}</p>
                <p className="text-gray-600">البريد الإلكتروني: {selectedProfile.email}</p>
                <p className="text-gray-600">الهاتف الداخلي: {selectedProfile.internalPhone}</p>
                <p className="text-gray-600">مرشح للترقية: {selectedProfile.isPromotionCandidate ? "نعم" : "لا"}</p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3 justify-center border-b pb-4 mb-4">
                <button
                  onClick={() => setShowAddCourseModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-lg text-sm shadow transition duration-300"
                >
                  إضافة دورة
                </button>
                <button
                  onClick={() => setShowAddDocumentModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-lg text-sm shadow transition duration-300"
                >
                  إضافة مستند
                </button>
                <button
                  onClick={() => setShowAddEvaluationModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-lg text-sm shadow transition duration-300"
                >
                  إضافة تقييم
                </button>
                <button
                  onClick={() => setShowAddRecordModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-lg text-sm shadow transition duration-300"
                >
                  إضافة سجل
                </button>
                <button
                  onClick={() => setShowAddAchievementModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-lg text-sm shadow transition duration-300"
                >
                  إضافة إنجاز
                </button>
                {/* <button
                  onClick={() => handleGeneratePdf(selectedProfile.user._id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-lg text-sm shadow transition duration-300"
                  disabled={pdfLoading}
                >
                  {pdfLoading ? "جاري..." : "تحميل PDF"}
                </button> */}


                <button
                  onClick={() => handleAutoPromotionCheck(selectedProfile.user._id)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-lg text-sm shadow transition duration-300"
                  disabled={autoPromotionCheckLoading}
                >
                  {autoPromotionCheckLoading ? "جاري..." : "تحقق ترقية تلقائية"}
                </button>

                <button
                  onClick={() => handleMarkPromotionCandidate(selectedProfile.user._id, !selectedProfile.isPromotionCandidate)}
                  className={`font-bold py-2 px-3 rounded-lg text-sm bg-emerald-600 hover:bg-emerald-700 text-white`}
                  disabled={promotionLoading}
                >
                  {promotionLoading ? "جاري..." : selectedProfile.isPromotionCandidate ? "إزالة ترشيح ترقية" : "ترشيح لترقية"}
                </button>
              </div>

              {/* Tabs for Profile Details */}
              <div className="mt-6">
                <div className="flex border-b border-gray-200">
                  {["معلومات أساسية", "الخط الزمني", "الدورات التدريبية", "المستندات", "الإنجازات والمهام", "التقييمات", "السجلات الإدارية"].map((tab) => (
                    <button
                      key={tab}
                      className={`py-2 px-4 text-sm font-medium transition-colors duration-300 ${
                        activeTab === tab
                          ? "border-b-2 border-teal-500 text-teal-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  {activeTab === "معلومات أساسية" && (
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-lg mb-2">المؤهل العلمي:</h4>
                        {selectedProfile.qualification ? (
                          <>
                            <p>الدرجة: {selectedProfile.qualification.degree}</p>
                            <p>التخصص: {selectedProfile.qualification.specialization}</p>
                            <p>الجامعة: {selectedProfile.qualification.university}</p>
                            <p>سنة التخرج: {selectedProfile.qualification.graduationYear}</p>
                          </>
                        ) : (
                          <p className="text-gray-500">لا يوجد مؤهل علمي مسجل.</p>
                        )}
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-lg mb-2">المهارات:</h4>
                        {selectedProfile.skillTags && selectedProfile.skillTags.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {selectedProfile.skillTags.map((tag, index) => (
                              <span key={index} className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">لا توجد مهارات مسجلة.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === "الخط الزمني" && (
                    <div className="mt-4">
                      {getTimelineEvents.length > 0 ? (
                        <div className="relative border-r-2 border-gray-200 pr-4">
                          {getTimelineEvents.map((event, index) => (
                            <div key={index} className="mb-8 flex items-start">
                              <div className="absolute -right-3 mt-1.5 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {event.icon}
                              </div>
                              <div className="flex-1 mr-4 p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
                                <div className="font-semibold text-gray-800 text-lg mb-1">{event.type} - {moment(event.date).format("LL")}</div>
                                <p className="text-gray-700">{event.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">لا توجد أحداث في الخط الزمني.</p>
                      )}
                    </div>
                  )}

                  {activeTab === "الدورات التدريبية" && (
                    <div className="mt-4">
                      {selectedProfile.courses && selectedProfile.courses.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                            <thead>
                              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">اسم الدورة</th>
                                <th className="py-3 px-6 text-left">الجهة</th>
                                <th className="py-3 px-6 text-left">التاريخ</th>
                                <th className="py-3 px-6 text-left">الحالة</th>
                                <th className="py-3 px-6 text-center">الملف</th>
                              </tr>
                            </thead>
                            <tbody className="text-gray-700 text-sm font-light">
                              {selectedProfile.courses.map((course) => (
                                <tr key={course._id} className="border-b border-gray-200 hover:bg-gray-50">
                                  <td className="py-3 px-6 text-left">{course.name}</td>
                                  <td className="py-3 px-6 text-left">{course.provider}</td>
                                  <td className="py-3 px-6 text-left">{moment(course.date).format("LL")}</td>
                                  <td className="py-3 px-6 text-left">
                                    <span className={`py-1 px-2 rounded-full text-xs font-semibold ${
                                        course.status === "pending" ? "bg-yellow-200 text-yellow-800" :
                                        course.status === "accepted" ? "bg-green-200 text-green-800" :
                                        "bg-red-200 text-red-800"
                                      }`}
                                    >
                                      {course.status === "pending" ? "قيد الانتظار" : course.status === "accepted" ? "مقبول" : "مرفوض"}
                                    </span>
                                  </td>
                                  <td className="py-3 px-6 text-center">
                                    {course.file && (
                                      <a
                                        href={`${API_BASE_URL}/${course.file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                      >
                                        عرض
                                      </a>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-gray-500">لا توجد دورات تدريبية مسجلة.</p>
                      )}
                    </div>
                  )}

                  {activeTab === "المستندات" && (
                    <div className="mt-4">
                      {selectedProfile.documents && selectedProfile.documents.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                            <thead>
                              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">اسم الوثيقة</th>
                                <th className="py-3 px-6 text-left">النوع</th>
                                <th className="py-3 px-6 text-left">التاريخ</th>
                                <th className="py-3 px-6 text-left">الحالة</th>
                                <th className="py-3 px-6 text-center">الملف</th>
                              </tr>
                            </thead>
                            <tbody className="text-gray-700 text-sm font-light">
                              {selectedProfile.documents.map((doc) => (
                                <tr key={doc._id} className="border-b border-gray-200 hover:bg-gray-50">
                                  <td className="py-3 px-6 text-left">{doc.name}</td>
                                  <td className="py-3 px-6 text-left">{doc.type}</td>
                                  <td className="py-3 px-6 text-left">{moment(doc.date).format("LL")}</td>
                                  <td className="py-3 px-6 text-left">
                                    <span className={`py-1 px-2 rounded-full text-xs font-semibold ${
                                        doc.status === "pending" ? "bg-yellow-200 text-yellow-800" :
                                        doc.status === "accepted" ? "bg-green-200 text-green-800" :
                                        "bg-red-200 text-red-800"
                                      }`}
                                    >
                                      {doc.status === "pending" ? "قيد الانتظار" : doc.status === "accepted" ? "مقبول" : "مرفوض"}
                                    </span>
                                  </td>
                                  <td className="py-3 px-6 text-center">
                                    {doc.file && (
                                      <a
                                        href={`${API_BASE_URL}/${doc.file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline"
                                      >
                                        عرض
                                      </a>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-gray-500">لا توجد وثائق مرفقة.</p>
                      )}
                    </div>
                  )}

                  {activeTab === "الإنجازات والمهام" && (
                    <div className="mt-4">
                      {selectedProfile.achievements && selectedProfile.achievements.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                            <thead>
                              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">العنوان</th>
                                <th className="py-3 px-6 text-left">الوصف</th>
                                <th className="py-3 px-6 text-left">النوع</th>
                                <th className="py-3 px-6 text-left">التاريخ</th>
                                <th className="py-3 px-6 text-left">الحالة</th>
                                <th className="py-3 px-6 text-center">الإجراءات</th>
                              </tr>
                            </thead>
                            <tbody className="text-gray-700 text-sm font-light">
                              {selectedProfile.achievements.map((ach) => (
                                <tr key={ach._id} className="border-b border-gray-200 hover:bg-gray-50">
                                  <td className="py-3 px-6 text-left">{ach.title}</td>
                                  <td className="py-3 px-6 text-left">{ach.description}</td>
                                  <td className="py-3 px-6 text-left">{ach.type}</td>
                                  <td className="py-3 px-6 text-left">{moment(ach.date).format("LL")}</td>
                                  <td className="py-3 px-6 text-left">{ach.status}</td>
                                  <td className="py-3 px-6 text-center">
                                    <button
                                      onClick={() => handleEditAchievementClick(ach)}
                                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-md text-xs mr-2"
                                    >
                                      تعديل
                                    </button>
                                    <button
                                      onClick={() => handleDeleteAchievement(ach._id)}
                                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-xs"
                                    >
                                      حذف
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-gray-500">لا توجد إنجازات أو مهام مسجلة.</p>
                      )}
                    </div>
                  )}

                  {activeTab === "التقييمات" && (
                    <div className="mt-4">
                      {selectedProfile.evaluations && selectedProfile.evaluations.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                            <thead>
                              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">الدرجة</th>
                                <th className="py-3 px-6 text-left">الملاحظات</th>
                                <th className="py-3 px-6 text-left">التاريخ</th>
                                {/* <th className="py-3 px-6 text-left">تم التقييم بواسطة</th> */}
                                <th className="py-3 px-6 text-left">تقييمات المهارات</th>
                              </tr>
                            </thead>
                            <tbody className="text-gray-700 text-sm font-light">
                              {selectedProfile.evaluations.map((evalItem) => (
                                <tr key={evalItem._id} className="border-b border-gray-200 hover:bg-gray-50">
                                  <td className="py-3 px-6 text-left">{evalItem.score}</td>
                                  <td className="py-3 px-6 text-left max-w-xs truncate">{evalItem.notes}</td>
                                  <td className="py-3 px-6 text-left">{moment(evalItem.date).format("LL")}</td>
                                  {/* <td className="py-3 px-6 text-left">{evalItem.evaluatedBy?.username || "غير معروف"}</td> */}
                                  <td className="py-3 px-6 text-left">
                                    {evalItem.skillEvaluations && evalItem.skillEvaluations.length > 0 ? (
                                      <ul>
                                        {evalItem.skillEvaluations.map((skill, idx) => (
                                          <li key={idx}>
                                            {skill.skillName}: {skill.score} ({skill.notes})
                                          </li>
                                        ))}
                                      </ul>
                                    ) : "لا يوجد"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-gray-500">لا توجد تقييمات مسجلة.</p>
                      )}
                    </div>
                  )}

                  {activeTab === "السجلات الإدارية" && (
                    <div className="mt-4">
                      {selectedProfile.records && selectedProfile.records.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                            <thead>
                              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">النوع</th>
                                <th className="py-3 px-6 text-left">التفاصيل</th>
                                <th className="py-3 px-6 text-left">التاريخ</th>
                                <th className="py-3 px-6 text-left">بواسطة</th>
                                <th className="py-3 px-6 text-left">التوقيع</th>
                                <th className="py-3 px-6 text-center">الإجراءات</th>
                              </tr>
                            </thead>
                            <tbody className="text-gray-700 text-sm font-light">
                              {selectedProfile.records.map((record) => (
                                <tr key={record._id} className="border-b border-gray-200 hover:bg-gray-50">
                                  <td className="py-3 px-6 text-left">{record.type}</td>
                                  <td className="py-3 px-6 text-left max-w-xs truncate">{record.details}</td>
                                  <td className="py-3 px-6 text-left">{moment(record.date).format("LL")}</td>
                                  <td className="py-3 px-6 text-left">{record.signedBy}</td>
                                  <td className="py-3 px-6 text-left">
                                    {record.signatureImageUrl ? (
                                      <img src={`${API_BASE_URL}/${record.signatureImageUrl}`} alt="توقيع" className="h-10 w-auto object-contain" />
                                    ) : "لا يوجد"}
                                  </td>
                                  <td className="py-3 px-6 text-center">
                                    <button
                                      onClick={() => handleEditRecordClick(record)}
                                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-md text-xs mr-2"
                                    >
                                      تعديل
                                    </button>
                                    <button
                                      onClick={() => handleDeleteRecord(record._id)}
                                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-xs"
                                    >
                                      حذف
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-gray-500">لا توجد سجلات إدارية.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Update Requests Section */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div
                  className="flex justify-between items-center cursor-pointer pb-4 border-b border-gray-200 mb-4"
                  onClick={() => setExpandedSection(expandedSection === 'profileRequests' ? null : 'profileRequests')}
                >
                  <h2 className="text-2xl font-semibold text-gray-700">طلبات تحديث الملفات الشخصية ({profileUpdateRequests.filter(req => req.status === 'pending').length})</h2>
                  <svg className={`w-6 h-6 text-gray-600 transform transition-transform duration-300 ${expandedSection === 'profileRequests' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                {expandedSection === 'profileRequests' && (
                  <>
                    <div className="mb-4 relative">
                      <input
                        type="text"
                        placeholder="بحث باسم الموظف / الحالة..."
                        className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
                        value={profileRequestSearchTerm}
                        onChange={(e) => setProfileRequestSearchTerm(e.target.value)}
                      />
                      <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    {filteredProfileUpdateRequests.length === 0 ? (
                      <p className="text-gray-500">لا توجد طلبات تحديث معلقة حالياً.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                          <thead>
                            <tr className="bg-gray-100 text-gray-600 uppercase text-xs leading-normal">
                              <th className="py-2 px-4 text-left">الموظف</th>
                              <th className="py-2 px-4 text-left">الحالة</th>
                              <th className="py-2 px-4 text-center">الإجراءات</th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-700 text-sm font-light">
                            {filteredProfileUpdateRequests.map((request) => (
                              <tr key={request._id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-2 px-4 text-left whitespace-nowrap">
                                  {request.profile?.fullName || request.requestedBy?.username || "غير معروف"}
                                </td>
                                <td className="py-2 px-4 text-left">
                                  <span
                                    className={`py-1 px-2 rounded-full text-xs font-semibold ${
                                      request.status === "pending" ? "bg-yellow-200 text-yellow-800" :
                                      request.status === "approved" ? "bg-green-200 text-green-800" :
                                      "bg-red-200 text-red-800"
                                    }`}
                                  >
                                    {request.status === "pending" ? "قيد الانتظار" : request.status === "approved" ? "تمت الموافقة" : "مرفوض"}
                                  </span>
                                </td>
                                <td className="py-2 px-4 text-center">
                                  {request.status === "pending" && (
                                    <>
                                      <button
                                        onClick={() => handleReviewRequest(request._id, "approved", request.profile?.user || request.requestedBy._id)}
                                        className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded-md text-xs mr-1"
                                        disabled={reviewLoading}
                                      >
                                        {reviewLoading ? "..." : "قبول"}
                                      </button>
                                      <button
                                        onClick={() => handleReviewRequest(request._id, "rejected", request.profile?.user || request.requestedBy._id)}
                                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded-md text-xs"
                                        disabled={reviewLoading}
                                      >
                                        {reviewLoading ? "..." : "رفض"}
                                      </button>
                                    </>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Course Requests Section */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div
                  className="flex justify-between items-center cursor-pointer pb-4 border-b border-gray-200 mb-4"
                  onClick={() => setExpandedSection(expandedSection === 'courseRequests' ? null : 'courseRequests')}
                >
                  <h2 className="text-2xl font-semibold text-gray-700">طلبات الدورات التدريبية ({courseRequests.filter(req => req.status === 'pending').length})</h2>
                  <svg className={`w-6 h-6 text-gray-600 transform transition-transform duration-300 ${expandedSection === 'courseRequests' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                {expandedSection === 'courseRequests' && (
                  <>
                    <div className="mb-4 relative">
                      <input
                        type="text"
                        placeholder="بحث باسم الموظف / الدورة / الحالة..."
                        className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
                        value={courseRequestSearchTerm}
                        onChange={(e) => setCourseRequestSearchTerm(e.target.value)}
                      />
                      <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    {filteredCourseRequests.length === 0 ? (
                      <p className="text-gray-500">لا توجد طلبات دورات معلقة حالياً.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                          <thead>
                            <tr className="bg-gray-100 text-gray-600 uppercase text-xs leading-normal">
                              <th className="py-2 px-4 text-left">الموظف</th>
                              <th className="py-2 px-4 text-left">الدورة</th>
                              <th className="py-2 px-4 text-left">الحالة</th>
                              <th className="py-2 px-4 text-center">الإجراءات</th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-700 text-sm font-light">
                            {filteredCourseRequests.map((request) => (
                              <tr key={request._id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-2 px-4 text-left whitespace-nowrap">
                                  {request.profile?.fullName || request.user?.username || "غير معروف"}
                                </td>
                                <td className="py-2 px-4 text-left">{request.name}</td>
                                <td className="py-2 px-4 text-left">
                                  <span
                                    className={`py-1 px-2 rounded-full text-xs font-semibold ${
                                      request.status === "pending" ? "bg-yellow-200 text-yellow-800" :
                                      request.status === "accepted" ? "bg-green-200 text-green-800" :
                                      "bg-red-200 text-red-800"
                                    }`}
                                  >
                                    {request.status === "pending" ? "قيد الانتظار" : request.status === "accepted" ? "مقبول" : "مرفوض"}
                                  </span>
                                </td>
                                <td className="py-2 px-4 text-center">
                                  {request.status === "pending" && (
                                    <>
                                      <button
                                        onClick={() => handleApproveCourse(request.user._id, request._id, "accepted")}
                                        className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded-md text-xs mr-1"
                                        disabled={reviewLoading}
                                      >
                                        {reviewLoading ? "..." : "قبول"}
                                      </button>
                                      <button
                                        onClick={() => handleApproveCourse(request.user._id, request._id, "rejected")}
                                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded-md text-xs"
                                        disabled={reviewLoading}
                                      >
                                        {reviewLoading ? "..." : "رفض"}
                                      </button>
                                    </>
                                  )}
                                  {request.file && (
                                    <a
                                      href={`${API_BASE_URL}/${request.file}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md text-xs ml-2"
                                    >
                                      عرض الملف
                                    </a>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Document Requests Section */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <div
                  className="flex justify-between items-center cursor-pointer pb-4 border-b border-gray-200 mb-4"
                  onClick={() => setExpandedSection(expandedSection === 'documentRequests' ? null : 'documentRequests')}
                >
                  <h2 className="text-2xl font-semibold text-gray-700">طلبات المستندات ({documentRequests.filter(req => req.status === 'pending').length})</h2>
                  <svg className={`w-6 h-6 text-gray-600 transform transition-transform duration-300 ${expandedSection === 'documentRequests' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
                {expandedSection === 'documentRequests' && (
                  <>
                    <div className="mb-4 relative">
                      <input
                        type="text"
                        placeholder="بحث باسم الموظف / المستند / النوع / الحالة..."
                        className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
                        value={documentRequestSearchTerm}
                        onChange={(e) => setDocumentRequestSearchTerm(e.target.value)}
                      />
                      <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    {filteredDocumentRequests.length === 0 ? (
                      <p className="text-gray-500">لا توجد طلبات مستندات معلقة حالياً.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                          <thead>
                            <tr className="bg-gray-100 text-gray-600 uppercase text-xs leading-normal">
                              <th className="py-2 px-4 text-left">الموظف</th>
                              <th className="py-2 px-4 text-left">المستند</th>
                              <th className="py-2 px-4 text-left">النوع</th>
                              <th className="py-2 px-4 text-center">الإجراءات</th>
                            </tr>
                          </thead>
                          <tbody className="text-gray-700 text-sm font-light">
                            {filteredDocumentRequests.map((request) => (
                              <tr key={request._id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-2 px-4 text-left whitespace-nowrap">
                                  {request.profile?.fullName || request.user?.username || "غير معروف"}
                                </td>
                                <td className="py-2 px-4 text-left">{request.name}</td>
                                <td className="py-2 px-4 text-left">{request.type}</td>
                                <td className="py-2 px-4 text-center">
                                  {request.status === "pending" && (
                                    <>
                                      <button
                                        onClick={() => handleApproveDocument(request.user._id, request._id, "accepted")}
                                        className="bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded-md text-xs mr-1"
                                        disabled={reviewLoading}
                                      >
                                        {reviewLoading ? "..." : "قبول"}
                                      </button>
                                      <button
                                        onClick={() => handleApproveDocument(request.user._id, request._id, "rejected")}
                                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded-md text-xs"
                                        disabled={reviewLoading}
                                      >
                                        {reviewLoading ? "..." : "رفض"}
                                      </button>
                                    </>
                                  )}
                                  {request.file && (
                                    <a
                                      href={`${API_BASE_URL}/${request.file}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md text-xs ml-2"
                                    >
                                      عرض الملف
                                    </a>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {showAddCourseModal && selectedProfile && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md" dir="rtl">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-bold text-gray-800">إضافة دورة تدريبية لـ {selectedProfile.fullName}</h3>
              <button
                onClick={() => setShowAddCourseModal(false)}
                className="text-gray-500 hover:text-gray-800 text-3xl font-bold"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddCourse} className="space-y-4">
              <div>
                <label htmlFor="courseName" className="block text-gray-700 text-sm font-bold mb-2">اسم الدورة:</label>
                <input
                  type="text"
                  id="courseName"
                  name="name"
                  value={courseFormData.name}
                  onChange={(e) => setCourseFormData({ ...courseFormData, name: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label htmlFor="courseProvider" className="block text-gray-700 text-sm font-bold mb-2">الجهة المانحة:</label>
                <input
                  type="text"
                  id="courseProvider"
                  name="provider"
                  value={courseFormData.provider}
                  onChange={(e) => setCourseFormData({ ...courseFormData, provider: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label htmlFor="courseDate" className="block text-gray-700 text-sm font-bold mb-2">تاريخ الدورة:</label>
                <input
                  type="date"
                  id="courseDate"
                  name="date"
                  value={courseFormData.date}
                  onChange={(e) => setCourseFormData({ ...courseFormData, date: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label htmlFor="courseExpiryDate" className="block text-gray-700 text-sm font-bold mb-2">تاريخ انتهاء صلاحية الدورة (اختياري):</label>
                <input
                  type="date"
                  id="courseExpiryDate"
                  name="expiryDate"
                  value={courseFormData.expiryDate}
                  onChange={(e) => setCourseFormData({ ...courseFormData, expiryDate: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label htmlFor="courseFile" className="block text-gray-700 text-sm font-bold mb-2">ملف الدورة (PDF/Image):</label>
                <input
                  type="file"
                  id="courseFile"
                  name="file"
                  onChange={(e) => setCourseFormData({ ...courseFormData, file: e.target.files[0] })}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                />
              </div>
              <button
                type="submit"
                disabled={courseLoading}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {courseLoading ? "جاري الإضافة..." : "إضافة دورة"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showAddDocumentModal && selectedProfile && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md" dir="rtl">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-bold text-gray-800">إضافة مستند لـ {selectedProfile.fullName}</h3>
              <button
                onClick={() => setShowAddDocumentModal(false)}
                className="text-gray-500 hover:text-gray-800 text-3xl font-bold"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddDocument} className="space-y-4">
              <div>
                <label htmlFor="docName" className="block text-gray-700 text-sm font-bold mb-2">اسم المستند:</label>
                <input
                  type="text"
                  id="docName"
                  name="name"
                  value={documentFormData.name}
                  onChange={(e) => setDocumentFormData({ ...documentFormData, name: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label htmlFor="docType" className="block text-gray-700 text-sm font-bold mb-2">نوع المستند:</label>
                <input
                  type="text"
                  id="docType"
                  name="type"
                  value={documentFormData.type}
                  onChange={(e) => setDocumentFormData({ ...documentFormData, type: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label htmlFor="docDate" className="block text-gray-700 text-sm font-bold mb-2">تاريخ المستند:</label>
                <input
                  type="date"
                  id="docDate"
                  name="date"
                  value={documentFormData.date}
                  onChange={(e) => setDocumentFormData({ ...documentFormData, date: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label htmlFor="docExpiryDate" className="block text-gray-700 text-sm font-bold mb-2">تاريخ انتهاء صلاحية المستند (اختياري):</label>
                <input
                  type="date"
                  id="docExpiryDate"
                  name="expiryDate"
                  value={documentFormData.expiryDate}
                  onChange={(e) => setDocumentFormData({ ...documentFormData, expiryDate: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label htmlFor="docFile" className="block w-full text-sm text-gray-700 font-bold mb-2">ملف المستند (PDF/Image):</label>
                <input
                  type="file"
                  id="docFile"
                  name="file"
                  onChange={(e) => setDocumentFormData({ ...documentFormData, file: e.target.files[0] })}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                />
              </div>
              <button
                type="submit"
                disabled={documentLoading}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {documentLoading ? "جاري الإضافة..." : "إضافة مستند"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showAddEvaluationModal && selectedProfile && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-bold text-gray-800">إضافة تقييم لـ {selectedProfile.fullName}</h3>
              <button
                onClick={() => setShowAddEvaluationModal(false)}
                className="text-gray-500 hover:text-gray-800 text-3xl font-bold"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddEvaluation} className="space-y-4">
              <div>
                <label htmlFor="evalScore" className="block text-gray-700 text-sm font-bold mb-2">الدرجة (من 0-100):</label>
                <input
                  type="number"
                  id="evalScore"
                  name="score"
                  value={evaluationFormData.score}
                  onChange={(e) => setEvaluationFormData({ ...evaluationFormData, score: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  min="0"
                  max="100"
                  required
                />
              </div>
              <div>
                <label htmlFor="evalNotes" className="block text-gray-700 text-sm font-bold mb-2">ملاحظات عامة:</label>
                <textarea
                  id="evalNotes"
                  name="notes"
                  value={evaluationFormData.notes}
                  onChange={(e) => setEvaluationFormData({ ...evaluationFormData, notes: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="3"
                ></textarea>
              </div>

              <h4 className="text-lg font-semibold text-gray-700 mb-2">تقييمات المهارات:</h4>
              {evaluationFormData.skillEvaluations.map((skill, index) => (
                <div key={index} className="flex gap-2 mb-2 p-3 border rounded-lg bg-gray-50 items-end">
                  <div className="flex-1">
                    <label htmlFor={`skillName-${index}`} className="block text-gray-700 text-xs font-bold mb-1">اسم المهارة:</label>
                    <input
                      type="text"
                      id={`skillName-${index}`}
                      value={skill.skillName}
                      onChange={(e) => handleSkillEvaluationChange(index, "skillName", e.target.value)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                      placeholder="مثال: التواصل"
                    />
                  </div>
                  <div className="w-24">
                    <label htmlFor={`skillScore-${index}`} className="block text-gray-700 text-xs font-bold mb-1">الدرجة:</label>
                    <input
                      type="number"
                      id={`skillScore-${index}`}
                      value={skill.score}
                      onChange={(e) => handleSkillEvaluationChange(index, "score", e.target.value)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                      min="0"
                      max="100"
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor={`skillNotes-${index}`} className="block text-gray-700 text-xs font-bold mb-1">ملاحظات المهارة:</label>
                    <input
                      type="text"
                      id={`skillNotes-${index}`}
                      value={skill.notes}
                      onChange={(e) => handleSkillEvaluationChange(index, "notes", e.target.value)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                      placeholder="ملاحظات حول هذه المهارة"
                    />
                  </div>
                  <button type="button" onClick={() => removeSkillEvaluationField(index)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md text-sm h-10 w-10 flex items-center justify-center">
                    &times;
                  </button>
                </div>
              ))}
              <button type="button" onClick={addSkillEvaluationField} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow transition duration-300">
                إضافة مهارة أخرى
              </button>

              <button
                type="submit"
                disabled={evaluationLoading}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {evaluationLoading ? "جاري الإضافة..." : "إضافة تقييم"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showAddRecordModal && selectedProfile && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md" dir="rtl">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-bold text-gray-800">إضافة سجل إداري لـ {selectedProfile.fullName}</h3>
              <button
                onClick={() => setShowAddRecordModal(false)}
                className="text-gray-500 hover:text-gray-800 text-3xl font-bold"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddRecord} className="space-y-4">
              <div>
                <label htmlFor="recordType" className="block text-gray-700 text-sm font-bold mb-2">نوع السجل:</label>
                <select
                  id="recordType"
                  name="type"
                  value={recordFormData.type}
                  onChange={(e) => setRecordFormData({ ...recordFormData, type: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="reward">مكافأة</option>
                  <option value="warning">إنذار</option>
                  <option value="transfer">نقل</option>
                  <option value="promotion">ترقية</option>
                </select>
              </div>
              <div>
                <label htmlFor="recordDetails" className="block text-gray-700 text-sm font-bold mb-2">التفاصيل:</label>
                <textarea
                  id="recordDetails"
                  name="details"
                  value={recordFormData.details}
                  onChange={(e) => setRecordFormData({ ...recordFormData, details: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div>
                <label htmlFor="recordDate" className="block text-gray-700 text-sm font-bold mb-2">التاريخ:</label>
                <input
                  type="date"
                  id="recordDate"
                  name="date"
                  value={recordFormData.date}
                  onChange={(e) => setRecordFormData({ ...recordFormData, date: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label htmlFor="recordSignedBy" className="block text-gray-700 text-sm font-bold mb-2">تم التوقيع بواسطة:</label>
                <input
                  type="text"
                  id="recordSignedBy"
                  name="signedBy"
                  value={recordFormData.signedBy}
                  onChange={(e) => setRecordFormData({ ...recordFormData, signedBy: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label htmlFor="signatureImageUrl" className="block text-gray-700 text-sm font-bold mb-2">رابط صورة التوقيع (اختياري):</label>
                <input
                  type="text"
                  id="signatureImageUrl"
                  name="signatureImageUrl"
                  value={recordFormData.signatureImageUrl}
                  onChange={(e) => setRecordFormData({ ...recordFormData, signatureImageUrl: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <button
                type="submit"
                disabled={recordLoading}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {recordLoading ? "جاري الإضافة..." : "إضافة سجل"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showAddAchievementModal && selectedProfile && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md" dir="rtl">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-bold text-gray-800">إضافة إنجاز/مهمة لـ {selectedProfile.fullName}</h3>
              <button
                onClick={() => setShowAddAchievementModal(false)}
                className="text-gray-500 hover:text-gray-800 text-3xl font-bold"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddAchievement} className="space-y-4">
              <div>
                <label htmlFor="achievementTitle" className="block text-gray-700 text-sm font-bold mb-2">العنوان:</label>
                <input
                  type="text"
                  id="achievementTitle"
                  name="title"
                  value={achievementFormData.title}
                  onChange={(e) => setAchievementFormData({ ...achievementFormData, title: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label htmlFor="achievementDescription" className="block text-gray-700 text-sm font-bold mb-2">الوصف:</label>
                <textarea
                  id="achievementDescription"
                  name="description"
                  value={achievementFormData.description}
                  onChange={(e) => setAchievementFormData({ ...achievementFormData, description: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="3"
                ></textarea>
              </div>
              <div>
                <label htmlFor="achievementType" className="block text-gray-700 text-sm font-bold mb-2">النوع:</label>
                <select
                  id="achievementType"
                  name="type"
                  value={achievementFormData.type}
                  onChange={(e) => setAchievementFormData({ ...achievementFormData, type: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="task">مهمة</option>
                  <option value="award">جائزة</option>
                  <option value="thank_letter">خطاب شكر</option>
                  <option value="other">أخرى</option>
                </select>
              </div>
              <div>
                <label htmlFor="achievementDate" className="block text-gray-700 text-sm font-bold mb-2">التاريخ:</label>
                <input
                  type="date"
                  id="achievementDate"
                  name="date"
                  value={achievementFormData.date}
                  onChange={(e) => setAchievementFormData({ ...achievementFormData, date: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label htmlFor="achievementStatus" className="block text-gray-700 text-sm font-bold mb-2">الحالة:</label>
                <select
                  id="achievementStatus"
                  name="status"
                  value={achievementFormData.status}
                  onChange={(e) => setAchievementFormData({ ...achievementFormData, status: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="pending">قيد الانتظار</option>
                  <option value="completed">مكتملة</option>
                  <option value="in_progress">قيد التقدم</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={achievementLoading}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {achievementLoading ? "جاري الإضافة..." : "إضافة إنجاز/مهمة"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showEditAchievementModal && selectedProfile && editAchievementFormData && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md" dir="rtl">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-bold text-gray-800">تعديل إنجاز/مهمة لـ {selectedProfile.fullName}</h3>
              <button
                onClick={() => setShowEditAchievementModal(false)}
                className="text-gray-500 hover:text-gray-800 text-3xl font-bold"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleUpdateAchievement} className="space-y-4">
              <div>
                <label htmlFor="editAchievementTitle" className="block text-gray-700 text-sm font-bold mb-2">العنوان:</label>
                <input
                  type="text"
                  id="editAchievementTitle"
                  name="title"
                  value={editAchievementFormData.title || ""}
                  onChange={(e) => setEditAchievementFormData({ ...editAchievementFormData, title: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label htmlFor="editAchievementDescription" className="block text-gray-700 text-sm font-bold mb-2">الوصف:</label>
                <textarea
                  id="editAchievementDescription"
                  name="description"
                  value={editAchievementFormData.description || ""}
                  onChange={(e) => setEditAchievementFormData({ ...editAchievementFormData, description: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="3"
                ></textarea>
              </div>
              <div>
                <label htmlFor="editAchievementType" className="block text-gray-700 text-sm font-bold mb-2">النوع:</label>
                <select
                  id="editAchievementType"
                  name="type"
                  value={editAchievementFormData.type || ""}
                  onChange={(e) => setEditAchievementFormData({ ...editAchievementFormData, type: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="task">مهمة</option>
                  <option value="award">جائزة</option>
                  <option value="thank_letter">خطاب شكر</option>
                  <option value="other">أخرى</option>
                </select>
              </div>
              <div>
                <label htmlFor="editAchievementDate" className="block text-gray-700 text-sm font-bold mb-2">التاريخ:</label>
                <input
                  type="date"
                  id="editAchievementDate"
                  name="date"
                  value={editAchievementFormData.date || ""}
                  onChange={(e) => setEditAchievementFormData({ ...editAchievementFormData, date: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label htmlFor="editAchievementStatus" className="block text-gray-700 text-sm font-bold mb-2">الحالة:</label>
                <select
                  id="editAchievementStatus"
                  name="status"
                  value={editAchievementFormData.status || ""}
                  onChange={(e) => setEditAchievementFormData({ ...editAchievementFormData, status: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="pending">قيد الانتظار</option>
                  <option value="completed">مكتملة</option>
                  <option value="in_progress">قيد التقدم</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={achievementLoading}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {achievementLoading ? "جاري التحديث..." : "حفظ التعديلات"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showEditRecordModal && selectedProfile && editRecordFormData && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md" dir="rtl">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-bold text-gray-800">تعديل سجل إداري لـ {selectedProfile.fullName}</h3>
              <button
                onClick={() => setShowEditRecordModal(false)}
                className="text-gray-500 hover:text-gray-800 text-3xl font-bold"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleUpdateRecord} className="space-y-4">
              <div>
                <label htmlFor="editRecordType" className="block text-gray-700 text-sm font-bold mb-2">نوع السجل:</label>
                <select
                  id="editRecordType"
                  name="type"
                  value={editRecordFormData.type || ""}
                  onChange={(e) => setEditRecordFormData({ ...editRecordFormData, type: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="reward">مكافأة</option>
                  <option value="warning">إنذار</option>
                  <option value="transfer">نقل</option>
                  <option value="promotion">ترقية</option>
                </select>
              </div>
              <div>
                <label htmlFor="editRecordDetails" className="block text-gray-700 text-sm font-bold mb-2">التفاصيل:</label>
                <textarea
                  id="editRecordDetails"
                  name="details"
                  value={editRecordFormData.details || ""}
                  onChange={(e) => setEditRecordFormData({ ...editRecordFormData, details: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div>
                <label htmlFor="editRecordDate" className="block text-gray-700 text-sm font-bold mb-2">التاريخ:</label>
                <input
                  type="date"
                  id="editRecordDate"
                  name="date"
                  value={editRecordFormData.date || ""}
                  onChange={(e) => setEditRecordFormData({ ...editRecordFormData, date: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label htmlFor="editRecordSignedBy" className="block text-gray-700 text-sm font-bold mb-2">تم التوقيع بواسطة:</label>
                <input
                  type="text"
                  id="editRecordSignedBy"
                  name="signedBy"
                  value={editRecordFormData.signedBy || ""}
                  onChange={(e) => setEditRecordFormData({ ...editRecordFormData, signedBy: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label htmlFor="editSignatureImageUrl" className="block text-gray-700 text-sm font-bold mb-2">رابط صورة التوقيع (اختياري):</label>
                <input
                  type="text"
                  id="editSignatureImageUrl"
                  name="signatureImageUrl"
                  value={editRecordFormData.signatureImageUrl || ""}
                  onChange={(e) => setEditRecordFormData({ ...editRecordFormData, signatureImageUrl: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <button
                type="submit"
                disabled={recordLoading}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {recordLoading ? "جاري التحديث..." : "حفظ التعديلات"}
              </button>
            </form>
          </div>
        </div>
      )}

      {showEditProfileModal && editProfileFormData && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-2xl font-bold text-gray-800">تعديل ملف {editProfileFormData.fullName || "الموظف"}</h3>
              <button
                onClick={() => setShowEditProfileModal(false)}
                className="text-gray-500 hover:text-gray-800 text-3xl font-bold"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="editFullName" className="block text-gray-700 text-sm font-bold mb-2">الاسم الكامل:</label>
                <input
                  type="text"
                  id="editFullName"
                  name="fullName"
                  value={editProfileFormData.fullName || ""}
                  onChange={(e) => setEditProfileFormData({ ...editProfileFormData, fullName: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label htmlFor="editJobTitle" className="block text-gray-700 text-sm font-bold mb-2">المسمى الوظيفي:</label>
                <input
                  type="text"
                  id="editJobTitle"
                  name="jobTitle"
                  value={editProfileFormData.jobTitle || ""}
                  onChange={(e) => setEditProfileFormData({ ...editProfileFormData, jobTitle: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label htmlFor="editDepartment" className="block text-gray-700 text-sm font-bold mb-2">القسم:</label>
                <input
                  type="text"
                  id="editDepartment"
                  name="department"
                  value={editProfileFormData.department || ""}
                  onChange={(e) => setEditProfileFormData({ ...editProfileFormData, department: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label htmlFor="editInternalPhone" className="block text-gray-700 text-sm font-bold mb-2">رقم الهاتف الداخلي:</label>
                <input
                  type="text"
                  id="editInternalPhone"
                  name="internalPhone"
                  value={editProfileFormData.internalPhone || ""}
                  onChange={(e) => setEditProfileFormData({ ...editProfileFormData, internalPhone: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label htmlFor="editEmail" className="block text-gray-700 text-sm font-bold mb-2">البريد الإلكتروني:</label>
                <input
                  type="email"
                  id="editEmail"
                  name="email"
                  value={editProfileFormData.email || ""}
                  onChange={(e) => setEditProfileFormData({ ...editProfileFormData, email: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label htmlFor="editStartDate" className="block text-gray-700 text-sm font-bold mb-2">تاريخ بدء العمل:</label>
                <input
                  type="date"
                  id="editStartDate"
                  name="startDate"
                  value={editProfileFormData.startDate || ""}
                  onChange={(e) => setEditProfileFormData({ ...editProfileFormData, startDate: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div>
                <label htmlFor="editProfileImageUrl" className="block text-gray-700 text-sm font-bold mb-2">رابط صورة الملف الشخصي:</label>
                <input
                  type="text"
                  id="editProfileImageUrl"
                  name="profileImageUrl"
                  value={editProfileFormData.profileImageUrl || ""}
                  onChange={(e) => setEditProfileFormData({ ...editProfileFormData, profileImageUrl: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="md:col-span-2 border-t pt-4 mt-4">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">المؤهل العلمي:</h4>
                <div>
                  <label htmlFor="qualificationDegree" className="block text-gray-700 text-sm font-bold mb-2">الدرجة:</label>
                  <input
                    type="text"
                    id="qualificationDegree"
                    name="qualification.degree"
                    value={editProfileFormData.qualification?.degree || ""}
                    onChange={(e) => setEditProfileFormData({ ...editProfileFormData, qualification: { ...editProfileFormData.qualification, degree: e.target.value } })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div>
                  <label htmlFor="qualificationSpecialization" className="block text-gray-700 text-sm font-bold mb-2">التخصص:</label>
                  <input
                    type="text"
                    id="qualificationSpecialization"
                    name="qualification.specialization"
                    value={editProfileFormData.qualification?.specialization || ""}
                    onChange={(e) => setEditProfileFormData({ ...editProfileFormData, qualification: { ...editProfileFormData.qualification, specialization: e.target.value } })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div>
                  <label htmlFor="qualificationUniversity" className="block text-gray-700 text-sm font-bold mb-2">الجامعة:</label>
                  <input
                    type="text"
                    id="qualificationUniversity"
                    name="qualification.university"
                    value={editProfileFormData.qualification?.university || ""}
                    onChange={(e) => setEditProfileFormData({ ...editProfileFormData, qualification: { ...editProfileFormData.qualification, university: e.target.value } })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div>
                  <label htmlFor="qualificationYear" className="block text-gray-700 text-sm font-bold mb-2">سنة التخرج:</label>
                  <input
                    type="number"
                    id="qualificationYear"
                    name="qualification.graduationYear"
                    value={editProfileFormData.qualification?.graduationYear || ""}
                    onChange={(e) => setEditProfileFormData({ ...editProfileFormData, qualification: { ...editProfileFormData.qualification, graduationYear: e.target.value } })}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </div>

              <div className="md:col-span-2 border-t pt-4 mt-4">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">المهارات (افصل بينها بفاصلة):</h4>
                <input
                  type="text"
                  id="editSkillTags"
                  name="skillTags"
                  value={editProfileFormData.skillTags || ""}
                  onChange={(e) => setEditProfileFormData({ ...editProfileFormData, skillTags: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="مثال: قيادة, تواصل, حل المشكلات"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={editProfileLoading}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editProfileLoading ? "جاري التحديث..." : "حفظ التعديلات"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SupervisorDashboard;
