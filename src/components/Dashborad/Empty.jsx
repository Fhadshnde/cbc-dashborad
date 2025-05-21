import React from 'react';

const Empty = () => {
  return (
    <div
      className="
        bg-white rounded-xl shadow-md p-4 mt-4 mx-auto
        w-[600px] max-w-[600px] min-w-[320px] h-[320px]
        transition-all duration-300
        [@media(max-width:600px)]:w-[320px]
        [@media(max-width:600px)]:max-w-[100vw]
        [@media(max-width:600px)]:min-w-0
      "
    >
    </div>
  );
};

export default Empty;
