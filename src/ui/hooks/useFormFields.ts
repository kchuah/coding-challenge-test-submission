import { useState } from 'react';

interface FormFields {
  postCode: string;
  houseNumber: string;
  firstName: string;
  lastName: string;
  selectedAddress: string;
}

interface UseFormFieldsReturn {
  fields: FormFields;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearFields: () => void;
}

const initialFields: FormFields = {
  postCode: '',
  houseNumber: '',
  firstName: '',
  lastName: '',
  selectedAddress: '',
};

export const useFormFields = (): UseFormFieldsReturn => {
  const [fields, setFields] = useState<FormFields>(initialFields);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearFields = () => {
    setFields(initialFields);
  };

  return {
    fields,
    onChange,
    clearFields,
  };
};
