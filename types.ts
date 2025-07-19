export type Street = {
  number?: number;
  name?: string;
};

export type Timezone = {
  offset?: string;
  description?: string;
};

export type Location = {
  street?: Street;
  city?: string;
  state?: string;
  country?: string;
  postcode?: string | number;
  coordinates?: {
    latitude?: string;
    longitude?: string;
  };
  timezone?: Timezone;
};

export type Name = {
  title?: string;
  first?: string;
  last?: string;
};

export type IdInfo = {
  name?: string;
  value?: string;
};

export type Dob = {
  date: string;
  age: number;
};

export type Registered = {
  date: string;
  age: number;
};

export type Picture = {
  large?: string;
  medium?: string;
  thumbnail?: string;
};

export type User = {
  gender?: string;
  name?: Name;
  location?: Location;
  email?: string;
  login?: {
    uuid?: string;
    username?: string;
    password?: string;
    salt?: string;
    md5?: string;
    sha1?: string;
    sha256?: string;
  };
  dob?: Dob;
  registered?: Registered;
  phone?: string;
  cell?: string;
  id?: IdInfo;
  picture?: Picture;
  nat?: string;
  IRN_NUMBER?: string;
  status: 'logged_in' | 'logged_out';
};
