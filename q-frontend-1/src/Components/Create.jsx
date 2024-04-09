import { useState, useEffect } from "react";
import { Button, Modal, Input, Flex, Col, Form, Space } from "antd";

export default function Create() {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const [input, setInput] = useState({});

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

  const url = "http://localhost:3000";
  const handleOk = () => {
    setConfirmLoading(true);
    fetch(`${url}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    })
      .then((res) => res.json())
      .then((data) => console.log("Data sussfully posted", data))
      .catch((err) => console.error("error posting data", err))
      .finally(() => {
        console.log("finally");
        setInput({
          id: "",
          name: "",
          country: "",
          state: "",
          city: "",
          address: "",
          zip: "",
        });
        setConfirmLoading(false);
        setOpen(false);
      });
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
        <Form
          form={form}
          style={{ margin: "44px 0" }}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 12 }}
        >
          <Form.Item
            label="Customer ID"
            name="id"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Country"
            name="country"
            rules={[
              {
                required: true,
                message: "Please input your country!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="State"
            name="state"
            rules={[
              {
                required: true,
                message: "Please input your state!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="City"
            name="city"
            rules={[
              {
                message: "Please input your city!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
            rules={[
              {
                required: true,
                message: "Please input your address!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Zip"
            name="zip"
            rules={[
              {
                message: "Please input your zip!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Space>
              <SubmitButton form={form}>Submit</SubmitButton>
              <Button htmlType="reset">Reset</Button>
            </Space>
          </Form.Item>
        </Form>
        {/* <Flex vertical gap={16} style={{ margin: "32px 0" }}>
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
        </Flex> */}
      </Modal>
    </>
  );
}

const SubmitButton = ({ form, children }) => {
  const [submittable, setSubmittable] = useState(false);

  // Watch all values
  const values = Form.useWatch([], form);
  useEffect(() => {
    form
      .validateFields({
        validateOnly: true,
      })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false));
  }, [form, values]);
  return (
    <Button type="primary" htmlType="submit" disabled={!submittable}>
      {children}
    </Button>
  );
};
