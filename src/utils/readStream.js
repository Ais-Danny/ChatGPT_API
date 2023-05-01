const Result = require("../entity/result");
const axios = require('axios');
const split2 = require('split2');
/**
 * 流式读取代码块
 */
async function readStream(url, data, requestOptions, req, res) {
    const source = axios.CancelToken.source();
    requestOptions.cancelToken = source.token;
    res.write("")//标识开始发送
    axios.post(url, data, requestOptions).then(response => {
        // const read_Stream = response.data.pipe(split2(/\n\n/));
        // read_Stream.pipe(res)//直接转发流
        const read_Stream = response.data.pipe(split2(/\n\n/));//为流分片读取
        read_Stream.on('data', (block) => {
            try {
                var json = JSON.parse(block.toString().substring(6))//截取掉前面的"data: "
                var text = json.choices[0].delta.content.toString()
                res.write(text)
            } catch (e) {
                //防止读取不到text.choices[0].delta.content对象抛出异常
            }
        }).on('end', () => {
            res.end()//读流操作完成，结束流
        });
        req.on('close', () => {
            source.cancel("请求中断/取消")//停止向openai连接，防止内存溢出
            res.end("请求中断/取消"); // 关闭流
        });
    }).catch(function (error) {
        res.end(error.toString());
        return global.logger.error(error)
    });
}

module.exports = readStream