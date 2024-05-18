<template>
    <div>
        <Dropdown v-model="selectedCounterId" :options="countersReadOnly" optionLabel="name" optionValue="id"
            placeholder="Select a Counter" class="w-full md:w-14rem" showClear />
        <Dropdown v-model="selectedOperation" :options="availableOperations" optionLabel="name"
            placeholder="Select an Operation" class="w-full md:w-14rem"
            @update:modelValue="$emit('update:selectedOperation', index, $event)" />

        <Button icon="pi pi-trash" class="p-button-danger" @click="$emit('delete', index)" />
    </div>

</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import Dropdown from 'primevue/dropdown';
import  Button from 'primevue/button';
import { useCounterStore, Operation } from "../stores/counterStore";

const props = defineProps<{
    selectedOperation: Operation | null;
    index: number;
}>();

const store = useCounterStore();
const selectedOperation = ref<Operation | null>(props.selectedOperation);
const selectedCounterId = ref<string>(selectedOperation.value?.hostCounter || "");
const countersReadOnly = computed(() => store.counters);
const availableOperations = computed(() => {
    return selectedCounterId.value ?
        store.availableOperations.filter((operation) => operation.hostCounter === selectedCounterId.value)
        : store.availableOperations;
});

watch(selectedOperation, (newVal) => {
    if (newVal) {
        selectedCounterId.value = newVal.hostCounter;
    }
});


</script>