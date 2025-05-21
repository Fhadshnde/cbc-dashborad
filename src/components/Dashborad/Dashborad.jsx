import React from "react";
import NewBills from "./NewBills";
import BestSellers from "./BestSellers";
import TotalBills from "./TotalBills";
import Salas from "./Salas";
import Empty from "./Empty";

const Dashboard = () => {
  return (
    <div className="flex justify-between md:flex-row h-[120vh] w-400 gap-4 bg-[#E7EAEF] p-4 rounded-lg">
      <div className="w-full md:w-[400px]">
        <TotalBills />
        <Salas />
        <Empty />
      </div>
      <div className="w-full md:w-[400px] flex flex-col gap-[20px] ml-5">
        <NewBills />
        <BestSellers />
      </div>
    </div>
  );
};

export default Dashboard;
