<script setup>
import { saveValue } from "../api.js";

const props = defineProps(["value", "editable", "database"]);

const colors = {
    "todo-today": "green",
    "submit-today": "blue",
    "todo-past": "yellow",
    "todo-submit-past": "red",
    "submit-past": "fuchsia",
};

const types = {
    todo: "普通",
    submit: "提交",
};

const status = {
    todo: "待做",
    cancelled: "取消",
    ok: "完成",
};

const reason = {
    "todo-today": "今天要做",
    "submit-today": "今天要交",
    "todo-past": "过去未做",
    "todo-submit-past": "过去未做但要交",
    "submit-past": "过去要交",
};

const saveOK = async () => {
    props.value.status = "ok";
    await save();
};

const save = async () => {
    props.value.selected ^= true;
    props.value.editable = false;
    await saveValue("record", props.value);
};
</script>

<template>
    <td :style="{ backgroundColor: colors[value.reason] }"></td>
    <td>
        {{ value.id }}
    </td>
    <td>
        <input v-if="editable" type="date" v-model="value.date" />
        <template v-else>{{ value.date }}</template>
    </td>
    <template v-if="editable">
        <td colspan="2">
            <select v-model="value.subject.id">
                <option v-for="subject in database.subject" :key="subject.id" :value="subject.id">
                    {{ subject.id }} {{ subject.name }}
                </option>
            </select>
        </td>
    </template>
    <template v-else>
        <td>{{ value.subject.id }}</td>
        <td>{{ value.subject.name }}</td>
    </template>
    <template v-if="editable">
        <td>
            <select v-model="value.type">
                <option value="todo">待办</option>
                <option value="submit">提交</option>
            </select>
        </td>
    </template>
    <template v-else>
        <td>{{ types[value.type] }}</td>
    </template>
    <template v-if="editable">
        <td colspan="2">
            <select v-model="value.task.id">
                <option
                    v-for="task in database.task.filter((t) => t.subject.id == value.subject.id)"
                    :key="task.id"
                    :value="task.id"
                >
                    {{ task.id }} {{ task.name }}
                </option>
            </select>
        </td>
    </template>
    <template v-else>
        <td>{{ value.task.id }}</td>
        <td>{{ value.task.name }}</td>
    </template>
    <template v-if="editable">
        <td colspan="2">
            <select v-model="value.step.id">
                <option
                    v-for="step in database.step.filter((t) => t.task.id == value.task.id)"
                    :key="step.id"
                    :value="step.id"
                >
                    {{ step.id }} {{ step.name == "#" ? "" : "-" + step.name }}
                </option>
            </select>
        </td>
    </template>
    <template v-else>
        <td>{{ value.step.id }}</td>
        <td>{{ value.step.name }}</td>
    </template>
    <td>
        {{ value.type != "todo" ? "交-" : "" }}{{ value.subject.name }}-{{ value.task.name
        }}{{ value.step.name == "#" ? "" : "-" + value.step.name }}
    </td>
    <td :class="value.status">
        <select v-if="editable" v-model="value.status">
            <option value="todo">待做</option>
            <option value="ok">完成</option>
            <option value="cancelled">取消</option>
        </select>
        <template v-else>{{ status[value.status] }}</template>
    </td>
    <td>{{ reason[value.reason] }}</td>
    <td>
        <button v-if="editable" @click="save()">保存</button>
        <button v-else @click="saveOK()">完成</button>
    </td>
</template>

<style scoped>
.todo {
    color: #000000;
    background-color: #ee8f8f;
}

.ok {
    color: #000000;
    background-color: #8fee8f;
}

.cancelled {
    color: #000000;
    background-color: #8f8fee;
}

.数学 {
    background-color: red;
}
</style>
