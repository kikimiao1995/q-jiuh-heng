// import "./App.css";
import Customers from "./Pages/Customers";
import Orders  from "./Pages/Orders";
import { Tabs } from 'antd'

const items = [
  {
    key: 'customers',
    label: 'customers',
    children:<Customers />,
  },
  {
    key: 'orders',
    label: 'orders',
    children: <Orders />,
  },
];

const onChange = (key) => {
  // console.log(key);
};

function App() {
  return (
    <>
      <Tabs defaultActiveKey="customers" items={items} onChange={onChange} />;
    </>
  );
}

export default App;
