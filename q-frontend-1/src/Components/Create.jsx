import { useState } from "react";
import { Button, Modal, Input, Flex, Col } from "antd";

export default function Create() {

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState('Content of the modal');
  const [input, setInput] = useState({})

  const showModal = () => {
    setOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput((preState) => ({
      ...preState,
      [name]: value,
    }));
  };
  
  const url = 'http://localhost:3000/customers'
  const handleOk = () => {
    setConfirmLoading(true);
    fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(input)
    })
      .then(res => res.json())
      .then(data => console.log('Data sussfully posted', data))
      .catch(err => console.error('error posting data', err))
      .finally(() => {
        console.log('finally')
        setInput({
          id: "",
          name: "",
          country: "",
          state: "",
          city: "",
          address: "",
          zip: ""
        })
        setConfirmLoading(false);
        setOpen(false);
      })
  };
  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <>
      <Button type="primary" onClick={showModal}>
       Create
      </Button>
      <Modal
        centered
        title="Create a Customer"
        open={open}
        onOk={handleOk}
        okText="Create"
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Flex vertical gap={16} style={{margin: '32px 0'}}>
          <label>
            Customer ID :
            <Input
              name="id"
              onChange={handleInputChange}
              maxLength={20}
              required
            />
          </label>
          <label>
            Name :
            <Input
              name="name"
              onChange={handleInputChange}
              maxLength={50}
              required
            />
          </label>
          <label>
            Country :
            <Input
              name="country"
              onChange={handleInputChange}
              maxLength={3}
              required
            />
          </label>
          <label>
            State :
            <Input
              name="state"
              onChange={handleInputChange}
              maxLength={2}
              required
            />
          </label>
          <label>
            City :
            <Input
              name="city"
              onChange={handleInputChange}
              maxLength={50}
              required
            />
          </label>
          <label>
            Address :
            <Input
              name="address"
              onChange={handleInputChange}
              maxLength={100}
              required
            />
          </label>
          <label>
            Zip :
            <Input
              name="zip"
              onChange={handleInputChange}
              maxLength={20}
              required
            />
          </label>
        </Flex>
      </Modal>
    </>
  )
}