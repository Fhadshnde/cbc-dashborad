import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChoicePage = () => {
  const navigate = useNavigate();

  const handleChoice = (department) => {
    localStorage.setItem("selectedDepartment", department);
    if (department === "followup") {
      navigate("/dashboard", { replace: true });
    } else {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">اختر القسم الذي تريد الذهاب إليه</h1>
      <div className="flex space-x-4">
        <button
          onClick={() => handleChoice("sales")}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
        >
          قسم المبيعات
        </button>
        <button
          onClick={() => handleChoice("followup")}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
        >
          قسم المتابعة
        </button>
      </div>
    </div>
  );
};

export default ChoicePage;
