var express = require('express');
const Result = require('../entity/result');
const axios = require('axios')
const jwt = require('jsonwebtoken');
var router = express.Router();

/* 一级路由. */
router.get('/', (req, res) => {
  res.send(new Result("启动成功"))
});

//创建token
router.post('/creatToken', async (req, res) => {
  let code = req.headers['js_code']
  if (req.headers['js_code'] == null) {
    global.logger.warn(` 403,无效code,禁止生成token, ip: ${req.ip}`)
    res.send(new Result("无效code,禁止生成token", 403, false))
    return
  }
  const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${global.config.appId}&secret=${global.config.appSecret}&js_code=${code}&grant_type=authorization_code`
  let result = await axios.get(url)
  const userinfo = result.data
  if (userinfo.session_key != null && userinfo.openid != null) {//判断code是否有效
    const token = jwt.sign({ userinfo }, global.config.private_key, { expiresIn: global.config.chat.token_live_time })
    res.send(new Result(token))
    global.logger.warn(`生成新token, ip: ${req.ip} ,openid: ${userinfo.openid}`)
  } else {
    global.logger.warn(` 403,无效code,禁止生成token, ip: ${req.ip}`)
    res.send(new Result("无效code,禁止生成token", 403, false))
  }
});

module.exports = router;