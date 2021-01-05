import React, { useState, useEffect } from "react"
import { MenuItem, FormControl, Select, Card, CardContent } from "@material-ui/core"
import './App.css';
import InfoBox from "./InfoBox"
import LineGraph from "./LineGraph"
import Table from "./Table"
import { sortData } from "./util"



function App() {
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then((data) => {
      setCountryInfo(data);
    });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2,
        }))
          
          let sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
      })
    }
      getCountriesData()
  }, []);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url = countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all" 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`

     await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setInputCountry(countryCode)
      setCountryInfo(data);
        });
  };

  return (
    <div className="app">
      <div className="app__left">
      <div className="app__header">
      <h1 style={{padding: "20px", color: "#cc1034"}}>COVID TRACKER</h1>
      <FormControl className="app__dropdown">
        <Select variant="outlined" onChange={onCountryChange} value={country}>
          <MenuItem value="worldwide">Worldwide</MenuItem>
        {countries.map((country) => (
          <MenuItem value={country.value}>{country.name}</MenuItem>
        ))}
        </Select>
      </FormControl>
      </div>
      <div className="app__stats">
        <InfoBox  
        title="Coronavirus Cases"
        cases={countryInfo.todayCases}
        isRed
        active={casesType === "cases"} 
        total={countryInfo.cases} />

        <InfoBox
        title="Recovered" 
        active={casesType === "recovered"}
        cases={countryInfo.todayRecovered} 
        total={countryInfo.recovered} 
        />

        <InfoBox
        title="Deaths"
        isRed
        active={casesType === "deaths"}
        cases={countryInfo.todayDeaths}
        total={countryInfo.deaths} 
        />
      </div>
      <div className="graph">  
      <h3>worldwide new {casesType}</h3>
      <LineGraph casesType={casesType} />
      <br /><br />
      <h6 style={{height: "20px",color: "#666", fontSize: "20px", fontFamily: "Century Gothic", textShadow: "0px 1px 0px rgba(255,255,255,.5)", alignContent: "center"}}>Created By Bisma Jamil</h6>

      </div>
     </div>
        <Card className="app__right">
        <CardContent>
        <div className="app__information">
            <h2>Live Cases by Country</h2>
            <Table countries={tableData} />
            </div>
        </CardContent>
        </Card>
              </div>
  );
}

export default App;

