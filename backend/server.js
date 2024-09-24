import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());

//I included some countries, because on the population API, codes are of three letters, and on the available countries one, it is two letters.
const iso2ToIso3 = {
  AF: 'AFG', // Afghanistan
  AL: 'ALB', // Albania
  DZ: 'DZA', // Algeria
  AS: 'ASM', // American Samoa
  AD: 'AND', // Andorra
  AO: 'AGO', // Angola
  AI: 'AIA', // Anguilla
  AQ: 'ATA', // Antarctica
  AG: 'ATG', // Antigua and Barbuda
  AR: 'ARG', // Argentina
  AM: 'ARM', // Armenia
  AW: 'ABW', // Aruba
  AU: 'AUS', // Australia
  AT: 'AUT', // Austria
  AZ: 'AZE', // Azerbaijan
  BS: 'BHS', // Bahamas
  BH: 'BHR', // Bahrain
  BD: 'BGD', // Bangladesh
  BB: 'BRB', // Barbados
  BY: 'BLR', // Belarus
  BE: 'BEL', // Belgium
  BZ: 'BLZ', // Belize
  BJ: 'BEN', // Benin
  BM: 'BMU', // Bermuda
  BT: 'BTN', // Bhutan
  BO: 'BOL', // Bolivia
  BQ: 'BES', // Bonaire, Sint Eustatius and Saba
  BA: 'BIH', // Bosnia and Herzegovina
  BW: 'BWA', // Botswana
  BR: 'BRA', // Brazil
  IO: 'IOT', // British Indian Ocean Territory
  BN: 'BRN', // Brunei Darussalam
  BG: 'BGR', // Bulgaria
  BF: 'BFA', // Burkina Faso
  BI: 'BDI', // Burundi
  CA: 'CAN', // Canada
  CL: 'CHL', // Chile
  CN: 'CHN', // China
  CO: 'COL', // Colombia
  CR: 'CRI', // Costa Rica
  CU: 'CUB', // Cuba
  CZ: 'CZE', // Czech Republic
  DK: 'DNK', // Denmark
  DO: 'DOM', // Dominican Republic
  EC: 'ECU', // Ecuador
  EG: 'EGY', // Egypt
  SV: 'SLV', // El Salvador
  EE: 'EST', // Estonia
  FI: 'FIN', // Finland
  FR: 'FRA', // France
  GE: 'GEO', // Georgia
  DE: 'DEU', // Germany
  GR: 'GRC', // Greece
  GT: 'GTM', // Guatemala
  HN: 'HND', // Honduras
  HK: 'HKG', // Hong Kong
  HU: 'HUN', // Hungary
  IS: 'ISL', // Iceland
  IN: 'IND', // India
  ID: 'IDN', // Indonesia
  IR: 'IRN', // Iran
  IQ: 'IRQ', // Iraq
  IE: 'IRL', // Ireland
  IL: 'ISR', // Israel
  IT: 'ITA', // Italy
  JM: 'JAM', // Jamaica
  JP: 'JPN', // Japan
  JO: 'JOR', // Jordan
  KZ: 'KAZ', // Kazakhstan
  KE: 'KEN', // Kenya
  KR: 'KOR', // South Korea
  KW: 'KWT', // Kuwait
  LV: 'LVA', // Latvia
  LB: 'LBN', // Lebanon
  LT: 'LTU', // Lithuania
  LU: 'LUX', // Luxembourg
  MY: 'MYS', // Malaysia
  MX: 'MEX', // Mexico
  MC: 'MCO', // Monaco
  MN: 'MNG', // Mongolia
  ME: 'MNE', // Montenegro
  MA: 'MAR', // Morocco
  NP: 'NPL', // Nepal
  NL: 'NLD', // Netherlands
  NZ: 'NZL', // New Zealand
  NI: 'NIC', // Nicaragua
  NG: 'NGA', // Nigeria
  NO: 'NOR', // Norway
  OM: 'OMN', // Oman
  PK: 'PAK', // Pakistan
  PA: 'PAN', // Panama
  PY: 'PRY', // Paraguay
  PE: 'PER', // Peru
  PH: 'PHL', // Philippines
  PL: 'POL', // Poland
  PT: 'PRT', // Portugal
  QA: 'QAT', // Qatar
  RO: 'ROU', // Romania
  RU: 'RUS', // Russia
  SA: 'SAU', // Saudi Arabia
  RS: 'SRB', // Serbia
  SG: 'SGP', // Singapore
  ZA: 'ZAF', // South Africa
  ES: 'ESP', // Spain
  SE: 'SWE', // Sweden
  CH: 'CHE', // Switzerland
  TW: 'TWN', // Taiwan
  TH: 'THA', // Thailand
  TN: 'TUN', // Tunisia
  TR: 'TUR', // Turkey
  UA: 'UKR', // Ukraine
  AE: 'ARE', // United Arab Emirates
  GB: 'GBR', // United Kingdom
  US: 'USA', // United States
  UY: 'URY', // Uruguay
  VE: 'VEN', // Venezuela
  VN: 'VNM', // Vietnam
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