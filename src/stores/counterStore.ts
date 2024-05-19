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
  minValue?: number;
  maxValue?: number;
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

  function testOperation(operation: Operation) {
    const hostCounter = counters.value.find((counter) => counter.id === operation.hostCounter);
    const selectedCounter = counters.value.find((counter) => counter.id === operation.selectedCounter);
    if (!hostCounter || !selectedCounter && !operation.isUseConstant) return null;
    const newValue = operation.isUseConstant ? operation.constant : selectedCounter?.value || 0;
    var result = 0;
    switch (operation.mathSign) {
      case "+":
        result = hostCounter.value + newValue;
        break;
      case "-":
        result = hostCounter.value - newValue;
        break;
      case "=":
        result = newValue;
        break;
    }
    if (hostCounter.minValue !== undefined && result < hostCounter.minValue ||
      hostCounter.maxValue !== undefined && result > hostCounter.maxValue) {
      return null;
    }
    console.log("testOperation", operation, result);
    return result;
  }

  function executeOperation(operation: Operation) {
    const hostCounter = counters.value.find((counter) => counter.id === operation.hostCounter);
    const result = testOperation(operation);
    if (result !== null && hostCounter) {
      hostCounter.value = result;
      console.log("Operation success", operation);
      return true;
    } else {
      console.log("Operation failed", operation);
      return false;
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
    console.log("addAction", uniqueId);
    actions.value.push({
      id: uniqueId,
      name: "",
      operations: [],
    });
    return uniqueId;
  }

  function deleteAction(actionId: string) {
    const actionIdx = actions.value.findIndex((action) => action.id === actionId);
    console.log("deleteAction", actionId, actionIdx);
    if (actionIdx >= 0) {
      actions.value.splice(actionIdx, 1);
    }
  }

  function getCountersSnapshot() {
    return [...counters.value];
  }

  function recoverCountersSnapshot(snapshot: Counter[]) {
    snapshot.forEach((counter) => {
      const existingCounter = counters.value.find((c) => c.id === counter.id);
      if (existingCounter) {
        existingCounter.value = counter.value;
      }
    });
  }
  function executeAction(action: Action) {
    const snapshot = getCountersSnapshot();
    for (let i = 0; i < action.operations.length; i++) {
      const operationRet = executeOperation(action.operations[i]);
      if (!operationRet) {
        recoverCountersSnapshot(snapshot);
        alert(`Action failed at operation ${i + 1} : ${action.operations[i].name}, reverting to the previous state.`);
        return false;
      }
    }
    return true;
  }

  setInterval(() => {
    console.log(actions.value.map((action) => action.name+action.id)).join(", ");
    // console.log(counters.value);
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
