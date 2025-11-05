import React, { ReactNode, FunctionComponent } from 'react';

import Button from "@/components/Button/Button";
import InputText from '../InputText/InputText';
import $ from './Form.module.css';


interface FormEntry {
  name: string;
  placeholder: string;
  // TODO: Defined a suitable type for extra props
  // This type should cover all different of attribute types
  extraProps: any;
}

interface FormProps {
  label: string;
  loading: boolean;
  formEntries: FormEntry[];
  children ?: ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitText: string;
}

const Form: FunctionComponent<FormProps> = ({
  label,
  loading,
  formEntries,
  children,
  onSubmit,
  submitText
}) => {
  return (
    <form onSubmit={onSubmit}>
      <fieldset>
        <legend>{label}</legend>
        {formEntries.map(({ name, placeholder, extraProps }, index) => (
          <div key={`${name}-${index}`} className={$.formRow}>
            <InputText
              key={`${name}-${index}`}
              name={name}
              placeholder={placeholder}
              {...extraProps}
            />
          </div>
        ))}

        <Button loading={loading} type="submit">
          {submitText}
        </Button>
      </fieldset>
    </form>
  );
};

export default Form;

