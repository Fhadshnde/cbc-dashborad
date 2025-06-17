import React from 'react';

const StepIndicator = ({ stepNumber, label, isActive, isCompleted }) => {
  const getBgColor = () => {
    if (isCompleted || isActive) return 'bg-[#25BC9D]';
    return 'bg-[#e0e0e0]';
  };

  const getTextColor = () => {
    if (isCompleted || isActive) return 'text-white';
    return 'text-[#777]';
  };

  const getBorderColor = () => {
    return isActive ? 'border-[#00ACC1]' : 'border-[#e0e0e0]';
  };

  const getLabelColor = () => {
    return isCompleted || isActive ? 'text-[#25BC9D]' : 'text-[#777]';
  };

  return (
    <div className="relative flex-1 flex flex-col items-center">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-2 border-2 transition-all duration-300 ${getBgColor()} ${getTextColor()} ${getBorderColor()}`}
      >
        {stepNumber}
      </div>
      <div className={`text-center text-sm ${getLabelColor()}`}>
        {label}
      </div>
      {stepNumber < 5 && (
        <div className="absolute top-5 right-[-50%] h-0.5 w-full bg-[#e0e0e0] z-[-1]"></div>
      )}
    </div>
  );
};

export default StepIndicator;
