const axios = require('axios');

module.exports = {
  name: "ai2",
  description: "Ask a question using the API",
  prefixRequired: false,
  adminOnly: false,
  
  async execute(api, event, args) {
    if (args.length === 0) {
      return api.sendMessage(global.convertToGothic("Please provide a question to ask. ex: ai wat is black"), event.threadID, event.messageID);
    }

    const question = args.join(' ');
    const apiUrl = `https://betadash-api-swordslush.vercel.app/gpt?ask=${encodeURIComponent(question)}`;

    try {
      const response = await axios.get(apiUrl);
      const answer = response.data.architecture || "No response received.";
      const styledAnswer = global.convertToGothic(answer);
      await api.sendMessage(styledAnswer, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      await api.sendMessage(global.convertToGothic("An error occurred while contacting the API."), event.threadID, event.messageID);
    }
  },
};
