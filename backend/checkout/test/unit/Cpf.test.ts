import Cpf from "../../src/domain/entity/Cpf";
import { validate } from "../../src/validator";

test.each([
    "407.302.170-27",
    "684.053.160-00"
])("Deve testar um cpf válido", function(value) {
    const cpf = new Cpf(value);
    expect(cpf.value).toBeDefined();
});

test.each([
    "406.302.170-27",
    "406.302.170-7676886"
])("Deve testar um cpf inválido", function(value) {

    expect(() => new Cpf(value)).toThrow(new Error("Invalid cpf"));
});


test.each([
    "111.111.111-11",
    "222.222.222-22"
])("Deve testar um cpf inválido com todos os dígitos iguais", function(value) {
    expect(() => new Cpf(value)).toThrow(new Error("Invalid cpf"));
});
