import { useState } from 'react'
import React from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function GetWeather(props){
  
}

function App() {
  const [weather, setWeather] = useState([])
  const [cityToSearch, setCityToSearch] = useState("")
  const [temp, setTemp] = useState("")


  React.useEffect(() => {
    fetchCityData();
  }, [cityToSearch]);


  const fetchCityData = () => {
    cityToSearch ? fetch("https://jb03dcnv74.execute-api.eu-west-1.amazonaws.com/Prod/weather/"+cityToSearch)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setWeather(data.condition);
        setTemp(data.temperature);
      }) : "";
  };

  const fetchLocalisation = () => {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        function(position){
          console.log(position);
          var latitude = position.coords.latitude;
          var longitude = position.coords.longitude;
          fetch("https://jb03dcnv74.execute-api.eu-west-1.amazonaws.com/Prod/geo?lon="+longitude+"&lat="+latitude)
            .then((response) => {
            return response.json();
            })
            .then((data) => {
              setCityToSearch(data.city);
          });
        },
        (err) => console.log(err)
      );
    } 
  }

  const onSubmitHandler = (event) =>{
      event.preventDefault();
      setCityToSearch(event.currentTarget.elements.city.value);
  }

  return (
    <>
      <div>
        <form onSubmit={onSubmitHandler}><button type="submit"></button><input type='text' id='city'></input></form><br/>
        <div>{cityToSearch}  {temp}</div><br/><div>{weather}</div>
        <br/><button onClick={fetchLocalisation}>Geoloc</button>
      </div>
    </>
  )
}

export default App
