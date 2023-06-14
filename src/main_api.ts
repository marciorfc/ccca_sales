import Checkout from "./application/usecase/checkout";
import AxiosAdapter from "./AxiosAdapter";
import CouponRepositoryDatabase from "./CouponRepositoryDatabase";
import CurrencyGatewayHttp from "./CurrencyGatewayHttp";
import ExpressAdapter from "./ExpressAdapter";
import HapiHttpServer from "./HapiAdapter";
import HttpController from "./HttpController";
import OrderRepositoryDatabase from "./OrderRepositoryDatabase";
import PgPromise from "./PgPromiseAdapter";
import ProductRepositoryDatabase from "./ProductRepositoryDatabase";

 function getCheckout() : Checkout {
    const connection = new PgPromise();
    const httpClient = new AxiosAdapter();
    const currencyGateway = new CurrencyGatewayHttp(httpClient);
    const productRepository = new ProductRepositoryDatabase(connection);
    const couponRepository = new CouponRepositoryDatabase(connection);
    const orderRepository = new OrderRepositoryDatabase(connection);
    return new Checkout(currencyGateway, productRepository, couponRepository, orderRepository);
}

const httpServer = new HapiHttpServer();//new ExpressAdapter();
new HttpController(httpServer, getCheckout());
httpServer.listen(3000);