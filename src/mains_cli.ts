import Checkout from "./application/usecase/checkout";
import AxiosAdapter from "./AxiosAdapter";
import CLIController from "./CLIController";
import CLIHandler from "./CLIHandler";
import CLIHandlerNode from "./CLIHandlerNode";
import CouponRepositoryDatabase from "./CouponRepositoryDatabase";
import CurrencyGatewayHttp from "./CurrencyGatewayHttp";
import OrderRepositoryDatabase from "./OrderRepositoryDatabase";
import PgPromise from "./PgPromiseAdapter";
import ProductRepositoryDatabase from "./ProductRepositoryDatabase";

const connection = new PgPromise();
const httpClient = new AxiosAdapter();
const currencyGateway = new CurrencyGatewayHttp(httpClient);
const productRepository = new ProductRepositoryDatabase(connection);
const couponRepository = new CouponRepositoryDatabase(connection);
const orderRepository = new OrderRepositoryDatabase(connection);
const checkout = new Checkout(currencyGateway, productRepository, couponRepository, orderRepository);

const handler = new CLIHandlerNode();
new CLIController(handler, checkout);



