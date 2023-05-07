const readStream = require("./readStream")

const proxy = global.config.proxy //代理服务器，默认应为https://api.openai.com
const max_tokens = global.config.chat.max_tokens//会话字符限制
const url = proxy + "/v1/chat/completions"

function sendChatGPT(req, res) {
    global.ordinal = (global.ordinal + 1) % (global.config.chat.keys.length)//keys轮询
    const key = global.config.chat.keys[global.ordinal]
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + key,
        'Origin': proxy,
        'path': 'v1/chat/completions',
    }
    const req_data = JSON.parse(req.body.toString()) //提取请求体
    const data = {
        messages: req_data.messages,
        stream: true,
        max_tokens: max_tokens,
        model: "gpt-3.5-turbo",
        temperature: 1,
        presence_penalty: 0
    }
    var requestOptions = {
        method: 'POST',
        headers: headers,
        responseType: 'stream',
        body: JSON.stringify(data), // 将raw数据转为字符串并设置为请求体
    }
    readStream(url, data, requestOptions, req, res)
}
module.exports = sendChatGPT