import { useEffect, useState } from "react";

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

function Weather() {
  const [data, setData] = useState<WeatherForecast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:7062/WeatherForecast")
      .then((res) => res.json())
      .then((json: WeatherForecast[]) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => console.error(err));
    console.log("Code has changed!");
  }, []);

  if (loading) return <div>Ładowanie danych...</div>;

  return (
    <ul>
      {data.map((item, index) => (
        <li key={index}>
          {item.summary} - {item.temperatureC}°C
        </li>
      ))}
    </ul>
  );
}

export default Weather;
