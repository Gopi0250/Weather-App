import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Current from "./Components/Current";
import Forecast from "./Components/Forecast";
import'../node_modules/bootstrap/dist/js/bootstrap'

export default function App() {
  const [city, setCity] = useState();
  const[clickedCity,setClickedcity] = useState();
  const [citysuggestion, setCitysuggestion] = useState([]); 
  const [currentWeather, setCurrent] = useState();
  const [forecastWeather, setForecast] = useState();
  const [location, setLocation] = useState();

  const autoCompleteURl =
    "https://api.weatherapi.com/v1/search.json?key=83c0b17cb2774eac95723527231501&q=";
  
  const WeatherURL=(city)=>`https://api.weatherapi.com/v1/forecast.json?key=83c0b17cb2774eac95723527231501&q=${city}&days=7&aqi=no&alerts=no`;
 
  useEffect(() => {
    if (city && city.length > 3) {
      fetchAutoCompAPI();
    }
  }, [city]);

  const fetchAutoCompAPI = async () => {
    try {
      const response = await axios.get(autoCompleteURl + city);
      const resp = response.data;
      console.log("api call", resp);
      const cityData = resp.map((data) => {
        return ` ${data.name},${data.region},${data.country}`; //template literal `
      });
      setCitysuggestion(cityData);
    } catch (e) {
      console.log("error", e);
    }
  };
  const handleSelectedCity =(city) =>{
    console.log("clicked city",city);
    // get user clicked city through city variable 
    setClickedcity(city);
    fetchWeatherAPI(city);
    setCitysuggestion([]);

  };
   


 const fetchWeatherAPI =async (city)=>{
  
    
    try{
      const response= await axios.get(WeatherURL(city));
      const resp =response.data;
      //console.log(resp);
      setCurrent(resp.current);
      setForecast(resp.forecast);
      setLocation(resp.location);
      console.log('Currrent',resp.current);
      console.log('Forecast',resp.forecast);
      console.log('Location',resp.location);

      
    } catch (e) {
      console.log("Weather API error",e);
    }

  }

  
 
  return (
    
    <div className="container text-center bg-black p-5 rounded ms-sm-lg-6 mt-5">
      <h1 className="text-white mb-4">Weather App</h1>
  <div className="col-md-6"></div>
  <input
    type="text"
    // assigning user clicked city to value variable
    value={clickedCity}
    className="form-control"
    onChange={(e) => {
      setCity(e.target.value);
      if(e.target.value===""){
        setCurrent();
        setForecast();
        setLocation();
        setClickedcity();
      }
    }}
  />

  {citysuggestion && citysuggestion.map((city, index) => {
    return (
      <div
        key={index}  // Use a unique key if available
        className="text-center--bs-info-border-subtle rounded p-1 bg-opacity-10 border border---bs-info-border-subtle border-opacity-25 text-white"
        style={{ cursor: 'pointer' }}
        onClick={() => handleSelectedCity(city)}
      >
        {city}
      </div>
    );
  })}

 
 {currentWeather && <Current currentWeather={currentWeather} location={location} />}
  {forecastWeather && <Forecast forecastWeather={forecastWeather} location={location} />}
</div>

  );
}
 