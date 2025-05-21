import React from "react";
import NewBills from "./NewBills";
import BestSellers from "./BestSellers";
import TotalBills from "./TotalBills";
import Salas from "./Salas";
import Empty from "./Empty";

const Dashboard = () => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between h-auto md:h-[120vh] w-[1200px] gap-4 bg-[#E7EAEF] p-4 rounded-lg dashboard-main">
      <div className="w-full max-w-[400px] dashboard-col">
        <TotalBills />
        <Salas />
        <Empty />
      </div>
      <div className="w-full max-w-[400px] flex flex-col gap-[20px] md:ml-5 dashboard-col">
        <NewBills />
        <BestSellers />
      </div>

      <style>{`
        /* تصغير عرض العمود dashboard-col */
        @media (max-width: 900px) {
          .dashboard-col {
            max-width: 420px !important;
            width: 420px !important;
          }
          /* تصغير عرض الحاوية الرئيسية */
          .dashboard-main {
            width: 90vw !important;
            max-width: 90vw !important;
          }
        }
        @media (max-width: 700px) {
          .dashboard-col {
            max-width: 100vw !important;
            width: 100vw !important;
          }
          /* تصغير عرض الحاوية الرئيسية */
          .dashboard-main {
            width: 100vw !important;
            max-width: 100vw !important;
            padding-left: 8px !important;
            padding-right: 8px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
