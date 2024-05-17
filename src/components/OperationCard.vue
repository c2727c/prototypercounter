<template>
  <div class="operation-card">
    <div v-if="isEdit">
      <select v-model="operation.mathSign">
        <option
          v-for="mathSign in allowedMathSigns"
          :key="mathSign"
          :value="mathSign"
        >
          {{ mathSign }}
        </option>
      </select>
      <select v-model="operation.selectedCounter">
        <option v-for="counter in counterNames" :key="counter" :value="counter">
          {{ counter }}
        </option>
      </select>
      <button @click="saveOperator">🖫</button>
    </div>
    <div v-else>
      <p>{{ operation.name }}</p>
      <p>
        {{ operation.mathSign }}
        {{
          operation.isUseConstant
            ? operation.constant
            : operation.selectedCounter
        }}
      </p>
      <button @click="$emit('execute-operation', operation)">Operate</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  Operation,
  allowedMathSigns,
  useCounterStore,
} from "../stores/counterStore";

const props = defineProps<{
  operation: Operation;
}>();

const operation = ref(props.operation);
const store = useCounterStore();
const counterNames = computed(() => store.counterNames);

const isEdit = ref(true);

const saveOperator = () => {
  console.log("saveOperator");
  // varify information
  // update store
  isEdit.value = false;
};
</script>

<style scoped>
.operation-card {
  margin-top: 1em;
  border: 1px solid #454545;
}
</style>
