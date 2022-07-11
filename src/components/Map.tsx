import { GoogleMap, Marker } from "@react-google-maps/api";
import { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Space, Drawer, message } from "antd";

import Places from "./Places";
import SearchHistory from "./SearchHistory";
import { LatLngLiteral, MarkerType, GeolocationType } from "./interface";

const RootBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
  const [fetching, setFetching] = useState<boolean>(false);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  const fetchTimeZoneAndLocalTime = async (latLng: LatLngLiteral) => {
    try {
      const date = new Date();
      const unixTime = date.getTime() / 1000 + date.getTimezoneOffset() * 60;
      const { data } = await axios.get(
        `https://maps.googleapis.com/maps/api/timezone/json?location=${latLng.lat},${latLng.lng}&timestamp=${unixTime}&key=AIzaSyCAy0Lm3QtsydKhWLc-OeKYq4VngcuYrpU`
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

  const getUserLocation = async () => {
    if (navigator.geolocation) {
      setFetching(true);
      navigator.geolocation.getCurrentPosition((position: GeolocationType) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
      setTimeout(() => {
        setFetching(false);
      }, 2000);
    } else {
      message.error("Geolocation is not supported by your browser");
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

  const handleDrawer = () => {
    if (!openDrawer) {
      setOpenDrawer(true);
    } else {
      setOpenDrawer(false);
    }
  };

  const handleOnClose = () => {
    setOpenDrawer(false);
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
          fetching={fetching}
          handleDrawer={handleDrawer}
        />
        <Drawer
          title="Search History"
          placement="right"
          closable={true}
          visible={openDrawer}
          onClose={handleOnClose}
        >
          {markers.length > 0 ? (
            <SearchHistory deletAddress={deletAddress} markers={markers} />
          ) : (
            <p>Please search and add your first marker</p>
          )}
        </Drawer>
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
