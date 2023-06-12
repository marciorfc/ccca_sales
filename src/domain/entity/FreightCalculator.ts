import Product from "./Product";

export default class FreightCalculator {
    static calculate(product: Product, quantity: number = 1) {
        const volume = product.getVolume();
        const density = product.getDensity();
        const itemFreight = 1000 * volume * (density/100);
        return Math.max(itemFreight, 10) * quantity;
    }
}