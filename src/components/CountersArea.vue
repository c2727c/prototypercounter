<template>
  <div class="card">
    <button @click="createCounter">Create Counter</button>
    <div v-for="(counter, index) in counters" :key="index">
      <CounterCard :initialName="counter.name" :index="index" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import CounterCard from "./CounterCard.vue";
import { useCounterStore } from "../stores/counterStore";

const store = useCounterStore();
// const counters = ref(store.counters);
const counters = computed(() => store.counters);

function createCounter() {
  console.log("createCounter");
  const newCounterName = `Counter ${counters.value.length + 1}`;
  store.addCounter(newCounterName);
}
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
