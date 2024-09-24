const axios = require('axios');

module.exports = {
  name: "ai2",
  description: "Ask a question using Hercai AI API",
  prefixRequired: false,
  adminOnly: false,

  async execute(api, event, args) {
    // Join the user's input into a single string (the question)
    const question = args.join(' ');

    // Check if no question is provided
    if (!question) {
      return api.sendMessage('Please provide a question, for example: ai2 what is love?', event.threadID, event.messageID);
    }

    // Send an initial message to indicate the AI is processing
    const initialMessage = await new Promise((resolve, reject) => {
      api.sendMessage({
        body: '🤖 Ai answering...',
        mentions: [{ tag: event.senderID, id: event.senderID }],
      }, event.threadID, (err, info) => {
        if (err) return reject(err);
        resolve(info);
      }, event.messageID);
    });

    try {
      // Send a GET request to the Hercai AI API with the question as a parameter
      const response = await axios.get('https://hercai.onrender.com/v3/hercai', {
        params: { question }
      });

      // Extract the AI's response
      const aiResponse = response.data;
      const responseString = aiResponse.reply ? aiResponse.reply : 'No result found.';

      // Format the AI response in a readable format
      const formattedResponse = `
🤖 Hercai AI
━━━━━━━━━━━━━━━━━━
${responseString}
━━━━━━━━━━━━━━━━━━
-𝚆𝙰𝙶 𝙼𝙾 𝙲𝙾𝙿𝚈 𝙻𝙰𝙷𝙰𝚃 𝙽𝙶 𝚂𝙰𝙶𝙾𝚃 𝙺𝚄𝙽𝙶 𝙰𝚈𝙰𝚆 𝙼𝙾𝙽𝙶 𝙼𝙰𝙷𝙰𝙻𝙰𝚃𝙰
━━━━━━━━━━━━━━━━━━
If you want to donate for the server, just PM or Add the developer: [https://www.facebook.com/Churchill.Dev4100]
      `;

      // Edit the initial message with the formatted AI response
      await api.editMessage(formattedResponse.trim(), initialMessage.messageID);

    } catch (error) {
      console.error('Error:', error);
      // Handle any errors by notifying the user
      await api.editMessage('An error occurred, please try again later.', initialMessage.messageID);
    }
  },
};
