import React from 'react';

function MapLocationCard() {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full lg:w-96 flex flex-col text-right rtl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">مواقع المتاجر</h3>
        <span className="text-gray-400 text-2xl leading-none">...</span>
      </div>
      <div className="w-full h-64 rounded-lg overflow-hidden">
      <img
  src="https://wpdatatables.com/wp-content/uploads/2019/07/store.jpg"
  alt="Store Locations Map"
  className="w-full h-full object-cover"
/>

      </div>
    </div>
  );
}

export default MapLocationCard;
