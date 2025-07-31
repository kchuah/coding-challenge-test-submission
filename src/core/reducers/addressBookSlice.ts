import { Address } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Define a type for the slice state
interface CounterState {
  addresses: Address[];
}

// Define the initial state using that type
const initialState: CounterState = {
  addresses: [],
};

export const addressBookSlice = createSlice({
  name: "address",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addAddress: (state, action: PayloadAction<Address>) => {
      // Prevent duplicate addresses
      const exists = state.addresses.some(
        (addr) =>
          addr.firstName === action.payload.firstName &&
          addr.lastName === action.payload.lastName &&
          addr.street === action.payload.street &&
          addr.houseNumber === action.payload.houseNumber &&
          addr.postcode === action.payload.postcode &&
          addr.city === action.payload.city
      );
      if (!exists) {
        state.addresses.push(action.payload);
      }
    },
    removeAddress: (state, action: PayloadAction<string>) => {
      // Remove address by ID
      state.addresses = state.addresses.filter(
        (addr) => addr.id !== action.payload
      );
    },
    updateAddresses: (state, action: PayloadAction<Address[]>) => {
      state.addresses = action.payload;
    },
  },
});

export const { addAddress, removeAddress, updateAddresses } =
  addressBookSlice.actions;

// // Other code such as selectors can use the imported `RootState` type
export const selectAddress = (state: RootState) => state.addressBook.addresses;

export default addressBookSlice.reducer;
