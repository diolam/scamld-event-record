const fs = require("fs");

function print_db(database) {
  let s = "";
  Object.entries(database).forEach(([name, schema]) => {
    let headersSet = new Set();
    schema.forEach((value) => {
      Object.keys(value).forEach((column) => {
        headersSet.add(column);
      });
    });

    let headers = Array.from(headersSet);
    let content = [];
    for (let i = 0; i < schema.length; i++) {
      for (let j = 0; j < headers.length; j++) {
        content.push("-");
      }
    }
    for (let i = 0; i < schema.length; i++) {
      Object.entries(schema[i]).forEach(([key, data]) => {
        let j = headers.indexOf(key);
        content[i * headers.length + j] = data;
      });
    }

    s += `<h2>${name}</h2>`;
    s += "<table><theader>";
    s += `<th>id</th>`;
    headers.forEach((data) => {
      s += `<th>${data}</th>`;
    });
    s += "</theader><tbody>";
    for (let i = 0; i < schema.length; i++) {
      s += "<tr>";
      s += `<td>${i}</td>`;
      for (let j = 0; j < headers.length; j++) {
        s += `<td>${content[i * headers.length + j]}</td>`;
      }
      s += "</tr>";
    }
    s += "</tbody></table>";
  });
  return s;
}

let raw;
try {
  raw = fs.readFileSync("data.json", "utf-8");
  console.log(raw);
} catch (err) {
  console.error(err);
}

const data = JSON.parse(raw);
console.log(data);

let html = '<link href="database.css" rel="stylesheet">';
html += "<h1>数据库</h1>";

const db = {};

const db_subject = [];
data.forEach((day) =>
  day.forEach((item) => {
    if (
      item &&
      typeof item !== "string" &&
      item[0] !== "交" &&
      !db_subject.find((value) => value.name === item[0])
    )
      db_subject.push({ name: item[0], deleted: false });
  }),
);

db.subject = db_subject;
console.log(db_subject);

const db_task = [];
data.forEach((day) =>
  day.forEach((item) => {
    const subject = db_subject.findIndex((value) => value.name === item[0]);
    if (
      item &&
      typeof item !== "string" &&
      item[0] !== "交" &&
      !db_task.find(
        (value) => value.name === item[1] && value.subject === subject,
      )
    )
      db_task.push({ name: item[1], subject: subject, deleted: false });
  }),
);

db.task = db_task;
console.log(db_task);

const db_step = [];
data.forEach((day) =>
  day.forEach((item) => {
    const subject = db_subject.findIndex((value) => value.name === item[0]);
    const task = db_task.findIndex(
      (value) => value.name === item[1] && value.subject === subject,
    );
    if (
      item &&
      typeof item !== "string" &&
      item[0] !== "交" &&
      item.length > 2 &&
      !db_step.find((value) => value.name === item[2] && value.task === task)
    )
      db_step.push({ name: item[2], task: task, deleted: false });
    if (
      item &&
      typeof item !== "string" &&
      item[0] !== "交" &&
      item.length === 2 &&
      !db_step.find((value) => value.name === "#" && value.task === task)
    )
      db_step.push({ name: "#", task: task, deleted: false });
  }),
);

db.step = db_step;
console.log(db_step);

const db_record = [];
data.forEach((day) => {
  const date = day[0];
  day.forEach((item) => {
    if (!item || typeof item === "string" || item[0] === "交") return;
    const subject = db_subject.findIndex((value) => value.name === item[0]);
    const task = db_task.findIndex(
      (value) => value.name === item[1] && value.subject === subject,
    );
    const step = db_step.findIndex(
      (value) => value.name === (item[2] || "#") && value.task === task,
    );
    db_record.push({
      date,
      step,
      type: "todo",
      status: "todo",
      deleted: false,
    });
  });
});

data.forEach((day) => {
  const date = day[0];
  day.forEach((item) => {
    if (!item || typeof item === "string" || item[0] !== "交") return;
    const subject = db_subject.findIndex((value) => value.name === item[1]);
    const task = db_task.findIndex(
      (value) => value.name === item[2] && value.subject === subject,
    );
    const step = db_step.findIndex(
      (value) => value.name === (item[3] || "#") && value.task === task,
    );
    db_record.push({
      date,
      step,
      type: "submit",
      status: "todo",
      deleted: false,
    });
  });
});

db.record = db_record;
console.log(db_record);

html += print_db(db);

console.log(html);

fs.writeFile("data.html", html, (err) => {
  if (err) {
    console.error(err);
  }
});

fs.writeFile("database.json", JSON.stringify(db), (err) => {
  if (err) {
    console.error(err);
  }
});
