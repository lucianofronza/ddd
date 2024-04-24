import EventHandlerInterface from "../../@shared/event-handler.interface";
import CustomerCreatedEvent from "../customer-created.event";

export default class SendLog2ConsoleWhenCustomerIsCreatedHandler 
implements EventHandlerInterface<CustomerCreatedEvent> {
    handle(event: CustomerCreatedEvent): void {
        console.log("This is the second log presented when creating the customer.");		
    }
}