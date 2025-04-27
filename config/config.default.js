/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
    /**
     * built-in config
     * @type {Egg.EggAppConfig}
     **/
    const config = exports = {};

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + 'xxxx';

    // add your middleware config here
    config.middleware = ["user"];

    config.security = {
        csrf: {
            enable: false,
            ignoreJSON: true,
        },
        domainWhiteList: ["http://localhost:3000"],
    };

    config.cors = {
        origin: "*",
        allowMethods: "GET,HEAD,PUT,POST,DELETE,PATCH",
    };

    config.jwt = {
        secret: "xxxxx",
    };

    config.sequelize = {
        dialect: "mysql", // 数据库类型，这里假设使用 MySQL
        host: "localhost",
        port: 3306,
        database: "xxx", // 替换为实际的数据库名
        username: "xxx", // 替换为实际的数据库用户名
        password: "xxx", // 替换为实际的数据库密码
        timezone: '+08:00', // 时区设置
        define: {
            freezeTableName: true, // 不自动将表名转为复数形式
            underscored: true, // 使用下划线命名法
            paranoid: true, // 开启软删除
        },
    };

    config.redis = {
        client: {
            port: 6379, // Redis port
            host: "127.0.0.1", // Redis host
            password: "auth",
            db: 0,
        },
    };

    // add your user config here
    const userConfig = {
        // myAppName: 'egg',
    };

    return {
        ...config,
        ...userConfig,
    };
};
