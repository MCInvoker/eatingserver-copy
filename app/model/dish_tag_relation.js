// app/model/dish_tag_relation.js
module.exports = app => {
    const { INTEGER, ENUM } = app.Sequelize;

    const DishTagRelation = app.model.define('dish_tag_relation', {
        dish_id: { type: INTEGER, primaryKey: true, references: { model: 'dishes', key: 'dish_id' } },
        tag_id: { type: INTEGER, primaryKey: true, references: { model: 'dish_tags', key: 'tag_id' } },
        is_deleted: { type: ENUM('1', '0'), defaultValue: '0', allowNull: false, comment: '逻辑删除标记：1=已删除，0=未删除' },
    }, {
        tableName: 'dish_tag_relations',
        timestamps: false,
    });

    return DishTagRelation;
};