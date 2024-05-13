import { useState, useEffect } from "react";
import CityList from "./CityList";
import CityForm from "./CityForm";
import axios from 'axios';
export default function CityApp(){
    const [cities, setCities] = useState([]);
    const storedDetail = JSON.parse(localStorage.getItem('details')) || [];

    useEffect(() => {
        loadData2();
        
    }, []);

    const loadData2 = () => {
        console.log("fetch");
        console.log(storedDetail);
        fetch(`http://localhost:8081/c`)
        .then(res => {return res.json()})
        .then(data => {
            console.log(data);
            const d = data;
            if(storedDetail.length != 0)
            {
                for(let si of storedDetail){
                    axios.post('http://localhost:8081/c/add',  {...si})
                    .then(res => {alert(res.status);})
                    .catch(err => {console.log(err);})
                    d.push(si);
                }
                localStorage.removeItem('details');
            }
            setCities(d);
        })
        .catch(err => {
            console.log(err.message);
            })
    }

    const [editCity, setEditCity] = useState({
        id: 0,
        name: "",
        cid: 0
    })

    const editCityAction = (id, name, cid) => {
        console.log(id)
        setEditCity({
            id: id,
            name: name,
            cid: cid
        })
    }

    const addCity = (objj) => {
        console.log(objj);
        axios.post('http://localhost:8081/c/add',  {...objj})
        .then(res => {alert(res.status);})
        .catch(err => {console.log(err);
            const h = storedDetail;
            h.push(objj)
            localStorage.setItem('details', JSON.stringify(h));
        })
        setTimeout(loadData2, 2000);
    };

    const deleteCity = (index) =>
    {
        axios.delete(`http://localhost:8081/c/del/${index}`)
        .then(res => alert(res.status))
        .catch(err => console.log(err))
        setTimeout(loadData2, 2000);
    }

    const updateCity = (objj) => {
        axios.put(`http://localhost:8081/c/upd/${objj.id}`, objj)
        .then(res => alert(res.status))
        .catch(err => console.log(err))
        setTimeout(loadData2, 2000);
    }

    return (
        <>
            <CityList items={cities} action={deleteCity} upd={editCityAction}/>
            <CityForm addAction={addCity} ed={editCity} updateAction={updateCity}/>
        </>
    )
}