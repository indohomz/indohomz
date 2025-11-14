import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
}

const variantStyles = {
  primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700',
  secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
  outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2',
  lg: 'px-6 py-3 text-lg'
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  icon
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        rounded-lg font-medium
        flex items-center justify-center gap-2
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {icon && <span className="text-xl">{icon}</span>}
      {children}
    </button>
  );
};