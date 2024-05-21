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
        <div>
          <InputGroup v-if="isEditName">
            <InputText id="countername" v-model="counterName" placeholder="Unnamed" />
            <Button @click="isEditName = false; storeCounter.name = counterName">💾</Button>
          </InputGroup>
          <Button v-else @click="isEditName = true" severity="secondary">
            {{ counterName }} 📝
          </Button>
        </div>
        <Button @click="showMenu($event)" @click.stop class="menu-button">⋮</Button>
      </div>
      <Menu ref="menu" id="overlay_menu" :model="menuitems" :popup="true" />
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
          <InputNumber id="originvalue" class="flex-auto" autocomplete="off" v-model="originValue" placeholder="0" />
        </div>
      </Dialog>
    </template>
    <template #title>
      <div class="count-container">
        <Button rounded v-visible="isEnableMinusOne" @click="addOnCounter(-1)">-</Button>
        <span class="count">{{ storeCounter.value }}</span>
        <Button rounded v-visible="isEnablePlusOne" @click="addOnCounter(1)">+</Button>
      </div>
    </template>
    <template #content>
      <OperationCard v-for="(operation, index) in renderedOperations" :key="index" :hostCounterName="counterName"
        :operation="operation" @execute-operation="executeOperation" @delete-operation="deleteOperation" />
    </template>
  </Card>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { useCounterStore, Operation, Counter, MathSign } from "../stores/counterStore";
import InputGroup from 'primevue/inputgroup';
import Card from 'primevue/card';
import InputNumber from 'primevue/inputnumber';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Menu from 'primevue/menu';

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
const menuPosition = ref({ top: "0px", left: "0px" });
const isEnablePlusOne = ref(true);
const isEnableMinusOne = ref(true);


const resetCounter = () => {
  storeCounter.value = originValue.value || 0;
};

function addOnCounter(NumberToAdd: number) {
  const addOnOperation = {
    id: "temporaray-id",
    hostCounter: storeCounter.id,
    name: `+(${NumberToAdd})`,
    mathSign: "+" as MathSign,
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
const menu = ref();
const showMenu = (event: MouseEvent) => {
  menu.value.toggle(event);
};
const menuitems = [
  {
    label: "Edit Attributes",
    icon: "pi pi-fw pi-pencil",
    command: () => isEditAttributes.value = true,
  },
  {
    label: "Toggle +1",
    icon: "pi pi-fw pi-plus",
    command: ()=> isEnablePlusOne.value = !isEnablePlusOne.value,
  },
  {
    label: "Toggle -1",
    icon: "pi pi-fw pi-minus",
    command: ()=> isEnableMinusOne.value = !isEnableMinusOne.value,
  },
  {
    label: "Add custom operation",
    icon: "pi pi-fw pi-plus-circle",
    command: ()=> store.addOperation(storeCounter.id),
  },
  {
    label: "Delete Counter",
    icon: "pi pi-fw pi-trash",
    command: () => store.deleteCounter(storeCounter.id),
  },
];


function deleteOperation(operationId: string) {
  store.deleteOperation(storeCounter.id, operationId);
}
</script>

<style scoped>
.counter-card {
  border: 1px solid #ccc;
  padding: 1em;
  margin: 1em 0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  min-height: 3em;
  font-size: 2em;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
}

.count {
  font-size: 1.5em;
  margin: 0 10px;
}
</style>
