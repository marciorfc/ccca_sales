import ValidateCoupon from "../src/application/usecase/ValidateCoupon";
import Connection from "../src/Connection";
import CouponRepositoryDatabase from "../src/CouponRepositoryDatabase";
import PgPromise from "../src/PgPromiseAdapter";


let validateCoupon: ValidateCoupon;
let connection: Connection;


beforeEach(() => {
    connection = new PgPromise();
    const couponRepository = new CouponRepositoryDatabase(connection);
    validateCoupon = new ValidateCoupon(couponRepository);
});

afterEach(async () => {
    await connection.close();
});

test("Deve validar um cupom de desconto válido", async function() {
    const input = "VALE20";
    const output = await validateCoupon.execute(input);
    expect(output).toBeTruthy();
});


test("Deve validar um cupom de desconto expirado", async function() {
    const input = "VALE10";
    const output = await validateCoupon.execute(input);
    expect(output).toBeFalsy();
});

