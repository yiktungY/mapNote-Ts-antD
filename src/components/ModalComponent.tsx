import { Button, Modal, message } from "antd";
import { useState } from "react";
import styled from "styled-components";

interface Model {
  text: string;
  title: string;
  processingText: string;
  action: () => void;
}

const DeleteButton = styled(Button)``;

export default function ModalComponent({
  text,
  title,
  processingText,
  action,
}: Model) {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState(text);

  const handleVisible = () => {
    if (!visible) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const handleOk = () => {
    setModalText(processingText);
    setConfirmLoading(true);

    setTimeout(() => {
      setVisible(false);
      setConfirmLoading(false);
      action();
      //error condtions should be considered if data fetch from api
      message.success("Action success!");
    }, 1000);
  };

  return (
    <>
      <DeleteButton type="primary" onClick={handleVisible}>
        Delete
      </DeleteButton>

      <Modal
        title={title}
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleVisible}
      >
        <p>{modalText}</p>
      </Modal>
    </>
  );
}
