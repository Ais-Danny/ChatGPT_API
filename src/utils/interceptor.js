const Result = require("../entity/result");
const jwt = require('jsonwebtoken');
/**
 * 路由拦截器
 */
function authInterceptor(req, res) {
    let token = req.headers['authorization']
    let clientIP = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.ip;
    try {
        let result = jwt.verify(token, global.config.private_key)
        console.log('验证结果', result);
        return true;
    } catch (e) {
        res.send(new Result("校验失败,禁止访问", 403, false));
        global.logger.warn(" 403,未授权的请求, ip :"+clientIP+",Authorization:" + req.headers['authorization']);
        return false;
    }
}

module.exports = authInterceptor