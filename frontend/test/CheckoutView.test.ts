import { mount } from "@vue/test-utils";
import CheckoutView from "../src/views/CheckoutView.vue";

test("Deve testar a tela de checkout", function() {
    const wrapper = mount(CheckoutView, {});
    console.log(wrapper.html());
    expect(wrapper.get(".title-name").text()).toBe("Checkout");
    expect(wrapper.findAll(".product")).toHaveLength(3);
    expect(wrapper.findAll(".product").at(0)?.text()).toBe("A");
    expect(wrapper.findAll(".product").at(0)?.text()).toBe("B");
    expect(wrapper.findAll(".product").at(0)?.text()).toBe("C");
});