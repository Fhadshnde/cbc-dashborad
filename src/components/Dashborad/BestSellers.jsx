import React, { useState, useEffect } from "react";
import axios from "axios";

const BestSellers = () => {
  const [user, setUser] = useState(null);

  const data = [
    { name: "مصطفى احمد", total: "9 عمليات بيع" },
    { name: "علي محمد", total: "8 عمليات بيع" },
    { name: "سارة خالد", total: "7 عمليات بيع" },
    { name: "ليلى حسن", total: "6 عمليات بيع" },
    { name: "كريم فؤاد", total: "5 عمليات بيع" },
    { name: "أحمد سامي", total: "4 عمليات بيع" },
    { name: "نهى فتحي", total: "3 عمليات بيع" },
    { name: "جمال مصطفى", total: "2 عمليات بيع" },
  ];

  useEffect(() => {
    axios.get("https://randomuser.me/api/")
      .then(res => {
        setUser(res.data.results[0]);
      });
  }, []);

  if (!user) return null;

  return (
    <div
      className="
        p-4 rounded-lg bg-white shadow-md overflow-y-auto
        w-[420px] max-w-[420px] min-w-[320px] h-auto md:h-[450px] mx-auto
        transition-all duration-300
        [@media(max-width:600px)]:w-[320px]
        [@media(max-width:600px)]:max-w-[100vw]
        [@media(max-width:600px)]:min-w-0
      "
    >
      <h2 className="text-lg font-bold text-center mb-6">أفضل البائعين</h2>
      <div className="flex flex-col gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-start">
            <div className="ml-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 overflow-hidden">
                <img src={user.picture.large} alt="User" className="w-full h-full object-cover rounded-full" />
              </div>
            </div>
            <div className="flex flex-col text-right flex-1 pr-2">
              <span className="text-sm font-semibold text-gray-700">{item.name}</span>
              <span className="text-sm text-gray-500">{item.total}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSellers;
