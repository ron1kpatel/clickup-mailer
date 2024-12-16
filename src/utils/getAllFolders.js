import axios from "axios";
import { getFolders } from "./getFolders.js";

const getAllFolders = async(spaces) => {
    if(!spaces) {
        console.error("spaces is required.");
    }

    const allFolders = [];

    for(const space of spaces) {
        console.log("Fetching ", space.name);
        const {folders} = await getFolders(space.id);
        allFolders.push(...folders);
    }

    return  {allFolders};

}

export {
    getAllFolders
}