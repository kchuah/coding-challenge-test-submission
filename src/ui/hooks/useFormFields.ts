import { useState } from "react";

const useFormFields = <T extends Record<string, string>>(initialValues: T) => {
    const [formvalues, setFormValues] = useState<T>(initialValues);
    const resetFormFields = () => setFormValues(initialValues);

    const onFieldChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };


    return { formvalues, onFieldChangeHandler, setFormValues, resetFormFields };
};

export default useFormFields;
