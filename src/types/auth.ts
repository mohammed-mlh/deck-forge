export interface User {
  id: string;
  email: string;
  name: string;
}

export interface DummyAccount extends User {
  password: string;
}
