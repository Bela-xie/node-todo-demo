#!/usr/bin/env node

const {
    Command
} = require("commander");
const pkg = require("./package.json");
const api = require("./index.js");
const program = new Command();

program.version(pkg.version);

program.option("-a, --add ", "add a task");

program
    .command("add")
    .description("add your task")
    .action(() => {
        const args = program.args;
        const name = args.slice(1).join(" ");
        api.add(name);
    });
program
    .command("show")
    .description("show all actions")
    .action(() => {
        api.showActions();
    });
program
    .command("clear")
    .description("clear all")
    .action(() => {
        api.clear();
    });
// console.log(process.argv.length)

if (process.argv.length === 2) {
    api.showActions();
}
program.parse(process.argv);