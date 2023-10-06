import { useEffect, useState } from 'react'
import React from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function GetWeatherIcon(props){
  const iconList = {
    "sunny": "../img/sun.png",
    "cloudy": "../img/cloud.png",
    "windy": "../img/wind.png",
    "rainy": "../img/rainy.png",
    "stormy": "../img/thunderstorm.png"
  };

  if(props.weather) return <img src={iconList[props.weather]} width="30" height="30"></img>;

  return <img/>;
}


function ShowCityData(props){
  if(props.cityToSearch == "waiting"){
    console.log("Wait for sheacrh"); 
    return <div>Waiting for server</div>;
  } 

  if(props.cityToSearch == "error"){
    return <div>Unable to access server</div>
  }

  return (<div>{props.cityToSearch}  {props.temp}<GetWeatherIcon weather={props.weather}/><br/>{props.weather}</div>);
}



function App() {
  const [weather, setWeather] = useState(0)
  const [cityToSearch, setCityToSearch] = useState("")
  const [temp, setTemp] = useState("")
  

  const fetchLocalisation = () => {
    if(navigator.geolocation){
      setCityToSearch("waiting");
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
        (err) => setCityToSearch("error")
      );
    } 
  }

  React.useEffect(() => {
    FetchCityData();
  }, [cityToSearch]);

  function FetchCityData (){
    cityToSearch ? fetch("https://jb03dcnv74.execute-api.eu-west-1.amazonaws.com/Prod/weather/"+cityToSearch)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setWeather(data.condition);
        setTemp(data.temperature);
      }) : "";
  };
  

  const onSubmitHandler = (event) =>{
      event.preventDefault();
      setCityToSearch(event.currentTarget.elements.city.value);
  }

  return (
    <>
      <div>
        <form onSubmit={onSubmitHandler}><button type="submit"></button><input type='text' id='city'></input></form><br/>
        <div><ShowCityData cityToSearch={cityToSearch} weather={weather} temp={temp}/></div><br/>
        <br/><button onClick={fetchLocalisation}>Geoloc</button>
      </div>
    </>
  )
}

export default App
