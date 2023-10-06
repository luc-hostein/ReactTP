import { useEffect, useState } from 'react'
import React from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function GetWeatherIcon(props){
  const iconList = {
    "sunny": "../../public/sun.png",
    "cloudy": "../../public/cloud.png",
    "windy": "../../public/wind.png",
    "rainy": "../../public/rainy.png",
    "stormy": "../../public/thunderstorm.png"
  };

  if(props.weather) return <img src={iconList[props.weather]} width="30" height="30"></img>;

  return <img/>;
}


function ShowCityData(props){
  if(props.cityToSearch == "waiting"){
    console.log("Wait for sheacrh"); 
    return <div><p style={{color:"black"}}>Waiting for server</p></div>;
  } 

  if(props.cityToSearch == "error"){
    return <div><p style={{color:"black"}}>Unable to access server</p></div>
  }

  if(props.cityToSearch) return (<div>
                                  <p style={{color:"black"}}>{props.cityToSearch}</p>
                                    <hr/><p style={{color:"black"}}>{props.temp}<GetWeatherIcon weather={props.weather}/></p>
                                    <p style={{color:"black"}}>{props.weather}</p>
                                  </div>);

  return "";
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
        <form onSubmit={onSubmitHandler}>
          <button type="submit" className="submit">
            <img src="../../public/loupe.png" width='20' height='20'></img>
          </button>
          <input type='text' id='city' className="input">
          </input></form><br/>
        <div><ShowCityData cityToSearch={cityToSearch} weather={weather} temp={temp}/></div>
        <br/><button onClick={fetchLocalisation} style={{color:"black"}}>Geoloc</button>
      </div>
    </>
  )
}

export default App
