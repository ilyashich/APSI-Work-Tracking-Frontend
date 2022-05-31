export class User {
  id: number;
  username: string;
  name: string;
  surname: string;
  role: string;

  constructor(id: number, username: string, name: string, surname: string, role: string) {
    this.id = id;
    this.username = username;
    this.name = name;
    this.surname = surname;
    this.role = role;
  }
}
