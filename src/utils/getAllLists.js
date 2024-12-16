import { getLists } from './getLists.js';

const getAllLists = async (folders, folderLessList = []) => {
    // Return early if folders are not defined
    if (!folders) return folderLessList;

    //Get all folder_ids ;
    let folder_ids = [];
    let allLists = [];

    folders.forEach(folder => {
        folder_ids.push(folder.id);
    });


    //Get all lists of each folder_ids
    
    for (const id of folder_ids) {
        const {lists} = await getLists(id);
        allLists.push(...lists);
    }

    //Get Folderless lists
    //Merge Folderless List
    for(const list of folderLessList) {
        allLists.push(list);
    }
    // console.log(allLists);
    // const allListJson = JSON.stringify(allLists, null, 2);
    // fs.writeFileSync('./allLists.json', allListJson);
    // return allLists; 


    return allLists;
}

export {getAllLists}