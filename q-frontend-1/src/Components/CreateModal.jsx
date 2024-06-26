import { useState, useEffect } from "react";
import { Button, Form, Input, Modal, Select } from "antd";
const CollectionCreateForm = ({ initialValues, onFormInstanceReady }) => {
  const [form] = Form.useForm();
  useEffect(() => {
    onFormInstanceReady(form);
  }, []);
  return (
    <Form
      layout="vertical"
      form={form}
      name="form_in_modal"
      initialValues={initialValues}
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
        label="Status"
        name="status"
        initialValue={0}
        rules={[
          {
            required: true,
            message: "Please input your address!",
          },
        ]}
      >
        <Select
        >
          <Select.Option value="0">0: void</Select.Option>
          <Select.Option value="1">1: active</Select.Option>
        </Select>
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
    </Form>
  );
};
const CollectionCreateFormModal = ({
  open,
  onCreate,
  onCancel,
  initialValues,
}) => {
  const [formInstance, setFormInstance] = useState();
  return (
    <Modal
      open={open}
      title="Create a Customer"
      okText="Create"
      cancelText="Cancel"
      okButtonProps={{
        autoFocus: true,
      }}
      onCancel={onCancel}
      destroyOnClose
      onOk={async () => {
        try {
          const values = await formInstance?.validateFields();
          formInstance?.resetFields();
          onCreate(values);
        } catch (error) {
          console.log("Failed:", error);
        }
      }}
    >
      <CollectionCreateForm
        initialValues={initialValues}
        onFormInstanceReady={(instance) => {
          setFormInstance(instance);
        }}
      />
    </Modal>
  );
};
const CreateModal = ({ refresh }) => {
  const [open, setOpen] = useState(false);
  const onCreate = (values) => {
    
    const url = "http://localhost:3000";
    fetch(`${url}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((res) => res.json())
      .then((data) => console.log("Data sucessfully posted", data))
      .catch((err) => console.error("error posting data", err))
      .finally(() => {
        console.log("Received values of form: ", values);
        setOpen(false);
        refresh()
      });
  };
  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Create
      </Button>
      <CollectionCreateFormModal
        open={open}
        onCreate={onCreate}
        onCancel={() => setOpen(false)}
        initialValues={{
          modifier: "public",
        }}
      />
    </>
  );
};
export default CreateModal;
