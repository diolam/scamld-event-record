<script setup>
import { onMounted, ref } from "vue";
import List from "./List.vue";
import { getHome, getAll } from "./api.js";

const view = ref({});
const database = ref({});

onMounted(async () => {
    const data = await getHome();
    database.value = await getAll();
    view.value = data;
});
</script>

<template>
    <h1>主页</h1>
    <List :data="view" schema="record" :database="database" />
</template>

<style scoped></style>
