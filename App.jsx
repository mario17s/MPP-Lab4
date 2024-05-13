import './App.css'
import CityApp from './CityApp'
import CountryApp from './CountryApp'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import { useState } from 'react';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import * as jwt_decode from 'jwt-decode';



function App() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  let aa = "";
  // Function to handle login
  const handleLogin = (token, refreshToken) => {
    Cookies.set('token', token);
    aa = refreshToken;
    localStorage.setItem('refreshToken', aa); 
    console.log(aa);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
  };
  

  useEffect(() => {
    const token = Cookies.get('token');
    const refreshToken = localStorage.getItem('refreshToken');
    console.log(refreshToken);
    if (token) {
      setIsLoggedIn(true);
      // Check token expiration
      const decodedToken = jwt_decode.jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert to seconds
      if (decodedToken.exp < currentTime) {
        // Token has expired, log out the user
        Cookies.remove('token');
        alert("gata");
      }
    }
    else if(refreshToken){
      setIsLoggedIn(true);
      // Check token expiration
      const decodedToken = jwt_decode.jwtDecode(refreshToken);
      const currentTime = Date.now() / 1000; // Convert to seconds
      if (decodedToken.exp < currentTime) {
        // Token has expired, log out the user
        localStorage.removeItem('refreshToken');
      }
    }
  }, []);



  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        {isLoggedIn ? (
          <>
            <Route path="/" element={<><CountryApp /><CityApp /></>} />
            <Route path="/logout" element={<button onClick={handleLogout}>Logout</button>} /> 
          </>
        ) : (
          <>
            <Route path="/" element={<Login onLogin={handleLogin} />} />
          </>
        )}
      </Routes>
    </Router>
  )
}

export default App
