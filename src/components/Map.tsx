import { GoogleMap, Marker } from "@react-google-maps/api";
import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Space } from "antd";

import Places from "./Places";
import SearchHistory from "./SearchHistory";
import { LatLngLiteral, MarkerType, GeolocationType } from "./interface";

const RootBox = styled.div`
  display: flex;
  flex-direction: row;
`;

const InputBox = styled(Space)`
  display: flex;
  flex-direction: column;
  margin: 2rem;
`;

const MapBox = styled.div`
  width: 80%;
  height: 100vh;
`;

export const TextBox = styled.div`
  min-height: 10rem;
  width: 20rem;
  border: 1px dashed silver;
  padding: 2rem 1rem;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export default function Map() {
  const [markers, setMarkers] = useState<MarkerType[]>([]);
  const [center, setCenter] = useState<LatLngLiteral>({
    lat: 43,
    lng: -79,
  });

  const fetchTimeZoneAndLocalTime = async (latLng: LatLngLiteral) => {
    try {
      const date = new Date();
      const unixTime = date.getTime() / 1000 + date.getTimezoneOffset() * 60;
      const { data } = await axios.get(
        `https://maps.googleapis.com/maps/api/timezone/json?location=${latLng.lat},${latLng.lng}&timestamp=${unixTime}&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEP}`
      );
      const { dstOffset, rawOffset, timeZoneName } = data;
      const localDate = new Date((unixTime + dstOffset + rawOffset) * 1000);
      const localTime = localDate.toLocaleTimeString("en-US");
      const createAt = date.toLocaleTimeString("en-US");
      const timeZoneAndLocalTime = { timeZoneName, localTime, createAt };
      return timeZoneAndLocalTime;
    } catch (err) {
      console.log(err);
    }
  };
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: GeolocationType) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  const deletAddress = (selectAddress: string[]) => {
    const newMarkers = markers.filter(
      (location) => !selectAddress.includes(location.address)
    );
    setMarkers(newMarkers);
  };

  const handleCenterState = (body: LatLngLiteral) => {
    setCenter(body);
  };
  return (
    <RootBox>
      <InputBox size={"small"}>
        <Places
          markers={markers}
          fetchTimeZoneAndLocalTime={fetchTimeZoneAndLocalTime}
          handleCenterState={handleCenterState}
          getUserLocation={getUserLocation}
          setMarker={(position: MarkerType[]) => {
            setMarkers(position);
          }}
        />

        {markers.length > 0 ? (
          <SearchHistory deletAddress={deletAddress} markers={markers} />
        ) : (
          <TextBox>
            <h2>Search History</h2>
            <p>Please search and add your first marker</p>
          </TextBox>
        )}
      </InputBox>
      <MapBox>
        <GoogleMap
          zoom={12}
          center={center}
          mapContainerClassName="map-container"
        >
          {markers &&
            markers.map((location) => (
              <Marker key={location.id} position={location.latLng} />
            ))}
        </GoogleMap>
      </MapBox>
    </RootBox>
  );
}
