interface ButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: string | React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

const Button = ({ onClick, disabled = false, className = '', children, type = 'button' }: ButtonProps) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    style={{ backgroundColor: '#1d9bf0', fontFamily: 'var(--font-poppins), Poppins, sans-serif', fontSize: '14px', fontWeight: 500, lineHeight: 'normal', color: '#E0E0E0' }}
    className={`w-57.25 h-11.5 rounded-3xl flex items-center justify-center transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:opacity-80 ${className}`}
  >
    {children}
  </button>
);

export default Button;
