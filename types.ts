export type User = {
  name?: { title?: string; first?: string; last?: string };
  email?: string;
  phone?: string;
  status: 'logged_in' | 'logged_out';
  picture?: { large?: string };
  IRN_NUMBER?: string;
};