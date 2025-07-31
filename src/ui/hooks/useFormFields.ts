import React from "react";

type FormFields<T> = T & {
  [key: string]: string;
};

export default function useFormFields<T extends Record<string, string>>(
  initialFields: T
) {
  const [fields, setFields] = React.useState<FormFields<T>>(initialFields);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFields = () => setFields(initialFields);

  return { fields, onChange, resetFields, setFields };
}
