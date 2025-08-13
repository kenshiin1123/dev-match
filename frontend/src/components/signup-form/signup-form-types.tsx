import type { ChangeEvent } from "react";

// Types
export type SkillType = { title: string; id: string }[];

export type LocationType = {
  country: {
    country: string;
    iso2?: string;
    iso3?: string;
    value: string;
  };
  city: {
    city: string;
    city_ascii?: string;
    admin_name?: string;
    lat?: string;
    lng?: string;
    id?: string;
  };
};

export type InputsType = {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  role: string;
  location: LocationType;
  skills: SkillType;
  company: string;
};

export const INITIAL_INPUT_VALUE: InputsType = {
  name: "",
  email: "",
  password: "",
  confirm_password: "",
  role: "developer",
  location: {
    country: {
      country: "United States",
      iso2: "US",
      iso3: "USA",
      value: "united-states",
    },
    city: {
      city: "New York",
      city_ascii: "New York",
      admin_name: "New York",
      lat: "40.6943",
      lng: "-73.9249",
      id: "1840034016",
    },
  },
  skills: [],
  company: "",
};

export type ContentType = {
  inputValues: InputsType;
  onInputValueChange: (event: ChangeEvent<HTMLInputElement>) => void;
};
