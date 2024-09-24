const axios = require('axios');

function formatResponse(response) {
  return response.replace(/\*\*(.*?)\*\*/g, (match, p1) => global.convertToGothic(p1));
}

async function handleImage(api, event, imageUrl, query) {
  const geminiUrl = `https://deku-rest-api.gleeze.com/gemini?prompt=${encodeURIComponent(query)}&url=${encodeURIComponent(imageUrl)}`;
  const { data } = await axios.get(geminiUrl);
  const formattedResponse = `🤖 | 𝗖𝗛𝗔𝗧-𝗚𝗣𝗧-𝟰𝗢
━━━━━━━━━━━━━━━━━━
${formatResponse(data.gemini)}
━━━━━━━━━━━━━━━━━━`;
  await api.sendMessage(formattedResponse, event.threadID, event.messageID);
}

module.exports = {
  name: "gpt4o",
  description: "Ask GPT anything.",
  prefixRequired: false,
  adminOnly: false,
  async execute(api, event, args) {
    await api.sendMessage(global.convertToGothic("Thinking... 🤔"), event.threadID, event.messageID);

    if (event.messageReply && event.messageReply.attachments.length > 0) {
      const imageUrl = event.messageReply.attachments[0].url;
      const query = args.length > 0 ? args.join(" ") : "Please describe this image.";
      await handleImage(api, event, imageUrl, query);
      return;
    }

    if (args.length === 0) {
      return api.sendMessage(global.convertToGothic("Please provide a question or reply to an image."), event.threadID, event.messageID);
    }

    const query = args.join(" ");
    const userId = event.senderID;
    const apiUrl = `https://deku-rest-api.gleeze.com/api/gpt-4o?q=${encodeURIComponent(query)}&uid=${userId}`;

    try {
      const { data } = await axios.get(apiUrl);
      const formattedResponse = `🤖 | 𝗖𝗛𝗔𝗧-𝗚𝗣𝗧-𝟰𝗢
━━━━━━━━━━━━━━━━━━
${formatResponse(data.result)}
━━━━━━━━━━━━━━━━━━`;

      await api.sendMessage(formattedResponse, event.threadID, event.messageID);
      
    } catch (error) {
      await api.sendMessage(global.convertToGothic("Sorry, I couldn't get a response from GPT."), event.threadID, event.messageID);
    }
  },
};
