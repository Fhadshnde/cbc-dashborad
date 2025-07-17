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
  const [showProfileModal, setShowProfileModal] = useState(false);
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
    type: "other", // تم التعديل ليتوافق مع الـ enum في المخطط
    date: "",
    status: "pending", // تم التعديل ليتوافق مع الـ enum في المخطط
  });
  const [showEditAchievementModal, setShowEditAchievementModal] = useState(false);
  const [editAchievementFormData, setEditAchievementFormData] = useState({});

  const [showEditRecordModal, setShowEditRecordModal] = useState(false);
  const [editRecordFormData, setEditRecordFormData] = useState({});

  const [searchTerm, setSearchTerm] = useState("");
  const [profileRequestSearchTerm, setProfileRequestSearchTerm] = useState("");
  const [courseRequestSearchTerm, setCourseRequestSearchTerm] = useState("");
  const [documentRequestSearchTerm, setDocumentRequestSearchTerm] = useState("");

  const [openProfileDropdownId, setOpenProfileDropdownId] = useState(null);
  const [openRequestDropdownId, setOpenRequestDropdownId] = useState(null);
  const [openAchievementDropdownId, setOpenAchievementDropdownId] = useState(null);
  const [openRecordDropdownId, setOpenRecordDropdownId] = useState(null);
  const [openCourseDocumentDropdownId, setOpenCourseDocumentDropdownId] = useState(null);


  const navigate = useNavigate();

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
          // Defensive check for profile.user and profile.user._id
          if (!profile.user || !profile.user._id) {
            console.warn("Profile missing user ID:", profile);
            return { ...profile, completionPercentage: null };
          }
          const completionRes = await axiosInstance.get(`/profiles/${profile.user._id}/completion`);
          return { ...profile, completionPercentage: completionRes.data.completionPercentage };
        } catch (compErr) {
          console.error(`Failed to fetch completion percentage for ${profile.fullName}:`, compErr.response?.data || compErr.message);
          return { ...profile, completionPercentage: null };
        }
      }));
      setProfiles(profilesWithCompletion);
    } catch (err) {
      setError("Failed to fetch profiles: " + (err.response?.data?.message || err.message));
      console.error("Error fetching profiles:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [axiosInstance]);

  const fetchProfileUpdateRequests = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/profiles/requests/all");
      setProfileUpdateRequests(response.data);
    } catch (err) {
      setError("Failed to fetch profile update requests: " + (err.response?.data?.message || err.message));
      console.error("Error fetching profile update requests:", err.response?.data || err.message);
    }
  }, [axiosInstance]);

  const fetchCourseRequests = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/profiles/courses/requests/all");
      setCourseRequests(response.data);
    } catch (err) {
      setError("Failed to fetch course requests: " + (err.response?.data?.message || err.message));
      console.error("Error fetching course requests:", err.response?.data || err.message);
    }
  } , [axiosInstance]);

  const fetchDocumentRequests = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/profiles/documents/requests/all");
      setDocumentRequests(response.data);
    } catch (err) {
      setError("Failed to fetch document requests: " + (err.response?.data?.message || err.message));
      console.error("Error fetching document requests:", err.response?.data || err.message);
    }
  }, [axiosInstance]);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openProfileDropdownId && !event.target.closest('.profile-dropdown-container')) {
        setOpenProfileDropdownId(null);
      }
      if (openRequestDropdownId && !event.target.closest('.request-dropdown-container')) {
        setOpenRequestDropdownId(null);
      }
      if (openAchievementDropdownId && !event.target.closest('.achievement-dropdown-container')) {
        setOpenAchievementDropdownId(null);
      }
      if (openRecordDropdownId && !event.target.closest('.record-dropdown-container')) {
        setOpenRecordDropdownId(null);
      }
      if (openCourseDocumentDropdownId && !event.target.closest('.course-document-dropdown-container')) {
        setOpenCourseDocumentDropdownId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openProfileDropdownId, openRequestDropdownId, openAchievementDropdownId, openRecordDropdownId, openCourseDocumentDropdownId]);

  const handleViewProfile = async (profileId, userId) => {
    setError("");
    try {
      if (!userId) {
        setError("User ID is missing for viewing profile.");
        console.error("User ID is missing for handleViewProfile.");
        return;
      }
      const response = await axiosInstance.get(`/profiles/${userId}`);
      setSelectedProfile(response.data);
      setShowProfileModal(true);
    } catch (err) {
      setError("Failed to fetch profile details: " + (err.response?.data?.message || err.message));
      console.error("Error fetching profile details:", err.response?.data || err.message);
    }
  };

  const handleReviewRequest = async (requestId, status, userId) => {
    setReviewLoading(true);
    try {
      if (!userId) {
        setError("User ID is missing for reviewing request.");
        console.error("User ID is missing for handleReviewRequest.");
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
      }
      alert(`Request ${status === 'approved' ? 'approved' : 'rejected'} successfully.`);
    } catch (err) {
      setError("Failed to review request: " + (err.response?.data?.message || err.message));
      console.error("Error reviewing request:", err.response?.data || err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    setCourseLoading(true);

    if (!selectedProfile?.user?._id) {
      setError("User ID is not available for adding course.");
      console.error("User ID is not available for handleAddCourse.");
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
      alert("Course added successfully. Awaiting approval.");
      setShowAddCourseModal(false);
      setCourseFormData({ name: "", provider: "", date: "", expiryDate: "", file: null });
      fetchProfiles();
      handleViewProfile(selectedProfile._id, selectedProfile.user._id);
      fetchCourseRequests();
    } catch (err) {
      setError("Failed to add course: " + (err.response?.data?.message || err.message));
      console.error("Error adding course:", err.response?.data || err.message);
    } finally {
      setCourseLoading(false);
      axiosInstance.defaults.headers["Content-Type"] = "application/json";
    }
  };

  const handleApproveCourse = async (userId, courseId, status) => {
    setReviewLoading(true);
    try {
      if (!userId) {
        setError("User ID is missing for approving course.");
        console.error("User ID is missing for handleApproveCourse.");
        setReviewLoading(false);
        return;
      }
      await axiosInstance.put(`/profiles/${userId}/courses/${courseId}/approve`, { status });
      alert(`Course ${status === 'accepted' ? 'accepted' : 'rejected'}.`);
      fetchProfiles();
      handleViewProfile(selectedProfile._id, userId);
      fetchCourseRequests();
    } catch (err) {
      setError("Failed to update course status: " + (err.response?.data?.message || err.message));
      console.error("Error updating course status:", err.response?.data || err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleAddDocument = async (e) => {
    e.preventDefault();
    setDocumentLoading(true);

    if (!selectedProfile?.user?._id) {
      setError("User ID is not available for adding document.");
      console.error("User ID is not available for handleAddDocument.");
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
      alert("Document added successfully. Awaiting approval.");
      setShowAddDocumentModal(false);
      setDocumentFormData({ name: "", type: "", date: "", expiryDate: "", file: null });
      fetchProfiles();
      handleViewProfile(selectedProfile._id, selectedProfile.user._id);
      fetchDocumentRequests();
    } catch (err) {
      setError("Failed to add document: " + (err.response?.data?.message || err.message));
      console.error("Error adding document:", err.response?.data || err.message);
    } finally {
      setDocumentLoading(false);
      axiosInstance.defaults.headers["Content-Type"] = "application/json";
    }
  };

  const handleApproveDocument = async (userId, docId, status) => {
    setReviewLoading(true);
    try {
      if (!userId) {
        setError("User ID is missing for approving document.");
        console.error("User ID is missing for handleApproveDocument.");
        setReviewLoading(false);
        return;
      }
      await axiosInstance.put(`/profiles/${userId}/documents/${docId}/approve`, { status });
      alert(`Document ${status === 'accepted' ? 'accepted' : 'rejected'}.`);
      fetchProfiles();
      handleViewProfile(selectedProfile._id, userId);
      fetchDocumentRequests();
    } catch (err) {
      setError("Failed to update document status: " + (err.response?.data?.message || err.message));
      console.error("Error updating document status:", err.response?.data || err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleAddEvaluation = async (e) => {
    e.preventDefault();
    setEvaluationLoading(true);
    if (!selectedProfile?.user?._id) {
      setError("User ID is not available for adding evaluation.");
      console.error("User ID is not available for handleAddEvaluation.");
      setEvaluationLoading(false);
      return;
    }
    try {
      await axiosInstance.post(`/profiles/${selectedProfile.user._id}/evaluations`, evaluationFormData);
      alert("Evaluation added successfully.");
      setShowAddEvaluationModal(false);
      setEvaluationFormData({ score: "", notes: "", skillEvaluations: [{ skillName: "", score: "", notes: "" }] });
      fetchProfiles();
      handleViewProfile(selectedProfile._id, selectedProfile.user._id);
    } catch (err) {
      setError("Failed to add evaluation: " + (err.response?.data?.message || err.message));
      console.error("Error adding evaluation:", err.response?.data || err.message);
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
      setError("User ID is not available for adding record.");
      console.error("User ID is not available for handleAddRecord.");
      setRecordLoading(false);
      return;
    }
    try {
      await axiosInstance.post(`/profiles/${selectedProfile.user._id}/records`, recordFormData);
      alert("Administrative record added successfully.");
      setShowAddRecordModal(false);
      setRecordFormData({ type: "reward", details: "", date: "", signedBy: "", signatureImageUrl: "" });
      fetchProfiles();
      handleViewProfile(selectedProfile._id, selectedProfile.user._id);
    } catch (err) {
      setError("Failed to add administrative record: " + (err.response?.data?.message || err.message));
      console.error("Error adding administrative record:", err.response?.data || err.message);
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
      setError("User ID or Record ID is not available for updating record.");
      console.error("User ID or Record ID is not available for handleUpdateRecord.");
      setRecordLoading(false);
      return;
    }
    try {
      await axiosInstance.put(`/profiles/${selectedProfile.user._id}/records/${editRecordFormData._id}`, editRecordFormData);
      alert("Administrative record updated successfully.");
      setShowEditRecordModal(false);
      setEditRecordFormData({});
      fetchProfiles();
      handleViewProfile(selectedProfile._id, selectedProfile.user._id);
    } catch (err) {
      setError("Failed to update administrative record: " + (err.response?.data?.message || err.message));
      console.error("Error updating administrative record:", err.response?.data || err.message);
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
      setError("User ID or Record ID is not available for deleting record.");
      console.error("User ID or Record ID is not available for handleDeleteRecord.");
      setRecordLoading(false);
      return;
    }
    try {
      await axiosInstance.delete(`/profiles/${selectedProfile.user._id}/records/${recordId}`);
      alert("Administrative record deleted successfully.");
      fetchProfiles();
      handleViewProfile(selectedProfile._id, selectedProfile.user._id);
    } catch (err) {
      setError("Failed to delete administrative record: " + (err.response?.data?.message || err.message));
      console.error("Error deleting administrative record:", err.response?.data || err.message);
    } finally {
      setRecordLoading(false);
    }
  };

  const handleAddAchievement = async (e) => {
    e.preventDefault();
    setAchievementLoading(true);
    if (!selectedProfile?.user?._id) {
      setError("User ID is not available for adding achievement.");
      console.error("User ID is not available for handleAddAchievement.");
      setAchievementLoading(false);
      return;
    }
    try {
      await axiosInstance.post(`/profiles/${selectedProfile.user._id}/achievements`, achievementFormData);
      alert("Achievement added successfully. Awaiting approval.");
      setShowAddAchievementModal(false);
      setAchievementFormData({ title: "", description: "", type: "other", date: "", status: "pending" }); // تم التعديل
      fetchProfiles();
      handleViewProfile(selectedProfile._id, selectedProfile.user._id);
    } catch (err) {
      setError("Failed to add achievement: " + (err.response?.data?.message || err.message));
      console.error("Error adding achievement:", err.response?.data || err.message);
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
        setError("User ID or Achievement ID is not available for updating achievement.");
        console.error("User ID or Achievement ID is not available for handleUpdateAchievement.");
        setAchievementLoading(false);
        return;
      }
      try {
        await axiosInstance.put(`/profiles/${selectedProfile.user._id}/achievements/${editAchievementFormData._id}`, editAchievementFormData);
        alert("Achievement updated successfully.");
        setShowEditAchievementModal(false);
        setEditAchievementFormData({});
        fetchProfiles();
        handleViewProfile(selectedProfile._id, selectedProfile.user._id);
      } catch (err) {
        setError("Failed to update achievement: " + (err.response?.data?.message || err.message));
        console.error("Error updating achievement:", err.response?.data || err.message);
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
      setError("User ID or Achievement ID is not available for deleting achievement.");
      console.error("User ID or Achievement ID is not available for handleDeleteAchievement.");
      setAchievementLoading(false);
      return;
    }
    try {
      await axiosInstance.delete(`/profiles/${selectedProfile.user._id}/achievements/${achievementId}`);
      alert("Achievement deleted successfully.");
      fetchProfiles();
      handleViewProfile(selectedProfile._id, selectedProfile.user._id);
    } catch (err) {
      setError("Failed to delete achievement: " + (err.response?.data?.message || err.message));
      console.error("Error deleting achievement:", err.response?.data || err.message);
    } finally {
      setAchievementLoading(false);
    }
  };

  const handleMarkPromotionCandidate = async (userId, isCandidate) => {
    setPromotionLoading(true);
    try {
      if (!userId) {
        setError("User ID is missing for marking promotion candidate.");
        console.error("User ID is missing for handleMarkPromotionCandidate.");
        setPromotionLoading(false);
        return;
      }
      await axiosInstance.put(`/profiles/${userId}/promotion`, { isPromotionCandidate: isCandidate });
      alert(`Promotion candidate status updated successfully.`);
      fetchProfiles();
      if (selectedProfile && selectedProfile.user._id === userId) {
        setSelectedProfile((prev) => ({ ...prev, isPromotionCandidate: isCandidate }));
      }
    } catch (err) {
      setError("Failed to update promotion candidate status: " + (err.response?.data?.message || err.message));
      console.error("Error updating promotion candidate status:", err.response?.data || err.message);
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
      alert("Profile updated successfully.");
      setShowEditProfileModal(false);
      fetchProfiles();
      if (selectedProfile && selectedProfile.user._id === userId) {
        handleViewProfile(selectedProfile._id, userId);
      }
    } catch (err) {
      setError("Failed to update profile: " + (err.response?.data?.message || err.message));
      console.error("Error updating profile:", err.response?.data || err.message);
    } finally {
      setEditProfileLoading(false);
    }
  };

  const handleGeneratePdf = async (userId) => {
    setPdfLoading(true);
    try {
      if (!userId) {
        setError("User ID is missing for generating PDF.");
        console.error("User ID is missing for handleGeneratePdf.");
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
      alert("PDF generated successfully.");
    } catch (err) {
      setError("Failed to generate PDF: " + (err.response?.data?.message || err.message));
      console.error("Error generating PDF:", err.response?.data || err.message);
    } finally {
      setPdfLoading(false);
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
    if (!searchTerm) {
      return profiles;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return profiles.filter(
      (profile) =>
        profile.user?.username?.toLowerCase().includes(lowerCaseSearchTerm) ||
        profile.fullName?.toLowerCase().includes(lowerCaseSearchTerm) ||
        profile.jobTitle?.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [profiles, searchTerm]);

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

  if (loading && !selectedProfile && profileUpdateRequests.length === 0 && courseRequests.length === 0 && documentRequests.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl text-gray-700">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <> {/* Added React.Fragment to wrap all top-level JSX elements */}
      <div className="min-h-screen bg-gray-100 p-4 font-sans" dir="rtl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">لوحة تحكم المشرف</h1>

        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* القسم الرئيسي (قائمة ملفات الموظفين) - Left Column */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">قائمة ملفات الموظفين</h2>
            {/* Search, Filter, Export Section */}
            <div className="mb-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:w-1/2">
                <input
                  type="text"
                  placeholder="بحث باسم المستخدم / الاسم الكامل / المسمى الوظيفي..."
                  className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <div className="flex gap-2">
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-sm transition duration-300">
                  <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                  تصفية
                </button>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-sm transition duration-300">
                  <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  تصدير
                </button>
              </div>
            </div>
            <div className="overflow-x-auto h-full">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">اسم المستخدم</th>
                    <th className="py-3 px-6 text-left">الاسم الكامل</th>
                    <th className="py-3 px-6 text-left">المسمى الوظيفي</th>
                    <th className="py-3 px-6 text-left">نسبة الاكتمال</th>
                    <th className="py-3 px-6 text-center">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 text-sm font-light">
                  {filteredProfiles.map((profile) => (
                    <tr key={profile._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-6 text-left">{profile.user?.username || "غير متوفر"}</td>
                      <td className="py-3 px-6 text-left">{profile.fullName}</td>
                      <td className="py-3 px-6 text-left">{profile.jobTitle}</td>
                      <td className="py-3 px-6 text-left">
                        {profile.completionPercentage !== null ? `${profile.completionPercentage.toFixed(2)}%` : "جاري..."}
                      </td>
                      <td className="py-3 px-6 text-center relative profile-dropdown-container">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenProfileDropdownId(openProfileDropdownId === profile._id ? null : profile._id);
                            setOpenRequestDropdownId(null);
                            setOpenAchievementDropdownId(null);
                            setOpenRecordDropdownId(null);
                            setOpenCourseDocumentDropdownId(null);
                          }}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded-md text-xs inline-flex items-center"
                        >
                          الإجراءات
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        {openProfileDropdownId === profile._id && (
                          <div
                            className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
                            style={{ transform: 'translateX(0%)' }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => {
                                handleViewProfile(profile._id, profile.user._id);
                                setOpenProfileDropdownId(null);
                              }}
                              className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              عرض الملف
                            </button>
                            <button
                              onClick={() => {
                                handleEditProfileClick(profile);
                                setOpenProfileDropdownId(null);
                              }}
                              className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              تعديل
                            </button>
                            <button
                              onClick={() => {
                                handleMarkPromotionCandidate(profile.user._id, !profile.isPromotionCandidate);
                                setOpenProfileDropdownId(null);
                              }}
                              className={`block w-full text-right px-4 py-2 text-sm ${
                                profile.isPromotionCandidate ? "text-red-700 hover:bg-red-100" : "text-green-700 hover:bg-green-100"
                              }`}
                              disabled={promotionLoading}
                            >
                              {promotionLoading ? "جاري..." : profile.isPromotionCandidate ? "إزالة ترشيح ترقية" : "ترشيح لترقية"}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* الشريط الجانبي (جميع الطلبات) - Right Column */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* طلبات تحديث الملفات الشخصية */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center justify-between">
                <span>طلبات تحديث الملفات الشخصية</span>
                <button
                  onClick={() => navigate("/supervisor/requests/profile")}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-lg text-sm shadow transition duration-300"
                >
                  عرض المزيد
                </button>
              </h2>
              {/* Search, Filter, Export Section for Profile Requests */}
              <div className="mb-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-1/2">
                  <input
                    type="text"
                    placeholder="بحث باسم الموظف / الحالة..."
                    className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    value={profileRequestSearchTerm}
                    onChange={(e) => setProfileRequestSearchTerm(e.target.value)}
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <div className="flex gap-2">
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-sm transition duration-300">
                    <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                    تصفية
                  </button>
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-sm transition duration-300">
                    <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    تصدير
                  </button>
                </div>
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
                          <td className="py-2 px-4 text-center relative request-dropdown-container">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenRequestDropdownId(openRequestDropdownId === `profile-${request._id}` ? null : `profile-${request._id}`);
                                setOpenProfileDropdownId(null);
                                setOpenAchievementDropdownId(null);
                                setOpenRecordDropdownId(null);
                                setOpenCourseDocumentDropdownId(null);
                              }}
                              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded-md text-xs inline-flex items-center"
                            >
                              الإجراءات
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>
                            {openRequestDropdownId === `profile-${request._id}` && (
                              <div
                                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
                                style={{ transform: 'translateX(0%)' }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => {
                                    handleReviewRequest(request._id, "approved", request.profile?.user || request.requestedBy._id);
                                    setOpenRequestDropdownId(null);
                                  }}
                                  className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  disabled={reviewLoading}
                                >
                                  {reviewLoading ? "جاري..." : "قبول"}
                                </button>
                                <button
                                  onClick={() => {
                                    handleReviewRequest(request._id, "rejected", request.profile?.user || request.requestedBy._id);
                                    setOpenRequestDropdownId(null);
                                  }}
                                  className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  disabled={reviewLoading}
                                >
                                  {reviewLoading ? "جاري..." : "رفض"}
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* طلبات الدورات التدريبية */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center justify-between">
                <span>طلبات الدورات التدريبية</span>
                <button
                  onClick={() => navigate("/supervisor/requests/coursess")}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-lg text-sm shadow transition duration-300"
                >
                  عرض المزيد
                </button>
              </h2>
              {/* Search, Filter, Export Section for Course Requests */}
              <div className="mb-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-1/2">
                  <input
                    type="text"
                    placeholder="بحث باسم الموظف / الدورة / الحالة..."
                    className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    value={courseRequestSearchTerm}
                    onChange={(e) => setCourseRequestSearchTerm(e.target.value)}
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <div className="flex gap-2">
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-sm transition duration-300">
                    <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                    تصفية
                  </button>
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-sm transition duration-300">
                    <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    تصدير
                  </button>
                </div>
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
                          <td className="py-2 px-4 text-center relative request-dropdown-container">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenRequestDropdownId(openRequestDropdownId === `course-${request._id}` ? null : `course-${request._id}`);
                                setOpenProfileDropdownId(null);
                                setOpenAchievementDropdownId(null);
                                setOpenRecordDropdownId(null);
                                setOpenCourseDocumentDropdownId(null);
                              }}
                              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded-md text-xs inline-flex items-center"
                            >
                              الإجراءات
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </button>
                            {openRequestDropdownId === `course-${request._id}` && (
                              <div
                                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
                                style={{ transform: 'translateX(0%)' }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  onClick={() => {
                                    handleApproveCourse(request.user._id, request._id, "accepted");
                                    setOpenRequestDropdownId(null);
                                  }}
                                  className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  disabled={reviewLoading}
                                >
                                  {reviewLoading ? "جاري..." : "قبول"}
                                </button>
                                <button
                                  onClick={() => {
                                    handleApproveCourse(request.user._id, request._id, "rejected");
                                    setOpenRequestDropdownId(null);
                                  }}
                                  className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  disabled={reviewLoading}
                                >
                                  {reviewLoading ? "جاري..." : "رفض"}
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* طلبات المستندات */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center justify-between">
                <span>طلبات المستندات</span>
                <button
                  onClick={() => navigate("/supervisor/requests/documents")}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-lg text-sm shadow transition duration-300"
                >
                  عرض المزيد
                </button>
              </h2>
              {/* Search, Filter, Export Section for Document Requests */}
              <div className="mb-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="relative w-full md:w-1/2">
                  <input
                    type="text"
                    placeholder="بحث باسم الموظف / المستند / النوع / الحالة..."
                    className="w-full py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                    value={documentRequestSearchTerm}
                    onChange={(e) => setDocumentRequestSearchTerm(e.target.value)}
                  />
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <div className="flex gap-2">
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-sm transition duration-300">
                    <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                    تصفية
                  </button>
                  <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-sm transition duration-300">
                    <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    تصدير
                  </button>
                </div>
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
                            <td className="py-2 px-4 text-center relative request-dropdown-container">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenRequestDropdownId(openRequestDropdownId === `document-${request._id}` ? null : `document-${request._id}`);
                                  setOpenProfileDropdownId(null);
                                  setOpenAchievementDropdownId(null);
                                  setOpenRecordDropdownId(null);
                                  setOpenCourseDocumentDropdownId(null);
                                }}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded-md text-xs inline-flex items-center"
                              >
                                الإجراءات
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                              </button>
                              {openRequestDropdownId === `document-${request._id}` && (
                                <div
                                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
                                  style={{ transform: 'translateX(0%)' }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button
                                    onClick={() => {
                                      handleApproveDocument(request.user._id, request._id, "accepted");
                                      setOpenRequestDropdownId(null);
                                    }}
                                    className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    disabled={reviewLoading}
                                  >
                                    {reviewLoading ? "جاري..." : "قبول"}
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleApproveDocument(request.user._id, request._id, "rejected");
                                      setOpenRequestDropdownId(null);
                                    }}
                                    className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    disabled={reviewLoading}
                                  >
                                    {reviewLoading ? "جاري..." : "رفض"}
                                  </button>
                                </div>
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
            </div>
          </div>

          {showProfileModal && selectedProfile && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                  <h3 className="text-2xl font-bold text-gray-800">ملف {selectedProfile.fullName}</h3>
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className="text-gray-500 hover:text-gray-800 text-3xl font-bold"
                  >
                    &times;
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="mb-2"><span className="font-semibold">المسمى الوظيفي:</span> {selectedProfile.jobTitle}</p>
                    <p className="mb-2"><span className="font-semibold">القسم:</span> {selectedProfile.department}</p>
                    <p className="mb-2"><span className="font-semibold">رقم الهاتف الداخلي:</span> {selectedProfile.internalPhone}</p>
                    <p className="mb-2"><span className="font-semibold">البريد الإلكتروني:</span> {selectedProfile.email}</p>
                    <p className="mb-2"><span className="font-semibold">تاريخ بدء العمل:</span> {moment(selectedProfile.startDate).format("LL")}</p>
                    <p className="mb-2"><span className="font-semibold">مرشح للترقية:</span> {selectedProfile.isPromotionCandidate ? "نعم" : "لا"}</p>
                    {selectedProfile.qualification && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-lg mb-2">المؤهل العلمي:</h4>
                        <p>الدرجة: {selectedProfile.qualification.degree}</p>
                        <p>التخصص: {selectedProfile.qualification.specialization}</p>
                        <p>الجامعة: {selectedProfile.qualification.university}</p>
                        <p>سنة التخرج: {selectedProfile.qualification.graduationYear}</p>
                      </div>
                    )}
                    {selectedProfile.skillTags && selectedProfile.skillTags.length > 0 ? (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-lg mb-2">المهارات:</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedProfile.skillTags.map((tag, index) => (
                            <span key={index} className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h4 className="font-semibold text-lg mb-2">المهارات:</h4>
                        <p className="text-gray-500">لا توجد مهارات مسجلة.</p>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-center items-start">
                    <img
                      src={selectedProfile.profileImageUrl || "https://via.placeholder.com/150"}
                      alt="Profile"
                      className="w-40 h-40 rounded-full object-cover shadow-lg border-4 border-teal-200"
                    />
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={() => setShowAddCourseModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow transition duration-300"
                  >
                    إضافة دورة
                  </button>
                  <button
                    onClick={() => setShowAddDocumentModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow transition duration-300"
                  >
                    إضافة مستند
                  </button>
                  <button
                    onClick={() => setShowAddEvaluationModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow transition duration-300"
                  >
                    إضافة تقييم
                  </button>
                  <button
                    onClick={() => setShowAddRecordModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow transition duration-300"
                  >
                    إضافة سجل إداري
                  </button>
                  <button
                    onClick={() => setShowAddAchievementModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow transition duration-300"
                  >
                    إضافة إنجاز/مهمة
                  </button>
                  <button
                    onClick={() => handleGeneratePdf(selectedProfile.user._id)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow transition duration-300"
                    disabled={pdfLoading}
                  >
                    {pdfLoading ? "جاري التوليد..." : "تحميل الذاتية PDF"}
                  </button>
                </div>

                <div className="mt-8">
                  <h4 className="text-xl font-semibold text-gray-700 mb-3">الدورات التدريبية</h4>
                  {selectedProfile.courses && selectedProfile.courses.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">اسم الدورة</th>
                            <th className="py-3 px-6 text-left">الجهة المانحة</th>
                            <th className="py-3 px-6 text-left">التاريخ</th>
                            <th className="py-3 px-6 text-left">تاريخ الانتهاء</th>
                            <th className="py-3 px-6 text-left">الحالة</th>
                            <th className="py-3 px-6 text-left">ملاحظات المشرف</th>
                            <th className="py-3 px-6 text-center">الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm font-light">
                          {selectedProfile.courses.map((course) => (
                            <tr key={course._id} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="py-3 px-6 text-left">{course.name}</td>
                              <td className="py-3 px-6 text-left">{course.provider}</td>
                              <td className="py-3 px-6 text-left">{moment(course.date).format("LL")}</td>
                              <td className="py-3 px-6 text-left">{course.expiryDate ? moment(course.expiryDate).format("LL") : "لا يوجد"}</td>
                              <td className="py-3 px-6 text-left">
                                <span
                                  className={`py-1 px-3 rounded-full text-xs font-semibold ${
                                    course.status === "pending" ? "bg-yellow-200 text-yellow-800" :
                                    course.status === "accepted" ? "bg-green-200 text-green-800" :
                                    "bg-red-200 text-red-800"
                                  }`}
                                >
                                  {course.status === "pending" ? "قيد الانتظار" : course.status === "accepted" ? "مقبول" : "مرفوض"}
                                </span>
                              </td>
                              <td className="py-3 px-6 text-left max-w-xs truncate">{course.adminNote || "لا يوجد"}</td>
                              <td className="py-3 px-6 text-center relative course-document-dropdown-container">
                                {course.status === "pending" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenCourseDocumentDropdownId(openCourseDocumentDropdownId === `course-action-${course._id}` ? null : `course-action-${course._id}`);
                                    }}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded-md text-xs inline-flex items-center"
                                  >
                                    الإجراءات
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                  </button>
                                )}
                                {openCourseDocumentDropdownId === `course-action-${course._id}` && (
                                  <div
                                    className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
                                    style={{ transform: 'translateX(0%)' }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <button
                                      onClick={() => {
                                        handleApproveCourse(selectedProfile.user._id, course._id, "accepted");
                                        setOpenCourseDocumentDropdownId(null);
                                      }}
                                      className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                      disabled={reviewLoading}
                                    >
                                      {reviewLoading ? "جاري..." : "قبول"}
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleApproveCourse(selectedProfile.user._id, course._id, "rejected");
                                        setOpenCourseDocumentDropdownId(null);
                                      }}
                                      className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                      disabled={reviewLoading}
                                    >
                                      {reviewLoading ? "جاري..." : "رفض"}
                                    </button>
                                  </div>
                                )}
                                {course.file && (
                                  <a
                                    href={`${API_BASE_URL}/${course.file}`}
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
                  ) : (
                    <p className="text-gray-500">لا توجد دورات تدريبية.</p>
                  )}
                </div>

                <div className="mt-8">
                  <h4 className="text-xl font-semibold text-gray-700 mb-3">المستندات</h4>
                  {selectedProfile.documents && selectedProfile.documents.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">اسم المستند</th>
                            <th className="py-3 px-6 text-left">النوع</th>
                            <th className="py-3 px-6 text-left">تاريخ الرفع</th>
                            <th className="py-3 px-6 text-left">تاريخ الانتهاء</th>
                            <th className="py-3 px-6 text-left">الحالة</th>
                            <th className="py-3 px-6 text-left">ملاحظات المشرف</th>
                            <th className="py-3 px-6 text-center">الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm font-light">
                          {selectedProfile.documents.map((doc) => (
                            <tr key={doc._id} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="py-3 px-6 text-left">{doc.name}</td>
                              <td className="py-3 px-6 text-left">{doc.type}</td>
                              <td className="py-3 px-6 text-left">{moment(doc.date).format("LL")}</td>
                              <td className="py-3 px-6 text-left">{doc.expiryDate ? moment(doc.expiryDate).format("LL") : "لا يوجد"}</td>
                              <td className="py-3 px-6 text-left">
                                <span
                                  className={`py-1 px-3 rounded-full text-xs font-semibold ${
                                    doc.status === "pending" ? "bg-yellow-200 text-yellow-800" :
                                    doc.status === "accepted" ? "bg-green-200 text-green-800" :
                                    "bg-red-200 text-red-800"
                                  }`}
                                >
                                  {doc.status === "pending" ? "قيد الانتظار" : doc.status === "accepted" ? "مقبول" : "مرفوض"}
                                </span>
                              </td>
                              <td className="py-3 px-6 text-left max-w-xs truncate">{doc.adminNote || "لا يوجد"}</td>
                              <td className="py-3 px-6 text-center relative course-document-dropdown-container">
                                {doc.status === "pending" && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenCourseDocumentDropdownId(openCourseDocumentDropdownId === `document-action-${doc._id}` ? null : `document-action-${doc._id}`);
                                    }}
                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded-md text-xs inline-flex items-center"
                                  >
                                    الإجراءات
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                  </button>
                                )}
                                {openCourseDocumentDropdownId === `document-action-${doc._id}` && (
                                  <div
                                    className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
                                    style={{ transform: 'translateX(0%)' }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <button
                                      onClick={() => {
                                        handleApproveDocument(selectedProfile.user._id, doc._id, "accepted");
                                        setOpenCourseDocumentDropdownId(null);
                                      }}
                                      className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                      disabled={reviewLoading}
                                    >
                                      {reviewLoading ? "جاري..." : "قبول"}
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleApproveDocument(selectedProfile.user._id, doc._id, "rejected");
                                        setOpenCourseDocumentDropdownId(null);
                                      }}
                                      className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                      disabled={reviewLoading}
                                    >
                                      {reviewLoading ? "جاري..." : "رفض"}
                                    </button>
                                  </div>
                                )}
                                {doc.file && (
                                  <a
                                    href={`${API_BASE_URL}/${doc.file}`}
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
                  ) : (
                    <p className="text-gray-500">لا توجد مستندات مرفوعة.</p>
                  )}
                </div>

                <div className="mt-8">
                  <h4 className="text-xl font-semibold text-gray-700 mb-3">الإنجازات والمهام</h4>
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
                              <td className="py-3 px-6 text-center relative achievement-dropdown-container">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenAchievementDropdownId(openAchievementDropdownId === ach._id ? null : ach._id);
                                    setOpenProfileDropdownId(null);
                                    setOpenRequestDropdownId(null);
                                    setOpenRecordDropdownId(null);
                                    setOpenCourseDocumentDropdownId(null);
                                  }}
                                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded-md text-xs inline-flex items-center"
                                >
                                  الإجراءات
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>
                                {openAchievementDropdownId === ach._id && (
                                  <div
                                    className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
                                    style={{ transform: 'translateX(0%)' }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <button
                                      onClick={() => {
                                        handleEditAchievementClick(ach);
                                        setOpenAchievementDropdownId(null);
                                      }}
                                      className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      تعديل
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleDeleteAchievement(ach._id);
                                        setOpenAchievementDropdownId(null);
                                      }}
                                      className="block w-full text-right px-4 py-2 text-sm text-red-700 hover:bg-red-100"
                                    >
                                      حذف
                                    </button>
                                  </div>
                                )}
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

                <div className="mt-8">
                  <h4 className="text-xl font-semibold text-gray-700 mb-3">التقييمات</h4>
                  {selectedProfile.evaluations && selectedProfile.evaluations.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">الدرجة</th>
                            <th className="py-3 px-6 text-left">الملاحظات</th>
                            <th className="py-3 px-6 text-left">التاريخ</th>
                            <th className="py-3 px-6 text-left">تم التقييم بواسطة</th>
                            <th className="py-3 px-6 text-left">تقييمات المهارات</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm font-light">
                          {selectedProfile.evaluations.map((evalItem) => (
                            <tr key={evalItem._id} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="py-3 px-6 text-left">{evalItem.score}</td>
                              <td className="py-3 px-6 text-left max-w-xs truncate">{evalItem.notes}</td>
                              <td className="py-3 px-6 text-left">{moment(evalItem.date).format("LL")}</td>
                              <td className="py-3 px-6 text-left">{evalItem.evaluatedBy?.username || "غير معروف"}</td>
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

                <div className="mt-8">
                  <h4 className="text-xl font-semibold text-gray-700 mb-3">السجلات الإدارية</h4>
                  {selectedProfile.records && selectedProfile.records.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                        <thead>
                          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">النوع</th>
                            <th className="py-3 px-6 text-left">التفاصيل</th>
                            <th className="py-3 px-6 text-left">التاريخ</th>
                            <th className="py-3 px-6 text-left">بواسطة</th>
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
                              <td className="py-3 px-6 text-center relative record-dropdown-container">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenRecordDropdownId(openRecordDropdownId === record._id ? null : record._id);
                                    setOpenProfileDropdownId(null);
                                    setOpenRequestDropdownId(null);
                                    setOpenAchievementDropdownId(null);
                                    setOpenCourseDocumentDropdownId(null);
                                  }}
                                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-2 rounded-md text-xs inline-flex items-center"
                                >
                                  الإجراءات
                                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>
                                {openRecordDropdownId === record._id && (
                                  <div
                                    className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200"
                                    style={{ transform: 'translateX(0%)' }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <button
                                      onClick={() => {
                                        handleEditRecordClick(record);
                                        setOpenRecordDropdownId(null);
                                      }}
                                      className="block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                      تعديل
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleDeleteRecord(record._id);
                                        setOpenRecordDropdownId(null);
                                      }}
                                      className="block w-full text-right px-4 py-2 text-sm text-red-700 hover:bg-red-100"
                                    >
                                      حذف
                                    </button>
                                  </div>
                                )}
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
              </div>
            </div>
          )}

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
                      <option value="in_progress">قيد التقدم</option> {/* تم التعديل: استخدام in_progress */}
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
                      <option value="in_progress">قيد التقدم</option> {/* تم التعديل: استخدام in_progress */}
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
        </div>
      </div>
    </>
  );
};

export default SupervisorDashboard;
