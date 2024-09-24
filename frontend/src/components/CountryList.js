import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function CountryList() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/countries')
      .then((response) => response.json())
      .then((data) => setCountries(data));
  }, []);

  return (
    <ul>
      {countries.map((country) => (
        <li key={country.countryCode}>
          <Link to={`/country/${country.countryCode}`}>{country.name}</Link>
        </li>
      ))}
    </ul>
  );
}

export default CountryList;
