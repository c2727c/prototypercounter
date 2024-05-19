<!-- 
  1. header
  2. counter name
  3. counter value, +1, -1
  4. operations


 -->

<template>
  <Card class="counter-card">
    <template #header>
      <div class="header">
        <Button @click="resetCounter" class="menu-button">↺</Button>
        <div style="flex-grow: 1">Cnt</div>
        <Button @click="showMenu($event)" @click.stop class="menu-button">⋮</Button>
        <div>
          <div v-if="isMenuVisible" class="menu" :style="{ top: menuPosition.top, left: menuPosition.left }"
            @click.stop>
            <div @click="editAttributes">Edit Attributes</div>
            <div @click="toggleEnablePlusOne">
              Enable +1 <span v-if="isEnablePlusOne">√</span>
            </div>
            <div @click="toggleEnableMinusOne">
              Enable -1 <span v-if="isEnableMinusOne">√</span>
            </div>
            <div @click="addCustomOperation">Add custom operation</div>
          </div>
          <Dialog v-model:visible="isEditAttributes" modal header="Edit Attributes" :style="{ width: '25rem' }">
            <div class="flex align-items-center gap-3 mb-3">
              <label for="minvalue" class="font-semibold w-6rem">Min</label>
              <InputNumber id="minvalue" class="flex-auto" autocomplete="off" v-model="minValue" placeholder="-∞" />
            </div>
            <div class="flex align-items-center gap-3 mb-5">
              <label for="maxvalue" class="font-semibold w-6rem">Max</label>
              <InputNumber id="maxvalue" class="flex-auto" autocomplete="off" v-model="maxValue" placeholder="+∞" />
            </div>
            <div class="flex align-items-center gap-3 mb-5">
              <label for="originvalue" class="font-semibold w-6rem">Reset Value</label>
              <InputNumber id="originvalue" class="flex-auto" autocomplete="off" v-model="originValue"
                placeholder="0" />
            </div>
          </Dialog>
        </div>
      </div>
    </template>
    <template #title>
      <InputGroup v-if="isEditName" class="w-full md:w-30rem">
        <InputText id="countername" v-model="counterName" placeholder="Unnamed" />
        <Button @click="isEditName = false; storeCounter.name = counterName">💾</Button>
      </InputGroup>
      <Button v-else @click="isEditName = true" severity="secondary">{{ counterName }} 📝</Button>
    </template>
    <template #content>


      <div class="count-container">
        <Button rounded v-visible="isEnableMinusOne" @click="addOnCounter(-1)">-</Button>
        <span class="count">{{ storeCounter.value }}</span>
        <Button rounded v-visible="isEnablePlusOne" @click="addOnCounter(1)">+</Button>
      </div>
      <div>
        <OperationCard v-for="(operation, index) in renderedOperations" :key="index" :hostCounterName="counterName"
          :operation="operation" @execute-operation="executeOperation" @delete-operation="deleteOperation" />
      </div>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useCounterStore, Operation, Counter } from "../stores/counterStore";
import InputGroup from 'primevue/inputgroup';
import Card from 'primevue/card';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';

import OperationCard from "./OperationCard.vue";

const store = useCounterStore();
const props = defineProps<{ counter: Counter }>();

const storeCounter = props.counter; // use this to manipulate the value in the store

// local refs that are related to the storeCounter
const counterName = ref(storeCounter.name);
const renderedOperations = ref<Operation[]>(storeCounter.operations);
const minValue = ref(storeCounter.minValue || null);
const maxValue = ref(storeCounter.minValue || null);
const originValue = ref(storeCounter.resetValue || null);

watch(minValue, (newVal) => {
  if (newVal !== null) {
    storeCounter.minValue = newVal;
    if (storeCounter.value < newVal) {
      storeCounter.value = newVal;
    }
  }
});
watch(maxValue, (newVal) => {
  if (newVal !== null) {
    storeCounter.maxValue = newVal;
    if (storeCounter.value > newVal) {
      storeCounter.value = newVal;
    }
  }
});
watch(originValue, (newVal) => {
  if (newVal !== null) {
    storeCounter.resetValue = newVal;
  }
});




const isEditName = ref(false);
const isEditAttributes = ref(false);
const isMenuVisible = ref(false);
const menuPosition = ref({ top: "0px", left: "0px" });
const isEnablePlusOne = ref(true);
const isEnableMinusOne = ref(true);


const resetCounter = () => {
  storeCounter.value = originValue.value;
};

function addOnCounter(NumberToAdd: number) {
  const addOnOperation = {
    id: "temporaray-id",
    hostCounter: storeCounter.id,
    name: `+(${NumberToAdd})`,
    mathSign: "+",
    isUseConstant: true,
    constant: NumberToAdd,
    selectedCounter: "",
  };
  store.executeOperation(addOnOperation);
}

function executeOperation(operation: Operation) {
  store.executeOperation(operation);
}

// menu
import { onMounted, onBeforeUnmount } from "vue";

const showMenu = (event: MouseEvent) => {
  isMenuVisible.value = true;
  menuPosition.value = {
    top: `${event.clientY}px`,
    left: `${event.clientX}px`,
  };
};

const editAttributes = () => {
  isEditAttributes.value = true;
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
  isMenuVisible.value = false;
  // TODO : collapse all other operations
  store.addOperation(storeCounter.id);
}

function deleteOperation(operationId: string) {
  store.deleteOperation(storeCounter.id, operationId);
}

const handleDocumentClick = (event: MouseEvent) => {
  if (isMenuVisible.value) isMenuVisible.value = false;
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

.menu-button {}

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
  gap: 5px;
  /* Adjust as needed */
}

.count {
  font-size: 1.5em;
  margin: 0 10px;
  /* Adjust as needed */
}
</style>
