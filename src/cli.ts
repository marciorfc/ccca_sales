import Checkout from "./application/usecase/checkout";
import CouponRepositoryDatabase from "./CouponRepositoryDatabase";
import CurrencyGatewayHttp from "./CurrencyGatewayHttp";
import OrderRepositoryDatabase from "./OrderRepositoryDatabase";
import PgPromise from "./PgPromiseAdapter";
import ProductRepositoryDatabase from "./ProductRepositoryDatabase";


const input : Input = {
    cpf: "",
    items: []
};
process.stdin.on("data", async (chunk) => {
    const command = chunk.toString().replace(/\n/g, "");
    
    if (command.startsWith("set-cpf")) {
        input.cpf = command.replace("set-cpf ", "");

    }
    if (command.startsWith("add-item")) {
        const [idProduct, quantity] = command.replace("add-item ", "").split(" ");
        input.items.push({idProduct: parseInt(idProduct), quantity: parseInt(quantity)});
    }
    if (command.startsWith("checkout")) {
        try{
            const connection = new PgPromise();
            const currencyGateway = new CurrencyGatewayHttp();
            const productRepository = new ProductRepositoryDatabase(connection);
            const couponRepository = new CouponRepositoryDatabase(connection);
            const orderRepository = new OrderRepositoryDatabase(connection);
            const checkout = new Checkout(currencyGateway, productRepository, couponRepository, orderRepository);
            const output = await checkout.execute(input);
            console.log(output);
        } catch(e: any) {
            console.log(e.message);
        }
    }
    console.log(input);
});

type Input = {
    cpf: string,
    items: { idProduct: number, quantity: number}[],
    coupon?: string,
    from?: string,
    to?: string
}

