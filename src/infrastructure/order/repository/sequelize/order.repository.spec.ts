import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import OrderItemModel from "./order-item.model";
import ProductModel from "../../../product/repository/sequelize/product.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import Product from "../../../../domain/product/entity/product";
import OrderItem from "../../../../domain/checkout/entity/orderItem";
import Order from "../../../../domain/checkout/entity/order";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true }
        });

        sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    }); 
    
    it("should create a new order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");

        customer.changeAddress(address);

        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order("123", customer.id, [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"]
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "123",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: "123",
                    product_id: "123"
                }
            ]
        });
    });

    it("should update a order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 1, "Zipcode 1", "City 1");

        customer.changeAddress(address);

        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product1 = new Product("1", "Product 1", 15);
        const product2 = new Product("2", "Product 2", 18);
        const product3 = new Product("3", "Product 3", 19);
        
        await productRepository.create(product1);
        await productRepository.create(product2);
        await productRepository.create(product3);

        const ordemItem1 = new OrderItem("1", product1.name, product1.price, product1.id, 1);
        const ordemItem2 = new OrderItem("2", product2.name, product2.price, product2.id, 2);

        const order = new Order("update123", customer.id, [ordemItem1, ordemItem2]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const ordemItem3 = new OrderItem("3", product3.name, product3.price, product3.id, 3);

        order.addItem(ordemItem3);

        await orderRepository.update(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"]
        });
        
        expect(orderModel?.items.length).toBe(3);
		expect(orderModel?.total).toBe(order.total());
    });

    it("should find a order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer('999', 'Customer 1');
        const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1');
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product('999', 'Product 1', 10);
        await productRepository.create(product);

        const orderItem = new OrderItem('1', product.name, product.price, product.id, 2);
        const order = new Order('999', customer.id, [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({ where: { id: order.id }});
        const searchOrder = await orderRepository.find("999");

        expect(orderModel.toJSON()).toStrictEqual({
            id: searchOrder.id,
            customer_id: searchOrder.customerId,
            total: searchOrder.total()
        });
        expect(searchOrder.items.length).toBe(1);
        expect(searchOrder.items[0].price).toBe(10);
        expect(searchOrder.items[0].quantity).toBe(2);
    });

    it("should find all orders", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer('123', 'Customer 1');
        const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1');
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product('123', 'Product 1', 10);
        await productRepository.create(product);
        const product2 = new Product('1234', 'Product 2', 20);
        await productRepository.create(product2);

        const orderItem = new OrderItem('1', product.name, product.price, product.id, 1);
        const orderItem2 = new OrderItem('2', product.name, product.price, product.id, 1);

        const orderRepository = new OrderRepository();
        const order = new Order('123', customer.id, [orderItem]);
        await orderRepository.create(order);
        const order2 = new Order('456', customer.id, [orderItem2]);
        await orderRepository.create(order2);

        const orderModels = await orderRepository.findAll();
        const orders = [order, order2];

        expect(orderModels).toHaveLength(2);
        expect(orderModels).toEqual(orders);
    });
});
