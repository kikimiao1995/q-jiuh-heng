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
} from "antd";
import { Content } from "antd/es/layout/layout";
import Orders from "./Orders";
import Create from "../Components/Create";
import CreateModal from "../Components/CreateModal";
import SearchForm from "../Components/SearchForm";

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
  const url = "http://localhost:3000/customers?status=1";
  const [data, setData] = useState([]);
  const [search, setSearch] = useState({});

  useEffect(() => {
    fetch("http://localhost:3000/customers?status=1&_start=0&_limit=30")
      .then((res) => res.json())
      .then((json) => setData(json))
      // .then(data => console.log(data))
      .catch((err) => console.error(err));
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
    const query = inputString !== "" ? `${url}&${inputString}` : url;
    fetch(query)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error(err));
  };
  return (
    <>
      <Layout style={{ padding: "40px" }}>
        <Content>
          <Card>
            {/* <Orders></Orders> */}
            <p>列表可檢視該客戶近三年的各年度銷售總金額</p>
          </Card>
          <Card>
            <Row>
              <SearchForm />
            </Row>
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
            <Table
              rowKey={(item) => item.id}
              columns={columns}
              dataSource={data}
              pagination={{ pageSize: 30 }}
              scroll={{ y: 340 }}
            />
            <Pagination />
          </Card>
        </Content>
      </Layout>
    </>
  );
}
