const express = require('express');
const sendChatGPT = require('../utils/sendChatGPT');
const interceptor=require('../utils/interceptor')
const router = express.Router();

router.post('/chat', (req, res)=> {
  if(interceptor(req,res)){//过滤器
    res.writeHead(200, {//设置流式响应头
      'Content-Type': 'text/plain',
      'Transfer-Encoding': 'chunked',
    });
    sendChatGPT(req,res)
  }
});

module.exports = router;