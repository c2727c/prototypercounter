<template>
  <DoPanel 
    style="width: 20em;"
    :doableName="displayName" :updateCollapsed="handdleUpdateCollapsed"
    @execute-do="$emit('execute-operation', operation)" @execute-delete="$emit('delete-operation', operation.id)">
      <InputGroup style="height: 3em; width: 18em;line-height: 1.8em;">
        <Dropdown style="max-width:4em;"
        v-model="newMathSign" :options="allowedMathSigns.slice()"/>
        <InputGroupAddon>
          <Button :label="newIsUseConstant ? 'Num' : 'Cnt'" :severity="newIsUseConstant ? 'primary' : 'warning'"
            @click="newIsUseConstant = !newIsUseConstant" />
        </InputGroupAddon>
        <InputNumber v-if="newIsUseConstant" v-model="newConstant" mode="decimal"
          showButtons />
        <Dropdown v-else v-model="newSelectedCounter" editable :options="allCounters" optionLabel="name"
          optionValue="id" placeholder="Select a Counter"/>
      </InputGroup>
  </DoPanel>

</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Dropdown from 'primevue/dropdown';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
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
    console.log("collapsed!!!");
    updateStore(newName);
  }
};
</script>


