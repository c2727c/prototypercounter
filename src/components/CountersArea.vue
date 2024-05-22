<template>
  <div>
    <Button @click="create">Create Counter</Button>
    <div class="area">
      <div v-for="(counter, index) in store.counters" :key="counter.id">
        <CounterCard :counter="counter" :index="index" />
      </div>
    </div>
    <GridLayout 
    style="width:100em;"
    v-model:layout="layout"
    :col-num="16" 
    :vertical-compact="false"
    :row-height="30" 
    :is-draggable="draggable"
    :is-resizable="resizable">
        <template #item="{ item }">
          <span class="text">{{ item.i }}</span>
          <CounterCard :counter="item.counter" index="item.i" />
          
        </template>
      </GridLayout>
  </div>
</template>

<script setup lang="ts">
import CounterCard from "./CounterCard.vue";
import { useCounterStore } from "../stores/counterStore";
import Button from 'primevue/button';
import { ref,reactive,computed } from "vue";

const store = useCounterStore();
const layout = computed(() => store.counters.map((counter, index) => ({
  x: index * 3 % 12,
  y: Math.floor(index / 4) * 3,
  w: 3,
  h: 3,
  i: counter.id,
  counter: counter
})));

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
.vgl-layout {
  background-color: #eee;
}

:deep(.vgl-item:not(.vgl-item--placeholder)) {
  background-color: #ccc;
  border: 1px solid black;
}

:deep(.vgl-item--resizing) {
  opacity: 90%;
}

:deep(.vgl-item--static) {
  background-color: #cce;
}

.text {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: auto;
  font-size: 24px;
  text-align: center;
}

.layout-json {
  padding: 10px;
  margin-top: 10px;
  background-color: #ddd;
  border: 1px solid black;
}

.columns {
  columns: 120px;
}

.remove {
  position: absolute;
  top: 0;
  right: 2px;
  cursor: pointer;
}
</style>
