import Checkout from "./application/usecase/checkout";
import CLIController from "./CLIController";
import CLIHandler from "./CLIHandler";
import CLIHandlerNode from "./CLIHandlerNode";

const checkout = new Checkout();
const handler = new CLIHandlerNode();
new CLIController(handler, checkout);



