import React, { FunctionComponent } from 'react';

import $ from './Radio.module.css';

interface RadioProps {
  id: string;
  name: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  checked?: boolean;
  children: React.ReactNode;
}

const Radio: FunctionComponent<RadioProps> = ({ children, id, name, onChange, value, checked }) => {
  return (
    <div className={$.radio}>
      <input 
        type="radio" 
        id={id} 
        name={name} 
        onChange={onChange} 
        value={value || id}
        checked={checked}
      />
      <label htmlFor={id}>{children}</label>
    </div>
  );
};

export default Radio;
