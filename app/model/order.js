// app/model/order.js
module.exports = app => {
    const { INTEGER, STRING, ENUM, DATE } = app.Sequelize;

    const Order = app.model.define('order', {
        order_id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        customer_id: { type: INTEGER },
        chef_id: { type: INTEGER },
        status: { type: ENUM('1', '2', '3', '4', '5'), allowNull: false },
        note: { type: STRING(255) },
        created_at: { type: DATE, defaultValue: app.Sequelize.NOW },
        updated_at: { type: DATE, defaultValue: app.Sequelize.NOW, onUpdate: app.Sequelize.NOW },
        is_deleted: { type: ENUM('1', '0'), defaultValue: '0', allowNull: false, comment: '逻辑删除标记：1=已删除，0=未删除' },
    }, {
        tableName: 'orders',
        timestamps: false,
    });

    Order.associate = function () {
        const { OrderDishDetail, User } = app.model;

        // 订单与订单菜肴详情的关系
        Order.belongsTo(User, { as: 'Chef', foreignKey: "chef_id" });
        Order.belongsTo(User, { as: 'Customer', foreignKey: "customer_id" });
        Order.hasMany(OrderDishDetail, { foreignKey: 'order_id' });
    };

    return Order;
};