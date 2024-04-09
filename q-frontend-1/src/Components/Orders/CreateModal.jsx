import { useState, useEffect } from "react";
import { Button, Form, Input, Modal, Select, DatePicker } from "antd";
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
        label="ID"
        name="id"
        rules={[
          {
            required: true,
            message: "Please input ID!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Customer ID"
        name="customerID"
        rules={[
          {
            required: true,
            message: "Please input Customer ID!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Total Amount"
        name="totalAmount"
        rules={[
          {
            required: true,
            message: "Please input Total Amount!",
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
            message: "Please input your status!",
          },
        ]}
      >
        <Select
        >
          <Select.Option value="0">0: void</Select.Option>
          <Select.Option value="1">1: Open</Select.Option>
          <Select.Option value="2">2: Completed</Select.Option>
          <Select.Option value="3">3: Invoice</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="Sale Name"
        name="saleName"
        rules={[
          {
            required: true,
            message: "Please input your sale name!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Date"
        name="date"
        rules={[
          {
            required: true,
            message: "'Please select date!",
            type: 'object'
          },
        ]}
      >
        <DatePicker />
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
    const request = {
      ...values,
      unixSecDate:  Math.floor(new Date(values.date).getTime() / 1000)
    }
    
    console.log(request)

    const url = "http://localhost:3000";
    fetch(`${url}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    })
      .then((res) => res.json())
      .then((data) => console.log("Data sucessfully posted", data))
      .catch((err) => console.error("error posting data", err))
      .finally(() => {
        // console.log("Received request of form: ", request);
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
