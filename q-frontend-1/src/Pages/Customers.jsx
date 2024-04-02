// import "./App.css";
import { useState } from "react";
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
} from "antd";
import { Content } from "antd/es/layout/layout";

const data = [
  {
    id: "-5GihhRgK_w184ouP-Dt",
    name: "Dr. Bill Ernser",
    country: "PCN",
    city: "West Jaunitaborough",
    state: "WI",
    address: "9848 Jenifer Club Suite 127",
    zip: "63029-5878",
    status: 1,
  },
  {
    id: "i8fogxNaLMGVHpgTC1TY",
    name: "Brandy Borer",
    country: "TGO",
    city: "Tiabury",
    state: "AZ",
    address: "3592 Hill Street Suite 865",
    zip: "76869-8307",
    status: 0,
  },
];
for (let i = 0; i < 100; i++) {
  data.push({
    id: i,
    name: "Brandy Borer",
    country: "TGO",
    city: "Tiabury",
    state: "AZ",
    address: "3592 Hill Street Suite 865",
    zip: "76869-8307",
    status: 0,
  });
}

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
  },
  {
    title: "Country",
    dataIndex: "country",
    key: "country",
  },
  {
    title: "State",
    dataIndex: "state",
    key: "state",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
  {
    title: "Zip",
    dataIndex: "zip",
    key: "zip",
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Edit</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

function Customers() {
  const [search, setSearch] = useState({
    id: "",
    name: "",
    country: "",
    city: "",
    state: "",
    address: "",
    zip: "",
    status: 1,
  });

  const handleSearchInputChange = (e) => {
    const { name, value } = e.target;
    setSearch((preState) => ({
      ...preState,
      [name]: value,
    }));
  };

  const submit = () => {
    console.table(search);
  };
  return (
    <>
      <Layout style={{ padding: "40px" }}>
        <Content>
          <Card>
            <p>只顯示 Status = Active 的客戶</p>
            <p>
              Customer.ID, Name, Country, State, City, Address, Zip
              做單一或多欄位模糊查詢
            </p>
            <p>列表可檢視該客戶近三年的各年度銷售總金額</p>
          </Card>
          <Card>
            <Row justify="start" gutter={16}>
              <Col span={3}>
                <p>Customer ID</p>
                <Input
                  onChange={handleSearchInputChange}
                  maxLength={20}
                ></Input>
              </Col>
            </Row>
            <p>State</p>
            <Input maxLength={0}></Input>
            <p>City</p>
            <Input></Input>
            <p>Address</p>
            <Input></Input>
            <p>Zip</p>
            <Input></Input>
            <Button type="primary" onClick={submit}>
              Button
            </Button>
          </Card>
          <Card>
            <Table
              rowKey={(item) => item.id}
              columns={columns}
              dataSource={data}
              pagination={{ pageSize: 30 }}
              scroll={{ y: 240 }}
            />
          </Card>
        </Content>
      </Layout>
    </>
  );
}

export default Customers;
