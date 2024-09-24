import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PopulationChart from './PopulationChart'; 

function CountryDetails() {
  const { countryCode } = useParams();
  const [countryData, setCountryData] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/countries/${countryCode}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('Country Data:', data); 
        setCountryData(data);
      })
      .catch((error) => console.error('Error fetching country data:', error));
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
          <li key={border.countryCode}>
            <Link to={`/country/${border.countryCode}`}>
              {border.commonName}
            </Link>
          </li>
        ))}
      </ul>

      <h2>Population Data</h2>
      {countryData.populationData.length === 0 ? (
        <p>No population data available.</p>
      ) : (
        <PopulationChart populationData={countryData.populationData} />
      )}
    </div>
  );
}

export default CountryDetails;