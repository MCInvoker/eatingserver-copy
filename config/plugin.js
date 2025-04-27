/** @type Egg.EggPlugin */
module.exports = {
    // had enabled by egg
    // static: {
    //   enable: true,
    // }
    sequelize: {
        enable: true,
        package: "egg-sequelize",
    },
    cors: {
        enable: true,
        package: "egg-cors",
    },
    redis: {
        enable: true,
        package: "egg-redis",
    },
    jwt: {
        enable: true,
        package: "egg-jwt",
    },
};
