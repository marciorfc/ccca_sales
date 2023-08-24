export default class Item {

    private quantity: number = 1;

    constructor(readonly idProduct: number) {
        
    }

    incrementQuantity() {
        this.quantity++;
    }

    getQuantity() {
        return this.quantity;
    }


}