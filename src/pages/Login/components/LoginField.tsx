import React, { ChangeEvent, ReactNode } from "react";

interface LoginFieldProps {
  icon: ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  action?: ReactNode;
  actionLabel?: string;
}

const LoginField: React.FC<LoginFieldProps> = ({
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
  autoComplete,
  action,
  actionLabel,
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="login-field">
      <span className="login-field__icon">{icon}</span>
      <input
        aria-label={placeholder}
        autoComplete={autoComplete}
        onChange={handleChange}
        placeholder={placeholder}
        type={type}
        value={value}
      />
      {action && (
        <span aria-label={actionLabel} className="login-field__suffix">
          {action}
        </span>
      )}
    </div>
  );
};

export default LoginField;
