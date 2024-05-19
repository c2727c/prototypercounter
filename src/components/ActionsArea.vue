<template>
    <div class="card">
      <Button @click="create">Create Action</Button>
      <div v-for="(action, index) in actionsRef" :key="action.id">
        <ActionCard :action="action" :index="index" />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from "vue";
  import { useCounterStore } from "../stores/counterStore";
  import Button from 'primevue/button';
  import ActionCard from "./ActionCard.vue";
  const store = useCounterStore();
  const actionsRef = computed(() => [...store.actions]);
  
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
  