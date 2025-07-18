export type User = {
  [key: string]: any;
  name?: { title?: string; first?: string; last?: string };
  email?: string;
  phone?: string;
  status: "logged_in" | "logged_out";
  picture?: { large?: string };
  IRN_NUMBER?: string;
};

