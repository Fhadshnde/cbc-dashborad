import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaFileContract, FaPollH, FaCalendarAlt, FaSpinner, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

const API_URL = "https://hawkama.cbc-api.app/api/tasks/my";
const UPDATE_TASK_API_URL = "https://hawkama.cbc-api.app/api/tasks";

const MyTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isCompletingTask, setIsCompletingTask] = useState(false);
  const navigate = useNavigate();

  const getAuthHeader = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return null;
    }
    return { Authorization: `Bearer ${token}` };
  }, [navigate]);

  const fetchMyTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = getAuthHeader();
      if (!headers) {
        setLoading(false);
        return;
      }
      const response = await axios.get(API_URL, { headers });
      const relevantTasks = response.data.data.filter(task =>
        task.taskType === "Contract Renewal" ||
        task.taskType === "Survey Completion" ||
        task.taskType === "Monthly Follow-up Visit"
      );
      setTasks(relevantTasks);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/login');
      } else {
        setError("حدث خطأ أثناء جلب المهام: " + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  }, [getAuthHeader, navigate]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  useEffect(() => {
    fetchMyTasks();
  }, [fetchMyTasks]);

  const isUpcomingAlert = useCallback((dueDateStr) => {
    if (!dueDateStr) return false;
    const dueDate = new Date(dueDateStr);

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const taskDueDateAtStartOfDay = new Date(dueDate);
    taskDueDateAtStartOfDay.setHours(0, 0, 0, 0);

    const thirtyDaysFromNow = new Date(now);
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    const isDueTodayOrFuture = taskDueDateAtStartOfDay >= now;
    const isWithinThirtyDays = taskDueDateAtStartOfDay < thirtyDaysFromNow;

    return isDueTodayOrFuture && isWithinThirtyDays;
  }, []);

  const handleMarkTaskAsCompleted = useCallback(async (taskId) => {
    setError(null);
    setSuccessMessage('');
    setIsCompletingTask(true);
    try {
      const headers = getAuthHeader();
      if (!headers) {
        setIsCompletingTask(false);
        return;
      }

      await axios.put(`${UPDATE_TASK_API_URL}/${taskId}`, { status: 'completed' }, { headers });
      setSuccessMessage('تم وضع علامة على المهمة كمكتملة بنجاح!');
      fetchMyTasks();
    } catch (err) {
      setError("فشل وضع علامة على المهمة كمكتملة: " + (err.response?.data?.message || err.message));
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsCompletingTask(false);
    }
  }, [getAuthHeader, fetchMyTasks, navigate]);

  // First, filter all tasks that are currently active (pending or overdue)
  const activeTasks = tasks.filter(task =>
    task.status === 'pending' || task.status === 'overdue'
  );

  // Filter tasks that are upcoming alerts
  const upcomingAlertTasks = activeTasks.filter(task => isUpcomingAlert(task.dueDate));
  
  // Get IDs of tasks already in upcomingAlertTasks to exclude them from other lists
  const upcomingAlertTaskIds = new Set(upcomingAlertTasks.map(task => task._id));

  // Filter remaining tasks for specific categories, excluding those already in upcoming alerts
  const incompleteContracts = activeTasks.filter(task =>
    task.taskType === "Contract Renewal" && !upcomingAlertTaskIds.has(task._id)
  );
  const incompleteSurveys = activeTasks.filter(task =>
    task.taskType === "Survey Completion" && !upcomingAlertTaskIds.has(task._id)
  );
  // The 'Monthly Follow-up Visit' tasks will ONLY appear in upcomingAlertTasks if they meet the criteria.
  // We no longer need a separate 'monthlyVisits' array if they are not shown outside of upcoming alerts.


  const getTaskIcon = (taskType) => {
    switch (taskType) {
      case "Contract Renewal": return <FaFileContract className="text-blue-500" />;
      case "Survey Completion": return <FaPollH className="text-green-500" />;
      case "Monthly Follow-up Visit": return <FaCalendarAlt className="text-purple-500" />;
      default: return null;
    }
  };

  const getTaskTitle = (taskType) => {
    switch (taskType) {
      case "Contract Renewal": return "عقد يحتاج لمتابعة/تجديد";
      case "Survey Completion": return "استبيان يحتاج للإكمال";
      case "Monthly Follow-up Visit": return "تذكير بزيارة متابعة دورية";
      default: return "";
    }
  };

  return (
    <div className="m-4 sm:m-16 p-4 sm:p-6 bg-gray-50 min-h-screen text-right font-sans">
      <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">مهامي القادمة</h2>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <FaSpinner className="animate-spin text-teal-600 text-4xl" />
          <span className="mr-3 text-lg text-gray-600">جاري تحميل المهام...</span>
        </div>
      )}

      {error && (
        <div className="text-center py-4 text-red-600">خطأ: {error}</div>
      )}

      {successMessage && (
        <div className="fixed top-20 right-5 bg-green-500 text-white p-3 rounded-lg shadow-lg z-50 animate-bounce-in-right">
          {successMessage}
        </div>
      )}

      {!loading && !error && tasks.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-lg">
          لا توجد مهام قادمة حالياً. استمر في العمل الرائع!
        </div>
      )}

      {!loading && !error && tasks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcomingAlertTasks.length > 0 && (
            <div className="bg-yellow-50 p-6 rounded-lg shadow-md border border-yellow-300">
              <h3 className="flex items-center text-xl font-semibold text-yellow-800 mb-4">
                <FaExclamationTriangle className="text-yellow-600 ml-2" /> تنبيهات قادمة
              </h3>
              <ul className="space-y-3">
                {upcomingAlertTasks.map(task => (
                  <li key={task._id} className="border-b border-yellow-200 pb-3 last:border-b-0">
                    <div className="flex items-start justify-between">
                      <span className="font-medium text-gray-700">{getTaskTitle(task.taskType)}</span>
                      <span className="text-sm font-bold text-yellow-700">
                        قريباً (شهر أو أقل)
                      </span>
                    </div>
                    {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
                    {task.relatedTo && (
                      <p className="text-xs text-gray-500 mt-1">
                        {task.relatedToModel === 'Contract' && `العقد: ${task.relatedTo.contractNumber || 'N/A'} - المتجر: ${task.relatedTo.storeName || 'N/A'}`}
                        {task.relatedToModel === 'FollowUpSurvey' && `المتجر: ${task.relatedTo.storeName || 'N/A'}`}
                        {task.relatedToModel === 'FollowUpSurvey' && task.relatedTo.contract && ` (عقد: ${task.relatedTo.contract.contractNumber})`}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      الموعد النهائي: {new Date(task.dueDate).toLocaleDateString('ar-EG')}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      {task.relatedTo && (
                        <Link
                          to={task.relatedToModel === 'Contract' ? `/contracts/${task.relatedTo._id}` : `/followupsurveys/${task.relatedTo._id}`}
                          className="inline-block text-yellow-600 hover:underline text-sm"
                        >
                          عرض التفاصيل
                        </Link>
                      )}
                      <button
                        onClick={() => handleMarkTaskAsCompleted(task._id)}
                        className="bg-teal-600 text-white px-3 py-1 rounded-lg text-sm flex items-center hover:bg-teal-700 transition-colors duration-300"
                        disabled={isCompletingTask}
                      >
                        {isCompletingTask ? <FaSpinner className="animate-spin ml-1" /> : <FaCheckCircle className="ml-1" />}
                        {isCompletingTask ? 'جاري الإكمال...' : 'تم التجديد / الإكمال'}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {incompleteContracts.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="flex items-center text-xl font-semibold text-gray-800 mb-4">
                <FaFileContract className="text-blue-500 ml-2" /> عقود لم تُكمل
              </h3>
              <ul className="space-y-3">
                {incompleteContracts.map(task => (
                  <li key={task._id} className="border-b pb-3 last:border-b-0">
                    <div className="flex items-start justify-between">
                      <span className="font-medium text-gray-700">{getTaskTitle(task.taskType)}</span>
                      <span className={`text-sm font-bold ${task.status === 'overdue' ? 'text-red-500' : 'text-orange-500'}`}>
                        {task.status === 'overdue' ? 'متأخرة' : 'قيد الانتظار'}
                      </span>
                    </div>
                    {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
                    {task.relatedToModel === 'Contract' && task.relatedTo && (
                      <p className="text-xs text-gray-500 mt-1">
                        العقد: {task.relatedTo.contractNumber || 'N/A'} - المتجر: {task.relatedTo.storeName || 'N/A'}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      الموعد النهائي: {new Date(task.dueDate).toLocaleDateString('ar-EG')}
                    </p>
                    {task.relatedToModel === 'Contract' && task.relatedTo && (
                      <Link to={`/contracts/${task.relatedTo._id}`} className="inline-block mt-2 text-blue-600 hover:underline text-sm">
                        عرض تفاصيل العقد
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {incompleteSurveys.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="flex items-center text-xl font-semibold text-gray-800 mb-4">
                <FaPollH className="text-green-500 ml-2" /> استبيانات ناقصة
              </h3>
              <ul className="space-y-3">
                {incompleteSurveys.map(task => (
                  <li key={task._id} className="border-b pb-3 last:border-b-0">
                    <div className="flex items-start justify-between">
                      <span className="font-medium text-gray-700">{getTaskTitle(task.taskType)}</span>
                      <span className={`text-sm font-bold ${task.status === 'overdue' ? 'text-red-500' : 'text-orange-500'}`}>
                        {task.status === 'overdue' ? 'متأخرة' : 'قيد الانتظار'}
                      </span>
                    </div>
                    {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
                    {task.relatedToModel === 'FollowUpSurvey' && task.relatedTo && (
                      <p className="text-xs text-gray-500 mt-1">
                        المتجر: {task.relatedTo.storeName || 'N/A'}
                        {task.relatedTo.contract && ` (عقد: ${task.relatedTo.contract.contractNumber})`}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      الموعد النهائي: {new Date(task.dueDate).toLocaleDateString('ar-EG')}
                    </p>
                    {task.relatedToModel === 'FollowUpSurvey' && task.relatedTo && (
                      <Link to={`/followupsurveys/${task.relatedTo._id}`} className="inline-block mt-2 text-green-600 hover:underline text-sm">
                        عرض تفاصيل الاستبيان
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Monthly Visits section is removed here as per user's request */}
          {/* They should now only appear in "Upcoming Alerts" if they meet the criteria */}
        </div>
      )}
    </div>
  );
};

export default MyTasksPage;
