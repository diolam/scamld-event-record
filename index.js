const fs = require("fs/promises");
const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const static = require("koa-static");
const vm = require("node:vm");
const app = new Koa();

app.use(bodyParser());
app.use(static(__dirname + "/frontend/dist"));

/**
 * @type {Router<{database: {
 *   subject: {name: string, deleted: boolean}[],
 *   task: {name: string, subject: number, deleted: boolean}[],
 *   step: {name: string, task: number, deleted: boolean}[],
 *   record: {date: string, step: number, type: "submit" | "todo", status: "todo" | "done" | "cancelled", deleted: boolean}[],
 * }}, {}>}
 */
const router = new Router();

const views = {
    subject: (ctx, view) =>
        view
            .map((subject, id) => {
                return { ...subject, id };
            })
            .filter(({ deleted }) => !deleted),
    task: (ctx, view) =>
        view
            .map((task, id) => {
                const subject = ctx.state.database.subject[task.subject];
                return { ...task, subject: { ...subject, id: task.subject }, id };
            })
            .filter(({ deleted }) => !deleted),
    step: (ctx, view) =>
        view
            .map((step, id) => {
                const task = ctx.state.database.task[step.task];
                const subject = ctx.state.database.subject[task.subject];
                return {
                    ...step,
                    task: { ...task, id: step.task },
                    subject: { ...subject, id: task.subject },
                    id,
                };
            })
            .filter(({ deleted }) => !deleted),
    record: (ctx, view) =>
        view
            .map((record, id) => {
                const step = ctx.state.database.step[record.step];
                const task = ctx.state.database.task[step.task];
                const subject = ctx.state.database.subject[task.subject];
                return {
                    ...record,
                    step: { ...step, id: record.step },
                    task: { ...task, id: step.task },
                    subject: { ...subject, id: task.subject },
                    id,
                };
            })
            .filter(({ deleted }) => !deleted),
};

const serialize = {
    subject: (view) => {
        const tmp = [];
        view.forEach((value) => {
            while (tmp.length <= value.id - 1) {
                tmp.push({
                    name: "---",
                    deleted: true,
                });
            }
            tmp.push({
                name: value.name,
                deleted: value.deleted,
            });
        });
        return tmp;
    },
    task: (view) => {
        const tmp = [];
        view.forEach((value) => {
            while (tmp.length <= value.id - 1) {
                tmp.push({
                    name: "---",
                    subject: -1,
                    deleted: true,
                });
            }
            tmp.push({
                name: value.name,
                subject: value.subject.id,
                deleted: value.deleted,
            });
        });
        return tmp;
    },
    step: (view) => {
        const tmp = [];
        view.forEach((value) => {
            while (tmp.length <= value.id - 1) {
                tmp.push({
                    name: "---",
                    task: -1,
                    deleted: true,
                });
            }
            tmp.push({
                name: value.name,
                task: value.task.id,
                deleted: value.deleted,
            });
        });
        return tmp;
    },
    record: (view) => {
        const tmp = [];
        view.forEach((value) => {
            while (tmp.length <= value.id - 1) {
                tmp.push({
                    date: "---",
                    step: -1,
                    type: "---",
                    status: "---",
                    deleted: true,
                });
            }
            tmp.push({
                date: value.date,
                step: value.step.id,
                type: value.type,
                status: value.status,
                deleted: value.deleted,
            });
        });
        return tmp;
    },
};

const getDatabase = async () => {
    const numberJSON = await fs.readFile("number.json");
    const number = JSON.parse(numberJSON.toString("utf-8"));
    const databaseJSON = await fs.readFile(`database/${number - 1}.json`);
    const database = JSON.parse(databaseJSON.toString("utf-8"));
    return database;
};

const saveDatabase = async (database) => {
    const serialized = {};

    Object.entries(database).map(([name, schema]) => {
        serialized[name] = serialize[name](schema);
    });

    const numberJSON = await fs.readFile("number.json");
    const number = JSON.parse(numberJSON.toString("utf-8"));
    await fs.writeFile("number.json", JSON.stringify(number + 1));
    await fs.writeFile(`database/${number}.json`, JSON.stringify(serialized));
};

app.use(async (ctx, next) => {
    const database = await getDatabase();
    ctx.state.database = database;
    const view = {};

    Object.entries(database).map(([name, schema]) => {
        view[name] = views[name](ctx, schema);
    });

    ctx.state.database = view;

    await next();
});

router.get("/api/home", (ctx) => {
    const _date = new Date();
    const dateToday = `${_date.getFullYear()}-${(_date.getMonth() + 1).toString().padStart(2, "0")}-${_date.getDate().toString().padStart(2, "0")}`;
    const view = [];

    view.push(
        ...ctx.state.database.record.filter(
            ({ status, date, deleted }) => !deleted && date === dateToday && status === "todo"
        )
    );

    view.push(
        ...ctx.state.database.record.filter(
            ({ status, date, deleted }) => !deleted && date < dateToday && status === "todo"
        )
    );

    ctx.response.body = view;
});

router.get("/api/all", (ctx) => {
    ctx.response.body = ctx.state.database;
});

router.post("/api/query", (ctx) => {
    const code = ctx.request.body.code;
    const name = ctx.request.body.schema;

    const schema = ctx.state.database[name];
    const context = { schema, result: null };
    try {
        vm.runInNewContext(code, context);
    } catch (e) {
        console.log(e);
        ctx.throw(400, e);
    }

    ctx.body = context.result;
});

router.post("/api/:schema", async (ctx) => {
    const schema = ctx.params.schema;
    const data = ctx.request.body;

    const _value = ctx.state.database[schema].find((value) => !value.deleted);
    const value = {};
    Object.entries(data).forEach(([key, val]) => {
        if (key in _value) {
            value[key] = val;
        }
    });

    ctx.state.database[schema].push(value);
    await saveDatabase(ctx.state.database);
    ctx.body = "ok";
});

router.put("/api/:schema/:id", async (ctx) => {
    const id = Number(ctx.params.id);
    const schema = ctx.params.schema;
    const data = ctx.request.body;

    console.log(ctx.params)
    
    const value = ctx.state.database[schema].find((value) => value.id === id);
    Object.entries(data).forEach(([key, val]) => {
        if (key in value) {
            value[key] = val;
        }
    });

    await saveDatabase(ctx.state.database);
    ctx.body = "ok";
});

app.use(router.routes());
app.listen(3000);
