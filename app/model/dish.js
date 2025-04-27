// app/model/dish.js
module.exports = app => {
    const { INTEGER, STRING, DECIMAL, ENUM, DATE } = app.Sequelize;

    const Dish = app.model.define('dish', {
        dish_id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        user_id: { type: INTEGER },
        name: { type: STRING(255), allowNull: false },
        description: { type: STRING(255) },
        price: { type: DECIMAL(10, 2) },
        is_disclosure: { type: ENUM('1', '0'), defaultValue: '1' },
        is_deleted: { type: ENUM('1', '0'), defaultValue: '0' },
        created_at: { type: DATE, defaultValue: app.Sequelize.NOW },
        updated_at: { type: DATE, defaultValue: app.Sequelize.NOW, onUpdate: app.Sequelize.NOW },
    }, {
        tableName: 'dishes',
        timestamps: false,
    });

    Dish.associate = function () {
        const { User, DishImage, DishCategory, DishTag, DishCategoryRelation, DishTagRelation, OrderDishDetail } = app.model;
        // 菜肴与用户的关系
        Dish.belongsTo(User, { foreignKey: 'user_id' });

        // 菜肴与菜肴图片一对多关系
        Dish.hasMany(DishImage, { foreignKey: 'dish_id' });

        // 菜肴与菜肴分类的多对多关系
        Dish.belongsToMany(DishCategory, { through: DishCategoryRelation, foreignKey: 'category_id' });
        DishCategory.belongsToMany(Dish, { through: DishCategoryRelation, foreignKey: 'dish_id' });

        // 菜肴与菜肴标签的多对多关系
        Dish.belongsToMany(DishTag, { through: DishTagRelation, foreignKey: 'tag_id' });
        DishTag.belongsToMany(Dish, { through: DishTagRelation, foreignKey: 'dish_id' });

        // 菜肴与订单菜肴详情的关系
        Dish.hasMany(OrderDishDetail, { foreignKey: 'dish_id' });
    };

    return Dish;
};