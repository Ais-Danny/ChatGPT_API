const Result = require("../entity/result");

/**
 * 路由拦截器
 */
const authInterceptor = function (req, res, next) {
    let token = req.headers['Authorization']
    try {
        let result = jwt.verify(token, global.config.private_key)
        console.log('验证结果', result);
    } catch (e) {
        res.send(new Result("校验失败,禁止访问", 403, false));
        global.logger.warn(" 403,未授权的请求, ip "+req.ip+",Authorization:" + req.headers['Authorization']);
    }
}

module.exports = authInterceptor