import axios from "axios";

const getFolders =  async (space_id) => {
    if(!space_id) {
        console.error("space_id is required.")
        return null;
    }

    const GET_FOLDERS_URL = `https://api.clickup.com/api/v2/space/${space_id}/folder`

    try {
        const response = await axios.get(GET_FOLDERS_URL, {
            headers: {
                'Authorization': process.env.CLICKUP_API_KEY,
                'accept': 'application/json'
            }
        })

        if(response && response.data) {
            return response.data;
        }else{
            return null;
        }
    }catch(err) {
        console.error("Error while fetching folders:\n  ", err.message)
        return null;
    }
}

export {getFolders}