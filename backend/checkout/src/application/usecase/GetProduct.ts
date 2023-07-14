import FreightCalculator from "../../domain/entity/FreightCalculator";
import ProductRepository from "../repository/ProductRepository";
import ProductRepositoryDatabase from "../../infra/repository/ProductRepositoryDatabase";

export default class GetProduct {

    constructor(readonly productRepository: ProductRepository) {
    }
    
    async execute(): Promise<Output> {
        const output: Output = [];
        const products = await this.productRepository.getProducts();
        return output;
    }
}


type Output = {
    idProduct: number,
    description: string,
    price: number
}