import axios from "axios";

const getSpaces = async (teamId) => {
  const GET_SPACES_URL = `https://api.clickup.com/api/v2/team/${teamId}/space?archived=false`;

  try {
    const response = await axios.get(GET_SPACES_URL, {
      headers: {
        'Authorization': process.env.CLICKUP_API_KEY,
        'accept': 'application/json',
      },
    });

    // Check if the response contains data
    if (response && response.data) {
      return response.data;
    } else {
      console.warn("No data found in the response.");
      return null;
    }
  } catch (err) {
    console.error("Error while getting space details:", err.message);
    return null;
  }
};

export {getSpaces};