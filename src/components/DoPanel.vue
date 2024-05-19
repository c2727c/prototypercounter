<template>
    <Panel toggleable @update:collapsed="handdleUpdateCollapsed($event)">
        <template #header>
            <div
            style="position: relative; display: flex; justify-content: space-between; align-items: center;width:auto;min-width: 12em;   ">
            <InputText  v-if="!allowDo"  
                style="position: absolute; width: 98%; top: 0;left: 0; margin: 0.2em; z-index: 1;"
                id="operationname" v-model="newName" placeholder="Rename this item..." />
            <Button 
            style="width:100%;font-size: 120%;"
            @click="$emit('execute-do')" 
            :disabled="!allowDo">🔨
                {{ props.doableName }}
            </Button>
            </div>
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
