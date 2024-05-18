<template>
  <DoPanel :doableName="displayName" :updateCollapsed="handdleUpdateCollapsed"
    @execute-do="$emit('execute-operation', operation)" @execute-delete="$emit('delete-operation', operation.id)">
    <div class="flex justify-content-center">
      <InputGroup class="w-full md:w-30rem">
        <Dropdown v-model="newMathSign" :options="allowedMathSigns.slice()" placeholder="Select a City"
          class="w-full md:w-14rem" />
        <InputGroupAddon>
          <Button :label="newIsUseConstant ? 'Num' : 'Cnt'" :severity="newIsUseConstant ? 'primary' : 'warning'"
            @click="newIsUseConstant = !newIsUseConstant" />
        </InputGroupAddon>
        <InputNumber v-if="newIsUseConstant" v-model="newConstant" inputId="minmax-buttons" mode="decimal"
          showButtons />
        <Dropdown v-else v-model="newSelectedCounter" editable :options="allCounters" optionLabel="name"
          optionValue="id" placeholder="Select a Counter" class="w-full md:w-14rem" />
      </InputGroup>
    </div>
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

<style scoped>
.header {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
