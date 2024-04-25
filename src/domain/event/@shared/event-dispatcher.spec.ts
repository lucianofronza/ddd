import Address from "../../entity/address";
import CustomerChangedAddressEvent from "../customer/customer-changed-address.event";
import CustomerCreatedEvent from "../customer/customer-created.event";
import SendLogConsoleWhenCustomerChangeAddressHandler from "../customer/handler/send-log-console-when-customer-change-address.handler";
import SendLog1ConsoleWhenCustomerIsCreatedHandler from "../customer/handler/send-log1-console-when-customer-is-created.handler";
import SendLog2ConsoleWhenCustomerIsCreatedHandler from "../customer/handler/send-log2-console-when-customer-is-created.handler";
import SendEmailWhenProductIsCreatedHandler from "../product/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../product/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
    it("Should register an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const eventLog1CustomerHandler = new SendLog1ConsoleWhenCustomerIsCreatedHandler();
        const eventLog2CustomerHandler = new SendLog2ConsoleWhenCustomerIsCreatedHandler();
        const eventLogCustomerChangeAddressHandler = new SendLogConsoleWhenCustomerChangeAddressHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        eventDispatcher.register("CustomerCreatedEvent", eventLog1CustomerHandler);
        eventDispatcher.register("CustomerCreatedEvent", eventLog2CustomerHandler);
        eventDispatcher.register("CustomerChangedAddressEvent", eventLogCustomerChangeAddressHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventLog1CustomerHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventLog2CustomerHandler);

        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]).toMatchObject(eventLogCustomerChangeAddressHandler);
    });

    it("Should unregister an event handler", () => {
        //Product is created
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
        eventDispatcher.unregister("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0);

        //Customer is Created
        const eventLog1CustomerHandler = new SendLog1ConsoleWhenCustomerIsCreatedHandler();
        const eventLog2CustomerHandler = new SendLog2ConsoleWhenCustomerIsCreatedHandler();

        eventDispatcher.register("CustomerCreatedEvent", eventLog1CustomerHandler);
        eventDispatcher.register("CustomerCreatedEvent", eventLog2CustomerHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventLog1CustomerHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventLog2CustomerHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
        eventDispatcher.unregister("CustomerCreatedEvent", eventLog1CustomerHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(1);
        eventDispatcher.unregister("CustomerCreatedEvent", eventLog2CustomerHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(0);

        //Customer changed address
        const eventLogCustomerChangeAddressHandler = new SendLogConsoleWhenCustomerChangeAddressHandler(); 
        
        eventDispatcher.register("CustomerChangedAddressEvent", eventLogCustomerChangeAddressHandler);
        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]).toMatchObject(eventLogCustomerChangeAddressHandler);
        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"].length).toBe(1);        
        eventDispatcher.unregister("CustomerChangedAddressEvent", eventLogCustomerChangeAddressHandler);
        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"].length).toBe(0);
    });

    it("Should unregister all event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const eventLog1CreatedCustomer = new SendLog1ConsoleWhenCustomerIsCreatedHandler();
        const eventLog2CreatedCustomer = new SendLog2ConsoleWhenCustomerIsCreatedHandler();
        const eventLogCustomerChangeAddressHandler = new SendLogConsoleWhenCustomerChangeAddressHandler(); 

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        eventDispatcher.register("CustomerCreatedEvent", eventLog1CreatedCustomer);
        eventDispatcher.register("CustomerCreatedEvent", eventLog2CreatedCustomer);
        eventDispatcher.register("CustomerChangedAddressEvent", eventLogCustomerChangeAddressHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventLog1CreatedCustomer);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventLog2CreatedCustomer);
        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]).toMatchObject(eventLogCustomerChangeAddressHandler);

        eventDispatcher.unregisterAll();

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeUndefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeUndefined();
        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"]).toBeUndefined();        
    });

    it("Should notify all event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");
        
        const eventHandlerLog1Customer = new SendLog1ConsoleWhenCustomerIsCreatedHandler();
        const spyEventHandlerLog1Customer = jest.spyOn(eventHandlerLog1Customer, "handle");

        const eventHandlerLog2Customer = new SendLog2ConsoleWhenCustomerIsCreatedHandler();
        const spyEventHandlerLog2Customer = jest.spyOn(eventHandlerLog2Customer, "handle");

        const eventLogCustomerChangeAddressHandler = new SendLogConsoleWhenCustomerChangeAddressHandler();
        const spyEventLogCustomerChangeAddressHandler = jest.spyOn(eventLogCustomerChangeAddressHandler, "handle");

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        eventDispatcher.register("CustomerCreatedEvent", eventHandlerLog1Customer);
        eventDispatcher.register("CustomerCreatedEvent", eventHandlerLog2Customer);
        eventDispatcher.register("CustomerChangedAddressEvent", eventLogCustomerChangeAddressHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandlerLog1Customer);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandlerLog2Customer);
        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]).toMatchObject(eventLogCustomerChangeAddressHandler);   

        const productCreatedEvent = new ProductCreatedEvent({
            name: "Product 1",
            description: "Product 1 description",
            price: 10.0
        });

        //Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
        eventDispatcher.notify(productCreatedEvent);

        expect(spyEventHandler).toHaveBeenCalled();

        const customerCreatedEventLog1 = new CustomerCreatedEvent({
            name: "Customer 1",
            description: "Log 1 Customer 1 description"
        });

        eventDispatcher.notify(customerCreatedEventLog1);

        expect(spyEventHandlerLog1Customer).toHaveBeenCalled();

        const customerCreatedEventLog2 = new CustomerCreatedEvent({
            name: "Customer 1",
            description: "Log 2 Customer 1 description"
        });

        eventDispatcher.notify(customerCreatedEventLog2);

        expect(spyEventHandlerLog2Customer).toHaveBeenCalled();

        const address = new Address("Rua 1",10,"88.056-256","Cidade 1");

        const customerCustomerChangeAddressLog = new CustomerChangedAddressEvent({
            id: "123",
            name: "Customer 1",
            address: { street: address.street, number: address.number, zipcode: address.zip, city: address.city }
        });

        eventDispatcher.notify(customerCustomerChangeAddressLog);

        expect(spyEventLogCustomerChangeAddressHandler).toHaveBeenCalled();
    });    
});