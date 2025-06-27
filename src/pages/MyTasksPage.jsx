import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getToken = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return null;
    }
    return token;
  }, [navigate]);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get("https://hawkama.cbc-api.app/api/dashboard", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        setData(res.data);
      } catch (err) {
        setError("حدث خطأ في تحميل البيانات: " + (err.response?.data?.message || err.message));
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [getToken, navigate]);

  if (loading) return <div className="p-4 text-center">...جاري تحميل البيانات</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!data) return null;

  return (
    <div className="p-6 max-w-5xl mx-auto font-sans text-right">
      <h1 className="text-3xl font-bold mb-6">لوحة التحكم</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded shadow text-center">
          <div className="text-lg font-semibold">العقود الموقعة اليوم</div>
          <div className="text-3xl">{data.contractsSignedToday}</div>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <div className="text-lg font-semibold">العقود الموقعة هذا الشهر</div>
          <div className="text-3xl">{data.contractsSignedThisMonth}</div>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <div className="text-lg font-semibold">الاستبيانات المنجزة</div>
          <div className="text-3xl">{data.surveysCompleted}</div>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <div className="text-lg font-semibold">المتاجر الجديدة هذا الشهر</div>
          <div className="text-3xl">{data.newStoresThisMonth}</div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-2">الموظفة الأكثر نشاطاً</h2>
        <div>{data.mostActiveUser?.username} - عدد المهام: {data.mostActiveUser?.taskCount}</div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-2">أفضل 3 موظفات هذا الأسبوع</h2>
        <ol className="list-decimal list-inside">
          {data.top3UsersWeek.map((user, i) => (
            <li key={i}>{user.username.trim()} - عدد المهام: {user.taskCount}</li>
          ))}
        </ol>
      </div>

      <div className="bg-white p-4 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-2">التنبيهات العاجلة</h2>
        {data.urgentAlerts.length === 0 ? (
          <p>لا توجد تنبيهات عاجلة</p>
        ) : (
          <ul>
            {data.urgentAlerts.map((alert, i) => (
              <li key={i}>{alert}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white p-4 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-2">عدادات حية</h2>
        <div>المهام المكتملة: {data.liveCounters.byStatus.completed}</div>
        <div>المهام المعلقة: {data.liveCounters.byStatus.pending}</div>
        <div>الأولوية المتوسطة: {data.liveCounters.byPriority.medium}</div>
        <div>إجمالي المهام: {data.liveCounters.totalTasks}</div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-2">خريطة مواقع المتاجر</h2>
        <div className="w-full h-64 border rounded overflow-hidden">
          <iframe
            title="Stores Map"
            width="100%"
            height="100%"
            src={`https://maps.google.com/maps?q=${data.storesLocations
              .map((store) => store.location.coordinates[1] + "," + store.location.coordinates[0])
              .join("|")}&t=&z=10&ie=UTF8&iwloc=&output=embed`}
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-2">جدول اليوم (المهام والمتابعات)</h2>
        <div>
          <h3 className="font-semibold">المهام</h3>
          {data.tasksToday.length === 0 ? (
            <p>لا توجد مهام اليوم</p>
          ) : (
            <ul>
              {data.tasksToday.map((task) => (
                <li key={task._id}>{task.title || task.name}</li>
              ))}
            </ul>
          )}
          <h3 className="font-semibold mt-4">المتابعات</h3>
          {data.followUpsToday.length === 0 ? (
            <p>لا توجد متابعات اليوم</p>
          ) : (
            <ul>
              {data.followUpsToday.map((fu) => (
                <li key={fu._id}>{fu.title || fu.name}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
