import axios from "axios";

const getTasks = async (list_id) => {
    if(!list_id) {
        console.error("list_id is required.");
        return null;
    }


    const GET_TASKS_URL =  `https://api.clickup.com/api/v2/list/${list_id}/task`
    try {
        const response = await axios.get(GET_TASKS_URL, {
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
    } catch (err) {
        console.error("Error while fetching tasks.\n    ", err.message);
    }

}

export {getTasks};  