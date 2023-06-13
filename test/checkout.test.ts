import Sinon from "sinon";
import Checkout from "../src/application/usecase/checkout";
import CouponRepositoryDatabase from "../src/CouponRepositoryDatabase";
import CurrencyGateway from "../src/CurrencyGateway";
import CurrencyGatewayHttp from "../src/CurrencyGatewayHttp";
import GetOrder from "../src/application/usecase/getOrder";
import ProductRepository from "../src/ProductRepository";
import ProductRepositoryDatabase from "../src/ProductRepositoryDatabase";
import crypto from "crypto";
import OrderRepositoryDatabase from "../src/OrderRepositoryDatabase";
import Product from "../src/domain/entity/Product";
import PgPromise from "../src/PgPromiseAdapter";
import Connection from "../src/Connection";
import CouponRepository from "../src/CouponRepository";
import OrderRepository from "../src/OrderRepository";

let checkout: Checkout;
let getOrder: GetOrder;
let connection: Connection;
let couponRepository: CouponRepository;
let orderRepository: OrderRepository;


beforeEach(() => {
    connection = new PgPromise();
    const currencyGateway = new CurrencyGatewayHttp();
    const productRepository = new ProductRepositoryDatabase(connection);
    couponRepository = new CouponRepositoryDatabase(connection);
    orderRepository = new OrderRepositoryDatabase(connection);
    checkout = new Checkout(currencyGateway, productRepository, couponRepository, orderRepository);
    getOrder = new GetOrder(orderRepository);
});

afterEach(async () => {
    await connection.close();
})

test("Não deve aceitar um pedido com cpf inválido", async function() {
    const input = {
        cpf: "406.302.170-27",
        items: []
    };

    await expect(() => checkout.execute(input)).rejects.toThrow(new Error("Invalid cpf"));
   
});

test("Deve criar um pedido vazio com cpf válido", async function() {
    const input = {
        cpf: "407.302.170-27",
        items: []
    };
    const output = await checkout.execute(input);
    expect(output.total).toBe(0);
});

test("Deve criar um pedido com 3 produtos", async function() {
    const uuid = crypto.randomUUID();
    const input = {
        uuid,
        cpf: "407.302.170-27",
        items: [
            {idProduct: 1, quantity: 1},
            {idProduct: 2, quantity: 1},
            {idProduct: 3, quantity: 3}
        ]

        
    };
    await checkout.execute(input);
    const output = await getOrder.execute(uuid);
    expect(output.total).toBe(6090);
});

test("Deve criar um pedido com 3 produtos com cupom de desconto", async function() {
    const input = {
        cpf: "407.302.170-27",
        items: [
            {idProduct: 1, quantity: 1},
            {idProduct: 2, quantity: 1},
            {idProduct: 3, quantity: 3}
        ],
        coupon: "VALE20"
        
    };
    const output = await checkout.execute(input);
    console.log(output);
    expect(output.total).toBe(4872);
});

test("Deve criar um pedido com 3 produtos com cupom de desconto expirado", async function() {
    const input = {
        cpf: "407.302.170-27",
        items: [
            {idProduct: 1, quantity: 1},
            {idProduct: 2, quantity: 1},
            {idProduct: 3, quantity: 3}
        ],
        coupon: "VALE10"
        
    };
    const output = await checkout.execute(input);
    expect(output.total).toBe(6090);
});

test("Não deve criar um pedido com quantidade negativa", async function() {
    const input = {
        cpf: "407.302.170-27",
        items: [
            {idProduct: 1, quantity: -1},
        ]
    };
    await expect(() => checkout.execute(input)).rejects.toThrow(new Error("Invalid quantity"));
});

test("Não deve criar um pedido com item duplicado", async function() {
    const input = {
        cpf: "407.302.170-27",
        items: [
            {idProduct: 1, quantity: 1},
            {idProduct: 1, quantity: 1},
        ]
    };
    await expect(() => checkout.execute(input)).rejects.toThrow(new Error("Duplicated item"));
});

test("Deve criar um pedido com 1 produto calculando o frete", async function() {
    const input = {
        cpf: "407.302.170-27",
        items: [
            {idProduct: 1, quantity: 1},
          
        ],
        from: "22069030",
        to: "88015600"
    };
    const output = await checkout.execute(input);
    expect(output.freight).toBe(30);
    expect(output.total).toBe(1030);
});


test("Não deve criar um pedido se o produto tiver alguma dimensão negativa", async function() {
    const input = {
        cpf: "407.302.170-27",
        items: [
            {idProduct: 4, quantity: 1},
        ]
    };
    await expect(() => checkout.execute(input)).rejects.toThrow(new Error("Invalid dimension"));
});

