exports.settings = {
    "status_message": "I'm a chatbot!",
    "client": {
        "jid": "aion.chatbot@gmail.com",
        "password": "aionchat",
        "host": "talk.google.com",
        "port": 5222,
        "reconnect": true
    },
    "allow_auto_subscribe": true,
    "command_argument_separator": /\s*\;\s*/,
    "herokuUrl": process.env.heroku_url || ""
};
