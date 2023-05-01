const fs = require('fs');
const authInterceptor = require('./utils/interceptor');
const bodyParser = require('body-parser');
const cors = require('cors');//跨域中间件
require('./utils/logs')//启动日志系统

fs.readFile('config.json', 'utf8', (err, data) => {//加载环境变量
    if (err) {
        global.logger.error(err)
        throw err
    };
    global.config = JSON.parse(data);
    init()
});

function init() {
    routes_init()//初始化路由
}

function routes_init() {
    let express = require('express')
    const app = express()
    app.use(bodyParser.raw({ type: 'application/json' }));//格式化请求体(方便后续读取请求体)

    app.use(cors());//允许跨域

    app.use("/", require('../routes/index'))//导入默认一级路由

    app.use('/api',
        // authInterceptor,//校验请求头,DEV测试
        require('../routes/chat'))

    app.listen(global.config.port, function () {
        global.logger.info("路由启动成功");
    })
}