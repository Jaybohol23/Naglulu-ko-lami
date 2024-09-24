const axios = require('axios');

module.exports = {
  name: "ai",
  description: "Ask a question using the API",
  prefixRequired: false,
  adminOnly: false,
  
  async execute(api, event, args) {
    if (args.length === 0) {
      return api.sendMessage(global.convertToGothic("Please provide a question to ask."), event.threadID, event.messageID);
    }

    const question = args.join(' ');
    const apiUrl = `https://betadash-api-swordslush.vercel.app/gpt4?ask=${encodeURIComponent(question)}`;

    try {
      const response = await axios.get(apiUrl);
      const answer = response.data.content || "No response received.";  // Corrected to extract the 'content' field
      const styledAnswer = global.convertToGothic(answer);
      await api.sendMessage(styledAnswer, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      await api.sendMessage(global.convertToGothic("An error occurred try to use ai2."), event.threadID, event.messageID);
    }
  },
};
