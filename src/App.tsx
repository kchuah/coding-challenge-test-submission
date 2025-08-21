import React from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import useAddressBook from "@/hooks/useAddressBook";
import { Address as AddressType } from "./types";
import { useForm } from "./ui/hooks/useForm";
import { FieldConfig, Form } from "./ui/forms/forms";
import Button from "@/components/Button/Button";

type UserFormAddress = {
  postCode: string;
  houseNumber: string;
  selectedAddress: string;
};

type UseFormInfo = {
  firstName: string;
  lastName: string;
}

const addressFields: FieldConfig[] = [
  { name: "postCode", label: "Post Code", type: "text", placeholder: "Enter post code" },
  { name: "houseNumber", label: "House Number", type: "text", placeholder: "Enter house number" }
];

const infoFields: FieldConfig[] = [
  { name: "firstName", label: "First Name", type: "text", placeholder: "First Name" },
  { name: "lastName", label: "Last Name", type: "text", placeholder: "Last Name" }
];


function App() {
   const { values: addValues, handleChange: addressChange, resetForm: addressResetForm } = useForm<UserFormAddress>({
    postCode: "",
    houseNumber: "",
    selectedAddress: "",
  });

  const { values: infoValues, handleChange: infoChange, resetForm: resetInfoForm } = useForm<UseFormInfo>({
    firstName: "",
    lastName: "",
  });
  /**
   * Results states
   */
  const [error, setError] = React.useState<undefined | string>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  const { firstName, lastName } = infoValues;
  const { postCode, houseNumber, selectedAddress } = addValues
  
  /**
   * Redux actions
   */
  const { addAddress } = useAddressBook();
  const handleAddressSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/getAddresses?postcode=${postCode}&streetnumber=${houseNumber}`);
      const data = await res.json();
      setAddresses(data.details);
      addressResetForm()
    } catch(error: any) {
      setError("Error fetching address. Please try again!")
    }
  };

  const handlePersonSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedAddress || !addresses.length) {
      setError(
        "No address selected, try to select an address or find one if you haven't"
      );
      return;
    }

    if (!firstName || !lastName) {
      setError("First name and last name fields mandatory!")
      return
    }

    const foundAddress = addresses.find(
      (address) => address.houseNumber === selectedAddress
    );
    
    if (!foundAddress) {
      setError("Selected address not found");
      return;
    }
  
    addAddress({ ...foundAddress, firstName, lastName });
  };

  const handleClearAllFields = () => {
    resetInfoForm();
    addressResetForm();
  }

  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode add personal info and done! 👏
          </small>
        </h1>
        <Form
          legend="Address Form"
          fields={addressFields}
          values={addValues}
          handleChange={addressChange}
          onSubmit={handleAddressSubmit}
          submitLabel="Find"
        />
        {addresses.length > 0 &&
          addresses.map((address) => {
            return (
              <Radio
                
                name="selectedAddress"
                id={address.houseNumber}
                key={address.houseNumber}
                onChange={addressChange}
              >
                <Address {...address} />
              </Radio>
            );
          })}
        <Form
          legend="Address Form"
          fields={infoFields}
          values={infoValues}
          handleChange={infoChange}
          onSubmit={handlePersonSubmit}
          submitLabel="Add to addressbook"
        />

        {/* TODO: Create an <ErrorMessage /> component for displaying an error message */}
        {error && <div className="error">{error}</div>}

        <Button onClick={handleClearAllFields} variant="secondary">Clear all fields</Button>
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
