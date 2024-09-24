const axios = require('axios');

module.exports = {
  name: "shoti",
  description: "Fetch a random Shoti video or image",
  prefixRequired: false,
  adminOnly: false,

  async execute(api, event, args) {
    try {
      
      const apiUrl = `https://betadash-shoti-yazky.vercel.app/shotizxx?apikey=shipazu`;
      const response = await axios.get(apiUrl);

      
      const { username, shotiurl } = response.data;


      let imgStream = await global.getStream(shotiurl);

      
      await api.sendMessage({
        body: `Username: ${username}`,
        attachment: imgStream
      }, event.threadID, event.messageID);
      
    } catch (error) {
      // Handle any error from the API call
      console.error(error);
      await api.sendMessage("An error occurred while fetching the Shoti video.", event.threadID, event.messageID);
    }
  },
};
