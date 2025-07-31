import React from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import InputText from "@/components/InputText/InputText";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import useAddressBook from "@/hooks/useAddressBook";
import useFormFields from "@/hooks/useFormFields";
import transformAddress from "./core/models/address";
import Form from "@/components/Form/Form";

import styles from "./App.module.css";
import { Address as AddressType } from "./types";

function App() {
  /**
   * Form fields states
   * TODO: Write a custom hook to set form fields in a more generic way:
   * - Hook must expose an onChange handler to be used by all <InputText /> and <Radio /> components
   * - Hook must expose all text form field values, like so: { postCode: '', houseNumber: '', ...etc }
   * - Remove all individual React.useState
   * - Remove all individual onChange handlers, like handlePostCodeChange for example
   */
  const {
    fields,
    onChange: handleFieldChange,
    resetFields,
    setFields,
  } = useFormFields({
    postCode: "",
    houseNumber: "",
    firstName: "",
    lastName: "",
    selectedAddress: "",
  });
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

  /** TODO: Fetch addresses based on houseNumber and postCode using the local BE api
   * - Example URL of API: ${process.env.NEXT_PUBLIC_URL}/api/getAddresses?postcode=1345&streetnumber=350
   * - Ensure you provide a BASE URL for api endpoint for grading purposes!
   * - Handle errors if they occur
   * - Handle successful response by updating the `addresses` in the state using `setAddresses`
   * - Make sure to add the houseNumber to each found address in the response using `transformAddress()` function
   * - Ensure to clear previous search results on each click
   * - Bonus: Add a loading state in the UI while fetching addresses
   */
  const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("handleAddressSubmit called with fields:", fields);
    e.preventDefault();
    setError(undefined);
    setAddresses([]);
    setLoading(true);

    const BASE_URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
    const { postCode, houseNumber } = fields;

    // Basic validation
    if (!postCode || !houseNumber) {
      setError("Postcode and house number are required!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${BASE_URL}/api/getAddresses?postcode=${encodeURIComponent(
          postCode
        )}&streetnumber=${encodeURIComponent(houseNumber)}`
      );
      const data = await res.json();
      if (data.status === "ok" && Array.isArray(data.details)) {
        setAddresses(
          data.details.map((addr: any) =>
            transformAddress({ ...addr, houseNumber })
          )
        );
      } else {
        setError(data.errormessage || "No results found!");
      }
    } catch (err) {
      setError("Failed to fetch addresses.");
    } finally {
      setLoading(false);
    }
  };

  /** TODO: Add basic validation to ensure first name and last name fields aren't empty
   * Use the following error message setError("First name and last name fields mandatory!")
   */
  const handlePersonSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

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

    addAddress({
      ...foundAddress,
      firstName: fields.firstName,
      lastName: fields.lastName,
    });
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
        {/* Use generic <Form /> component for address search */}
        <Form
          label="🏠 Find an address"
          loading={loading}
          formEntries={[
            {
              name: "postCode",
              placeholder: "Post Code",
              extraProps: {
                value: fields.postCode,
                onChange: handleFieldChange,
              },
            },
            {
              name: "houseNumber",
              placeholder: "House number",
              extraProps: {
                value: fields.houseNumber,
                onChange: handleFieldChange,
              },
            },
          ]}
          // Fix: Wrap async handler to match () => void signature
          onFormSubmit={(e) => {
            e.preventDefault();
            handleAddressSubmit(e as React.FormEvent<HTMLFormElement>);
          }}
          submitText="Find"
        />
        {loading && (
          <div style={{ padding: "1em 0" }}>
            <span data-testid="loading-spinner">Loading...</span>
          </div>
        )}
        {addresses.length > 0 &&
          addresses.map((address) => {
            return (
              <Radio
                name="selectedAddress"
                id={address.id}
                key={address.id}
                onChange={handleFieldChange}
              >
                <Address {...address} />
              </Radio>
            );
          })}
        {/* Use generic <Form /> component for personal info */}
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
                  onChange: handleFieldChange,
                },
              },
              {
                name: "lastName",
                placeholder: "Last name",
                extraProps: {
                  value: fields.lastName,
                  onChange: handleFieldChange,
                },
              },
            ]}
            onFormSubmit={(e) => {
              e.preventDefault();
              if (!fields.firstName || !fields.lastName) {
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
              addAddress({
                ...foundAddress,
                firstName: fields.firstName,
                lastName: fields.lastName,
              });
            }}
            submitText="Add to addressbook"
          />
        )}

        {/* TODO: Create an <ErrorMessage /> component for displaying an error message */}
        {error && <ErrorMessage message={error} />}

        {/* TODO: Add a button to clear all form fields. 
        Button must look different from the default primary button, see design. 
        Button text name must be "Clear all fields"
        On Click, it must clear all form fields, remove all search results and clear all prior
        error messages
        */}
        <Button
          variant="secondary"
          type="button"
          onClick={() => {
            resetFields();
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
