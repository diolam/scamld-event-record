<script setup>
import { saveValue, getAll } from "../api.js";
import { ref } from "vue";
import StepForm from "./StepForm.vue";

const visable = ref(false);
const value = ref({});
const loading = ref(false);
const id = ref(0);

const save = async (value) => {
    value.selected ^= true;
    value.editable = false;
    await saveValue("step", value);
};

const handleEdit = (scope) => {
    visable.value = true;
    id.value = [scope.row.subject.id, scope.row.task.id];
    value.value = scope.row;
};

const handleSave = async () => {
    value.value.task.id = id.value[1];
    await save(value.value);
    visable.value = false;
};

</script>

<template>
    <el-dialog v-model="visable" append-to-body draggable="true">
        <template #header> 修改 </template>
        <step-form v-if="value && visable" v-model:id="id" :value="value" />
        <el-button v-loading="loading" type="primary" @click="handleSave()">保存</el-button>
    </el-dialog>
    <el-table-column label="ID" prop="id" width="50" />
    <el-table-column label="名称" prop="name" width="200" />
    <el-table-column label="学科" prop="subject.name" width="60" />
    <el-table-column label="任务" prop="task.name" width="200" />
    <el-table-column label="综合名" width="300">
        <template #default="scope">
            {{ scope.row.subject.name }}-{{ scope.row.task.name
            }}{{ scope.row.name == "#" ? "" : "-" + scope.row.name }}
        </template>
    </el-table-column>
    <el-table-column label="操作" width="90">
        <template #default="scope">
            <el-button v-loading="loading" text type="primary" @click="handleEdit(scope)">
                修改
            </el-button>
        </template>
    </el-table-column>
</template>
