import React, { useEffect } from 'react';

import {
  FormControl,
  NativeSelect,
  Card,
  CardContent
} from '@material-ui/core'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

import InfoBox from './components/InfoBox'
import CountryTable from './components/CountryTable'
import Map from './components/Map'

import './App.css';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      gridGap: theme.spacing(3),
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: 'center',
      color: theme.palette.text.secondary,
      whiteSpace: 'nowrap',
      marginBottom: theme.spacing(1),
    },
    divider: {
      margin: theme.spacing(2, 0),
    },
    formControl: {
      alignItems: 'right'
    },
    cardContent: {
      flexGrow: 1,
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  }),
);

interface CountryData {
  todayCases: number,
  cases: number,
  todayRecovered: number,
  recovered: number,
  todayDeaths: number,
  deaths: number
}

function App() {
  const classes = useStyles();
  const [countries, setCountries] = React.useState([]);
  const [country, setCountry] = React.useState('worldwide');
  const [casesType, setCasesType] = React.useState('cases');
  const [tableData, setTableData] = React.useState<any[]>([]);
  const [mapCenter, setMapCenter] = React.useState<any>({ lat: 20.80746, lng: 90.4796 });
  const [mapZoom, setMapZoom] = React.useState(3);
  const [mapCountries, setMapCountries] = React.useState([]);
  const [countryData, setCountryData] = React.useState<CountryData>(
    {
      todayCases: 0,
      cases: 0,
      todayRecovered: 0,
      recovered: 0,
      todayDeaths: 0,
      deaths: 0
    });


  useEffect(() => {
    // Get data on all countries from the api
    // We need an empty dependency so this does not loop
    fetch('https://disease.sh/v3/covid-19/all')
      .then((res) => res.json())
      .then((data) => {
        setCountryData(data)
      })
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country: any) => ({
            name: country.country,
            value: country.countryInfo.iso2
          }))
          // Needed to remove countries with no iso2 values
          const unique = countries.filter((set => (f: { value: any; }) => !set.has(f.value) && set.add(f.value))(new Set()));

          setTableData(data)
          setMapCountries(data);
          setCountries(Array.from(unique.values()))
        })
    }
    getCountriesData()
  }, [])


  const onCountryChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
    const countryCode = event.target.value as string
    const url =
      countryCode === 'worldwide'
        ? 'https://disease.sh/v3/covid-19/all'
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

      await fetch(url)
        .then((response) => response.json())
        .then((data) => {
          setCountry(countryCode);
          setCountryData(data);
          
          if (countryCode === 'worldwide'){
            setMapCenter({ lat: 20.80746, lng: 90.4796 })
          } else {
            setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          }
          setMapZoom(4);
        })
  }

  return (
    <div className="App">
      <div>
        <Grid container spacing={3}>
          <Grid item xs={8}>
            <Paper className={classes.paper}>
              <Grid container spacing={3} alignItems="center">
                <Grid container item xs={8}>
                  <Typography variant="h4" color="inherit" align="left">
                  Covid-19 Dashboard
                  </Typography>
                </Grid>
                <Grid container item xs={4} justify='flex-end'>
                  <FormControl className={classes.formControl}>
                    <NativeSelect variant="outlined"  value={country} onChange={onCountryChange}>
                      <option value="worldwide">Worldwide</option>
										  {countries.map(({name, value}) => (
                        <option value={value} key={value}>{name}</option>
										  ))}
                    </NativeSelect>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={6} alignItems="center">
                <Grid container item xs={4}>
                  <InfoBox
									  isRed
									  active={casesType === 'cases'}
									  onClick={(e: React.ChangeEvent<{ value: unknown }>) => setCasesType('cases')}
									  title="Cases"
									  cases={countryData.todayCases}
									  total={countryData.cases}
								  />
                </Grid>
                <Grid container item xs={4}>
                  <InfoBox
									  active={casesType === 'recovered'}
									  onClick={(e: React.ChangeEvent<{ value: unknown }>) => setCasesType('recovered')}
									  title="Recovered"
									  cases={countryData.todayRecovered}
									  total={countryData.recovered}
								  />
                </Grid>
                <Grid container item xs={4}>
                  <InfoBox
                    isRed
									  active={casesType === 'deaths'}
									  onClick={(e: React.ChangeEvent<{ value: unknown }>) => setCasesType('deaths')}
									  title="Deaths"
									  cases={countryData.todayDeaths}
									  total={countryData.deaths}
								  />
                </Grid>
              </Grid>
              <div>
              <Map
								casesType={casesType}
								countries={mapCountries}
								center={mapCenter}
								zoom={mapZoom}
			        />
              </div>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Card className={classes.cardContent}>
              <CardContent>
              
                <Typography variant="body1" color="inherit" align="left">
                Cases by Country
                </Typography>
                <CountryTable
                  countries= {tableData}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default App;
