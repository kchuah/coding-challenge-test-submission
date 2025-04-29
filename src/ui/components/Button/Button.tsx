import { ButtonType, ButtonVariant } from "@/types";
import React, { FunctionComponent } from "react";
import $ from "./Button.module.css";

interface ButtonProps {
  onClick?: () => void;
  type?: ButtonType;
  variant?: ButtonVariant;
  loading?: boolean;
  children: React.ReactNode;
}

const Button: FunctionComponent<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  loading = false,
}) => {
  // Conditional class based on variant and loading state
  const buttonClass = `${$.button} ${variant === "primary" ? $.primary : $.secondary}`;

  return (
    <button
      className={buttonClass}
      type={type}
      onClick={onClick}
      disabled={loading} // Disable the button while loading
      aria-busy={loading} // Adds 'aria-busy' for better accessibility
      aria-label={loading ? "Loading..." : "Submit"} // Change button label for accessibility when loading
    >
      {children}
      {loading && (
        <span
          className={$.spinner}
          data-testid="loading-spinner"
          aria-label="Loading" // Helps with screen readers
        />
      )}
    </button>
  );
};

export default Button;
