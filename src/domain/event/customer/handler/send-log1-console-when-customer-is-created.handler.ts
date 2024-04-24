import EventHandlerInterface from "../../@shared/event-handler.interface";
import CustomerCreatedEvent from "../customer-created.event";

export default class SendLog1ConsoleWhenCustomerIsCreatedHandler 
implements EventHandlerInterface<CustomerCreatedEvent> {
    handle(event: CustomerCreatedEvent): void {
        console.log("This is the first log presented when creating the customer.");		
    }
}