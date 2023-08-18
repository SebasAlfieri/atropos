import { useEffect, useState } from 'react';

const IpTesting = () => {
  const [city, setCity] = useState('a');
  const [region, setRegion] = useState('b');
  const [country, setCountry] = useState('c');
  useEffect(() => {
    fetch('https://ipinfo.io/json')
      .then((response) => response.json())
      .then((data) => {
        const { city, region, country } = data;
        console.log(`Ubicación aproximada: ${city}, ${region}, ${country}`);
        setCity(city);
        setRegion(region);
        setCountry(country);
      })
      .catch((error) => {
        console.error('Error obteniendo la ubicación:', error);
      });
  }, []);

  return (
    <div>
      <h1>Ubicación Aproximada</h1>
      {city ? (
        <div>
          <p>City: {city}</p>
          <p>Region: {region}</p>
          <p>Country: {country}</p>
        </div>
      ) : (
        <p>Cargando la ubicación...</p>
      )}
    </div>
  );
};

export default IpTesting;
