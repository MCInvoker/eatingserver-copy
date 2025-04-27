// app/model/dish_tag.js
module.exports = app => {
    const { INTEGER, STRING, ENUM, DATE } = app.Sequelize;

    const DishTag = app.model.define('dish_tag', {
        tag_id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        user_id: { type: INTEGER },
        name: { type: STRING(255), allowNull: false },
        description: { type: STRING(255) },
        created_at: { type: DATE, defaultValue: app.Sequelize.NOW },
        updated_at: { type: DATE, defaultValue: app.Sequelize.NOW, onUpdate: app.Sequelize.NOW },
        is_deleted: { type: ENUM('1', '0'), defaultValue: '0', allowNull: false, comment: '逻辑删除标记：1=已删除，0=未删除' },
    }, {
        tableName: 'dish_tags',
        timestamps: false,
    });

    DishTag.associate = function () {
        const { Dish, DishTagRelation } = app.model;

        // 菜肴与菜肴标签的多对多关系
        Dish.belongsToMany(DishTag, { through: DishTagRelation, foreignKey: 'dish_id' });
        DishTag.belongsToMany(Dish, { through: DishTagRelation, foreignKey: 'tag_id' });
    };

    return DishTag;
};