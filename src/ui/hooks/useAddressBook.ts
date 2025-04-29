import {
  addAddress,
  removeAddress,
  selectAddress,
  updateAddresses,
} from "../../core/reducers/addressBookSlice";
import { Address } from "@/types";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../core/store/hooks";

import transformAddress, { RawAddressModel } from "../../core/models/address";
import databaseService from "../../core/services/databaseService";

export default function useAddressBook() {
  const dispatch = useAppDispatch();
  const addresses = useAppSelector(selectAddress);
  const [loading, setLoading] = React.useState(true);

  const updateDatabase = React.useCallback(() => {
    databaseService.setItem("addresses", addresses);
  }, [addresses]);

  const fetchAddresses = async (postcode: string, houseNumber: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/getAddresses?postcode=${postcode}&streetnumber=${houseNumber}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch addresses");
      }

      const data = await response.json();

      console.log("Response:", data);
      if (!data || !Array.isArray(data.details)) {
        throw new Error("Invalid data format");
      }

      // Assuming `transformAddress` converts raw data to the correct Address type
      const transformedAddresses = data.details.map(
        (address: RawAddressModel) => transformAddress(address)
      );

      // Return transformed addresses
      return transformedAddresses;
    } catch (error) {
      console.error("Error fetching addresses:", error);
      throw error; // This will be caught in the calling function
    }
  };

  return {
    /** Add address to the redux store */
    addAddress: (address: Address) => {
      dispatch(addAddress(address));
      updateDatabase();
    },
    searchAddress: (firstName: string) => {
      const filteredAddresses = addresses.findIndex((address) =>
        address.firstName.toLowerCase().includes(firstName.toLowerCase())
      );
      if (filteredAddresses === -1) {
        return false;
      } else {
        return true;
      }
    },
    /** Remove address by ID from the redux store */
    removeAddress: (id: string) => {
      dispatch(removeAddress(id));
      updateDatabase();
    },
    /** Loads saved addresses from the indexedDB */
    loadSavedAddresses: async () => {
      const saved: RawAddressModel[] | null = await databaseService.getItem(
        "addresses"
      );
      // No saved item found, exit this function
      if (!saved || !Array.isArray(saved)) {
        setLoading(false);
        return;
      }
      dispatch(
        updateAddresses(saved.map((address) => transformAddress(address)))
      );
      setLoading(false);
    },
    fetchAddresses,
    loading,
  };
}
