import React, { InputHTMLAttributes } from 'react';

// Card Component
export const Card: React.FC<{ children: React.ReactNode; title: string; description?: string; icon?: React.ReactNode }> = ({ children, title, description, icon }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full transition-all hover:shadow-md">
    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
      {icon && <div className="text-indigo-600 bg-indigo-50 p-2 rounded-lg">{icon}</div>}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 leading-tight">{title}</h3>
        {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
      </div>
    </div>
    <div className="p-6 flex-1 flex flex-col">
      {children}
    </div>
  </div>
);

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', ...props }) => {
  const baseStyles = "inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-500",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-indigo-500",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-500",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-500"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props} />
  );
};

// Input Component
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  suffix?: string;
}

export const Input: React.FC<InputProps> = ({ label, suffix, className = '', id, ...props }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        <input
          id={id}
          className={`block w-full rounded-lg border-slate-300 border p-2.5 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${className}`}
          {...props}
        />
        {suffix && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-slate-500 sm:text-sm">{suffix}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Result Display Component
export const ResultDisplay: React.FC<{ label: string; value: string | number; message?: string | React.ReactNode; type?: 'neutral' | 'success' | 'warning' | 'danger' }> = ({ label, value, message, type = 'neutral' }) => {
  const typeColors = {
    neutral: "bg-slate-50 text-slate-900 border-slate-200",
    success: "bg-green-50 text-green-800 border-green-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
    danger: "bg-red-50 text-red-800 border-red-200",
  };

  return (
    <div className={`mt-6 p-4 rounded-lg border ${typeColors[type]}`}>
      <div className="text-sm font-medium opacity-80 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-3xl font-bold tracking-tight">{value}</div>
      {message && <div className="mt-2 text-sm font-medium border-t border-black/10 pt-2">{message}</div>}
    </div>
  );
};
