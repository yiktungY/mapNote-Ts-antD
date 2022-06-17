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
    googleMapsApiKey: "AIzaSyCAy0Lm3QtsydKhWLc-OeKYq4VngcuYrpU",
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
