<script setup>
import { ref } from "vue";
import RecordForm from "./List/RecordForm.vue";
import StepForm from "./List/StepForm.vue";
import TaskForm from "./List/TaskForm.vue";
import SubjectForm from "./List/SubjectForm.vue";
import { createValue } from "./api";

const record = ref({
    date: "2024-01-01",
    type: "todo",
    step: {},
    status: "todo",
});
const stepId = ref([0, 0, 0]);

const step = ref({
    name: "",
    task: {},
});
const taskId = ref([0, 0]);

const task = ref({
    name: "",
    subject: {},
});
const subjectId = ref([0]);

const subject = ref({
    name: "",
});
</script>

<template>
    <h1>创建</h1>
    <el-tabs>
        <el-tab-pane label="记录">
            <record-form v-model:id="stepId" :value="record" />
            <el-button
                type="primary"
                @click="
                    record.step.id = stepId[2];
                    createValue('record', record);
                "
                >保存</el-button
            >
        </el-tab-pane>
        <el-tab-pane label="步骤">
            <step-form v-model:id="taskId" :value="step" />
            <el-button
                type="primary"
                @click="
                    step.task.id = taskId[1];
                    createValue('step', step);
                "
                >保存</el-button
            >
        </el-tab-pane>
        <el-tab-pane label="任务">
            <task-form v-model:id="subjectId" :value="task" />
            <el-button
                type="primary"
                @click="
                    task.subject.id = subjectId[0];
                    createValue('task', task);
                "
                >保存</el-button
            >
        </el-tab-pane>
        <el-tab-pane label="学科">
            <subject-form v-model:id="subjectId" :value="subject" />
            <el-button type="primary" @click="createValue('subject', record)">保存</el-button>
        </el-tab-pane>
    </el-tabs>
</template>
