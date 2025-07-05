import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Sidebar from './components/SideBar/Sidebare';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';
import AccessReports from './components/AccessReports/AccessReports';
import AddReportForm from './components/AccessReports/AddReport';
import Login from './pages/Login';
import SupervisorAccessReports from './components/AccessReports/SupervisorAccessReports';
import EditReport from './components/AccessReports/EditReport';
import Archives from './components/Archives/Archives';
import SummaryReports from './components/SummaryReports/SummaryReports';
import EmployeeReports from './components/SummaryReports/EmployeeReports';
import Management from './components/Management/Management';
import AddUser from './components/Management/AddUser';
import EditUser from './components/Management/EditUser';
import UserDetails from './components/Management/UserDetails';
import ContractForm from './components/ContractForm';
import FollowUpSurveyList from './components/FollowUp/FollowUpSurveyList';
import FollowUpSurveyCreate from './components/FollowUp/FollowUpSurveyCreate';
import FollowUpSurveyDetails from './components/FollowUp/FollowUpSurveyDetails';
import FollowUpSurveyEdit from './components/FollowUp/FollowUpSurveyEdit';
import SelectStoreForSurvey from './pages/SelectStoreForSurvey';
import ContractsWithoutSurveyPage from './pages/ContractsWithoutSurveyPage';
import MyTasksPage from './pages/MyTasksPage';
import AccessPrint from './components/AccessPrint/AccessPrint';
import DashboardPage from './pages/DashboardPage';
import ChoicePage from './pages/ChoicePage';
import Contracts from './components/Contract/Contracts';
import AddContract from './components/Contract/AddContract';
import ContractDetails from './components/Contract/ContractDetails';
import Stores from './components/Stores/Stores'; 
import Surveys from './components/Surveys/Surveys'; 
import AddSurvey from './components/Surveys/AddSurvey';
import EditSurvey from './components/Surveys/EditSurvey'; 
import Employees from './components/Employees/Employees';
import ReportsAndAnalytics from './components/RelationsDepartment/RelationsDepartment'; // Assuming you have this component

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const token = localStorage.getItem('token');
    setIsAuthenticated(loggedIn && !!token);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />

        <Route
          path="/*" 
          element={
            isAuthenticated ? (
              <div className="p-5 flex" dir="rtl">
                <Sidebar />
                <div className="flex-grow overflow-auto">
                  <Navbar setIsAuthenticated={setIsAuthenticated} />
                  <Routes>

                    <Route path="/accessreports/add-report" element={<AddReportForm />} />
                    <Route path="/accessreports/supervisor/reports" element={<SupervisorAccessReports />} />
                    <Route path="/accessreports/print/:id" element={<AccessPrint />} />
                    <Route path="/accessreports/print" element={<AccessPrint />} />
                    <Route path="/accessreports" element={<AccessReports />} />
                    <Route path="/edit-report/:id" element={<EditReport />} />
                    {/* <Route path="/supervisor/reports/edit/:id" element={<EditReport />} /> */}

                    {/* مسارات العقود */}
                    <Route path="/contracts/create" element={<AddContract />} /> {/* استخدام AddContract هنا إذا كان ContractForm هو نفسه AddContract */}
                    <Route path="/contracts/edit/:id" element={<ContractForm />} /> {/* إذا كان ContractForm يستخدم للتعديل */}
                    <Route path="/contracts/:id" element={<ContractDetails />} />
                    <Route path="/contracts/without-survey" element={<ContractsWithoutSurveyPage />} />
                    <Route path="/contracts" element={<Contracts />} />
                    <Route path="/add-contract" element={<AddContract />} /> {/* إذا كان هذا مسار منفصل لإضافة عقد */}
                    <Route path="/contract-details" element={<ContractDetails />} />

                    {/* مسارات المتابعة والاستبيانات */}
                    <Route path="/followupsurveys/create/:contractId" element={<FollowUpSurveyCreate />} />
                    <Route path="/followupsurveys/new" element={<FollowUpSurveyCreate />} />
                    <Route path="/followupsurveys/:id/edit" element={<FollowUpSurveyEdit />} />
                    <Route path="/followupsurveys/:id" element={<FollowUpSurveyDetails />} />
                    <Route path="/followupsurveys" element={<FollowUpSurveyList />} />
                    <Route path="/select-store-for-survey" element={<SelectStoreForSurvey />} />

                    {/* مسارات الإدارة والمستخدمين */}
                    <Route path="/management/add-user" element={<AddUser />} />
                    <Route path="/management/edit-user/:id" element={<EditUser />} />
                    <Route path="/management/details/:id" element={<UserDetails />} />
                    <Route path="/management" element={<Management />} />

                    {/* مسارات تقارير المبيعات */}
                    <Route path="/reports/admin/:adminUsername" element={<EmployeeReports />} />
                    <Route path="/summary-reports" element={<SummaryReports />} />

                    {/* المسارات الأخرى */}
                    <Route path="/archives" element={<Archives />} />
                    <Route path="/my-tasks" element={<MyTasksPage />} />

                    {/* المسارات الخاصة بـ Pages (مثل Dashboard, Stores, Home) */}
                    <Route path="/stores" element={<Stores />} /> {/* هذا هو المسار الذي تريده */}
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/surveys" element={<Surveys />} /> {/* تأكد من أن هذا المسار صحيح */}
                    <Route path="/surveys/add" element={<AddSurvey />} />
                    <Route path="/surveys/edit" element={<EditSurvey />} />
                    <Route path="/employees" element={<Employees />} />
                    <Route path="/choice" element={<ChoicePage />} />
                    <Route path="/reports-and-analytics" element={<ReportsAndAnalytics />} /> {/* Assuming you have this component */}

                    {/* المسار الجذر: يجب أن يكون في النهاية أو قبل الـ catch-all */}
                    <Route path="/" element={<Home />} /> {/* المسار الجذر يجب أن يكون في النهاية أو قبل الـ catch-all */}

                    {/* المسار الشامل: يجب أن يكون في النهاية ليتأكد من أن جميع المسارات الأخرى قد حظيت بفرصتها */}
                    <Route path="*" element={<Navigate to="/choice" replace />} />
                  </Routes>
                </div>
              </div>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;