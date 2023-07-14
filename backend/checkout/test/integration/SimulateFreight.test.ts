import SimulateFreight from "../../src/application/usecase/SimulateFreight";
import Connection from "../../src/infra/database/Connection";
import PgPromise from "../../src/infra/database/PgPromiseAdapter";
import ProductRepositoryDatabase from "../../src/infra/repository/ProductRepositoryDatabase";

let simulateFreight: SimulateFreight;
let connection: Connection;


beforeEach(() => {
    connection = new PgPromise();
    const productRepository = new ProductRepositoryDatabase(connection);
    simulateFreight = new SimulateFreight(productRepository);
});

afterEach(async () => {
    await connection.close();
})



test("Deve calcular o frete para um pedido com 3 itens", async function() {
    const input = {
        cpf: "407.302.170-27",
        items: [
            {idProduct: 1, quantity: 1},
            {idProduct: 2, quantity: 1},
            {idProduct: 3, quantity: 3}
        ],
        from: "2206030",
        to: "88015600"
        
    };
    const output = await simulateFreight.execute(input);
    expect(output.freight).toBe(280);
});

