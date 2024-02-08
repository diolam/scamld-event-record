import axios from "axios";
import { ElMessage } from "element-plus";

const handleData = (data) =>
    data.forEach((val) => {
        val.selected = false;
        val.editable = false;
    });

const success = () => {
    ElMessage({
        type: "success",
        message: "成功",
    });
};

const failed = () => {
    ElMessage({
        type: "error",
        message: "失败",
    });
};

const error = () => {
    ElMessage({
        type: "error",
        message: "错误",
    });
};

/**
 * 获取首页数据
 */
export const getHome = async () => {
    let result;
    try {
        result = await axios.get("/api/home");
    } catch (e) {
        failed();
        console.error(e);
        return;
    }

    let data = result.data;
    handleData(data);
    success();

    return data;
};

/**
 * 获取查询结果
 */
export const postQuery = async (schema, code) => {
    let result;
    try {
        result = await axios.post("/api/query", {
            schema: schema,
            code: code,
        });
    } catch (e) {
        if (e.response.status === 400) {
            error();
        } else {
            failed();
        }
        console.error(e);
        return;
    }

    let data = result.data;
    handleData(data);
    success();

    return data;
};

export const getAll = async () => {
    let result;
    try {
        result = await axios.get("/api/all");
    } catch (e) {
        error();
        console.error(e);
        return;
    }

    let data = result.data;

    success()
    return data;
};

export const saveValue = async (schema, value) => {
    try {
        await axios.put(`/api/${schema}/${value.id}`, {
            ...value,
        });
    } catch (e) {
        error()
        console.error(e);
        return;
    }
    success();
};

export const createValue = async (schema, value) => {
    try {
        await axios.post(`/api/${schema}`, {
            ...value,
        });
    } catch (e) {
        error()
        console.error(e);
        return;
    }
    success();
};
