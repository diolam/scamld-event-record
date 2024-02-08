<script setup>
import { ref } from "vue";
import SubjectHeader from "./List/SubjectHeader.vue";
import SubjectBody from "./List/SubjectBody.vue";
import TaskHeader from "./List/TaskHeader.vue";
import TaskBody from "./List/TaskBody.vue";
import StepHeader from "./List/StepHeader.vue";
import StepBody from "./List/StepBody.vue";
import RecordHeader from "./List/RecordHeader.vue";
import RecordBody from "./List/RecordBody.vue";
import RecordColumn from "./List/RecordColumn.vue";
import StepColumn from "./List/StepColumn.vue";
import TaskColumn from "./List/TaskColumn.vue";
import SubjectColumn from "./List/SubjectColumn.vue";

const props = defineProps(["data", "schema", "database"]);

const views = {
    subject: SubjectColumn,
    task: TaskColumn,
    step: StepColumn,
    record: RecordColumn,
};

const img = new Image();
img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' %3E%3Cpath /%3E%3C/svg%3E";
</script>
<template>
    <el-table
        v-if="schema && data && data.length > 0"
        :data="data"
        style="width: 100%; height: 800px"
    >
        <component :is="views[schema]" />
    </el-table>
    <span v-else v-loading="true"> Loading </span>
</template>

<style scoped>
@media print {
    #button-box {
        display: none;
    }

    :deep(tr),
    :deep(th),
    :deep(td) {
        color: #000000;
        background-color: #ffffff;
    }
}

.selected {
    background-color: #0078d7 !important;
    color: #ffffff;
}

.hidden {
    display: none;
}

#button-box {
    margin-bottom: 10px;
}

table {
    border-collapse: collapse;
    border: 1px dotted gray;
}

:deep(tr),
:deep(th),
:deep(td) {
    padding: 0px;
    white-space: nowrap;
    border: 1px dotted gray;
    padding: 0px 5px;
}

tr:hover {
    color: #ffffff;
    background-color: #70a5d1;
}

* {
    cursor: pointer;
}
</style>
