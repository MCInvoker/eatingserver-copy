// app/model/dish_category_relation.js
module.exports = app => {
    const { INTEGER, ENUM } = app.Sequelize;

    const DishCategoryRelation = app.model.define('dish_category_relation', {
        dish_id: { type: INTEGER, primaryKey: true, references: { model: 'dishes', key: 'dish_id' } },
        category_id: { type: INTEGER, primaryKey: true, references: { model: 'dish_categories', key: 'category_id' } },
        is_deleted: { type: ENUM('1', '0'), defaultValue: '0', allowNull: false, comment: '逻辑删除标记：1=已删除，0=未删除' },
    }, {
        tableName: 'dish_category_relations',
        timestamps: false,
    });

    return DishCategoryRelation;
};