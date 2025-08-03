import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// استيراد جميع المكونات الأخرى
import Sidebar from "./components/SideBar/Sidebare";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import AccessReports from "./components/AccessReports/AccessReports";
import AddReportForm from "./components/AccessReports/AddReport";
import Login from "./pages/Login";
import SupervisorAccessReports from "./components/AccessReports/SupervisorAccessReports";
import EditReport from "./components/AccessReports/EditReport";
import Archives from "./components/Archives/Archives";
import SummaryReports from "./components/SummaryReports/SummaryReports";
import EmployeeReports from "./components/SummaryReports/EmployeeReports";
import Management from "./components/Management/Management";
import AddUser from "./components/Management/AddUser";
import EditUser from "./components/Management/EditUser";
import UserDetails from "./components/Management/UserDetails";
import ContractForm from "./components/ContractForm";
import FollowUpSurveyList from "./components/FollowUp/FollowUpSurveyList";
import FollowUpSurveyCreate from "./components/FollowUp/FollowUpSurveyCreate";
import FollowUpSurveyDetails from "./components/FollowUp/FollowUpSurveyDetails";
import FollowUpSurveyEdit from "./components/FollowUp/FollowUpSurveyEdit";
import ContractsWithoutSurveyPage from "./pages/ContractsWithoutSurveyPage";
import MyTasksPage from "./pages/MyTasksPage";
import AccessPrint from "./components/AccessPrint/AccessPrint";
import DashboardPage from "./pages/DashboardPage";
import ChoicePage from "./pages/ChoicePage";
import Contracts from "./components/Contract/Contracts";
import AddContract from "./components/Contract/AddContract";
import ContractDetails from "./components/Contract/ContractDetails";
import Stores from "./components/Stores/Stores";
import Surveys from "./components/Surveys/Surveys";
import AddSurvey from "./components/Surveys/AddSurvey";
import EditSurvey from "./components/Surveys/EditSurvey";
import Employees from "./components/Employees/Employees";
import ReportsAndAnalytics from "./components/RelationsDepartment/RelationsDepartment";
import Notification from "./components/notification/notification";
import MyAccount from "./components/MyAccount/MyAccount";
import MonthlyPlanDetails from "./components/Dashboard/MonthlyPlanDetails";
import UrgentComplaintsPage from "./components/Dashboard/UrgentComplaintsPage";
import EmployeesWithUnfinishedSurveys from "./components/EmployeesWithUnfinishedSurveys/EmployeesWithUnfinishedSurveys";
import SupervisorPage from "./pages/SupervisorPage";
import AdminPage from "./pages/AdminPage";
import ProfileRequestsPage from "./components/Profile/ProfileRequestsPage";
import DocumentRequestsPage from "./components/Profile/DocumentRequestsPage";
import CourseRequestsPage from "./components/Profile/CourseRequestsPage";
import Record from "./components/Record/Record";
import ExpiredReports from "./components/ExpiredReports/ExpiredReports";
// لا يوجد تغيير في ProtectedLayout
const ProtectedLayout = ({ setIsAuthenticated }) => {
  return (
    <div className="p-5 flex" dir="rtl">
      <Sidebar />
      <div className="flex-grow overflow-auto">
        <Navbar setIsAuthenticated={setIsAuthenticated} />
        <Routes>
          <Route path="/accessreports" element={<AccessReports />} />
          <Route path="/accessreports/add-report" element={<AddReportForm />} />
          <Route
            path="/accessreports/supervisor/reports"
            element={<SupervisorAccessReports />}
          />
          <Route path="/edit-report/:id" element={<EditReport />} />
          <Route path="/accessreports/print" element={<AccessPrint />} />

          <Route path="/contracts" element={<Contracts />} />
          <Route path="/contracts/create" element={<AddContract />} />
          <Route path="/contracts/edit/:id" element={<ContractForm />} />
          <Route path="/contracts/:id" element={<ContractDetails />} />
          <Route
            path="/contracts/without-survey"
            element={<ContractsWithoutSurveyPage />}
          />

          <Route path="/followupsurveys" element={<FollowUpSurveyList />} />
          <Route path="/followupsurveys/new" element={<FollowUpSurveyCreate />} />
          <Route
            path="/followupsurveys/create/:contractId"
            element={<FollowUpSurveyCreate />}
          />
          <Route
            path="/followupsurveys/:id"
            element={<FollowUpSurveyDetails />}
          />
          <Route
            path="/followupsurveys/:id/edit"
            element={<FollowUpSurveyEdit />}
          />
          <Route path="/expired-reports" element={<ExpiredReports />} />

          <Route path="/stores" element={<Stores />} />
          <Route path="/surveys" element={<Surveys />} />
          <Route path="/surveys/add" element={<AddSurvey />} />
          <Route path="/surveys/edit" element={<EditSurvey />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/MyTasksPage" element={<MyTasksPage />} />

          <Route path="/management" element={<Management />} />
          <Route path="/management/add-user" element={<AddUser />} />
          <Route path="/management/edit-user/:id" element={<EditUser />} />
          <Route path="/management/details/:id" element={<UserDetails />} />

          <Route path="/supervisor" element={<SupervisorPage />} />
          <Route path="/admin" element={<AdminPage />} />

          <Route path="/supervisor/requests/profile" element={<ProfileRequestsPage />} />
          <Route path="/supervisor/requests/documents" element={<DocumentRequestsPage />} />
          <Route path="/supervisor/requests/coursess" element={<CourseRequestsPage />} />

          <Route path="/archives" element={<Archives />} />
          <Route path="/summary-reports" element={<SummaryReports />} />
          <Route
            path="/reports/admin/:adminUsername"
            element={<EmployeeReports />}
          />
          <Route path="/monthly-plan/:employeeName" element={<MonthlyPlanDetails />} />
          <Route path="/urgent-complaints" element={<UrgentComplaintsPage />} />

          <Route
            path="/reports-and-analytics"
            element={<ReportsAndAnalytics />}
          />
          <Route path="/notification" element={<Notification />} />
          <Route path="/my-account" element={<MyAccount />} />
          <Route
            path="/employees-with-unfinished-surveys"
            element={<EmployeesWithUnfinishedSurveys />}
          />
          <Route path="/record" element={<Record />} />

          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
};

const AppContent = ({ isAuthenticated, setIsAuthenticated }) => {
  const location = useLocation();
  const [initialCheckComplete, setInitialCheckComplete] = useState(false); // حالة جديدة للتحقق الأولي

  // استخدام useEffect لقراءة localStorage مرة واحدة عند التحميل
  useEffect(() => {
    // يمكننا تحسين هذا لجعل selectedDepartment حالة داخلية هنا أيضًا
    // ولكن لغرض التبسيط، سنستمر في قراءته مباشرة
    setInitialCheckComplete(true);
  }, []);

  // لا تقم بأي توجيه حتى يكتمل التحقق الأولي
  if (!initialCheckComplete) {
    return null; // أو شاشة تحميل بسيطة
  }

  const selectedDepartment = localStorage.getItem("selectedDepartment");

  // تعريف المسارات التي لا تتطلب مصادقة أو اختيار قسم
  const publicPaths = ["/login", "/choice"];

  // 1. إذا لم يكن المستخدم مصادقًا (بغض النظر عن القسم)
  // و لم يكن المسار الحالي من المسارات العامة، أعد توجيهه إلى /login
  if (!isAuthenticated && !publicPaths.includes(location.pathname)) {
    // حفظ المسار الذي كان يحاول الوصول إليه قبل التوجيه لتسجيل الدخول
    localStorage.setItem("redirectPath", location.pathname);
    return <Navigate to="/login" replace />;
  }

  // 2. إذا كان المستخدم مصادقًا ولكن لم يختر قسمًا بعد
  // و لم يكن المسار الحالي هو /choice، أعد توجيهه إلى /choice
  if (isAuthenticated && !selectedDepartment && location.pathname !== "/choice") {
    // حفظ المسار الذي كان يحاول الوصول إليه قبل التوجيه لاختيار القسم
    localStorage.setItem("redirectPath", location.pathname);
    return <Navigate to="/choice" replace />;
  }

  return (
    <Routes>
      <Route path="/choice" element={<ChoicePage />} />

      <Route
        path="/login"
        element={
          isAuthenticated ? (
            // إذا كان المستخدم مصادقًا بالفعل وكان على صفحة تسجيل الدخول،
            // أعد توجيهه إلى المسار الذي كان فيه قبل تسجيل الدخول، أو المسار الافتراضي للقسم.
            (() => {
              const redirectTo = localStorage.getItem("redirectPath");
              localStorage.removeItem("redirectPath"); // امسح المسار بعد الاستخدام

              if (redirectTo && redirectTo !== "/login" && redirectTo !== "/choice") {
                return <Navigate to={redirectTo} replace />;
              }
              // إذا لم يكن هناك مسار محفوظ، أو كان هو /login أو /choice، فوجه بناءً على القسم
              if (selectedDepartment === "followup") {
                return <Navigate to="/dashboard" replace />;
              } else if (selectedDepartment === "sales") {
                return <Navigate to="/" replace />;
              } else if (selectedDepartment === "archives") {
                return <Navigate to="/archives" replace />;
              }
              return <Navigate to="/choice" replace />; // كحل أخير إذا لم يتم العثور على أي شيء
            })()
          ) : (
            <Login setIsAuthenticated={setIsAuthenticated} />
          )
        }
      />

      {/* المسارات المحمية: يجب أن يصل إليها المستخدم فقط إذا كان مصادقًا ولديه قسم مختار */}
      {/* هذا المسار الشامل يجب أن يكون الأخير */}
      <Route
        path="/*"
        element={
          // إذا كان مصادقًا ولديه قسم، اعرض الـ ProtectedLayout
          isAuthenticated && selectedDepartment ? (
            <ProtectedLayout setIsAuthenticated={setIsAuthenticated} />
          ) : (
            // في حالة غير المصادقة أو عدم وجود قسم، سيتم التعامل معها بواسطة الشروط أعلاه
            // هذا 'الآخر' يجب أن يكون صعب الوصول إليه بسبب الشروط أعلاه.
            // ولكن إذا وصل المستخدم إلى هنا بدون مصادقة أو قسم، نوجهه إلى مكان منطقي.
            // يمكن أن يحدث هذا إذا كان المسار الذي حاول الوصول إليه ليس ضمن publicPaths
            // وتم التعامل معه بواسطة الشروط العلوية
            null // أو يمكنك إعادة توجيه إلى /login أو /choice هنا إذا لزم الأمر، لكن الشروط أعلاه يجب أن تكون كافية.
          )
        }
      />
    </Routes>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    const token = localStorage.getItem("token");
    setIsAuthenticated(loggedIn && !!token);
  }, []);

  return (
    <Router>
      <AppContent
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
    </Router>
  );
};

export default App;