import { defineStore } from "pinia";
import { ref, Ref, computed } from "vue";

// Define props
export const allowedMathSigns = ["+", "-", "="] as const;
export type MathSign = (typeof allowedMathSigns)[number];


export interface Action {
  readonly id: string;
  name: string;
  readonly operations: Operation[];
}

export interface Operation {
  readonly id: string;
  name: string;
  mathSign: MathSign;
  isUseConstant: boolean;
  constant: number;
  readonly hostCounter: string;
  selectedCounter: string;
}

export interface Counter {
  readonly id: string;
  name: string;
  value: number;
  resetValue?: number;
  readonly operations: Operation[];
}

export const useCounterStore = defineStore("counterStore", () => {
  const counters = ref<Counter[]>([]);
  const actions = ref<Action[]>([]);
  const availableOperations = computed(() => {
    const retOperations: Operation[] = [];
    counters.value.forEach((counter) => {
      const plusOneOperation: Operation = {
        id: `O-${counter.id}-plusone`,
        name: counter.name + ". + 1",
        mathSign: "+",
        isUseConstant: true,
        constant: 1,
        hostCounter: counter.id,
        selectedCounter: counter.id,
      };
      const minusOneOperation: Operation = {
        id: `O-${counter.id}-minusone`,
        name: counter.name + ". - 1",
        mathSign: "-",
        isUseConstant: true,
        constant: 1,
        hostCounter: counter.id,
        selectedCounter: counter.id,
      };
      const resetOperation: Operation = {
        id: `O-${counter.id}-reset`,
        name: counter.name + ".Reset",
        mathSign: "=",
        isUseConstant: true,
        constant: counter.resetValue || 0,
        hostCounter: counter.id,
        selectedCounter: counter.id,
      };
      retOperations.push(plusOneOperation);
      retOperations.push(minusOneOperation);
      retOperations.push(resetOperation);
      counter.operations.forEach((operation) => {
        const operationCopy = { ...operation };
        operationCopy.name = getDefaultOperationDisplayName(operationCopy);
        retOperations.push(operationCopy);
      });
    }
    );
    console.log("availableOperations", retOperations);
    return retOperations;
  });

  const generateUniqueId = function () {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 6).padStart(4, "0");
  }

  function addCounter(initialName: string) {
    const uniqueId = "C-" + generateUniqueId();
    counters.value.push({
      id: uniqueId,
      name: initialName,
      value: 0,
      operations: [],
    });
    return uniqueId;
  }

  function getCounterValue(counterId: string) {
    const counter = counters.value.find((counter) => counter.id === counterId);
    return counter ? counter.value : 0;
  }

  function addOperation(counterId: string) {
    const counter = counters.value.find((counter) => counter.id === counterId);
    if (counter) {
      const operationId = "O-" + generateUniqueId();
      console.log("addOperation", counterId, operationId);
      counter.operations.push(
        {
          id: operationId,
          name: "",
          mathSign: "+",
          isUseConstant: true,
          constant: 3,
          hostCounter: counterId,
          selectedCounter: counterId,
        }
      );
    }
  }

  function deleteOperation(counterId: string, operationId: string) {
    const counter = counters.value.find((counter) => counter.id === counterId);
    if (counter) {
      const operationIdx = counter.operations.findIndex((operation) => operation.id === operationId);
      if (operationIdx >= 0) {
        counter.operations.splice(operationIdx, 1);
      }
    }
  }

  function executeOperation(operation: Operation) {
    const hostCounter = counters.value.find((counter) => counter.id === operation.hostCounter);
    const selectedCounter = counters.value.find((counter) => counter.id === operation.selectedCounter);
    if (!hostCounter || !selectedCounter && !operation.isUseConstant) return;
    const newValue = operation.isUseConstant ? operation.constant : selectedCounter?.value || 0;
    switch (operation.mathSign) {
      case "+":
        hostCounter.value += newValue;
        break;
      case "-":
        hostCounter.value -= newValue;
        break;
      case "=":
        hostCounter.value = newValue;
        break;
    }
  }

  function getDefaultOperationDisplayName(operation: Operation) {
    const hostCounterName = counters.value.find((counter) => counter.id === operation.hostCounter)?.name;
    if (operation.name.trim()) {
      return `${hostCounterName}.${operation.name}`;
    }
    if (operation.isUseConstant) {
      return `${hostCounterName}.${operation.mathSign} ${operation.constant}`;
    } else {
      const selectedCounterName = counters.value.find((counter) => counter.id === operation.selectedCounter)?.name;
      return `${hostCounterName}.${operation.mathSign} ${selectedCounterName}`;
    }
  }

  function addAction() {
    const uniqueId = "A-" + generateUniqueId();
    actions.value.push({
      id: uniqueId,
      name: "",
      operations: [],
    });
    return uniqueId;
  }

  function deleteAction(actionId: string) {
    const actionIdx = actions.value.findIndex((action) => action.id === actionId);
    if (actionIdx >= 0) {
      actions.value.splice(actionIdx, 1);
    }
  }

  function executeAction(action: Action) {
    action.operations.forEach((operation) => {
      executeOperation(operation);
    });
  }

  setInterval(() => {
    console.log(actions.value);
  }
  , 5000);

  return {
    counters,
    actions,
    availableOperations,
    addCounter,
    getCounterValue,
    addOperation,
    deleteOperation,
    executeOperation,
    getDefaultOperationDisplayName,
    addAction,
    deleteAction,
    executeAction
  };
});
