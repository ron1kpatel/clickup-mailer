import axios from "axios";
import dotenv from 'dotenv';
import { getTeamDetails } from "./utils/getTeamDetails.js";
import { getSpaces } from "./utils/getSpaces.js";
import { getFolders } from "./utils/getFolders.js";
import { getLists } from "./utils/getLists.js"; 
import fs from 'fs';
import { getFolderLessList } from "./utils/getFolderlessList.js";
import { getTasks } from "./utils/getTasks.js"; 
import { createFilteredPayloadForAllAssignees } from "./utils/createFilteredPayloadForAllAssignees.js";
import { sendMail } from "./utils/mail/send.mail.js";
dotenv.config({
    path: './src/.env'
});

// Fetch team details
const { teams } = await getTeamDetails();

const payload = {
    teams: []
};

// Loop through each team
for (const team of teams) {
    const { spaces } = await getSpaces(team.id);

    const teamWithSpaces = {
        ...team,  
        spaces: []
    };

    // Loop through each space
    for (const space of spaces) {
        const { folders } = await getFolders(space.id);

        const spaceWithFolders = {
            ...space,  
            folders: []
        };

        // Loop through each folder
        for (const folder of folders) {
            const { lists } = await getLists(folder.id); 
            const folderWithLists = {
                ...folder,  
                lists: []   
            };

            // Loop through each l`ist in the folder (to get tasks)
            for (const list of lists) {
                const tasks = await getTasks(list.id); 
                const listWithTasks = {
                    ...list,   
                    tasks      
                };

                folderWithLists.lists.push(listWithTasks);
            }

            spaceWithFolders.folders.push(folderWithLists);
        }

        // Create folderless folder and add lists
        const folderlessLists  = await getFolderLessList(space.id);
        const folderlessFolder = {
            name: 'folderless', 
            lists: []           
        };

        for (const list of folderlessLists.lists) {
            const tasks = await getTasks(list.id); 
            const listWithTasks = {
                ...list,   
                tasks     
            };

            folderlessFolder.lists.push(listWithTasks);
        }

        spaceWithFolders.folders.push(folderlessFolder);

        teamWithSpaces.spaces.push(spaceWithFolders);
    }

    payload.teams.push(teamWithSpaces);
}

const payloadJson = JSON.stringify(payload, null, 2);
fs.writeFileSync('./src/Demos/payload.json', payloadJson);

console.log("Payload written to ./src/Demos/payload.json");

const filteredPayload = createFilteredPayloadForAllAssignees(payload);
const json  = JSON.stringify(filteredPayload, null, 2);
fs.writeFileSync('./src/Demos/filteredPayload.json', json);
console.log('Done')

// const filteredPayload = JSON.parse(fs.readFileSync('./src/Demos/filteredPayload.json'));

for(const payload of filteredPayload) {
    console.log('Sending Mail To ', payload.member.email);
    fs.writeFileSync(`./src/Demos/${payload.member.email}.json`, JSON.stringify(payload, null, 2));
    sendMail(payload);
}