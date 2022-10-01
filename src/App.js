import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ReactComponent as SunriseIcon } from "./imgs/sunrise.svg"
import { ReactComponent as SunsetIcon } from "./imgs/sunset.svg"
import { ReactComponent as WindIcon } from "./imgs/wind.svg"
import { ReactComponent as HumidityIcon } from "./imgs/humidity.svg"
import { ReactComponent as FeelLikeIcon } from "./imgs/feelLikeIcon.svg"
import { ReactComponent as CloudsIcon } from "./imgs/clouds.svg"
import { ReactComponent as RainIcon } from "./imgs/rainy.svg"
import {ReactComponent as ClearIcon} from "./imgs/clear.svg"
import Moment from 'react-moment';

function App() {
  const [data, setData] = useState({})
  const [location, setLocation] = useState('')
  const [loaded, setLoaded] = useState(false)
  const API_KEY = '38618cbcf815d294e32f825715db2765'
  Moment.globalFormat = 'H:mm:ss';

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(OnSuccess, OnError)
  }, [])


  const OnSuccess = (location) => {
    console.log(location.coords)
    // SetLatitude(location.coords.latitude)
    // SetLongitude(location.coords.longitude)
    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&units=metric&appid=${API_KEY}`)
      .then((response) => {
        setData(response.data)
        console.log(response.data.sys)
        setLoaded(true)
      }).catch(error => console.log(error))

  }

  const OnError = (error) => {
    console.log(error);
  }

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`)
        .then((response) => {
          setData(response.data)
          // console.log(response.data)
          setLoaded(true)
        })
      setLocation('') //to clear the search input after each search!
    }
  }


  return (
    <div className="app">
      <div className="search">
        <input
          value={location}
          onChange={event => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder='Enter Location'
          type="text" />
      </div>
    
      <div className="container">
        {loaded &&
          <div className="top">
            <div className="location">
              <p>{data.name}</p>
            </div>
            <div className="temp">
              <h1>{data.main.temp.toFixed()}°C</h1>
            </div>
            <div className="description">
              <p>{data.weather[0].main}</p>
              {data.weather[0].main === "Clouds" ? <div><CloudsIcon /></div> : null}
              {data.weather[0].main === "Rain" ? <div><RainIcon /></div> : null}
              {data.weather[0].main === "Clear" ? <div><ClearIcon /></div> : null}
            </div>

          </div>
        }

        {loaded &&
          <div className="center">
            <div className="sunrise">
              <div><SunriseIcon /></div>
              <Moment unix>{data.sys.sunrise}</Moment>
              <p>Sunrise</p>
            </div>
            <div className="sunset">
              <div><SunsetIcon /></div>
              <Moment unix>{data.sys.sunset}</Moment>
              <p>Sunset</p>
            </div>
          </div>
        }

        {loaded &&
          <div className="bottom">
            <div className="feels">
              <div><FeelLikeIcon /></div>
              <p className='bold'>{data.main.feels_like.toFixed()}°C</p>
              <p>Feels Like</p>
            </div>
            <div className="humidity">
              <div><HumidityIcon /></div>
              <p className='bold'>{data.main.humidity}%</p>
              <p>Humidity</p>
            </div>
            <div className="wind">
              <div><WindIcon /></div>
              <p className='bold'>{data.wind.speed.toFixed()} MPH</p>
              <p>Wind Speed</p>
            </div>
          </div>
        }
        {!loaded ? <div className='msg'><h3>allow your location or enter location to display the weather !</h3></div> : null}
      </div>
     
    </div>
  );
}

export default App;
