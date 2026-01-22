'use client';
import { useId } from 'react';

interface InputProps {
  type?: 'text' | 'password' | 'email' | 'search';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
  label?: string;
}

const Input = ({ type = 'text', placeholder, value, onChange, className = '', disabled = false, name, id, label }: InputProps) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const input = (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      name={name}
      id={inputId}
      style={{ backgroundColor: '#fdfdff', fontFamily: 'var(--font-poppins), Poppins, sans-serif' }}
      className={`w-[269px] h-[38px] border border-black border-solid rounded-[40px] px-4 text-sm font-normal outline-none transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-black focus:ring-offset-2 ${className}`}
    />
  );
  return label ? (
    <div className="flex flex-col gap-[10px] items-center w-full">
      <label htmlFor={inputId} style={{ fontFamily: 'var(--font-poppins), Poppins, sans-serif', fontSize: '14px', fontWeight: 500, lineHeight: 'normal', color: '#e0e0e0' }} className="w-[269px] text-left">{label}</label>
      {input}
    </div>
  ) : input;
};

export default Input;
