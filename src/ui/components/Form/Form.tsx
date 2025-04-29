import React, { FunctionComponent } from 'react';
import Button from '../Button/Button';
import InputText from '../InputText/InputText';
import $ from './Form.module.css';

// Define the extraProps type more narrowly to match with the InputText component's expected props
interface FormEntry {
  name: string;
  placeholder: string;
  extraProps: React.InputHTMLAttributes<HTMLInputElement>; // Narrow the type for extraProps
}

interface FormProps {
  label: string;
  loading: boolean;
  formEntries: FormEntry[];
  onFormSubmit: () => void;
  submitText: string;
}

const Form: FunctionComponent<FormProps> = ({
  label,
  loading,
  formEntries,
  onFormSubmit,
  submitText
}) => {
  return (
    <form onSubmit={onFormSubmit}>
      <fieldset>
        <legend>{label}</legend>
        {formEntries.map(({ name, placeholder, extraProps }, index) => (
          <div key={`${name}-${index}`} className={$.formRow}>
            {/* Ensure value is a string to match InputText's expected props */}
            <InputText
              key={`${name}-${index}`}
              name={name}
              placeholder={placeholder}
              // Coerce the value to string, if it's a number or array, convert it to a string
              value={extraProps.value != null ? `${extraProps.value}` : ''} // Ensure value is coerced to a string or fallback to an empty string
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
