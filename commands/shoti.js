const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: "shoti",
  description: "Get a random video from the API and send it as an attachment",
  prefixRequired: false,
  adminOnly: false,

  async execute(api, event) {
    const apiUrl = `https://betadash-shoti-yazky.vercel.app/shotizxx?apikey=shipazu`;

    try {
      const downloadingMessage = global.convertToGothic("Downloading video... 📥");
      const messageID = await new Promise((resolve, reject) => {
        api.sendMessage(downloadingMessage, event.threadID, (err, info) => {
          if (err) return reject(err);
          resolve(info.messageID);
        });
      });

      const response = await axios.get(apiUrl);
      const videoUrl = response.data.shotiurl;

      if (!videoUrl) {
        return api.sendMessage(global.convertToGothic("No random video found."), event.threadID, event.messageID);
      }

      const videoPath = path.join(__dirname, 'temp_video.mp4');
      const writer = fs.createWriteStream(videoPath);

      const videoResponse = await axios({
        url: videoUrl,
        method: 'GET',
        responseType: 'stream',
      });

      videoResponse.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      await api.unsendMessage(messageID);

      const msg = {
        body: global.convertToGothic(`Here is your random shoti video:`),
        attachment: fs.createReadStream(videoPath)
      };

      await api.sendMessage(msg, event.threadID, event.messageID);

      fs.unlinkSync(videoPath);
      
    } catch (error) {
      console.error(error);
      api.sendMessage(global.convertToGothic("An error occurred while fetching or sending the video."), event.threadID, event.messageID);
    }
  },
};
