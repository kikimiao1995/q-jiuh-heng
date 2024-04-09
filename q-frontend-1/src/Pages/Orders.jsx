// export default function Orders() {
//   let now = new Date()
//   now.setFullYear(now.getFullYear() - 3)
//   let formattedDate = Math.floor(now.getTime() / 1000)
//   console.log(now.getTime())
//   console.log(formattedDate);
//   return (
//     <>
//       <div>Orders</div>
//       <p>{formattedDate}</p>
//     </>
//   )
// }

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
  Typography,
  DatePicker 
} from "antd";
import { Content } from "antd/es/layout/layout";
import CreateModal from "../Components/Orders/CreateModal";

function removeBlankAttributes(obj) {
  const result = {};
  for (const key in obj) {
    if (obj[key] !== "" && obj[key] !== undefined && key !== "timeInterval") {
      result[key] = obj[key];
    }
  }
  return result;
}

export default function Orders() {
  
  const baseUrl = "http://localhost:3000"
  const orinigalUrl = "http://localhost:3000/customers?status=1&_start=0&_limit=30"
  const url = "http://localhost:3000/orders?status=1";
  
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [search, setSearch] = useState({});

  
  const [editingID, seteditingID] = useState('');
  const isEditing = (record) => record.id === editingID;

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Customer ID",
      dataIndex: "customerID",
      key: "customerID",
      editable: true,
    },
    {
      title: "Total Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      editable: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      editable: true,
    },
    {
      title: "Sales Name",
      dataIndex: "saleName",
      key: "saleName",
      editable: true,
    },
    {
      title: "Order Date",
      dataIndex: "date",
      key: "date",
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

      const [month, day, year] = editedRow.date.split('-');
      const dateObj = new Date(`${year}-${month}-${day}`)
      const unixSecDate =  Math.floor(dateObj.getTime() / 1000)

      const edition = {
        ...editedRow,
        unixSecDate 
      }

      const res = await fetch(`http://localhost:3000/orders/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(edition)
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
        const res = await fetch(`http://localhost:3000/orders/${id}`, {
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

  const refreshData = async () => {
    // fetch("http://localhost:3000/customers?status=1&_start=0&_limit=30")
    // fetch("http://localhost:3000/customers?status=1")
    //   .then((res) => res.json())
    //   .then((json) => setData(json))
    //   // .then(data => console.log(data))
    //   .catch((err) => console.error(err));

      try {
        const orders = await fetch(`${baseUrl}/orders?status=1`).then(res => res.json())
        orders.forEach(order => {
          order.date = new Date(order.unixSecDate * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).replace(/\//g, '-')
        })
        setData(orders)
      } catch (err) {
        console.error(err)
      }


  }

  useEffect(() => {
    refreshData()
  }, []);

  const handleSearchInputChange = (e) => {
    const { name, value } = e.target;
    setSearch((preState) => ({
      ...preState,
      [name]: value,
    }));
  };

  const onChangeDate = (date, dateString) => {
    if (!date) {
      setSearch((preState) => ({
        ...preState,
        timeInterval: []
      }));
      return
    }
    const start = Math.floor(new Date(dateString).getTime() / 1000)
    const end =  start + 86400
    setSearch((preState) => ({
      ...preState,
      timeInterval: [start, end]
    }));
  }

  const submit = () => {
    const inputString = new URLSearchParams({
      status: 1,
      ...removeBlankAttributes(search),
    }).toString();

    // const url = `${baseUrl}/orders?status=1`
    let query = `${baseUrl}/orders?${inputString}`
    console.log(query)

    if (search.timeInterval?.length > 0) {
      // time interval
      query = `${query}&unixSecDate_gte=${search.timeInterval[0]}&unixSecDate_lt=${search.timeInterval[1]}`
    }
    // console.log(query)
    fetch(query)
      .then((res) => res.json())
      .then((data) => {
        data.forEach(order => {
          order.date = new Date(order.unixSecDate * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).replace(/\//g, '-')
        })
        setData(data)
      })
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
      <Layout style={{ padding: "60px 40px" }}>
        <Content>
          <Card>
            <Row justify="start" align="bottom" gutter={16}>
              <Col span={2}>
                <label>
                  ID :
                  <Input
                    name="id"
                    onChange={handleSearchInputChange}
                    maxLength={20}
                  />
                </label>
              </Col>
              <Col span={2}>
                <label>
                  Customer ID :
                  <Input
                    name="customerID"
                    onChange={handleSearchInputChange}
                    maxLength={20}
                  />
                </label>
              </Col>
              <Col span={2}>
                <label>
                  TotalAmount :
                  <Input
                    name="totalAmount"
                    onChange={handleSearchInputChange}
                    maxLength={20}
                  />
                </label>
              </Col>
              <Col span={2}>
                <label>
                  Status :
                  <Input
                    name="status"
                    onChange={handleSearchInputChange}
                    maxLength={2}
                  />
                </label>
              </Col>
              <Col span={2}>
                <label>
                  Sales Name :
                  <Input
                    name="saleName"
                    onChange={handleSearchInputChange}
                    maxLength={50}
                  />
                </label>
              </Col>
              <Col span={3}>
                <label>
                  Order Date :
                  <DatePicker 
                    name="unixSecDate"
                    onChange={onChangeDate}
                  />
                </label>
              </Col>
              <Col flex="auto">
                <Flex justify="space-between">
                  <Button type="primary" onClick={submit}>
                    Submit
                  </Button>
                  <CreateModal refresh={refreshData} />
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


