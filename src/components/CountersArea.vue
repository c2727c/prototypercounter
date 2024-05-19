<template>
  <div>
    <Button @click="create">Create Counter</Button>
    <div class = "area">
    <div v-for="(counter, index) in store.counters" :key="counter.id">
      <CounterCard :counter="counter" :index="index" />
    </div>
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
.area {
  width: 120em;
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
}
</style>
