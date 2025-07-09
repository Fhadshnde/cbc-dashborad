// UrgentNotesCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function UrgentNotesCard() {
  const navigate = useNavigate();

  const urgentNotes = [
    {
      message: "يرجى التوجه نحو متجر الرصافة في أقرب وقت",
      date: "2025 يناير / 7 / 12:07 pm",
      level: "red",
    },
    {
      message: "يرجى التوجه نحو متجر الكرادة بأقرب وقت",
      date: "2025 يناير / 6 / 10:30 am",
      level: "yellow",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full lg:w-96 flex flex-col text-right rtl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800"> تنبهات عاجلة (الشكاوي) </h3>
        <span
          className="text-gray-400 text-2xl leading-none cursor-pointer"
          onClick={() => navigate("/urgent-complaints")}
        >
          ...
        </span>
      </div>
      <div className="space-y-4">
        {urgentNotes.map((note, index) => (
          <div
            key={index}
            className={`$ {
              note.level === "red"
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-yellow-50 border-yellow-200 text-yellow-800"
            } border rounded-lg p-3 flex items-start gap-3`}
          >
            <svg
              className={`w-5 h-5 mt-1 flex-shrink-0 $ {
                note.level === "red" ? "text-red-500" : "text-yellow-600"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div>
              <p className="text-sm font-medium">{note.message}</p>
              <p className="text-gray-500 text-xs mt-1">{note.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UrgentNotesCard;
