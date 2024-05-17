import { defineStore } from "pinia";
import { ref, Ref, computed } from "vue";

// Define props
export const allowedMathSigns = ["+", "-", "="] as const;
export type MathSign = (typeof allowedMathSigns)[number];

export interface Operation {
  name: string;
  mathSign: MathSign;
  isUseConstant: boolean;
  constant: number;
  selectedCounter: string;
}

export interface Counter {
  name: string;
  value: number;
  min: number;
  max: number;
  origin: number;
  operations: Ref<Operation[]>;
}

export const useCounterStore = defineStore("counterStore", () => {
  const counters = ref<Counter[]>([]);

  const counterNames = computed(() =>
    counters.value.map((counter) => counter.name),
  );

  function addCounter(initialName: string) {
    counters.value.push({
      name: initialName,
      value: 0,
      min: 0,
      max: 0,
      origin: 0,
      operations: [],
    });
  }

  function updateCounterValue(name: string, newValue: string) {
    const counter = counters.value.find((counter) => counter.name === name);
    if (counter) {
      counter.value = newValue;
    }
  }

  function updateCounterName(oldName: string, newName: string) {
    const counter = counters.value.find((counter) => counter.name === oldName);
    if (counter) {
      counter.name = newName;
    }
  }

  function getCounterValue(name: string) {
    console.log("getCounterValue name=", name);
    const counter = counters.value.find((counter) => counter.name === name);
    return counter ? counter.value : -1;
  }

  function getCounterOperations(name: string) {
    console.log("getCounterOperations name=", name);
    const counter = counters.value.find((counter) => counter.name === name);
    return counter ? counter.operations : [];
  }

  function addCounterOperation(name: string, operation: Operation) {
    console.log("addCounterOperation name=", name, operation);
    const counter = counters.value.find((counter) => counter.name === name);
    if (counter) {
      counter.operations.push(operation);
      console.log(counters);
    } else {
      console.log("addCounterOperation NOT FOUND");
    }
  }

  return {
    counters,
    counterNames,
    addCounter,
    updateCounterValue,
    updateCounterName,
    getCounterValue,
    getCounterOperations,
    addCounterOperation,
  };
});
