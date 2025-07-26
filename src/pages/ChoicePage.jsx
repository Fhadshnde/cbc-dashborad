import React from "react";
import { useNavigate } from "react-router-dom";

const ChoicePage = () => {
  const navigate = useNavigate();

  const handleChoice = (department) => {
    localStorage.setItem("selectedDepartment", department);

    const redirectTo = localStorage.getItem("redirectPath");
    localStorage.removeItem("redirectPath");

    if (department === "archives") {
      navigate("/login", { replace: true });
      return;
    }

    if (redirectTo && redirectTo !== "/choice" && redirectTo !== "/login") {
      navigate(redirectTo, { replace: true });
    } else if (department === "followup") {
      navigate("/dashboard", { replace: true });
    } else if (department === "sales") {
      navigate("/", { replace: true });
    }
  };

  const handleArchiveClick = () => {
    handleChoice("archives");
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-[#F5F7FA] relative"
      dir="rtl"
    >
      {/* Archive Icon Button in Top Right (Transparent Background) */}
      <button
        onClick={handleArchiveClick}
        className="absolute top-4 right-4 p-2 text-gray-700 rounded-full transition duration-300 hover:bg-gray-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
          />
        </svg>
      </button>

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#2C3E50] mb-2">اختر المستخدم</h1>
        <p className="text-lg text-[#6B778C]">مرحباً! اختر المستخدم من المربع أدناه</p>
      </div>
      <div className="flex space-x-6">
        <button
          onClick={() => handleChoice("followup")}
          className="flex flex-col items-center justify-center w-64 h-48 bg-white rounded-xl shadow-lg transition duration-300 transform hover:scale-105"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 text-[#6BBEB0] mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 20h-4v-2c0-.55-.45-1-1-1s-1 .45-1 1v2H7c-.55 0-1 .45-1 1s-.45 1 1 1h10c.55 0 1-.45 1-1s-.45-1-1-1zM12 11c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0 2c3.31 0 6 2.69 6 6v1H6v-1c0-3.31 2.69-6 6-6z"
            />
          </svg>
          <span className="text-xl font-semibold text-[#6BBEB0]">موظف علاقات</span>
        </button>

        <button
          onClick={() => handleChoice("sales")}
          className="flex flex-col items-center justify-center w-64 h-48 bg-[#6BBEB0] rounded-xl shadow-lg transition duration-300 transform hover:scale-105"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 text-white mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 11c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
            />
          </svg>
          <span className="text-xl font-semibold text-white">موظف مبيعات</span>
        </button>
      </div>
    </div>
  );
};

export default ChoicePage;