import React, { useEffect, useState } from 'react';
import { Button, Card, Container, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaLocationArrow, FaTemperatureHigh } from "react-icons/fa";
import { faDroplet, faWind } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Weather = () => {
    const [cityName, setCityName] = useState('Noida');
    const [weatherInfo, setWeatherInfo] = useState({});
    const [cities, setCities] = useState([]);
    const [image, setImage] = useState('');

    const currentDate = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true
    };
    const dateTimeString = currentDate.toLocaleString('en-US', options).replace('at ', '');

    const fetchCities = async () => {
        try {
            const { data } = await axios.get('https://api.openaq.org/v1/cities?country_id=IN&limit=10000');
            setCities(data.results.map((city) => city.city));
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const getWeatherData = async () => {
        const apiKey = await process.env.REACT_APP_WEATHER_API;
        const countryCode = 'IN';

        const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityName},${countryCode}`;

        await axios.get(apiUrl).then(response => {
            setWeatherInfo(response?.data);
            setImage(response?.data?.current?.condition?.icon);
        }).catch(error => {
            console.error('Error:', error);
        });
    }

    useEffect(() => {
        fetchCities();
        getWeatherData();
    }, []);

    return (
        <Container className='weatherCard my-5'>
            <Card className='border border-1 border-dark'>
                <Card.Header>
                    <h1 className='fw-bold'>Weather App</h1>
                </Card.Header>
                <Card.Body style={{ background: '#9875' }}>
                    <Form autoComplete='off'>
                        <Form.Group className='d-flex flex-wrap justify-content-center'>

                            <Form.Control type='text' placeholder='Enter a City Name' size='md' id='inputCity'
                                value={cityName} onChange={(e) => setCityName(e.target.value)} list='cityList' />

                            <datalist id="cityList">
                                {cities.map((city) => (
                                    <option key={city} value={city} />
                                ))}
                            </datalist>

                            <Button onClick={getWeatherData} className='searchBtn rounded-5 fs-5' size='md'>Search</Button>
                        </Form.Group>

                        <Card.Img className='mt-5' src={`https:${image}`} style={{ width: "120px", height: '120px' }} />

                        <h1 className='display-4 mt-4 fw-bold'>
                            {weatherInfo.current?.temp_c}
                            <span className='display-5'>&#8451;</span>
                        </h1>

                        <p className='fs-4 fw-bold'>{weatherInfo.current?.condition?.text}</p>

                        <h1 className='fs-3 fw-bold'>
                            <FaLocationArrow className='text-danger' /> &nbsp;
                            {weatherInfo.location?.name}, {weatherInfo.location?.region}, {weatherInfo.location?.country}
                        </h1>

                        <div className='row pt-4'>
                            <div className='col'>
                                <h2 className='fw-bold'>
                                    <span><FaTemperatureHigh className='text-primary' /></span>&nbsp;
                                    {weatherInfo.current?.feelslike_c}<span style={{ fontSize: '1.8rem' }}>&#8451;</span>
                                </h2>
                                <span style={{ fontSize: '1.2rem' }}>feels like</span>
                            </div>

                            <div className='col'>
                                <h2 className='fw-bold'>
                                    <span className='fs-3'>&nbsp;<FontAwesomeIcon className='text-primary' icon={faDroplet} /></span>
                                    &nbsp;{weatherInfo.current?.humidity} %
                                </h2>
                                <span style={{ fontSize: '1.2rem' }}>humidity</span>
                            </div>

                            <div className='col'>
                                <h2 className='fw-bold'>
                                    <span className='fs-3'>&nbsp;<FontAwesomeIcon className='text-primary' icon={faWind} /></span>
                                    &nbsp;{weatherInfo.current?.humidity} KPH
                                </h2>
                                <span style={{ fontSize: '1.2rem' }}>winds</span>
                            </div>
                        </div>

                        <div className='fw-bold fs-5 mt-3'>{dateTimeString}</div>
                    </Form>
                </Card.Body>
                <Card.Footer>
                    <p className='mt-2 fs-4'>created by Shubham Saini</p>
                </Card.Footer>
            </Card>
        </Container >
    );
}

export default Weather;