<template>
  <DoPanel 
    style="width: 16em;"
    :doableName="displayName"
    :updateCollapsed="handdleUpdateCollapsed"
    :uncollapsed="isUndefined"
    @execute-do="$emit('execute-operation', operation)" @execute-delete="$emit('delete-operation', operation.id)">
      <div style="display:flex;justify-content:left;align-items:center;">
      <InputGroup
      style="max-width: 4.5em"
      >
        <Dropdown
        v-model="newMathSign" :options="allowedMathSigns.slice()"/>
        <Button 
        size="small"
        style="padding:0.5em;min-width:2.5em;"
        :label="newIsUseConstant ? 'N' : 'C'" 
        :severity="newIsUseConstant ? 'primary' : 'warning'"
        @click="newIsUseConstant = !newIsUseConstant" />
      </InputGroup>
      <span name="number-or-counter">
        <InputNumber 
        v-if="newIsUseConstant" 
        :pt="{ input: { root: { style: 'width: 100%', class: 'text-center' } } }"
        v-model="newConstant" 
        mode="decimal"
        showButtons
        />
        <Dropdown v-if="!newIsUseConstant" 
        :pt="{ input: { root: { style: 'width: 100%', class: 'text-center' } } }"
          v-model="newSelectedCounter" editable :options="allCounters" optionLabel="name"
          optionValue="id" placeholder="Select a Counter"/>
      </span>
      </div>
      
  </DoPanel>

</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Dropdown from 'primevue/dropdown';
import InputGroup from 'primevue/inputgroup';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import DoPanel from "./DoPanel.vue";

import {
  Operation,
  allowedMathSigns,
  useCounterStore,
} from "../stores/counterStore";

const props = defineProps<{
  operation: Operation;
}>();

const storeOperation = props.operation;
const isUndefined = storeOperation.constant === undefined && storeOperation.selectedCounter === undefined;
const operation = ref(storeOperation);
const store = useCounterStore();
const allCounters = computed(() => store.counters);

//hard copy the values from the store
const newMathSign = ref(storeOperation.mathSign);
const newIsUseConstant = ref(storeOperation.isUseConstant);
const newConstant = ref(storeOperation.constant);
const newSelectedCounter = ref(storeOperation.selectedCounter);
const newSelectedCounterName = computed(() => {
  const counter = allCounters.value.find((counter) => counter.id === newSelectedCounter.value);
  return counter ? counter.name : "";
});
const displayName = computed(() => {
  return storeOperation.name.trim() ? storeOperation.name
    : newMathSign.value + (newIsUseConstant.value ? newConstant.value : newSelectedCounterName.value);
});

// const isCounter = ref(true);
const updateStore = (newName: string) => {
  if (newName) {
    storeOperation.name = newName;
  }
  storeOperation.mathSign = newMathSign.value;
  storeOperation.isUseConstant = newIsUseConstant.value;
  storeOperation.constant = newConstant.value;
  storeOperation.selectedCounter = newSelectedCounter.value;
};

const handdleUpdateCollapsed = (collapsed: boolean, newName: string) => {
  if (collapsed) {
    // delete if not valid
    if(newIsUseConstant.value && newConstant.value === undefined ||
      !newIsUseConstant.value && newSelectedCounter.value === undefined) {
      store.deleteOperation(storeOperation.hostCounter, storeOperation.id);
    }
    updateStore(newName);
  }
};
</script>


