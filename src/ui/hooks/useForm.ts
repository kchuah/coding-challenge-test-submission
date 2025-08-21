import { useState } from "react";

type FormState<T> = {
  values: T;
  setField: <K extends keyof T>(field: K, value: T[K]) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  resetForm: (newValues?: Partial<T>) => void;
};

export function useForm<T extends Record<string, any>>(initialValues: T): FormState<T> {
  const [values, setValues] = useState<T>(initialValues);

  const setField = <K extends keyof T>(field: K, value: T[K]) => {
    setValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  
 const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | HTMLFormElement>
) => {
  const { name, value, type } = e.target;

  if (e.target instanceof HTMLInputElement && type === "checkbox") {
    const target = e.target as HTMLInputElement;
    setValues(prev => ({
      ...prev,
      [name]: target.checked,
    }));
  } else {
    setValues(prev => ({
      ...prev,
      [name]: value,
    }));
  }
};

  const resetForm = (newValues: Partial<T> = {}) => {
    setValues({ ...initialValues, ...newValues });
  };

  return { values, setField, handleChange, resetForm };
}