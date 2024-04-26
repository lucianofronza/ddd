import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerChangedAddressEvent from "../customer-changed-address.event";

export default class SendLogConsoleWhenCustomerChangeAddressHandler 
implements EventHandlerInterface<CustomerChangedAddressEvent> {
    handle(event: CustomerChangedAddressEvent): void {
        console.log(event);
        console.log("The customer's address has changed.");
    }
}