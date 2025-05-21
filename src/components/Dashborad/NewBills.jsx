import React from "react";
import { FaBell } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

const NewBills = () => {
  const bills = [
    { code: "#34334", status: "بانتظار المراجعة", time: "منذ 4 ساعات", color: "#00C853" },
    { code: "#34334", status: "تمت الموافقة", time: "منذ 5 ساعات", color: "#00C853" },
    { code: "#34334", status: "بانتظار المراجعة", time: "أمس", color: "#00C853" },
    { code: "#34334", status: "قيد التنفيذ", time: "5 ديسمبر 2024", color: "#FF9800" },
  ];

  return (
    <div className="p-4 rounded-lg bg-white shadow-md overflow-y-auto 
                    w-full max-w-[420px] h-auto md:h-[450px] mx-auto">
      <h2 className="text-lg font-bold text-center mb-6">الفواتير المضافة حديثاً</h2>
      <div className="flex flex-col gap-4 px-2">
        {bills.map((bill, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-100">
              <FaBell className="text-gray-400 text-lg" />
            </div>
            
            <div className="flex flex-col text-right flex-1">
              <span className="text-sm font-semibold text-gray-700">{bill.status}</span>
              <span className="text-sm text-gray-500">تمت إضافة فاتورة جديدة بواسطة</span>
              <span className="text-xs text-gray-400">{bill.time}</span>
            </div>
            
            <div className="flex flex-col items-end flex-shrink-0">
              <div className="flex items-center">
                <span className="w-2 h-2 rounded-full ml-2" style={{ backgroundColor: bill.color }}></span>
                <span className="text-sm text-gray-500">{bill.code}</span>
              </div>
              <FontAwesomeIcon 
                icon={faAngleLeft}
                className="text-gray-400 text-sm cursor-pointer hover:text-gray-600 mt-1" 
                onClick={() => console.log("Navigate to bill details", bill.code)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewBills;
