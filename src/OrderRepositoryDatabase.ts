import pgp from "pg-promise";
import Item from "./domain/entity/Item";
import Order from "./domain/entity/Order";
import OrderRepository from "./OrderRepository";

export default class OrderRepositoryDatabase implements OrderRepository {
    
    async save(order: Order): Promise<void> {
        const connection = pgp()("postgres://admin:admin@localhost:5432/admin");
        await connection.query("insert into cccat10.order (id_order, cpf, code, total, freight) values ($1, $2, $3, $4, $5)", [order.idOrder, order.cpf, order.code, order.getTotal(), order.freight]);
        for (const item of order.items) {
            await connection.query("insert into cccat10.item (id_order, id_product, price, quantity) values ($1, $2, $3, $4)", [order.idOrder, item.idProduct, item.price, item.quantity]);
        }
        await connection.$pool.end();
    }
    async getById(id: string): Promise<Order> {
        const connection = pgp()("postgres://admin:admin@localhost:5432/admin");
        const [orderData] = await connection.query("select * from cccat10.order where id_order = $1", [id]);
        const order = new Order(orderData.id_order, orderData.cpf, undefined, 1, new Date());
        const itemsData = await connection.query("select * from cccat10.item where id_order = $1", [id]);
        for (const itemData of itemsData) {
            order.items.push(new Item(itemData.id_product, parseFloat(itemData.price), itemData.quantity, "BRL"));
        }
        await connection.$pool.end();
        console.log(order);
        return order;
    }

    async count() : Promise<number> {
        const connection = pgp()("postgres://admin:admin@localhost:5432/admin");
        const [options] = await connection.query("select count(*) from cccat10.order", []);
        await connection.$pool.end();
        return parseInt(options.count);
    }


    
}