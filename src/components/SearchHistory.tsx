import { useState } from "react";
import styled from "styled-components";
import { Checkbox, Pagination, Divider, Row, Col } from "antd";
import type { CheckboxValueType } from "antd/es/checkbox/Group";

import { TextBox } from "./Map";
import ModalComponent from "./ModalComponent";

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
const Line = styled(Divider)`
  width: 15rem;
`;

const RowBox = styled(Row)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid silver;
`;
const pageSize = 5;
const deleteText = {
  title: "Confirm Delete",
  text: "Are you sure to delete the markers? After you delete this, it can't be recovered.",
  processingText: "Deleting...",
};

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

  const handleDelete = () => {
    deletAddress(selectValue);
  };

  return (
    <TextBox>
      {selectValue.length > 0 && (
        <RowBox>
          <Col>
            {selectValue.length} of {markers.length} selected
          </Col>
          <ModalComponent
            action={handleDelete}
            title={deleteText.title}
            text={deleteText.text}
            processingText={deleteText.processingText}
          />
        </RowBox>
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
