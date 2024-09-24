import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());

const iso2ToIso3 = {
  AF: 'AFG',
  AL: 'ALB',
  DZ: 'DZA',
  AS: 'ASM',
  AD: 'AND',
  AO: 'AGO',
  AI: 'AIA',
  AQ: 'ATA',
  AG: 'ATG',
  AR: 'ARG',
  AM: 'ARM',
  AW: 'ABW',
  AU: 'AUS',
  AT: 'AUT',
  AZ: 'AZE',
  BS: 'BHS',
  BH: 'BHR',
  BD: 'BGD',
  BB: 'BRB',
  BY: 'BLR',
  BE: 'BEL',
  BZ: 'BLZ',
  BJ: 'BEN',
  BM: 'BMU',
  BT: 'BTN',
  BO: 'BOL',
  BQ: 'BES',
  BA: 'BIH',
  BW: 'BWA',
  BR: 'BRA',
  IO: 'IOT',
  BN: 'BRN',
  BG: 'BGR',
};

const getAvailableCountries = async () => {
  const response = await fetch('https://date.nager.at/api/v3/AvailableCountries');
  const countries = await response.json();
  return countries;
};

const getCountryInfo = async (countryCode) => {

  const iso3Code = iso2ToIso3[countryCode];

  if (!iso3Code) {
    return { error: `No ISO3 code found for country code: ${countryCode}` };
  }

  const countryInfoResponse = await fetch(`https://date.nager.at/api/v3/CountryInfo/${countryCode}`);
  const countryInfo = await countryInfoResponse.json();

  const populationResponse = await fetch('https://countriesnow.space/api/v0.1/countries/population');
  const populationData = await populationResponse.json();

  const countryPopulation = populationData.data.find(c => c.iso3 === iso3Code);

  const flagResponse = await fetch('https://countriesnow.space/api/v0.1/countries/flag/images');
  const flagData = await flagResponse.json();
  const countryFlag = flagData.data.find(c => c.iso2 === countryCode);

  return {
    countryInfo,
    populationData: countryPopulation ? countryPopulation.populationCounts : [],
    flagUrl: countryFlag ? countryFlag.flag : null
  };
};


app.get('/api/countries', async (req, res) => {
  const countries = await getAvailableCountries();
  res.json(countries);
});

app.get('/api/countries/:countryCode', async (req, res) => {
  const { countryCode } = req.params;
  const countryData = await getCountryInfo(countryCode);
  res.json(countryData);
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});