import axios from "axios"
const GET_TEAM_DETAILS_URL = "https://api.clickup.com/api/v2/team"
const getTeamDetails = async () => {
    try{
        const response = await axios.get(GET_TEAM_DETAILS_URL, {
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
    }catch (error){
        console.error("Error fetching team details:\n", error)
        return null;
    }
}

export {getTeamDetails}