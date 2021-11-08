import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const URL = "http://localhost/shoppinglist/"

function App() {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState("");
  const [amounts, setAmounts] = useState([]);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    axios.get(URL)
      .then((response) => {
        setItems(response.data)
        setAmounts(response.data)
      }).catch(error => {
        alert(error.response ? error.response.data.error : error);
      })
  }, [])

  function add(e) {
    e.preventDefault();
    const json = JSON.stringify({ description: item, amount: amount })
    axios.post("http://localhost/shoppinglist/add.php", json, {
      headers: {
        "Content-Type": "application/json",

      }
    })
      .then((response) => {
        setItems(items => [...items, response.data]);
        setItem("");
        setAmounts(amounts => [...amounts, response.data]);
        setAmount("");
      }).catch(error => {
        alert(error.response.data.error)
      });
  }

  function remove(id) {
    const json = JSON.stringify({ id: id })
    axios.post("http://localhost/shoppinglist/delete.php", json, {
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((response) => {
        const newListWithoutRemoved = items.filter((item) => item.id !== id);
        const newListWithoutRemovedAmounts = amounts.filter((amount) => amount.id !== id);
        setItems(newListWithoutRemoved);
        setAmounts(newListWithoutRemovedAmounts)
      }).catch(error => {
        alert(error.response ? error.response.data.error : error);
      });
  }


  return (
    <div className="container">
      <h3>Shopping List</h3>
      <form onSubmit={add}>
        <label>New Item
          <input type="text" value={item} onChange={e => setItem(e.target.value)} />
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
          <input type="submit" value="Add" />
        </label>
      </form>
      <ol>
        {items?.map(item => (
          <li key={item.id}>{item.description}</li>
        ))}
      </ol>
      <ol>
        {amounts?.map(amount => (
          <li key={amount.id}>{amount.amount}
            <a href="#" className="delete" onClick={() => remove(amount.id)}> Delete</a>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default App;
