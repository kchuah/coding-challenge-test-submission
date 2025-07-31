import { ButtonType, ButtonVariant } from "@/types";
import React, { FunctionComponent } from "react";
import cx from "classnames";

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
  return (
    <button
      className={cx(
        $.button,
        variant === "primary" && $.primary,
        variant === "secondary" && $.secondary
      )}
      type={type}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <span data-testid="loading-spinner">Loading...</span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
