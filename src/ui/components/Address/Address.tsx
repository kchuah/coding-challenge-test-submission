import React, { FunctionComponent } from "react";

import $ from "./Address.module.css";

export interface AddressProps {

  city: string;
  street: string;
  houseNumber: string;
  postcode: string;
  firstName?: string;
  lastName?: string;
}

const Address: React.FC<AddressProps> = ({
  street,
  city,
  postcode,
  houseNumber
}) => {
  return (
    <div>
      <div>
        {street} {houseNumber}, {postcode}, {city}
      </div>
    </div>
  );
};

export default Address;
