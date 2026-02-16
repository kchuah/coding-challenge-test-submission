import React from "react";

export interface FormFields {
  postCode: string;
  houseNumber: string;
  firstName: string;
  lastName: string;
  selectedAddress: string;
}

const initialFields: FormFields = {
  postCode: "",
  houseNumber: "",
  firstName: "",
  lastName: "",
  selectedAddress: "",
};

export function useFormFields() {
  const [fields, setFields] = React.useState<FormFields>(initialFields);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFields((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const reset = React.useCallback(() => {
    setFields(initialFields);
  }, []);

  return { fields, setFields, handleChange, reset };
}
