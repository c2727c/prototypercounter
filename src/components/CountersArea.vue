<template>
  <div class="card">
    <Button @click="create">Create Counter</Button>
    <div v-for="(counter, index) in store.counters" :key="index">
      <CounterCard :counter="counter" :index="index" />
    </div>
  </div>
</template>

<script setup lang="ts">
import CounterCard from "./CounterCard.vue";
import { useCounterStore } from "../stores/counterStore";
import Button from 'primevue/button';

const store = useCounterStore();

function create() {
  console.log("createCounter");
  const newCounterName = `Counter ${store.counters.length + 1}`;
  store.addCounter(newCounterName);
}
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
