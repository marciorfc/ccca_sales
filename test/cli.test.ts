import Checkout from "../src/application/usecase/checkout";
import CLIController from "../src/CLIController";
import CLIHandler from "../src/CLIHandler";

test("Deve testar o cli", async function() {
    const checkout = new Checkout();
    let output: any;
    const handler = new class extends CLIHandler {
        write(text: string): void {
            output = JSON.parse(text);
        }
        
    }
    new CLIController(handler, checkout);

    handler.type("set-cpf 407.302.170-27");
    handler.type("add-item 1 1");
    handler.type("add-item 2 1");
    handler.type("add-item 3 3");
    await handler.type("checkout");
    expect(output.total).toBe(6090);
    expect(output.freight).toBe(280);
})