var express = require('express');
const sendChatGPT = require('../src/utils/sendChatGPT');
var router = express.Router();

router.post('/chat', (req, res)=> {
  res.writeHead(200, {//设置流式响应头
    'Content-Type': 'text/plain',
    'Transfer-Encoding': 'chunked',
  });
  
  sendChatGPT(req,res)
});

module.exports = router;