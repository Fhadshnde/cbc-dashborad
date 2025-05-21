import React from "react";
import NewBills from "./NewBills";
import BestSellers from "./BestSellers";
import TotalBills from "./TotalBills";
import Salas from "./Salas";
import Empty from "./Empty";

const Dashboard = () => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between h-auto md:h-[120vh] w-full gap-4 bg-[#E7EAEF] p-4 rounded-lg">
      <div className="w-full max-w-[400px]">
        <TotalBills />
        <Salas />
        <Empty />
      </div>
      <div className="w-full max-w-[400px] flex flex-col gap-[20px] md:ml-5">
        <NewBills />
        <BestSellers />
      </div>
      <style>{`
        @media (max-width: 700px) {
          .max-w-\\[400px\\] {
            max-width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;