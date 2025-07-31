import React, { FunctionComponent, InputHTMLAttributes } from "react";

import Button from "../Button/Button";
import InputText from "../InputText/InputText";
import $ from "./Form.module.css";

interface FormEntry {
  name: string;
  placeholder: string;
  extraProps: InputHTMLAttributes<HTMLInputElement>;
}

interface FormProps {
  label: string;
  loading: boolean;
  formEntries: FormEntry[];
  onFormSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  submitText: string;
}

const Form: FunctionComponent<FormProps> = ({
  label,
  loading,
  formEntries,
  onFormSubmit,
  submitText,
}) => {
  return (
    <form onSubmit={onFormSubmit}>
      <fieldset>
        <legend>{label}</legend>
        {formEntries.map(({ name, placeholder, extraProps }, index) => (
          <div key={`${name}-${index}`} className={$.formRow}>
            <InputText
              key={`${name}-${index}`}
              name={name}
              placeholder={placeholder}
              {...{
                ...extraProps,
                value:
                  typeof extraProps.value === "string"
                    ? extraProps.value
                    : extraProps.value !== undefined
                    ? String(
                        Array.isArray(extraProps.value)
                          ? extraProps.value.join(",")
                          : extraProps.value
                      )
                    : "",
              }}
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
