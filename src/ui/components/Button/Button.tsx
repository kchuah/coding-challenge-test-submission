import { ButtonType, ButtonVariant } from "@/types";
import classNames from "classnames";
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
  return (
    <button
      className={classNames($.button, {
        [$.primary]: variant === "primary",
        [$.secondary]: variant === "secondary",
      })}
      type={type}
      onClick={onClick}
      disabled={loading}
    >
      {loading ? (
        <span data-testid="loading-spinner" className={$.spinner} aria-hidden />
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
