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

    // Send the "searching" message first
    const searchMessage = global.convertToGothic("Searching for an answer... 🔍");
    const messageID = await new Promise((resolve, reject) => {
      api.sendMessage(searchMessage, event.threadID, (err, info) => {
        if (err) return reject(err);
        resolve(info.messageID);
      });
    });

    try {
      const response = await axios.get(apiUrl);
      const answer = response.data.content || "No response received.";
      
      const userInfo = await api.getUserInfo(event.senderID);
      const userName = userInfo[event.senderID].name || "Anonymous";

      const styledAnswer = global.convertToGothic(answer) + `\n\n👤 𝙰𝚜𝚔𝚎𝚍 𝚋𝚢: ${userName}`;

      // Unsend the "searching" message
      await api.unsendMessage(messageID);


      await api.sendMessage(styledAnswer, event.threadID, event.messageID);
      
    } catch (error) {
      console.error(error);

      await api.unsendMessage(messageID);

      await api.sendMessage(global.convertToGothic("An error occurred try use ai2"), event.threadID, event.messageID);
    }
  },
};
