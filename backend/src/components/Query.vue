<script setup>
import { onMounted, ref } from "vue";
import List from "./List.vue";
import { postQuery, getAll } from "./api.js";

const view = ref({});
const code = ref("");
const formSchema = ref("record");
const schema = ref("record");
const database = ref({});

code.value = "result = schema;";

onMounted(async () => {
    await query();
    database.value = await getAll();
});

const query = async () => {
    view.value = [];
    const data = await postQuery(formSchema.value, code.value);
    schema.value = formSchema.value;
    view.value = data;
};
</script>

<template>
    <h1>查询</h1>
    <p>
        <el-select v-model="formSchema">
            <el-option value="subject">subject</el-option>
            <el-option value="task">task</el-option>
            <el-option value="step">step</el-option>
            <el-option value="record">record</el-option>
        </el-select>
    </p>
    <el-input
        type="textarea"
        :autosize="{ minRows: 1, maxRows: 10 }"
        class="code"
        v-model="code"
        spellcheck="false"
    ></el-input>
    <p>
        <el-button @click="query">查询</el-button>
        <el-button disabled>修改</el-button>
    </p>

    <List :data="view" :schema="schema" :database="database" />
</template>

<style scoped>
.code {
    font-family: "Consolas", monospace;
}
</style>
