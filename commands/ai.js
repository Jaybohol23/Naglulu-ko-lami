const axios = require('axios');

async function fetchAIResponse(query) {
  const apiUrl = `https://betadash-api-swordslush.vercel.app/gpt?ask=${encodeURIComponent(query)}`;
  try {
    const response = await axios.get(apiUrl);
    return response.data;
  } catch (error) {
    console.error('Error fetching AI response:', error);
    return "Sorry, I couldn't get a response from the AI.";
  }
}

module.exports = {
  name: "ai",
  description: "Ask the AI any question you like.",
  prefixRequired: false,
  adminOnly: false,
  async execute(api, event, args) {
    await api.sendMessage(global.convertToGothic("Answering plss wait..."), event.threadID, event.messageID);

    if (args.length === 0) {
      return api.sendMessage(global.convertToGothic("Please provide a question."), event.threadID, event.messageID);
    }

    const query = args.join(" ");
    const aiResponse = await fetchAIResponse(query);

    const formattedResponse = `🧩 | 𝘾𝙝𝙞𝙡𝙡𝙞 𝙂𝙥𝙩
━━━━━━━━━━━━━━━━━━
${global.convertToGothic(aiResponse)}
━━━━━━━━━━━━━━━━━━`;

    await api.sendMessage(formattedResponse, event.threadID, event.messageID);
  },
};
