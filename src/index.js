const db = require("./db.js");
const inquirer = require("inquirer");
const path = require("path");
const home = process.env.HOME || require("os").homedir();
const filePath = path.join(home, "todo");

module.exports.add = (name) => {
    addTodo(name);
};

module.exports.clear = () => {
    db.writeFile(filePath, []);
};

module.exports.showActions = async () => {
    let listArr = await getListArr();
    inquirer
        .prompt([{
            type: "list",
            message: "选择你要进行的操作",
            name: "action",
            choices: [
                new inquirer.Separator(" = The Actions = "),
                {
                    name: "退出",
                },
                ...listArr,
                {
                    name: "+ 创建任务",
                },
            ],
        }, ])
        .then((answer) => {
            if (answer.action === "+ 创建任务") {
                createTask();
            } else if (answer.action === "退出") {} else {
                setTask(answer.action);
            }
        });
};


const getListArr = async () => {
    let list = await db.readFile(filePath)
    let listArr = list.map((item) => {
        if (item.isDone === false) {
            return {
                name: "[_]".concat(item.name),
            };
        } else {
            return {
                name: "[x]".concat(item.name),
            };
        }
    });
    return listArr;
};

const createTask = () => {
    inquirer
        .prompt([{
            type: "input",
            name: "taskName",
            message: "任务名称：",
        }, ])
        .then((answer) => {
            addTodo(answer.taskName);
        });
};

const setTask = async (task) => {
    let listArr = await getListArr();
    const nameArr = listArr.map((item) => item.name);
    const index = nameArr.indexOf(task);
    const actions = {
        已完成: setDone,
        未完成: setUndone,
        改标题: updateName,
        删除: deleteTask,
    };
    inquirer
        .prompt([{
            type: "list",
            message: "选择你要进行的操作",
            name: "action",
            choices: [
                new inquirer.Separator(" = The Actions = "),
                {
                    name: "退出",
                },
                {
                    name: "已完成",
                },
                {
                    name: "未完成",
                },

                {
                    name: "改标题",
                },
                {
                    name: "删除",
                },
            ],
        }, ])
        .then((answer) => {
            const fn = actions[answer.action];
            fn(index);
        });
};

const addTodo = async (name) => {
    let list = await db.readFile(filePath);
    const item = {
        name,
        isDone: false,
    };
    list.push(item);
    db.writeFile(filePath, list);
};

const updateName = (index) => {
    inquirer
        .prompt([{
            type: "input",
            name: "newName",
            message: "请输入新的标题：",
        }, ])
        .then(async (answer) => {
            let list = await db.readFile(filePath);
            list[index].name = answer.newName;
            db.writeFile(filePath, list);
        });
};

const setDone = async (index) => {
    let list = await db.readFile(filePath)
    list[index].isDone = true;
    db.writeFile(filePath, list);
};

const setUndone = async (index) => {
    let list = await db.readFile(filePath)
    list[index].isDone = false;
    db.writeFile(filePath, list);
};

const deleteTask = async (index) => {
    let list = await db.readFile(filePath)
    list.splice(index, 1);
    db.writeFile(filePath, list);
};