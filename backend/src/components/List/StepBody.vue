<script setup>
import { saveValue } from "../api.js";

const props = defineProps(["value", "editable", "database"]);

const save = async () => {
    props.value.selected ^= true;
    props.value.editable = false;
    await saveValue("step", props.value);
};
</script>

<template>
    <td>{{ value.id }}</td>
    <td>
        <input v-if="editable" v-model="value.name" />
        <template v-else>{{ value.name }}</template>
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
    <td>
        {{ value.subject.name }}-{{ value.task.name
        }}{{ value.name == "#" ? "" : "-" + value.name }}
    </td>
    <td>
        <button v-if="editable" @click="save()">保存</button>
    </td>
</template>
