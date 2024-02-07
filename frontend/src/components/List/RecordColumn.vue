<script setup>
import { saveValue, getAll } from "../api.js";
import { ref  } from "vue";

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
                    children: database.step
                        .filter((step) => step.task.id === task.id)
                        .map((step) => ({
                            value: step.id,
                            label: step.name,
                        })),
                })),
        });
    });

    options.value = _options;
};

const type_tag = {
    todo: "primary",
    submit: "danger",
};

const type_text = {
    todo: "普通",
    submit: "提交",
};

const status_text = {
    todo: "待做",
    cancelled: "取消",
    ok: "完成",
};

const status_tag = {
    todo: "warning",
    cancelled: "info",
    ok: "success",
};

const saveOK = async (value) => {
    value.status = "ok";
    loading.value = true;
    await save(value);
    loading.value = false;
};

const save = async (value) => {
    value.selected ^= true;
    value.editable = false;
    await saveValue("record", value);
};

const handleEdit = async (scope) => {
    id.value = [scope.row.subject.id, scope.row.task.id, scope.row.step.id];
    value.value = scope.row;
    loading.value = true;
    await computeOptions();
    loading.value = false;
    visable.value = true;
};

const handleSave = async () => {
    value.value.step.id = id.value[2];
    await save(value.value);
    visable.value = false;
};
</script>

<template>
    <Teleport to="body">
        <el-dialog v-model="visable">
            <template #header> 修改 </template>
            <el-form v-model="value">
                <el-form-item label="日期">
                    <el-date-picker v-model="value.date" value-format="YYYY-MM-DD" type="date" />
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="value.type">
                        <el-option
                            v-for="item in ['todo', 'submit']"
                            :key="item"
                            :label="item"
                            :value="item"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="步骤">
                    <el-cascader v-model="id" :options="options" />
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="value.status">
                        <el-option
                            v-for="item in ['todo', 'ok', 'cancelled']"
                            :key="item"
                            :label="status_text[item]"
                            :value="item"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
            <el-button v-loading="loading" type="primary" @click="handleSave()">保存</el-button>
        </el-dialog>
    </Teleport>
    <el-table-column label="ID" prop="id" width="50" />
    <el-table-column label="日期" prop="date" width="120" />
    <el-table-column label="类型" width="80">
        <template #default="scope">
            <el-tag :type="type_tag[scope.row.type]">
                {{ type_text[scope.row.type] }}
            </el-tag>
        </template>
    </el-table-column>
    <el-table-column label="ID" prop="subject.id" width="50" />
    <el-table-column label="学科" prop="subject.name" width="60" />
    <el-table-column label="ID" prop="task.id" width="50" />
    <el-table-column label="任务" prop="task.name" width="200" />
    <el-table-column label="ID" prop="step.id" width="50" />
    <el-table-column label="步骤" prop="step.name" width="200" />
    <el-table-column label="综合名" width="300">
        <template #default="scope">
            {{ scope.row.type != "todo" ? "交-" : "" }}{{ scope.row.subject.name }}-{{
                scope.row.task.name
            }}{{ scope.row.step.name == "#" ? "" : "-" + scope.row.step.name }}
        </template>
    </el-table-column>
    <el-table-column label="状态" width="80">
        <template #default="scope">
            <el-tag :type="status_tag[scope.row.status]">
                {{ status_text[scope.row.status] }}
            </el-tag>
        </template>
    </el-table-column>
    <el-table-column label="操作" width="160">
        <template #default="scope">
            <el-button v-loading="loading" text type="primary" @click="handleEdit(scope)">
                修改
            </el-button>
            <el-button
                v-loading="loading"
                v-if="scope.row.status !== 'ok'"
                text
                type="primary"
                @click="saveOK(scope.row)"
            >
                完成
            </el-button>
        </template>
    </el-table-column>
</template>
