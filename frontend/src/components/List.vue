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
const range = ref([-1, -1]);
const hideOther = ref(false);
const selectable = ref(true);

const between = (n, range) => (n <= range[0] && n >= range[1]) || (n <= range[1] && n >= range[0]);

const views = {
    subject: { header: SubjectHeader, body: SubjectBody, column: SubjectColumn },
    task: { header: TaskHeader, body: TaskBody, column: TaskColumn },
    step: { header: StepHeader, body: StepBody, column: StepColumn },
    record: { header: RecordHeader, body: RecordBody, column: RecordColumn },
};

const img = new Image();
img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' %3E%3Cpath /%3E%3C/svg%3E";
</script>
<template>
    <el-tabs>
        <el-tab-pane label="新版">
            <el-table
                v-if="schema && data && data.length > 0"
                :data="data"
                style="width: 100%; height: 800px"
            >
                <component :is="views[schema]?.column" />
            </el-table>
            <span v-else v-loading="true"> Loading </span>
        </el-tab-pane>
        <el-tab-pane label="旧版">
            <div id="button-box">
                <button @click="hideOther ^= true">隐藏/显示其他</button>
                <button @click="selectable ^= true">开启/关闭选择</button>
                <button @click="data.forEach((value) => (value.selected = true))">全选</button>
                <button @click="data.forEach((value) => (value.selected = false))">全不选</button>
                <button @click="data.forEach((value) => (value.selected ^= true))">反选</button>
                <button @click="data.forEach((value) => (value.editable = true))">全编辑</button>
                <button @click="data.forEach((value) => (value.editable = false))">全不编辑</button>
            </div>
            <div class="table-outer hide-scrollbar" v-if="schema && data && data.length > 0">
                <table>
                    <thead>
                        <component :is="views[schema]?.header" />
                    </thead>
                    <tbody>
                        <tr
                            v-for="(value, index) in data"
                            :key="index"
                            @dragenter="range[1] = index"
                            :class="[
                                value.selected ^ between(index, range) ? 'selected' : '',
                                hideOther && !value.selected ? 'hidden' : '',
                            ]"
                            :draggable="selectable && !value.editable ? 'true' : 'false'"
                            @click="value.selected ^= selectable && !value.editable"
                            @dblclick="value.editable = true"
                            @dragstart="
                                (e) => {
                                    e.dataTransfer.setDragImage(img, 0, 0);
                                    range[0] = index;
                                    range[1] = index;
                                }
                            "
                            @dragend="
                                data.forEach((value, index) => {
                                    value.selected ^= between(index, range);
                                });
                                range = [-1, -1];
                            "
                        >
                            <component
                                :is="views[schema]?.body"
                                :value="value"
                                :editable="value.editable"
                                :database="database"
                            />
                        </tr>
                    </tbody>
                </table>
            </div>
            <p v-else>暂无数据</p>
        </el-tab-pane>
    </el-tabs>
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
