// app/model/follow.js
module.exports = app => {
    const { INTEGER, DATE, ENUM } = app.Sequelize;

    const Follow = app.model.define('follow', {
        follower_id: { type: INTEGER, primaryKey: true }, // 粉丝id
        following_id: { type: INTEGER, primaryKey: true }, // 被关注者
        created_at: { type: DATE, defaultValue: app.Sequelize.NOW },
        is_deleted: { type: ENUM('1', '0'), defaultValue: '0', allowNull: false, comment: '逻辑删除标记：1=已删除，0=未删除' },
    }, {
        tableName: 'follows',
        timestamps: false,
    });

    Follow.associate = function () {
        const { User } = app.model;

        // 定义粉丝与用户的关联
        Follow.belongsTo(User, {
            foreignKey: 'follower_id',
            as: 'follower', // 关联别名
        });

        // 定义被关注者与用户的关联
        Follow.belongsTo(User, {
            foreignKey: 'following_id',
            as: 'following', // 关联别名
        });
    }




    return Follow;
};