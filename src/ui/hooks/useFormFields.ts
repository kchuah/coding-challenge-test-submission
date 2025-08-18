import React from 'react';

interface FormFields {
  postCode: string;
  houseNumber: string;
  firstName: string;
  lastName: string;
  selectedAddress: string;
}

interface UseFormFieldsReturn {
  fields: FormFields;
  onChange: (name: keyof FormFields) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearFields: () => void;
  setField: (name: keyof FormFields, value: string) => void;
}

export const useFormFields = (initialValues?: Partial<FormFields>): UseFormFieldsReturn => {
  const [fields, setFields] = React.useState<FormFields>({
    postCode: '',
    houseNumber: '',
    firstName: '',
    lastName: '',
    selectedAddress: '',
    ...initialValues,
  });

  const onChange = React.useCallback(
    (name: keyof FormFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFields(prev => ({ ...prev, [name]: e.target.value }));
    },
    []
  );

  const clearFields = React.useCallback(() => {
    setFields({
      postCode: '',
      houseNumber: '',
      firstName: '',
      lastName: '',
      selectedAddress: '',
    });
  }, []);

  const setField = React.useCallback((name: keyof FormFields, value: string) => {
    setFields(prev => ({ ...prev, [name]: value }));
  }, []);

  return {
    fields,
    onChange,
    clearFields,
    setField,
  };
};
