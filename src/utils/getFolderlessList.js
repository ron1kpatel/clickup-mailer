import axios from 'axios';

const getFolderLessList = async (space_id) => {
    if(!space_id) {
        console.error("space_id is required.");
        return null;
    }

    const GET_FOLDERLESSLIST_URL = `https://api.clickup.com/api/v2/space/${space_id}/list?archived=false`;

    try {
        const response = await axios.get(GET_FOLDERLESSLIST_URL, {
            headers: {
                'Authorization': process.env.CLICKUP_API_KEY,
                'accept': 'application/json'
            }
        })

        if(response && response.data) {
            const folderlessLists = response.data
            return folderlessLists;
        }else{
            return null;
        }
    }catch( err ) {
        console.error("Error while getting folderless list.\n   ", err.message);
    }
}

const getAllFolderLessLists = async (spaces) => {
    if(!spaces) {
        console.log("spaces is required.");
    }

    const allList = [];

    for(const space of spaces) {
        const {lists} =  await getFolderLessList(space.id);
        allList.push(...lists);
    }


    
    return allList;
}
export {getFolderLessList}