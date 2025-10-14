import React from "react";

export default function useFormFields<T extends Record<string, string>>(
  initialValues: T
) {
  const [fields, setFields] = React.useState<T>(initialValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFields = () => {
    setFields(initialValues);
  };

  return {
    fields,
    handleChange,
    clearFields,
  };
}
