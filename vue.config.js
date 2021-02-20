const fs = require('fs')
// 配置 https
module.exports = {
    devServer: {
        port: 8443,
        https: {
            key: fs.readFileSync('./cert/server.key'),
            cert: fs.readFileSync('./cert/server.pem')
        }
    }
}