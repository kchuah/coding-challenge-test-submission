import React from "react";
// do styles as required
interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return <div className={""}>{message}</div>;
};

export default ErrorMessage;
