import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function CountryDetails() {
  const { countryCode } = useParams();
  const [countryData, setCountryData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/countries/${countryCode}`)
      .then((response) => response.json())
      .then((data) => setCountryData(data));
  }, [countryCode]);

  if (!countryData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{countryData.countryInfo.commonName}</h1>
      <img src={countryData.flagUrl} alt={`${countryData.countryInfo.commonName} flag`} width="500" height="300" />
      <h2>Border Countries</h2>
      <ul>
        {countryData.countryInfo.borders.map((border) => (
          <li key={border.countryCode}>{border.commonName}</li>
        ))}
      </ul>
      <h2>Population Data</h2>
      <ul>
        {countryData.populationData.map((population, index) => (
          <li key={index}>
            {population.year}: {population.value}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CountryDetails;
