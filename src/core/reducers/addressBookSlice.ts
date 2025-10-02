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
      /** Prevent duplicate addresses by checking if address already exists */
      const addressExists = state.addresses.some(
        (existingAddress) => 
          existingAddress.street === action.payload.street &&
          existingAddress.houseNumber === action.payload.houseNumber &&
          existingAddress.postcode === action.payload.postcode &&
          existingAddress.city === action.payload.city
      );
      
      if (!addressExists) {
        state.addresses.push(action.payload);
      }
    },
    removeAddress: (state, action: PayloadAction<string>) => {
      /** Remove address from the addresses array by filtering out the address with matching ID */
      state.addresses = state.addresses.filter(address => address.id !== action.payload);
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