test("Deve criar um pedido com 1 produto calculando o frete mínimo", async function() {
    const input = {
        cpf: "407.302.170-27",
        items: [
            {idProduct: 3, quantity: 1},
          
        ],
        from: "22069030",
        to: "88015600"
    };
    const output = await checkout.execute(input);
    expect(output.freight).toBe(10);
    expect(output.total).toBe(40);
});

test("Deve criar um pedido com 1 produto em dólar usando um stub", async function() {
    const stubCurrencyGateway = Sinon.stub(CurrencyGatewayHttp.prototype, "getCurrencies").resolves({usd: 3});
    const stubProductReposiroty = Sinon.stub(ProductRepositoryDatabase.prototype, "getProduct").resolves(
        new Product(5, "A", 1000, 10, 10, 10, 10, "USD")
    )

    const input = {
        cpf: "407.302.170-27",
        items: [
            {idProduct: 5, quantity: 1},
        ]

        
    };
    const output = await checkout.execute(input);
    expect(output.total).toBe(3000);
    stubCurrencyGateway.restore();
    stubProductReposiroty.restore();
});

test("Deve criar um pedido com 3 produtos com cupom de desconto com spy", async function() {
    const spyCouponRepository = Sinon.spy(CouponRepositoryDatabase.prototype, "getCoupon");
    const spyProductRepository = Sinon.spy(ProductRepositoryDatabase.prototype, "getProduct");
    const input = {
        cpf: "407.302.170-27",
        items: [
            {idProduct: 1, quantity: 1},
            {idProduct: 2, quantity: 1},
            {idProduct: 3, quantity: 3}
        ],
        coupon: "VALE20"
        
    };
    const output = await checkout.execute(input);
    expect(output.total).toBe(4872);
    expect(spyCouponRepository.calledWith("VALE20")).toBeTruthy();
    expect(spyCouponRepository.calledOnce).toBeTruthy();
    expect(spyProductRepository.calledThrice).toBeTruthy();
    spyCouponRepository.restore();
    spyProductRepository.restore();
});

test("Deve criar um pedido com 1 produto em dólar usando um mock", async function() {
    
    const mockCurrencyGateway = Sinon.mock(CurrencyGatewayHttp.prototype);
    mockCurrencyGateway.expects("getCurrencies").atLeast(1).resolves({
        usd: 3
    });
    const input = {
        cpf: "407.302.170-27",
        items: [
            {idProduct: 5, quantity: 1},
        ]

        
    };
    const output = await checkout.execute(input);
    expect(output.total).toBe(3000);
    mockCurrencyGateway.verify();
    mockCurrencyGateway.restore();
    
});


test("Deve criar um pedido com 1 produto em dólar usando um fake", async function() {
    
    
    //const stubCurrencyGateway = Sinon.stub(CurrencyGatewayHttp.prototype, "getCurrencies").resolves({usd: 3});
    
    // const stubProductReposiroty = Sinon.stub(ProductRepositoryDatabase.prototype, "getProduct").resolves(
    //     {idProduct: 5, description: "A", price: 1000, width: 10, height: 10, length: 10, weight: 10, currency: "USD"}
    // )

    const currencyGateway: CurrencyGateway = {
        async getCurrencies(): Promise<any> {
            return {
                usd: 3
            }
        }
    }

    const productRepository: ProductRepository = {
        
        async getProduct(idProduct: number) : Promise<any> {
            return new Product(5, "A", 1000, 10, 10, 10, 10, "USD")
        }   
    }

    checkout = new Checkout(currencyGateway, productRepository, couponRepository, orderRepository);
    const input = {
        cpf: "407.302.170-27",
        items: [
            {idProduct: 5, quantity: 1},
        ]

        
    };
    const output = await checkout.execute(input);
    expect(output.total).toBe(3000);
    // stubCurrencyGateway.restore();
    // stubProductReposiroty.restore();
});


test("Deve criar um pedido e verificar o código de série", async function() {
    const stub = Sinon.stub(OrderRepositoryDatabase.prototype, "count").resolves(1);
    const uuid = crypto.randomUUID();
    const input = {
        uuid,
        cpf: "407.302.170-27",
        items: [
            {idProduct: 1, quantity: 1},
            {idProduct: 2, quantity: 1},
            {idProduct: 3, quantity: 3}
        ]

        
    };
    await checkout.execute(input);
    const output = await getOrder.execute(uuid);
    expect(output.code).toBe("202300000001");
    stub.restore();
});