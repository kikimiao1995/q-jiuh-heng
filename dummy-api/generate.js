const { faker } = require("@faker-js/faker");

// setting
const slaesNum = 20;
const customersNum = 100;
const ordersNum = 300;

const sales = [];
const customers = [];
const orders = [];

const generateCustomer = () => ({
  id: faker.string.nanoid(20),
  name: faker.person.fullName(),
  country: faker.location.countryCode("alpha-3"),
  city: faker.location.city(),
  state: faker.location.state({ abbreviated: true }),
  address: faker.location.streetAddress(true),
  zip: faker.location.zipCode(),
  status: Math.round(Math.random()),
});

const generateOrder = () => ({
  id: faker.string.nanoid(20),
  customerID: customers.at(Math.round(Math.random() * (customersNum - 1)))?.id,
  totalAmount: faker.number.float({
    min: 0,
    max: Math.pow(10, 4),
    fractionDigits: 2,
  }),
  status: Math.round(Math.random() * 3),
  orderDate: faker.date.anytime().toISOString().split("T")[0],
  saleName: sales.at(Math.round(Math.random() * (slaesNum - 1))),
});

for (let i = 0; i < slaesNum; i++) {
  sales.push(faker.person.firstName());
}

for (let i = 0; i < customersNum; i++) {
  customers.push(generateCustomer());
}

for (let i = 0; i < ordersNum; i++) {
  orders.push(generateOrder());
}

// console.log(sales);
// console.table(customers);
// console.table(orders);

module.exports = {
  sales,
  customers,
  orders,
};
