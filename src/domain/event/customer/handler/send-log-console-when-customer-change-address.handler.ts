import EventHandlerInterface from "../../@shared/event-handler.interface";
import CustomerCreatedEvent from "../customer-created.event";

export default class SendLogConsoleWhenCustomerChangeAddressHandler 
implements EventHandlerInterface<CustomerCreatedEvent> {
    handle(event: CustomerCreatedEvent): void {
        console.log(event);
        console.log("The customer's address has changed.");
    }
}