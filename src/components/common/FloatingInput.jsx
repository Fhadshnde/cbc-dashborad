import React from 'react';

const FloatingInput = ({ label, name, value, onChange, type = 'text', placeholder, required = false, className = '', readOnly = false }) => {
  return (
    <div className={`relative z-0 w-full mb-5 group ${className}`}>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" "
        required={required}
        readOnly={readOnly}
      />
      <label
        htmlFor={name}
        className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-full peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingInput;