module.exports = {
    name: "ping",
    description: "Check latency.",
    prefixRequired: false,
    adminOnly: false,
    async execute(api, event, args) {
        const { threadID, messageID } = event;
        api.sendMessage(global.convertToGothic("Calculating ping, please wait..."), threadID, messageID);

        const startTime = Date.now();
        const latency = Date.now() - startTime;

        api.sendMessage(global.convertToGothic(`Ping: ${latency}ms`), threadID, messageID);
    },
};
