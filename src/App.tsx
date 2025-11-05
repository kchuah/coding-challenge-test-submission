import React from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import Form from "@/components/Form/Form";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import useAddressBook from "@/hooks/useAddressBook";
import useFormFields from "@/hooks/useFormFields";

import styles from "./App.module.css";
import { Address as AddressType } from "./types";
import { CONFIG_FILES } from "next/dist/shared/lib/constants";

function App() {
  const { formvalues, onFieldChangeHandler, resetFormFields } = useFormFields({
    postCode: "",
    houseNumber: "",
    firstName: "",
    lastName: "",
    selectedAddress: "",
  });

  const { postCode, houseNumber, firstName, lastName, selectedAddress } = formvalues;

  const [error, setError] = React.useState<string | undefined>();
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  const [loading, setLoading] = React.useState(false);
  const { addAddress } = useAddressBook();

  const transformAddress = (address: any) => ({
    ...address,
    fullAddress: `${address.street} ${address.houseNumber}, ${address.city}`,
  });

  const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);
    setAddresses([]);

    if (!postCode || !houseNumber) {
      setError("Postcode and house number fields are mandatory!");
      return;
    }

    try {
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
      const res = await fetch(
        `${baseUrl}/api/getAddresses?postcode=${postCode}&streetnumber=${houseNumber}`
      );

      if (!res.ok) throw new Error("Failed to fetch addresses");

      const data = await res.json();
      const transformed = data.map((address: any) =>
        transformAddress({ ...address, houseNumber })
      );
      setAddresses(transformed);
    } catch (err: any) {
      setError(err.message || "Error fetching addresses");
    } finally {
      setLoading(false);
    }
  };

  const handlePersonSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    if (!firstName || !lastName) {
      setError("First name and last name fields mandatory!");
      return;
    }

    if (!selectedAddress || !addresses.length) {
      setError(
        "No address selected, try to select an address or find one if you haven't"
      );
      return;
    }

    const foundAddress = addresses.find((a) => a.id === selectedAddress);

    if (!foundAddress) {
      setError("Selected address not found");
      return;
    }

    addAddress({ ...foundAddress, firstName, lastName });
    resetFormFields();
    setAddresses([]);
  };
  console.log(postCode,"a")

  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>Enter an address by postcode add personal info and done! 👏</small>
        </h1>

        <Form
          label="🏠 Find an address"
          loading={loading}
          formEntries={[
            { name: "postCode", placeholder: "Post Code", extraProps: { value: postCode } },
            { name: "houseNumber", placeholder: "House Number", extraProps: { value: houseNumber } },
          ]}

          onSubmit={handleAddressSubmit}
          submitText="Find"
        >
        </Form>

        {addresses.length > 0 &&
          addresses.map((address) => (
            <Radio
              key={address.id}
              name="selectedAddress"
              id={address.id}
              onChange={onFieldChangeHandler}
            >
              <Address {...address} />
            </Radio>
          ))}

        {selectedAddress && (
          <Form
            label="✏️ Add personal info to address"
            loading={false}
            formEntries={[
              { name: "firstName", placeholder: "First Name", extraProps: { value: firstName } },
              { name: "lastName", placeholder: "Last Name", extraProps: { value: lastName } },
            ]}
            onSubmit={handlePersonSubmit}
            submitText="Add to addressbook"
          />
        )}

        {error && <ErrorMessage message={error} />}

        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            resetFormFields();
            setAddresses([]);
            setError(undefined);
          }}
        >
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
