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
import ContractsPage from './pages/ContractsPage';
import ContractDetails from './components/ContractDetails'
import FollowUpSurveyList from './components/FollowUp/FollowUpSurveyList';
import FollowUpSurveyCreate from './components/FollowUp/FollowUpSurveyCreate';
import FollowUpSurveyDetails from './components/FollowUp/FollowUpSurveyDetails';
import FollowUpSurveyEdit from './components/FollowUp/FollowUpSurveyEdit';
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
              <div className="p-5 flex" dir="rtl">
                <Sidebar />
                <div className="flex-grow overflow-auto">
                  <Navbar setIsAuthenticated={setIsAuthenticated} />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/accessreports" element={<AccessReports />} />
                    <Route path="/accessreports/add-report" element={<AddReportForm />} />
                    <Route path="/accessreports/supervisor/reports" element={<SupervisorAccessReports />} />
                    <Route path="/supervisor/reports/edit/:id" element={<EditReport />} />
                    <Route path="/archives" element={<Archives />} />
                    <Route path="/summary-reports" element={<SummaryReports />} />
                    <Route path="/reports/admin/:adminUsername" element={<EmployeeReports />} />
                    <Route path="/management" element={<Management />} />
                    <Route path="/management/add-user" element={<AddUser />} />
                    <Route path="/management/edit-user/:id" element={<EditUser />} />
                    <Route path="/management/details/:username" element={<UserDetails />} />
                    <Route path="/contracts" element={<ContractsPage />} />
                    <Route path="/contracts/:id" element={<ContractDetails />} />
                    <Route path="/followupsurveys" element={<FollowUpSurveyList />} />
                    <Route path="/followupsurveys/new" element={<FollowUpSurveyCreate />} />
                    <Route path="/followupsurveys/:id" element={<FollowUpSurveyDetails />} />
                    <Route path="/followupsurveys/:id/edit" element={<FollowUpSurveyEdit />} />
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