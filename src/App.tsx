import React from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import Form from "@/components/Form/Form";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import useAddressBook from "@/hooks/useAddressBook";
import { useFormFields } from "@/hooks/useFormFields";
import transformAddress, { RawAddressModel } from "./core/models/address";
import { Address as AddressType } from "@/types";

function App() {
  const { fields, handleChange, reset } = useFormFields();
  const { postCode, houseNumber, firstName, lastName, selectedAddress } =
    fields;

  const [error, setError] = React.useState<undefined | string>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  const [loading, setLoading] = React.useState(false);

  const { addAddress } = useAddressBook();

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_URL || "";

  const handleAddressSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError(undefined);
    setAddresses([]);

    try {
      setLoading(true);
      const url = `${baseUrl}/api/getAddresses?postcode=${encodeURIComponent(
        postCode
      )}&streetnumber=${encodeURIComponent(houseNumber)}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        setError(data.errormessage || "Something went wrong");
        return;
      }

      if (data.status === "ok" && data.details?.length) {
        const normalized = data.details.map(
          (addr: RawAddressModel & { long?: string | number }) => ({
            ...addr,
            lon: String(addr.lon ?? (addr as { long?: number }).long ?? ""),
            lat: String(addr.lat ?? ""),
          })
        );
        setAddresses(
          normalized.map((addr: RawAddressModel) => transformAddress(addr))
        );
      } else {
        setError("No results found!");
      }
    } catch {
      setError("Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  };

  const handlePersonSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(undefined);

    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();
    if (!trimmedFirst || !trimmedLast) {
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
      (address: AddressType) => address.id === selectedAddress
    );
    if (!foundAddress) {
      setError("Selected address not found");
      return;
    }

    addAddress({
      ...foundAddress,
      firstName: trimmedFirst,
      lastName: trimmedLast,
    });
  };

  const handleClearAll = () => {
    setError(undefined);
    setAddresses([]);
    reset();
  };

  const addressFormEntries = [
    {
      name: "postCode",
      placeholder: "Post Code",
      extraProps: { value: postCode, onChange: handleChange },
    },
    {
      name: "houseNumber",
      placeholder: "House number",
      extraProps: { value: houseNumber, onChange: handleChange },
    },
  ];

  const personFormEntries = [
    {
      name: "firstName",
      placeholder: "First name",
      extraProps: { value: firstName, onChange: handleChange },
    },
    {
      name: "lastName",
      placeholder: "Last name",
      extraProps: { value: lastName, onChange: handleChange },
    },
  ];

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
          formEntries={addressFormEntries}
          onFormSubmit={handleAddressSubmit}
          submitText="Find"
        />

        {addresses.length > 0 &&
          addresses.map((address: AddressType) => (
            <Radio
              name="selectedAddress"
              id={address.id}
              key={address.id}
              value={address.id}
              checked={selectedAddress === address.id}
              onChange={handleChange}
            >
              <Address {...address} />
            </Radio>
          ))}

        {selectedAddress && (
          <Form
            label="✏️ Add personal info to address"
            loading={false}
            formEntries={personFormEntries}
            onFormSubmit={handlePersonSubmit}
            submitText="Add to addressbook"
          />
        )}

        {error && <ErrorMessage message={error} />}

        <Button variant="secondary" onClick={handleClearAll}>
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
