<template>
    <Panel toggleable @update:collapsed="handdleUpdateCollapsed($event)">
        <template #header>
            <div class="my-panel-header" style="width:100%;display:flex;">
            <div name="doable-name"
            style="position: relative; width: 100%; ">
            <InputText  v-if="!allowDo"  
                style="position: absolute; width: 96%; top: 0; margin: 0.2em; z-index: 1;"
                id="operationname" 
                size="small"
                v-model="newName" 
                :placeholder="`...${props.doableName}`" />
            <Button 
            style="width:100%;"
            size="small"
            @click="$emit('execute-do')" 
            :disabled="!allowDo">🔨
                {{ props.doableName }}
            </Button>
            </div>
            <Button v-if="!allowDo" @click="$emit('execute-delete')" severity="danger" text rounded label="🗑️"
                size="small" />
            </div>
        </template>
        <slot></slot>
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
