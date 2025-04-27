// app/model/order_dish_detail.js
module.exports = app => {
    const { INTEGER, STRING, ENUM } = app.Sequelize;

    const OrderDishDetail = app.model.define('order_dish_detail', {
        detail_id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        order_id: { type: INTEGER },
        dish_id: { type: INTEGER },
        quantity: { type: INTEGER, allowNull: false },
        note: { type: STRING(255) },
        is_deleted: { type: ENUM('1', '0'), defaultValue: '0', allowNull: false, comment: '逻辑删除标记：1=已删除，0=未删除' },
    }, {
        tableName: 'order_dish_details',
        timestamps: false,
    });

    OrderDishDetail.associate = function () {
        const { Order, Dish } = app.model;

        // 订单菜肴详情与订单的关系
        OrderDishDetail.belongsTo(Order, { foreignKey: 'order_id' });

        // 订单菜肴详情与菜肴的关系
        OrderDishDetail.belongsTo(Dish, { foreignKey: 'dish_id' });
    };

    return OrderDishDetail;
};