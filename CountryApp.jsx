import { useEffect, useState } from 'react';
import CountryList from "./CountryList"
import Form from './Form';
import Button from '@mui/material/Button';
import axios from 'axios';

export default function CountryApp(){
    const [countries, setCountries] = useState([]);
    const storedItems = JSON.parse(localStorage.getItem('items')) || [];

    const loadData = () => {
        console.log("fetch");
        console.log(storedItems);
        fetch(`http://localhost:8081/`, {headers: {
            'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`
          }})
        .then(res => {return res.json()})
        .then(data => {
            console.log(data);
            const d = data;
            if(storedItems.length != 0)
            {
                for(let si of storedItems){
                    axios.post('http://localhost:8081/add',  {...si})
                    .then(res => {alert(res.status);})
                    .catch(err => {console.log(err);})
                    d.push(si);
                }
                localStorage.removeItem('items');
            }
            setCountries(d);
        })
        .catch(err => {
            console.log(err.message);
            })
    }

    useEffect(() => {
            loadData();
    }, []);

   
    const [editCountry, setEditCountry] = useState({
        id: 0,
        name: "",
        continent: "",
        capital: "",
        population: 0,
        checked: false
    })

    const deleteCountry = (index) =>
    {
        axios.delete(`http://localhost:8081/del/${index}`)
        .then(res => alert(res.status))
        .catch(err => console.log(err))
        setTimeout(loadData, 2000);
    }
    const editCountryAction = (id, name, continent, capital, population, checked) => {
        console.log(id)
        setEditCountry({
            id: id,
            name: name,
            continent: continent,
            capital: capital,
            population: population,
            checked: checked
        })
    }
    const addCountry = (objj) => {
        console.log(objj);
        axios.post('http://localhost:8081/add',  {...objj})
        .then(res => {alert(res.status);})
        .catch(err => {console.log(err); 
            const h = storedItems;
            h.push(objj)
            localStorage.setItem('items', JSON.stringify(h));})
        setTimeout(loadData, 2000);
    };
  
    const updateCountry = (objj) => {
        axios.put(`http://localhost:8081/upd/${objj.id}`, objj)
        .then(res => alert(res.status))
        .catch(err => console.log(err))
        setTimeout(loadData, 2000);
    }

    const exportJSON = () => {
        const JSONData = JSON.stringify(countries);
        const blob = new Blob([JSONData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    const checkCountry = (id, checkk) => {
        axios.get(`http://localhost:8081/${id}`)
        .then(res => {alert(res.data[0].id)})
        .catch(err => console.log(err))
        setCountries(old => {
            return old.map(c => {
                if(c.id === id)
                    return {...c, checked: checkk};
                else
                    return c;
            })
        })
    }

    const handleSort = () => {
        fetch(`http://localhost:8081/name`)
        .then(res => {return res.json()})
        .then(data => setCountries(data))
        .catch(err => {
            console.log(err.message);
            })
        setTimeout(loadData, 2000);
    }

    const deleteSelected = () => {
        setCountries(old => old.filter(c => c.checked === false));
    }

    return (
        <>
            <Button variant="outlined" color='primary' onClick={handleSort}>Sort</Button>
            <CountryList items={countries} action={deleteCountry} chec={checkCountry} upd={editCountryAction}/>
            <Form addAction={addCountry} ed={editCountry} updateAction={updateCountry}/>
            <Button variant="outlined" color='primary' onClick={exportJSON}>Export JSON</Button>
            <Button variant="contained" color='error' onClick={deleteSelected}>DELETE SELECTED</Button>
        </>
              
    )
}
