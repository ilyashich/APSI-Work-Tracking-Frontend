import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = 'https://apsi-work-tracking-backend.azurewebsites.net/apsi/';

function App() {

  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(BACKEND_URL + 'users');
      setUsers(response.data);
    };
    fetchData();
  }, [reload]);

  const handleSubmit = (e) => {
    axios.post(BACKEND_URL + 'users', {
      name: name,
      password: password
    }).then(res => {
      if(res.status === 200) {
        setReload(!reload);
      }
    });
    e.preventDefault();
  }

  const onChange = (e, setState) => {
    setState(e.target.value);
    e.preventDefault();
  }

  return (
      <div className="App">
        <form onSubmit={handleSubmit}>
          <label>Enter Name</label>
          <input type="text" value={name} onChange={event => onChange(event, setName)} />
          <label>Enter Password</label>
          <input type="text" value={password} onChange={event => onChange(event, setPassword)} />
          <button type="submit">Submit</button>
        </form>
        
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Password</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user, i) =>
                <tr key={i}>
                    <td>{i+1}</td>
                    <td>{user.name}</td>
                    <td>{user.password}</td>                   
                </tr>
                )}
            </tbody>
            </table>
      </div>
    );
}

export default App;
