import dotenv from 'dotenv'
import fs from 'fs'

import {getAllTasks, getAllLists, getFolders, getFolderLessList, getSpaces, getTeamDetails, sendMail} from './utils/index.js'
import { getAllFolders } from './utils/getAllFolders.js';
import { getAllFolderLessLists } from './utils/getFolderlessList.js';
import { getThisWeekTasks } from './utils/getThisWeekTasks.js';
dotenv.config({
    path:'./src/.env'
})

const {teams} = await getTeamDetails();

const {spaces} = await getSpaces(teams[0].id);

const {allFolders} = await getAllFolders(spaces);

const allFolderlessList = await getAllFolderLessLists(spaces)

const allLists = await getAllLists(allFolders, allFolderlessList);


const thisWeekTasks = getThisWeekTasks(allLists);

// const allTasks = await getAllTasks(allLists);


// const resultJSON = JSON.stringify(allTasks, null, 2);
// fs.writeFileSync('./src/Demos/allTasks.json', resultJSON);