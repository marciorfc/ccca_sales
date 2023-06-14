import CurrencyGateway from "./CurrencyGateway";
import HttpClient from "./HttpClient";

export default class CurrencyGatewayHttp implements CurrencyGateway {

    constructor(readonly httpClient: HttpClient) {
    }

    async getCurrencies() {
        const response = await this.httpClient.get("http://localhost:3001/currencies");
        return response
    }
}