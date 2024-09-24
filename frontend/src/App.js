import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CountryList from './components/CountryList';
import CountryDetails from './components/CountryDetails';

function App() {
  return (
    <Router>
      <div>
        <h1>Country List</h1>
        <Routes>
          <Route path="/" element={<CountryList />} />
          <Route path="/country/:countryCode" element={<CountryDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
