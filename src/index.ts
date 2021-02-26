#! /usr/bin/env node


import inquirer from 'inquirer';
import { TaskCollection } from './models/TaskCollection';
import { task } from './data';
import { JsonTaskCollection } from './models/JsonTaskCollection';

const collection = new JsonTaskCollection('gabo', task);
let showCompleted = true;

function displayTaskList(): void{

    console.log(`${collection.username}'s Tasks` + `(${collection.getTaskCount().incomplete} Task to do)`);
    collection.getTaskItem(showCompleted).forEach(task => task.printDetails());
}

enum Commands { 
    Add = 'Add New Task',
    Complete = 'Complete Task',
    Toggle = 'Show/Hide Completed',
    Purge = 'Remove Completed Task',
    Quit = 'Quit'
}

async function promptAdd(): Promise<void> {
    console.clear();
    const answer = await inquirer.prompt({
        type: 'input',
        name: 'add',
        message: 'Enter Task:'
    });
    if(answer['add'] !== ''){
        collection.addTask(answer['add']);
    }
    promptUser();
}

async function promptComplete(): Promise<void>{
    console.clear();
    const answer = await inquirer.prompt({
        type: 'checkbox',
        name: 'complete',
        message: 'Mark Task Complete',
        choices: collection.getTaskItem(showCompleted).map(item => ({
            name: item.task,
            value: item.id,
            checked: item.complete
        }))
    });
    let completedTasks = answer['complete'] as number[];
    collection.getTaskItem(true).forEach(item => collection.markComplete(
        item.id,
        completedTasks.find(id => id === item.id) != undefined )
    );
    promptUser();
}
async function promptUser(){
    console.clear();
    displayTaskList();

    const answer = await inquirer.prompt({
       type: 'list',
       name: 'command',
       message: 'Choose Option',
       choices: Object.values(Commands)
    });
    switch(answer["command"]){
        case Commands.Toggle:
            showCompleted = !showCompleted;
            console.log(showCompleted);
            promptUser();
            break;
        
        case Commands.Add: 
            promptAdd();
        break;
        
        case Commands.Complete:
           if(collection.getTaskCount().incomplete > 0 ){
               promptComplete();
            }else{
                promptUser();
            }
        break;
        
        case Commands.Purge:
            collection.removeComplete();
            promptUser();
        break;

    }
}

promptUser();
