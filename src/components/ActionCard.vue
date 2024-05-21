<template>
  <DoPanel style="width: 32em;" class="action-card" 
  :doableName="displayName" 
  :updateCollapsed="handdleUpdateCollapsed"
  :uncollapsed="props.action.operations.length === 0"
    @execute-do="doAction" @execute-delete="deleteAction">
      <div v-for="(operation, index) in editOperations" :key="index">
        <OperationSelectionCard :selectedOperation="operation" :index="index"
          @update:selectedOperation="updateOperation" @delete="editOperations.splice(index, 1)" />
      </div>
      <Button label="Add Operation" @click="addOperation" />
  </DoPanel>

</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import DoPanel from "./DoPanel.vue";
import OperationSelectionCard from "./OperationSelectionCard.vue";
import Button from 'primevue/button';

import {
  Action,
  Operation,
  useCounterStore,
} from "../stores/counterStore";

const props = defineProps<{
  action: Action;
}>();

const storeAction = props.action;
const store = useCounterStore();
const editOperations = ref([...storeAction.operations]);
const displayName = computed(() => {
  return storeAction.name.trim() ? storeAction.name
    : "Action: " + editOperations.value.map((operation) => operation.name).join(", ");
});
// const isCounter = ref(true);
const updateStore = (newName: string) => {
  if (newName) {
    storeAction.name = newName;
  }
  storeAction.operations.splice(0, storeAction.operations.length, ...editOperations.value);
  if (editOperations.value.length === 0) {
    store.deleteAction(storeAction.id);
  }
};

const handdleUpdateCollapsed = (collapsed: boolean, newName: string) => {
  if (collapsed) {
    updateStore(newName);
  }
};

const addOperation = () => {
  const availableOperations = store.availableOperations;
  if (availableOperations.length === 0) {
    return;
  }
  editOperations.value.push(availableOperations[0]);
};

const updateOperation = (index: number, newOperation: Operation) => {
  editOperations.value[index] = newOperation;
};

const doAction = () => {
  store.executeAction(storeAction);
};

const deleteAction = () => {
  store.deleteAction(storeAction.id);
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.action-card {
  border: 1px solid #ccc;
  padding: 1em;
  margin: 1em 0;
}
</style>