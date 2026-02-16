import React, { FunctionComponent } from 'react';

import $ from './Radio.module.css';

interface RadioProps {
  id: string;
  name: string;
  value?: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  children: React.ReactNode;
}

const Radio: FunctionComponent<RadioProps> = ({
  children,
  id,
  name,
  value = id,
  checked,
  onChange,
}) => {
  return (
    <div className={$.radio}>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
      <label htmlFor={id}>{children}</label>
    </div>
  );
};

export default Radio;
