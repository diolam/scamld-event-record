import axios from "axios";

const handleData = (data) =>
    data.forEach((val) => {
        val.selected = false;
        val.editable = false;
    });

/**
 * 获取首页数据
 */
export const getHome = async () => {
    let result;
    try {
        result = await axios.get("/api/home");
    } catch (e) {
        alert("获取数据失败");
        console.error(e);
        return;
    }

    let data = result.data;
    handleData(data);

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
        alert("获取数据失败");
        if (e.response.status === 400) {
            alert("用户代码运行时出错");
        }
        console.error(e);
        return;
    }

    let data = result.data;
    handleData(data);

    return data;
};

export const getAll = async () => {
    let result;
    try {
        result = await axios.get("/api/all");
    } catch (e) {
        alert("获取数据失败");
        console.error(e);
        return;
    }

    let data = result.data;

    return data;
};

export const saveValue = async (schema, value) => {
    try {
        await axios.put(`/api/${schema}/${value.id}`, {
            ...value,
        });
    } catch (e) {
        alert("保存时发生了错误");
        console.error(e);
        return;
    }
};
