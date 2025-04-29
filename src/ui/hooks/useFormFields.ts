import { useState } from "react";

type FormFields = {
  postcode: string;
  houseNumber: string;
  firstName: string;
  lastName: string;
  selectedAddress: string;
};

const useFormFields = (initialState: FormFields) => {
  const [fields, setFields] = useState(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const clearFields = () => {
    setFields(initialState);
  };

  return { fields, handleChange, clearFields, setFields };
};

export default useFormFields;
export type { FormFields };
