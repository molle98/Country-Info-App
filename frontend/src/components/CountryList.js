import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './CountryList.css'; 

function CountryList() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/countries')
      .then((response) => response.json())
      .then((data) => setCountries(data));
  }, []);

  return (
    <div className="container">
      <h1 className="title">Country List</h1>
      <ul className="country-list">
        {countries.map((country) => (
          <li key={country.countryCode}>
            <Link to={`/country/${country.countryCode}`}>{country.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CountryList;
