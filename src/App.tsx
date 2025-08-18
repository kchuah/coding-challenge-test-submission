import React from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import Form from "@/components/Form/Form";
import InputText from "@/components/InputText/InputText";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import useAddressBook from "@/hooks/useAddressBook";
import { useFormFields } from "@/hooks/useFormFields";

import styles from "./App.module.css";
import { Address as AddressType } from "./types";

function App() {
  /**
   * Form fields using custom hook
   */
  const { fields, onChange, clearFields, setField } = useFormFields();
  
  /**
   * Results states
   */
  const [error, setError] = React.useState<undefined | string>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  const [loading, setLoading] = React.useState(false);
  
  /**
   * Redux actions
   */
  const { addAddress } = useAddressBook();

  /**
   * Helper function to add house number to address
   */
  const transformAddress = (address: any, houseNumber: string) => ({
    ...address,
    houseNumber,
  });

  /** Fetch addresses based on houseNumber and postCode using the local BE api */
  const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);
    setAddresses([]);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
      const response = await fetch(
        `${baseUrl}/api/getAddresses?postcode=${fields.postCode}&streetnumber=${fields.houseNumber}`
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.errormessage || 'Failed to fetch addresses');
      }
      
      if (data.status === 'success' && data.results) {
        const transformedAddresses = data.results.map((address: any) => 
          transformAddress(address, fields.houseNumber)
        );
        setAddresses(transformedAddresses);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch addresses');
    } finally {
      setLoading(false);
    }
  };

  /** Add basic validation to ensure first name and last name fields aren't empty */
  const handlePersonSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    if (!fields.firstName.trim() || !fields.lastName.trim()) {
      setError("First name and last name fields mandatory!");
      return;
    }

    if (!fields.selectedAddress || !addresses.length) {
      setError(
        "No address selected, try to select an address or find one if you haven't"
      );
      return;
    }

    const foundAddress = addresses.find(
      (address) => address.id === fields.selectedAddress
    );

    if (!foundAddress) {
      setError("Selected address not found");
      return;
    }

    addAddress({ ...foundAddress, firstName: fields.firstName, lastName: fields.lastName });
    
    // Clear form after successful submission
    clearFields();
    setAddresses([]);
  };

  const handleClearAllFields = () => {
    clearFields();
    setAddresses([]);
    setError(undefined);
  };

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
          label="🏠 Find an address"
          loading={loading}
          formEntries={[
            {
              name: "postCode",
              placeholder: "Post Code",
              extraProps: {
                value: fields.postCode,
                onChange: onChange('postCode'),
              },
            },
            {
              name: "houseNumber",
              placeholder: "House number",
              extraProps: {
                value: fields.houseNumber,
                onChange: onChange('houseNumber'),
              },
            },
          ]}
          onFormSubmit={handleAddressSubmit}
          submitText="Find"
        />
        
        {addresses.length > 0 &&
          addresses.map((address) => {
            return (
              <Radio
                name="selectedAddress"
                id={address.id}
                key={address.id}
                onChange={onChange('selectedAddress')}
              >
                <Address {...address} />
              </Radio>
            );
          })}
        
        {fields.selectedAddress && (
          <Form
            label="✏️ Add personal info to address"
            loading={false}
            formEntries={[
              {
                name: "firstName",
                placeholder: "First name",
                extraProps: {
                  value: fields.firstName,
                  onChange: onChange('firstName'),
                },
              },
              {
                name: "lastName",
                placeholder: "Last name",
                extraProps: {
                  value: fields.lastName,
                  onChange: onChange('lastName'),
                },
              },
            ]}
            onFormSubmit={handlePersonSubmit}
            submitText="Add to addressbook"
          />
        )}

        {error && <ErrorMessage message={error} />}

        <Button variant="secondary" onClick={handleClearAllFields}>
          Clear all fields
        </Button>
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
