import InputText from "@/components/InputText/InputText";
import React from "react";
import styles from '../../App.module.css';
import Button from "@/components/Button/Button";

type FieldType = "text";

export type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: { label: string; value: string }[]; // for radio/select
};

type FormProps<T> = {
  legend: string;
  fields: FieldConfig[];
  values: T;
  submitLabel: string;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.ChangeEvent<HTMLFormElement>) => void;
};

export function Form<T extends Record<string, any>>({
  legend,
  fields,
  values,
  handleChange,
  onSubmit,
  submitLabel
}: FormProps<T>) {
  return (
    <form onSubmit={onSubmit}>
      <fieldset>
        <legend>{legend}</legend>
          {fields.map((field) => {
            return (
              <div className={styles.formRow}>
                <InputText
                  name={field.name}
                  placeholder={field.placeholder || ''}
                  value={values[field.name] ?? ""}
                  onChange={handleChange}
                />
              </div>
            );
          })}
      </fieldset>

      <Button type="submit">
        {submitLabel}
      </Button>
    </form>
  );
}