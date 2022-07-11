import styled from "styled-components";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { AutoComplete, Button, Form, Spin, message } from "antd";
import { HddTwoTone } from "@ant-design/icons";
import { SearchOutlined, AimOutlined } from "@ant-design/icons";
import { MarkerType, LatLngLiteral } from "./interface";

interface PlacesMarker {
  find: Function;
}

interface PlacesType {
  markers: PlacesMarker;
  setMarker: Function;
  fetching: Boolean;
  handleDrawer: () => void;
  handleCenterState: (body: LatLngLiteral) => void;
  fetchTimeZoneAndLocalTime: (
    latLng: LatLngLiteral
  ) => Promise<
    { timeZoneName: any; localTime: string; createAt: string } | undefined
  >;
  getUserLocation: () => void;
}

const SearchForm = styled(Form)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const SearchButton = styled(Button)`
  margin-left: 1rem;
  margin-right: 1rem;
  @media screen and (max-width: 768px) {
    margin-left: 0;
  }
`;

const Box = styled.div`
  width: 30rem;
  margin: 1rem 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media screen and (max-width: 500px) {
    width: 100vw;
    display: flex;
    padding: 1rem 3rem;
    flex-direction: column;
    align-items: flex-start;
    height: 10rem;
  }
`;

export default function Places({
  setMarker,
  markers,
  fetching,
  handleCenterState,
  fetchTimeZoneAndLocalTime,
  getUserLocation,
  handleDrawer,
}: PlacesType) {
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
        (location: MarkerType) => location.id === marker.id
      );
      if (!newMarker) {
        setMarker((prepMarkers: MarkerType[]) => [marker, ...prepMarkers]);
        handleCenterState(marker.latLng);
        message.success("Location saved!");
      } else {
        message.error("This address has already been saved!");
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
        style={{ width: 300 }}
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
      <Box>
        <SearchButton
          htmlType="submit"
          type="primary"
          icon={<SearchOutlined />}
        >
          Search
        </SearchButton>
        <Button
          onClick={getUserLocation}
          icon={fetching ? <Spin size="small" /> : <AimOutlined />}
        >
          Show My Location
        </Button>
        <Button icon={<HddTwoTone />} onClick={handleDrawer}>
          Manage Markers
        </Button>
      </Box>
    </SearchForm>
  );
}
