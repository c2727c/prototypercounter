<template>
    <Panel toggleable @update:collapsed="handdleUpdateCollapsed($event)">
        <template #header>
            <Button @click="$emit('execute-do')" :disabled="!allowDo">🔨
                {{ props.doableName }}
            </Button>
            <FloatLabel v-if="!allowDo">
                <InputText id="operationname" v-model="newName" placeholder="Rename this item..." />
                <label for="operationname">New Name</label>
            </FloatLabel>
            <Button v-if="!allowDo" @click="$emit('execute-delete')" severity="danger" text rounded label="🗑️"
                size="small" />
        </template>
        <slot></slot>
        <template #footer>
            <slot name="footer"></slot>
        </template>
    </Panel>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Button from 'primevue/button';
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import Panel from 'primevue/panel';

const props = defineProps<{
    doableName: string;
    updateCollapsed: (collapsed: boolean, newName: string) => void;
}>();

//hard copy the values from the store
const newName = ref("");
const allowDo = ref(false);

const handdleUpdateCollapsed = (collapsed: boolean) => {
    if (collapsed) {
        allowDo.value = true;
    } else {
        newName.value = "";
        allowDo.value = false;
    }
    props.updateCollapsed(collapsed, newName.value);
};
</script>
