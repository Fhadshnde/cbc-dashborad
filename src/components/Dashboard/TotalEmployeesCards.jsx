// TotalEmployeesCards.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function TotalEmployeesCards() {
  const navigate = useNavigate();

  const employeesData = [
    {
      name: "علي",
      contractsCount: 12,
      followUpsCount: 8,
      bgColor: "bg-pink-50",
      iconBg: "bg-pink-100",
      textColor: "text-pink-700",
      iconPath:
        "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
    },
    {
      name: "محمد",
      contractsCount: 15,
      followUpsCount: 10,
      bgColor: "bg-orange-50",
      iconBg: "bg-orange-100",
      textColor: "text-orange-700",
      iconPath:
        "M19 3H5c-1.1 0-2 .9-2 2v14l7-3 7 3V5c0-1.1-.9-2-2-2z",
    },
    {
      name: "سارة",
      contractsCount: 9,
      followUpsCount: 14,
      bgColor: "bg-yellow-50",
      iconBg: "bg-yellow-100",
      textColor: "text-yellow-700",
      iconPath:
        "M12 4.14L6 6v6c0 3.31 2.69 6 6 6s6-2.69 6-6V6l-6-1.86z",
    },
    {
      name: "ندى",
      contractsCount: 20,
      followUpsCount: 5,
      bgColor: "bg-teal-50",
      iconBg: "bg-teal-100",
      textColor: "text-teal-700",
      iconPath:
        "M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z",
    },
  ];

  return (
    <div
      className="bg-white rtl p-6 rounded-xl shadow-sm"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "20px",
        justifyContent: "center",
      }}
    >
      {employeesData.map((emp, index) => (
        <div
          key={index}
          onClick={() => navigate(`/monthly-plan/${emp.name}`)}
          className={`${emp.bgColor} cursor-pointer rounded-xl shadow-sm p-6 flex flex-col items-center justify-center text-center hover:shadow-md transition`}
          style={{ minHeight: "210px" }}
        >
          <h3 className="text-lg font-semibold text-gray-700 mb-3">{emp.name}</h3>

          <div
            className={`w-16 h-16 rounded-full ${emp.iconBg} flex items-center justify-center mb-3`}
          >
            <svg
              className="w-8 h-8 text-gray-500"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d={emp.iconPath} />
            </svg>
          </div>

          <div className={`${emp.textColor} text-xl font-bold`}>
            العقود: {emp.contractsCount}
          </div>
          <div className={`${emp.textColor} text-xl font-bold mt-1`}>
            المتابعات: {emp.followUpsCount}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TotalEmployeesCards;
