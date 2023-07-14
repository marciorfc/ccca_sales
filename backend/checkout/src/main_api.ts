import Checkout from "./application/usecase/checkout";
import AxiosAdapter from "./infra/http/AxiosAdapter";
import CouponRepositoryDatabase from "./infra/repository/CouponRepositoryDatabase";
import CurrencyGatewayHttp from "./infra/gateway/CurrencyGatewayHttp";
import ExpressAdapter from "./infra/http/ExpressAdapter";
import HapiHttpServer from "./infra/http/HapiAdapter";
import HttpController from "./infra/http/HttpController";
import OrderRepositoryDatabase from "./infra/repository/OrderRepositoryDatabase";
import PgPromise from "./infra/database/PgPromiseAdapter";
import ProductRepositoryDatabase from "./infra/repository/ProductRepositoryDatabase";

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