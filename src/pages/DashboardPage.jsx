import React from 'react';
import DashboardCards from '../components/Dashboard/DashboardCards';
import MapLocationCard from '../components/Dashboard/MapLocationCard';
import UrgentNotesCard from '../components/Dashboard/UrgentNotesCard';
import EmployeePerformanceCard from '../components/Dashboard/EmployeePerformanceCard'; // سنستخدمه هنا مرة واحدة
import TotalEmployeesCards from '../components/Dashboard/TotalEmployeesCards';
import DailyScheduleTable from '../components/Dashboard/DailyScheduleTable';

function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 font-sans rtl" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col gap-6 ">
          <DashboardCards />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <EmployeePerformanceCard />
          </div>
          <DailyScheduleTable />
        </div>
        <div className="lg:col-span-4 flex flex-col gap-6">
          <MapLocationCard />
          <UrgentNotesCard />
          <TotalEmployeesCards />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;