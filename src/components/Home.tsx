import { useLoadScript } from "@react-google-maps/api";
import { Spin } from "antd";
import styled from "styled-components";

import Map from "./Map";

const Loading = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function Home() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEP ?? "",
    libraries: ["places"],
  });

  return !isLoaded ? (
    <Loading>
      <Spin size="large" />
    </Loading>
  ) : (
    <Map />
  );
}
