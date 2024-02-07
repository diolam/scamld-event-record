<script setup>
import { saveValue, getAll } from "../api.js";
import { ref, watch } from "vue";

const visable = ref(false);
const value = ref({});
const id = ref(0);
const options = ref([]);
const loading = ref(false);

const computeOptions = async () => {
    const database = await getAll();
    const _options = [];
    database.subject.forEach((subject) => {
        _options.push({
            value: subject.id,
            label: subject.name,
            children: database.task
                .filter((task) => task.subject.id === subject.id)
                .map((task) => ({
                    value: task.id,
                    label: task.name,
                })),
        });
    });

    options.value = _options;
};

const save = async (value) => {
    value.selected ^= true;
    value.editable = false;
    await saveValue("step", value);
};

const handleEdit = async (scope) => {
    id.value = [scope.row.subject.id, scope.row.task.id];
    value.value = scope.row;
    loading.value = true;
    await computeOptions();
    loading.value = false;
    visable.value = true;
};

const handleSave = async () => {
    value.value.task.id = id.value[1];
    await save(value.value);
    visable.value = false;
};
</script>

<template>
    <Teleport to="body">
        <el-dialog v-model="visable">
            <template #header> 修改 </template>
            <el-form v-model="value">
                <el-form-item label="名称">
                    <el-input v-model="value.name" />
                </el-form-item>
                <el-form-item label="任务">
                    <el-cascader v-model="id" :options="options" />
                </el-form-item>
            </el-form>
            <el-button v-loading="loading" type="primary" @click="handleSave()">保存</el-button>
        </el-dialog>
    </Teleport>
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
