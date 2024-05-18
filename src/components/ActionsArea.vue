<template>
    <div class="card">
      <Button @click="create">Create Action</Button>
      <div v-for="(action, index) in store.actions" :key="index">
        <ActionCard :action="action" :index="index" />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useCounterStore } from "../stores/counterStore";
  import Button from 'primevue/button';
  import ActionCard from "./ActionCard.vue";
  const store = useCounterStore();
  
  function create() {
    console.log("createAction");
    store.addAction();
  }
  </script>
  
  <style scoped>
  .read-the-docs {
    color: #888;
  }
  </style>
  