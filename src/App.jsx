import React from 'react';
import Dashboard from './components/Dashborad/Dashborad'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/SideBar/Sidebare';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home';
import AccessReports from './components/AccessReports/AccessReports';
const App = () => {
  return (
    <div className="p-5 flex" dir="rtl">
      <Router>
        <Sidebar />
        <div className="flex-grow overflow-auto ">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/accessaeports' element={<AccessReports/>} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
