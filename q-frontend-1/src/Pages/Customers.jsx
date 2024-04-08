// import "./App.css";
import { useState, useEffect } from "react";
import {
  ConfigProvider,
  Flex,
  Row,
  Col,
  Button,
  Input,
  Card,
  Layout,
  Table,
  Space,
  Pagination,
  Form, 
  InputNumber, 
  Popconfirm, 
  Typography
} from "antd";
import { Content } from "antd/es/layout/layout";
import Orders from "./Orders";
import Create from "../Components/Create";
import CreateModal from "../Components/CreateModal";
import SearchForm from "../Components/SearchForm";

function removeBlankAttributes(obj) {
  const result = {};
  for (const key in obj) {
    if (obj[key] !== "" && obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  return result;
}

export default function Customers() {
  
  const orinigalUrl = "http://localhost:3000/customers?status=1&_start=0&_limit=30"
  const url = "http://localhost:3000/customers?status=1";
  
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [order, setOrder] = useState([]);

  const [search, setSearch] = useState({});

  
  const [editingID, seteditingID] = useState('');
  const isEditing = (record) => record.id === editingID;

  const columns = [
    {
      title: "Customer ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      editable: true,
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      editable: true,
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      editable: true,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      editable: true,
    },
    {
      title: "Zip",
      dataIndex: "zip",
      key: "zip",
      editable: true,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => {
        const editable = isEditing(record);
        return  (
          <Space size="middle">
            {
              editable ? (
                <span>
                  <Typography.Link
                    onClick={() => save(record.id)}
                    style={{
                      marginRight: 8,
                    }}
                  >
                    Save
                  </Typography.Link>
                  <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
              ) : (
                <Typography.Link disabled={editingID !== ''} onClick={() => edit(record)}>
                  Edit
                </Typography.Link>
              )
            }
            <Popconfirm title="Sure to delete?" onConfirm={() => del(record.id)}>
              <a>Delete</a>
            </Popconfirm>
          </Space>
        )
      },
    },
  ];

  const edit = (record) => {
    form.setFieldsValue({
      id: '',
      name: '',
      country: '',
      state: '',
      address: '',
      zip: '',
      ...record,
    });
    seteditingID(record.id);
  };

  const cancel = () => {
    seteditingID('');
  };

  const save = async (id) => {
    try {
      const editedRow = await form.validateFields();

      const res = await fetch(`http://localhost:3000/customers/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editedRow)
      });
      if (!res.ok) {
          throw new Error('Failed to save edition');
      }

      refreshData()
      seteditingID('');

    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const del = async (id) => {
    try {
        const res = await fetch(`http://localhost:3000/customers/${id}`, {
            method: 'DELETE'
        });
        if (!res.ok) {
            throw new Error('Failed to delete post');
        }
        refreshData()

    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
    
  }

  const refreshData = () => {
    // fetch("http://localhost:3000/customers?status=1&_start=0&_limit=30")
    fetch("http://localhost:3000/customers?status=1")
      .then((res) => res.json())
      .then((json) => setData(json))
      // .then(data => console.log(data))
      .catch((err) => console.error(err));
  }

  const calSales = () => {
    fetch("http://localhost:3000/orders")
      .then((res) => res.json())
      // .then((json) => setOrder(json))
      .then(orders => 
        orders.forEach(order => {
          const { customerID, totalAmount, unixSecDate } = order
          const matchCustomer = data.find(customer => customer.id === customerID)
          if(matchCustomer){
            setData((preState) => ({
              ...preState,
              order: [{
                totalAmount,
                unixSecDate
              }]
            }));
          }
        })


      )
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    refreshData()
    calSales()
  }, []);

  const handleSearchInputChange = (e) => {
    const { name, value } = e.target;
    setSearch((preState) => ({
      ...preState,
      [name]: value,
    }));
  };

  const submit = () => {
    console.table(search);
    const inputString = new URLSearchParams(
      removeBlankAttributes(search)
    ).toString();

    const query = inputString !== "" ? `${url}&${inputString}` : orinigalUrl;
    console.log(query)
    fetch(query)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  };

  const mergedColumns = columns.map((col) => {
    // console.log(col)
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'status' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      <Layout style={{ padding: "40px" }}>
        <Content>
          <Card>
            {/* <Orders></Orders> */}
            <p>列表可檢視該客戶近三年的各年度銷售總金額</p>
          </Card>
          <Card>
            <Row justify="start" align="bottom" gutter={16}>
              <Col span={2}>
                <label>
                  Customer ID :
                  <Input
                    name="id"
                    onChange={handleSearchInputChange}
                    maxLength={20}
                  />
                </label>
              </Col>
              <Col span={2}>
                <label>
                  Name :
                  <Input
                    name="name"
                    onChange={handleSearchInputChange}
                    maxLength={50}
                  />
                </label>
              </Col>
              <Col span={2}>
                <label>
                  Country :
                  <Input
                    name="country"
                    onChange={handleSearchInputChange}
                    maxLength={3}
                  />
                </label>
              </Col>
              <Col span={2}>
                <label>
                  State :
                  <Input
                    name="state"
                    onChange={handleSearchInputChange}
                    maxLength={2}
                  />
                </label>
              </Col>
              <Col span={2}>
                <label>
                  City :
                  <Input
                    name="city"
                    onChange={handleSearchInputChange}
                    maxLength={50}
                  />
                </label>
              </Col>
              <Col span={2}>
                <label>
                  Address :
                  <Input
                    name="address"
                    onChange={handleSearchInputChange}
                    maxLength={100}
                  />
                </label>
              </Col>
              <Col span={2}>
                <label>
                  Zip :
                  <Input
                    name="zip"
                    onChange={handleSearchInputChange}
                    maxLength={20}
                  />
                </label>
              </Col>
              <Col flex="auto">
                <Flex justify="space-between">
                  <Button type="primary" onClick={submit}>
                    Submit
                  </Button>
                  <CreateModal />
                </Flex>
              </Col>
            </Row>
          </Card>
          <Card>
            <Form form={form} component={false}>
              <Table
                rowKey={(item) => item.id}
                components={{
                  body: {
                    cell: EditableCell,
                  },
                }}
                bordered
                dataSource={data}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{
                  pageSize: 30,
                  onChange: cancel,
                }}
                scroll={{ y: 440 }}
              />
            </Form>
          </Card>
        </Content>
      </Layout>
    </>
  );
}

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

