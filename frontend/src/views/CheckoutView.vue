<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

  const products: any = ref([]);  
  const total = ref(0);
  const order: any = ref({
    cpf: "407.302.170-27",
    items: []
  });
  const output = ref({});

  function addItem (product: any) {
    const existingItem = order.value.items.find((item: any) => item.idProduct === product.idProduct);
    if (existingItem) {
      existingItem.quantity++;
    } else{
      order.value.items.push({ idProduct: product.idProduct, quantity: 1});
    }
    total.value += product.price;
  }

  function formatMoney (amount: number) {
    return new Intl.NumberFormat("en-us", { currency: "USD", style: "currency"}).format(amount);
  }

  async function checkout(order: any) {
    const response = await axios.post('http://localhost:3000/checkout', order);
    output.value = response.data;
  }

  onMounted(async () => {
    const response = await axios.get('http://localhost:3000/products');
    products.value = response.data;
  });
</script>

<template>
  <div>
    <div class="title-name">Checkout</div>
    <div class="product" v-for="product in products">
      <div class="product-description">{{ product.description }}</div>
      <div class="product-price">{{ formatMoney(product.price) }}</div>
      <button class="product-add" @click="addItem(product)">Add</button>
    </div>
    <div>
      <div class="total">{{ total }}</div>
      <div class="order-item" v-for="item in order.items">
        {{ item.idProduct }} {{item.quantity }}
      </div>
      <button class="checkout" @click="checkout(order)">Checkout</button>
      <div class="output-total">{{ output.total }}</div>
      <div class="output-freight">{{ output.freight }}</div>
    </div>
  </div>
  
</template>

<style scoped>
</style>