import React from 'react';

const Input = ({
  label,
  icon: Icon,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
            <Icon size={18} />
          </div>
        )}
        <input
          className={`
            w-full bg-white border rounded-lg px-4 py-2.5 outline-none transition-all
            ${Icon ? 'pl-10' : ''}
            ${error
              ? 'border-red-500 focus:ring-2 focus:ring-red-100'
              : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'}
          `}
          {...props}
        />
      </div>
      {error && (
        <span className="text-xs text-red-500 font-medium">{error}</span>
      )}
    </div>
  );
};

export default Input;
