import axios from "axios";

const getLists = async (folder_id) => {
    if(!folder_id) {
        console.error("folder_id is required.");
    }
    const GET_LISTS_URL = `https://api.clickup.com/api/v2/folder/${folder_id}/list?archived=false`
    try{
        const response = await axios.get(GET_LISTS_URL, {
            headers: {
                'Authorization': process.env.CLICKUP_API_KEY,
                'accept': 'application/json'
            }
        })

        if(response && response.data) {
            return response.data;
        }
        else {
            return null;
        }
    }catch(err) {
        console.log("Error while fetching lists.\n  ", err);
    }
}

export {getLists}