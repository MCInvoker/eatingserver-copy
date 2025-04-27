// app/model/dish_category.js
module.exports = app => {
    const { INTEGER, STRING, ENUM, DATE } = app.Sequelize;

    const DishCategory = app.model.define('dish_category', {
        category_id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        user_id: { type: INTEGER },
        name: { type: STRING(255), allowNull: false },
        description: { type: STRING(255) },
        created_at: { type: DATE, defaultValue: app.Sequelize.NOW },
        updated_at: { type: DATE, defaultValue: app.Sequelize.NOW, onUpdate: app.Sequelize.NOW },
        is_deleted: { type: ENUM('1', '0'), defaultValue: '0', allowNull: false, comment: '逻辑删除标记：1=已删除，0=未删除' },
    }, {
        tableName: 'dish_categories',
        timestamps: false,
    });

    DishCategory.associate = function () {
        const { Dish, DishCategoryRelation } = app.model;

        // 菜肴与菜肴分类的多对多关系
        Dish.belongsToMany(DishCategory, { through: DishCategoryRelation, foreignKey: 'dish_id' });
        DishCategory.belongsToMany(Dish, { through: DishCategoryRelation, foreignKey: 'category_id' });
    };

    return DishCategory;
};