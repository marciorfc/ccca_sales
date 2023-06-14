import express, { Request, Response } from "express";
import Checkout from "./application/usecase/checkout";
import AxiosAdapter from "./AxiosAdapter";
import CouponRepositoryDatabase from "./CouponRepositoryDatabase";
import CurrencyGatewayHttp from "./CurrencyGatewayHttp";
import OrderRepositoryDatabase from "./OrderRepositoryDatabase";
import PgPromise from "./PgPromiseAdapter";
import ProductRepositoryDatabase from "./ProductRepositoryDatabase";

const app = express();
app.use(express.json());

app.post("/checkout", async (req: Request, res: Response) => {
    try{
        const connection = new PgPromise();
        const httpClient = new AxiosAdapter();
        const currencyGateway = new CurrencyGatewayHttp(httpClient);
        const productRepository = new ProductRepositoryDatabase(connection);
        const couponRepository = new CouponRepositoryDatabase(connection);
        const orderRepository = new OrderRepositoryDatabase(connection);
        const checkout = new Checkout(currencyGateway, productRepository, couponRepository, orderRepository);
     
        const output = await checkout.execute(req.body);
        res.json(output);
    } catch(e: any) {
        res.status(422).json({
            message: e.message
        });
    }
})



app.listen(3000);