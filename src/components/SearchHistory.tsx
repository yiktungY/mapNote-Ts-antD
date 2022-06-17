import { useState } from "react";
import styled from "styled-components";
import { Checkbox, Pagination, Button, Divider, Row, Col } from "antd";
import type { CheckboxValueType } from "antd/es/checkbox/Group";

import { TextBox } from "./Map";

interface SearchMarkerType {
  length?: number;
  slice?: any;
}

interface SearchHistoryType {
  markers: SearchMarkerType;
  deletAddress: (selectAddress: any[]) => void;
}

export interface CurrentAddressType {
  id: string;
  address: string;
  timeZone: string;
  localTime: string;
  children?: JSX.Element | JSX.Element[];
}

const pageSize = 10;

const Line = styled(Divider)`
  width: 15rem;
`;

const DeleteButton = styled(Button)`
  margin: 1rem 0 1rem 10rem;
`;

export default function SearchHistory({
  markers,
  deletAddress,
}: SearchHistoryType) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectValue, setSelectValue] = useState<CheckboxValueType[]>([]);

  const indexOfLastAddress = currentPage * pageSize;
  const indexOfFirstAddress = indexOfLastAddress - pageSize;
  const currentAddress = markers.slice(indexOfFirstAddress, indexOfLastAddress);

  const handleSelect = (checkedValues: CheckboxValueType[]) => {
    setSelectValue(checkedValues);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelect = () => {
    deletAddress(selectValue);
  };

  return (
    <TextBox>
      {selectValue.length > 0 && (
        <DeleteButton type="primary" danger onClick={handleDelect}>
          Delete Location
        </DeleteButton>
      )}
      <Checkbox.Group onChange={handleSelect}>
        {currentAddress.map((location: CurrentAddressType, index: number) => (
          <Checkbox key={location.id} value={location.address}>
            {location.address}
            {index === 0 && (
              <Row>
                <Col>Timezone: {location.timeZone}</Col>
                <Col> Local Time: {location.localTime}</Col>
              </Row>
            )}
            <Line />
          </Checkbox>
        ))}
      </Checkbox.Group>
      <Pagination
        pageSize={pageSize}
        current={currentPage}
        total={markers.length}
        onChange={handlePageChange}
      />
    </TextBox>
  );
}
