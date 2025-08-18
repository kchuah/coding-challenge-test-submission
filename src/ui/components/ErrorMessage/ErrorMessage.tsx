import React, { FunctionComponent } from 'react';
import $ from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: FunctionComponent<ErrorMessageProps> = ({ message }) => {
  return (
    <div className={$.errorMessage} role="alert">
      {message}
    </div>
  );
};

export default ErrorMessage;
