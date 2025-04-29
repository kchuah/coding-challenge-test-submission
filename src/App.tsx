import React from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import InputText from "@/components/InputText/InputText";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import useAddressBook from "@/hooks/useAddressBook";

import useFormFields, { FormFields } from "@/hooks/useFormFields";

import styles from "./App.module.css";
import { Address as AddressType } from "./types";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";

export interface RadioProps {
  id: string;
  name: string;
  children: React.ReactNode;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string; // Allow value to be passed to the Radio component
}

function App() {

  const initialFields: FormFields = {
    postcode: "",
    houseNumber: "",
    firstName: "",
    lastName: "",
    selectedAddress: "",
  };

  const { fetchAddresses } = useAddressBook();
  const { fields, handleChange, clearFields, setFields } = useFormFields(initialFields);

  const [postcode, setpostcode] = React.useState("");
  const [houseNumber, setHouseNumber] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [selectedAddress, setSelectedAddress] = React.useState("");
  const [error, setError] = React.useState<undefined | string>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  const [load, setLoad] = React.useState<boolean>(false);
  const { addAddress } = useAddressBook();
  const { searchAddress } = useAddressBook();

  const [loading, setLoading] = React.useState(false)

  const handlepostcodeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setpostcode(e.target.value);

  const handleHouseNumberChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setHouseNumber(e.target.value);

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFirstName(e.target.value);

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setLastName(e.target.value);

  const handleSelectedAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => setSelectedAddress(e.target.value);


  const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    setAddresses([]); // Clear previous search results
    setLoad(false);
    setLoading(true);

    try {
      const fetchedAddresses = await fetchAddresses(postcode, houseNumber);

      if (!fetchedAddresses || !fetchedAddresses.length) {
        setError("No addresses found. Please check your input.");
        return;
      }

      // Optionally add houseNumber manually if transformAddress doesn't already
      const updatedAddresses = fetchedAddresses.map((address: any) => ({
        ...address,
        houseNumber,
      }));

      setAddresses(updatedAddresses);
      setLoad(true);
    } catch (err) {
      setError("Something went wrong while fetching addresses.");
    } finally {
      setLoading(false); // ✅ Hide spinner
    }
  };


  const handlePersonSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and last name fields mandatory!");
      return;
    }

    if (!selectedAddress || !addresses.length) {
      setError(
        "No address selected, try to select an address or find one if you haven't"
      );
      return;
    }

    const foundAddress = addresses.find(
      (address) => address.id === selectedAddress
    );
    if (!foundAddress) {
      setError("Selected address not found");
      return;
    }

    if (!searchAddress(firstName)) {
      addAddress({ ...foundAddress, firstName, lastName });
    } else {
      alert("existed users name, please change another name!");
    }
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

        <form onSubmit={handleAddressSubmit}>
          <fieldset>
            <legend>🏠 Find an address</legend>
            <div className={styles.formRow}>
              <InputText
                name="postcode"
                onChange={handlepostcodeChange}
                placeholder="Post Code"
                value={postcode}
              />
            </div>
            <div className={styles.formRow}>
              <InputText
                name="houseNumber"
                onChange={handleHouseNumberChange}
                value={houseNumber}
                placeholder="House number"
              />
            </div>
            <Button type="submit" loading={loading}>Find</Button>
          </fieldset>
        </form>


        {addresses && addresses.length > 0 &&
          addresses.map((address) => (
            <Radio
              name="selectedAddress"
              id={address.id}
              key={address.id}
              value={address.id}
              onChange={handleSelectedAddressChange}
            >
              <Address {...address} />
            </Radio>
          ))}

        {selectedAddress && (
          <form onSubmit={handlePersonSubmit}>
            <fieldset>
              <legend>✏️ Add personal info to address</legend>
              <div className={styles.formRow}>
                <InputText
                  name="firstName"
                  placeholder="First name"
                  onChange={handleFirstNameChange}
                  value={firstName}
                />
              </div>
              <div className={styles.formRow}>
                <InputText
                  name="lastName"
                  placeholder="Last name"
                  onChange={handleLastNameChange}
                  value={lastName}
                />
              </div>
              <Button type="submit">Add to addressbook</Button>
            </fieldset>
          </form>
        )}

        {error && <ErrorMessage message={error} />}

        <Button
          variant="secondary"
          type="button"
          onClick={() => {
            clearFields();             // Clears the form hook fields
            setpostcode("");           // Clear postcode field
            setHouseNumber("");        // Clear house number field
            setFirstName("");          // Clear first name field
            setLastName("");           // Clear last name field
            setSelectedAddress("");    // Deselect any selected address
            setAddresses([]);          // Remove all search results
            setError(undefined);       // Remove any error messages
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