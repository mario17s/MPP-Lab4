//import express from 'express'
//import cors from 'cors'

const express = require('express');
const countryjs = require('countryjs');
const { faker } = require('@faker-js/faker');
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const app = express(); 
const cors = require('cors');
app.use(express.json());
app.use(cors());
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'employees',
    password: 'root',
    port: 5432 // PostgreSQL default port
  });
  
  // Test the connection
  pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Error connecting to PostgreSQL database:', err);
    } else {
      console.log('Connected to PostgreSQL database');
    }
  });


let countriesList = [
    
  ];

let citiesList = [
    
]

let indexes = []


app.listen(8081, () =>{ 
    console.log("Listening...");
}); 

app.get('/', (req, res) => {
    //if(countriesList.length === 0)
    pool.query('SELECT * FROM Countries', (err, result) => {
        if (err) {
        console.error('Error executing SELECT query:', err);
        } else {
        console.log('Query result:', result.rows);
        countriesList = result.rows;
        res.status(200).send(countriesList);
        }
    });
})

app.get('/name', (req, res) => {
    //if(countriesList.length === 0)
    pool.query('SELECT * FROM Countries', (err, result) => {
        if (err) {
        console.error('Error executing SELECT query:', err);
        } else {
        console.log('Query result:', result.rows);
        countriesList = result.rows;
        for(let i = 0; i < countriesList.length; i++)
            for(let j = i + 1; j < countriesList.length; j++)
                if(countriesList[i].name > countriesList[j].name)
                {
                    let aux = countriesList[i];
                    countriesList[i] = countriesList[j];
                    countriesList[j] = aux;
                }
        console.log(countriesList);
        res.status(200).send(countriesList);
        }
    });
    
})

app.get('/c', (req, res) => {
    pool.query('SELECT * FROM Cities', (err, result) => {
        if (err) {
        console.error('Error executing SELECT query:', err);
        } else {
        //console.log('Query result:', result.rows);
        citiesList = result.rows;
        res.status(200).send(citiesList);
        }
    });
})

app.get('/:idd', (req, res) => {
    const {idd} = req.params;
    let idx = parseInt(idd);
    res.status(200).send(countriesList.filter(c => c.id == idx));
})


app.post('/add', (req, res) => {
    let country = req.body;
    console.log(req.body);

    pool.query('insert into Countries(id,name,continent,capital,population,checked) values($1, $2, $3, $4, $5, false)', 
        [country.id, country.name, country.continent, country.capital, country.population], (err, result) => {
        if (err) {
        console.error('Error executing INSERT query:', err);
        } else {
        console.log('Query result:', result.rows);
        res.status(201).sendStatus(201);
        }
    });
})

app.post('/c/add', (req, res) => {
    let city = req.body;
    console.log(req.body);
    pool.query('insert into Cities(id,name,cid) values($1, $2, $3)', 
        [city.id, city.name, city.cid], (err, result) => {
        if (err) {
        console.error('Error executing INSERT query:', err);
        } else {
        console.log('Query result:', result.rows);
        res.status(201).sendStatus(201);
        }
    });
})

app.delete(`/del/:idx`, (req, res) => {
    const {idx} = req.params;
    let idxx = parseInt(idx)
    /*console.log(req);
    countriesList = countriesList.filter(c => {return c.id != idxx})
    console.log(countriesList);*/
    pool.query('DELETE FROM Countries WHERE id = $1', 
        [idxx], (err, result) => {
        if (err) {
        console.error('Error executing Delete query:', err);
        } else {
        console.log('Query result:', result.rows);
        res.status(204).sendStatus(204);
        }
    });
   
})

app.post('/fake/city', (req, res) => {
    let fakers = req.body;
    for(let f of fakers)
        pool.query('insert into Cities(id,name,cid) values($1, $2, $3)', 
        [f.id, f.name, f.cid], (err, result) => {
        if (err) {
        console.error('Error executing INSERT query:', err);
        } else {
        console.log('Query result:', result.rows);
        
        }
    });
    res.status(201).sendStatus(201);
})

app.delete(`/c/del/:idx`, (req, res) => {
    const {idx} = req.params;
    let idxx = parseInt(idx)
    /*
    console.log(req);
    citiesList = citiesList.filter(c => {return c.id != idxx})
    console.log(citiesList);
    res.status(204).sendStatus(204);*/
    pool.query('DELETE FROM Cities WHERE id = $1', 
        [idxx], (err, result) => {
        if (err) {
        console.error('Error executing Delete query:', err);
        } else {
        console.log('Query result:', result.rows);
        res.status(204).sendStatus(204);
        }
    });
})

app.put(`/upd/:idx`, (req, res) => {
    const {idx} = req.params;
    console.log(req);
    let idxx = parseInt(idx);
    let newobj = req.body;
    pool.query('update Countries set name = $1,continent = $2, capital = $3, population = $4, checked = $5 where id = $6', 
        [newobj.name, newobj.continent, newobj.capital, newobj.population, newobj.checked, idxx], (err, result) => {
        if (err) {
        console.error('Error executing UPDATE query:', err);
        } else {
        console.log('Query result:', result.rows);
        res.status(200).sendStatus(200);
        }
    });
    /*
    countriesList = countriesList.map(c => {
        if(c.id === idxx) return newobj
        else return c;
    })
    res.status(200).sendStatus(200);*/
})

app.put(`/c/upd/:idx`, (req, res) => {
    const {idx} = req.params;
    console.log(req);
    let idxx = parseInt(idx);
    let newobj = req.body;
    /*
    citiesList = citiesList.map(c => {
        if(c.id === idxx) return newobj
        else return c;
    })
    res.status(200).sendStatus(200);*/
    pool.query('update Cities set name = $1 ,cid = $2 where id = $3', 
        [newobj.name, newobj.cid, idxx], (err, result) => {
        if (err) {
        console.error('Error executing UPDATE query:', err);
        } else {
        console.log('Query result:', result.rows);
        res.status(200).sendStatus(200);
        }
    });
})


app.post("/login", async (req, res) => {
    const {email, password} = req.body;
    let credentials = null
    const result = await pool.query('SELECT * FROM Users WHERE username = $1', 
        [email]) 
    if(result.rows.length > 0)
        credentials = result.rows;
    console.log(credentials);
    if(!credentials)
        return res.status(400).json({message: "Email does not match"})
    console.log(credentials[0].password);
    console.log(password);
    if(credentials[0].password != password)
        return res.status(400).json({message: "Password does not match"})

    const expiresIn = 30;
    const secretKey = crypto.randomBytes(32).toString('hex');
    const jwtToken = jwt.sign(
        {id: credentials[0].id,
        email: credentials[0].username}, secretKey,{
            expiresIn: expiresIn 
        }
    )

    const refreshTokenExpiresIn = 2592000; // 30 days in seconds

    // Generate a refresh token
    const refreshToken = jwt.sign(
        {id: credentials[0].id,
        email: credentials[0].username}, secretKey,{
            expiresIn: refreshTokenExpiresIn 
        })
    

    // Save refresh token in the database or any other storage
    // For simplicity, let's just send it to the client
    res.json({ message: "Welcome back!", token: jwtToken, refreshToken: refreshToken });
})

app.post("/register/do", async (req, res) => {
    const {email, password} = req.body;
    
    const result = await pool.query('INSERT INTO Users values($1, $2)', 
        [email, password]);
    
    res.json({message: "Thanks for registering!"});  
})

module.exports = app;