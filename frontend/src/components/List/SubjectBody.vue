<script setup>
import { saveValue } from "../api.js";

const props = defineProps(["value", "editable", "database"]);

const save = async () => {
    props.value.selected ^= true;
    props.value.editable = false;
    await saveValue("subject", props.value);
};
</script>

<template>
    <td>{{ value.id }}</td>
    <td>
        <input v-if="editable" v-model="value.name" />
        <template v-else>{{ value.name }}</template>
    </td>
    <td>
        <button v-if="editable" @click="save()">保存</button>
    </td>
</template>
