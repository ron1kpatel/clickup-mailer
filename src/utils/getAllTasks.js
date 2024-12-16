import fs from 'fs';
import { getTasks } from './getTasks.js';

const getAllTasks = async (lists) => {
    if (!lists || lists.length === 0) return null;  
    const allTask = [];

    for (const list of lists) {
        // console.log(`Fetching Tasks for List Id ${list.id}`);
        
        const { tasks } = await getTasks(list.id);  
        
        if (tasks && tasks.length > 0) {
            allTask.push(...tasks);  
        }
    }

    if (allTask.length === 0) return null;
    else return allTask;

    // const allTaskJson = JSON.stringify(allTask, null, 2);
    // fs.writeFileSync('./allTask.json', allTaskJson);
};

export { getAllTasks };