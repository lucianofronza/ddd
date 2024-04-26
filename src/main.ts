import Address from './domain/customer/value-object/address';
import Customer from './domain/customer/entity/customer'
import OrderItem from './domain/checkout/entity/orderItem';
import Order from './domain/checkout/entity/order';

let customer = new Customer("123","Luciano Fronza");
const address = new Address("Rua das Flores", 23, "88037-518", "Carlos Barbosa");
customer.Address = address;
customer.activate();

const item1 = new OrderItem("1", "Item 1", 10, "p1", 1);
const item2 = new OrderItem("2", "Item 2", 15, "p2", 1);

const order = new Order("1", "123", [item1, item2]);