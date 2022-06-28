export class User {
  id: number;
  username: string;
  name: string;
  surname: string;
  role: string;
  rate: number;

  constructor(id: number, username: string, name: string, surname: string, role: string, rate: number) {
    this.id = id;
    this.username = username;
    this.name = name;
    this.surname = surname;
    this.role = role;
    this.rate = rate;
  }
}
