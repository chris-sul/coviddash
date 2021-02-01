import React from 'react'
import { MapContainer , TileLayer, Circle, Popup } from 'react-leaflet';
import numeral from "numeral";

import './Map.css';

interface Props {
    countries: any[]
    center: any
    zoom: any
    casesType: string
  }

function Map({ countries, center, zoom, casesType='cases', ...props }: Props) {
    const casesTypeColors = {
        cases: {
          hex: "#CC1034",
          rgb: "rgb(204, 16, 52)",
          half_op: "rgba(204, 16, 52, 0.5)",
          multiplier: 500,
        },
        recovered: {
          hex: "#7dd71d",
          rgb: "rgb(125, 215, 29)",
          half_op: "rgba(125, 215, 29, 0.5)",
          multiplier: 500,
        },
        deaths: {
          hex: "#fb4443",
          rgb: "rgb(251, 68, 67)",
          half_op: "rgba(251, 68, 67, 0.5)",
          multiplier: 2000,
        },
    };
    
    function mapData(data: any[], casesType = "cases") {

        const res = data.map((country) => (
            <Circle
                key={country.country}
                center={[country.countryInfo.lat, country.countryInfo.long]}
                color={(casesTypeColors as any)[casesType].hex}
                fillColor={(casesTypeColors as any)[casesType].hex}
                fillOpacity={0.4}
                radius={
                    Math.sqrt(country[casesType]) * (casesTypeColors as any)[casesType].multiplier
                }
            >
            <Popup>
                <div className="info-container">
                <div
                    className="info-flag"
                    style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
                ></div>
                <div className="info-name">{country.country}</div>
                <div className="info-confirmed">
                    Cases: {numeral(country.cases).format("0,0")}
                </div>
                <div className="info-recovered">
                    Recovered: {numeral(country.recovered).format("0,0")}
                </div>
                <div className="info-deaths">
                    Deaths: {numeral(country.deaths).format("0,0")}
                  </div>
                </div>
            </Popup>
            </Circle>
        ))

        return res
    }
    
    return (
        <div className="map">
            <MapContainer center={center} zoom={zoom}>
                <TileLayer
                    //attribution= '&amp;copy <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                    attribution='Map tiles by Carto, under CC BY 3.0. Data by <a href="https://osm.org/copyright">OpenStreetMap</a>, under ODbL.'
                    //url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
                />
                {mapData(countries, casesType)}
            </MapContainer>
        </div>
    )
}

export default Map; 