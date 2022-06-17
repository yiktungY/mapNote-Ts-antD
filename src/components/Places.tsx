import styled from "styled-components";
import { useState } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { AutoComplete, Button, Form, Space } from "antd";
import { SearchOutlined, AimOutlined } from "@ant-design/icons";

// type PlacesProps = {
//   setMarker: (position: google.maps.LatLngLiteral) => void;
// };

const SearchForm = styled(Form)`
  padding: 2rem;
  display: flex;
  flex-direction: column;
  height: 10rem;
`;
const AlertText = styled.p`
  color: red;
  margin: 1rem;
`;

export default function Places({
  setMarker,
  markers,
  handleCenterState,
  fetchTimeZoneAndLocalTime,
  getUserLocation,
}: any) {
  const [alert, setAlert] = useState<Boolean>(false);
  const { Option } = AutoComplete;
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleOnChange = (data: string) => {
    setValue(data);
  };

  const handleOnSelect = (address: string) => {
    setValue(address, false);
    clearSuggestions();
  };

  const handleOnSearch = async () => {
    try {
      clearSuggestions();
      const results = await getGeocode({ address: value });
      const latLng = await getLatLng(results[0]);

      const data = await fetchTimeZoneAndLocalTime(latLng);

      const marker = {
        latLng,
        address: value,
        id: results[0].place_id,
        timeZone: data?.timeZoneName,
        localTime: data?.localTime,
        createdAt: data?.createAt,
      };
      const newMarker = markers.find(
        (location: any) => location.id === marker.id
      );
      if (!newMarker) {
        setMarker((prepMarkers: any) => [marker, ...prepMarkers]);
        handleCenterState(marker.latLng);
        setAlert(false);
      } else {
        setAlert(true);
        handleCenterState(marker.latLng);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SearchForm onFinish={handleOnSearch}>
      <AutoComplete
        value={value}
        style={{ width: 295, marginBottom: 20 }}
        onSelect={handleOnSelect}
        disabled={!ready}
        onChange={handleOnChange}
        placeholder="Typing Your Location"
      >
        {status === "OK" &&
          data.map((place) => (
            <Option key={place.place_id} value={place.description}>
              {place.description}
            </Option>
          ))}
      </AutoComplete>
      <Space size="large">
        <Button htmlType="submit" type="primary" icon={<SearchOutlined />}>
          Search
        </Button>
        <Button onClick={getUserLocation} icon={<AimOutlined />}>
          Show My Location
        </Button>
      </Space>
      {alert && <AlertText>This address has already been saved!</AlertText>}
    </SearchForm>
  );
}
