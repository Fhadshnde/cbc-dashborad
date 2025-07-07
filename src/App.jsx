import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

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
import ReportsAndAnalytics from './components/RelationsDepartment/RelationsDepartment';
import Notification from './components/notification/notification';
import MyAccount from './components/MyAccount/MyAccount';

const ProtectedLayout = ({ setIsAuthenticated }) => {
  return (
    <div className="p-5 flex" dir="rtl">
      <Sidebar />
      <div className="flex-grow overflow-auto">
        <Navbar setIsAuthenticated={setIsAuthenticated} />
        <Routes>
          <Route path="/accessreports" element={<AccessReports />} />
          <Route path="/accessreports/add-report" element={<AddReportForm />} />
          <Route path="/accessreports/supervisor/reports" element={<SupervisorAccessReports />} />
          <Route path="/edit-report/:id" element={<EditReport />} />
          <Route path="/accessreports/print" element={<AccessPrint />} />

          <Route path="/contracts" element={<Contracts />} />
          <Route path="/contracts/create" element={<AddContract />} />
          <Route path="/contracts/edit/:id" element={<ContractForm />} />
          <Route path="/contracts/:id" element={<ContractDetails />} />
          <Route path="/contracts/without-survey" element={<ContractsWithoutSurveyPage />} />

          <Route path="/followupsurveys" element={<FollowUpSurveyList />} />
          <Route path="/followupsurveys/new" element={<FollowUpSurveyCreate />} />
          <Route path="/followupsurveys/create/:contractId" element={<FollowUpSurveyCreate />} />
          <Route path="/followupsurveys/:id" element={<FollowUpSurveyDetails />} />
          <Route path="/followupsurveys/:id/edit" element={<FollowUpSurveyEdit />} />

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

          <Route path="/archives" element={<Archives />} />
          <Route path="/summary-reports" element={<SummaryReports />} />
          <Route path="/reports/admin/:adminUsername" element={<EmployeeReports />} />
          <Route path="/reports-and-analytics" element={<ReportsAndAnalytics />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/my-account" element={<MyAccount />} />

          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

const AppContent = ({ isAuthenticated, setIsAuthenticated }) => {
  const location = useLocation();
  const selectedDepartment = localStorage.getItem("selectedDepartment");

  if (!selectedDepartment && location.pathname !== "/choice") {
    return <Navigate to="/choice" replace />;
  }

  return (
    <Routes>
      <Route path="/choice" element={<ChoicePage />} />
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/" replace />
          ) : (
            <Login setIsAuthenticated={setIsAuthenticated} />
          )
        }
      />
      <Route
        path="/*"
        element={
          isAuthenticated ? (
            <ProtectedLayout setIsAuthenticated={setIsAuthenticated} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const token = localStorage.getItem('token');
    setIsAuthenticated(loggedIn && !!token);
  }, []);

  return (
    <Router>
      <AppContent isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
    </Router>
  );
};

export default App;
