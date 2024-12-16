import {due_date_gt, due_date_lt} from  './getThisWeek_due_date.js'
import axios from "axios";
import fs from 'fs';


const getThisWeekTasks = async (lists) => {
    const thisWeekTasks = [];

    for(const list of lists) {
        const GET_THIS_WEEK_URL = `https://api.clickup.com/api/v2/list/${list.id}/task?due_date_gt=${due_date_gt}&due_date_lt=${due_date_lt}`

        const response = await axios.get(GET_THIS_WEEK_URL, {
            headers: {
                'Authorization': process.env.CLICKUP_API_KEY,
                'accept': 'application/json'
            }
        })

        if(response && response.data && response.data.tasks.length > 0) {
            const {tasks} = response.data;
            thisWeekTasks.push(...tasks);
        }

    }

    generateThisWeekTasksJSON(thisWeekTasks);
}

const generateThisWeekTasksJSON = (data) => {
    const resultJSON = JSON.stringify(data, null, 2);
    fs.writeFileSync('./src/Demos/thisWeekTasks.json', resultJSON);
}


export {
    getThisWeekTasks    
}