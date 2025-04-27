// app/model/user.js
module.exports = app => {
    const { INTEGER, STRING, ENUM, DATE, BOOLEAN } = app.Sequelize;

    const User = app.model.define('user', {
        user_id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        username: { type: STRING(255), unique: true, defaultValue: null },
        password: { type: STRING(255), defaultValue: null },
        email: { type: STRING(255), unique: true, defaultValue: null },
        nickname: { type: STRING(255) },
        avatar: { type: STRING(255) },
        title: { type: STRING(255) },
        created_at: { type: DATE, defaultValue: app.Sequelize.NOW },
        updated_at: { type: DATE, defaultValue: app.Sequelize.NOW, onUpdate: app.Sequelize.NOW },
        openid: { type: STRING(255), unique: true, allowNull: false },
        user_code: { type: INTEGER, unique: true },
        is_deleted: { type: ENUM('1', '0'), defaultValue: '0', allowNull: false, comment: '逻辑删除标记：1=已删除，0=未删除' },
        subscribe_order_notify: { 
            type: BOOLEAN, 
            defaultValue: false,
            allowNull: false,
            comment: '是否订阅新订单提醒'
        },
    }, {
        tableName: 'users',
        timestamps: false,
    });

    User.associate = function () {
        const { Dish, Follow, DishTag, DishCategory, Order } = app.model;
        // 用户与菜肴一对多关系
        User.hasMany(Dish, { foreignKey: 'user_id' });

        // 用户与菜肴标签一对多关系
        User.hasMany(DishTag, { foreignKey: 'user_id' });

        // 用户与菜肴分类一对多关系
        User.hasMany(DishCategory, { foreignKey: 'user_id' });

        // 用户关注的多对多关系
        User.hasMany(Follow, { foreignKey: 'following_id', as: 'followers' });
        User.hasMany(Follow, { foreignKey: 'follower_id', as: 'Following' });

        // 用户和订单一对多关系
        User.hasMany(Order, { foreignKey: 'customer_id', as: 'Orders' })
        User.hasMany(Order, { foreignKey: 'chef_id', as: 'CustomerOrders' })
    };

    return User;
};