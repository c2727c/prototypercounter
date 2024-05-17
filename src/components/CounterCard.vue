<template>
  <div class="counter-card" @click.stop>
    <div class="header">
      <button @click="resetCounter" class="menu-button">↺</button>
      <div style="flex-grow: 1">M</div>
      <button @click="showMenu($event)" class="menu-button">⋮</button>
    </div>
    <div
      v-if="isMenuVisible"
      class="menu"
      :style="{ top: menuPosition.top, left: menuPosition.left }"
    >
      <div @click="">Set values</div>
      <div @click="toggleEnablePlusOne">
        Enable +1 <span v-if="isEnablePlusOne">√</span>
      </div>
      <div @click="toggleEnableMinusOne">
        Enable -1 <span v-if="isEnableMinusOne">√</span>
      </div>
      <div @click="addCustomOperation">Add custom operation</div>
    </div>

    <input v-model="counterName" />
    <div class="count-container">
      <button v-visible="isEnableMinusOne" @click="addOnCounter(-1)">-</button>
      <span class="count">{{ count }}</span>
      <button v-visible="isEnablePlusOne" @click="addOnCounter(1)">+</button>
    </div>
    <OperationCard
      v-for="(operation, index) in operations"
      :key="index"
      :operation="operation"
      @execute-operation="executeOperation"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useCounterStore, Operation, Counter } from "../stores/counterStore";
import OperationCard from "./OperationCard.vue";

const props = defineProps<{ initialName: string }>();
const counterName = ref(props.initialName);
const count = ref(0);
const operations = ref([]);
const store = useCounterStore();

const resetCounter = () => {
  count.value = 0;
};

function addOnCounter(NumberToAdd: number) {
  const oldValue = store.getCounterValue(counterName.value);
  const newValue = oldValue + NumberToAdd;
  count.value = newValue;
}

function executeOperation(operation: Operation) {
  console.log("executeOperation", operation.selectedCounter);
  const theOtherValue = store.getCounterValue(operation.selectedCounter);
  switch (operation.mathSign) {
    case "+": {
      count.value += theOtherValue;
      break;
    }
    case "-": {
      count.value -= theOtherValue;
      break;
    }
    case "=": {
      count.value = theOtherValue;
      break;
    }
  }
}

watch(count, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    store.updateCounterValue(counterName.value, newValue);
  }
});

watch(counterName, (newName, oldName) => {
  if (newName !== oldName) {
    store.updateCounterName(oldName, newName);
  }
});

watch(operations, (newOperations, oldOperations) => {
  console.log("operations updated");
});

// menu
import { onMounted, onBeforeUnmount } from "vue";
const isMenuVisible = ref(false);
const menuPosition = ref({ top: "0px", left: "0px" });
const isEnablePlusOne = ref(true);
const isEnableMinusOne = ref(true);
const showMenu = (event: MouseEvent) => {
  isMenuVisible.value = true;
  menuPosition.value = {
    top: `${event.clientY}px`,
    left: `${event.clientX}px`,
  };
};

const setValues = () => {
  // Implement the logic to set values
  isMenuVisible.value = false;
};

const toggleEnablePlusOne = () => {
  isEnablePlusOne.value = !isEnablePlusOne.value;
  isMenuVisible.value = false;
};

const toggleEnableMinusOne = () => {
  isEnableMinusOne.value = !isEnableMinusOne.value;
  isMenuVisible.value = false;
};

function addCustomOperation() {
  store.addCounterOperation(counterName.value, {
    name: "new operation",
    mathSign: "+",
  });
  isMenuVisible.value = false;
  operations.value = store.getCounterOperations(counterName.value);
}

const handleDocumentClick = (event: MouseEvent) => {
  if (!isMenuVisible.value) return;
  isMenuVisible.value = false;
};

onMounted(() => {
  document.addEventListener("click", handleDocumentClick);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleDocumentClick);
});
</script>

<style scoped>
.counter-card {
  border: 1px solid #ccc;
  padding: 1em;
  margin: 1em 0;
}

.header {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.menu-button {
  background: none;
  border: none;
  cursor: pointer;
}

.menu {
  position: absolute;
  border: 1px solid #ccc;
  background: white;
  color: black;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.menu div {
  padding: 8px;
  cursor: pointer;
}

.menu div:hover {
  background: #eee;
}

.count-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px; /* Adjust as needed */
}

.count {
  font-size: 1.5em;
  margin: 0 10px; /* Adjust as needed */
}
</style>
