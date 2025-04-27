// app/model/dish_image.js
module.exports = app => {
    const { INTEGER, STRING, ENUM } = app.Sequelize;

    const DishImage = app.model.define('dish_image', {
        image_id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        dish_id: { type: INTEGER },
        url: { type: STRING(255), allowNull: false },
        width: { type: INTEGER },
        height: { type: INTEGER },
        is_deleted: { type: ENUM('1', '0'), defaultValue: '0', allowNull: false, comment: '逻辑删除标记：1=已删除，0=未删除' },
    }, {
        tableName: 'dish_images',
        timestamps: false,
    });

    DishImage.associate = function () {
        const { Dish } = app.model;

        // 菜肴与菜肴图片一对多关系
        DishImage.belongsTo(Dish, { foreignKey: 'dish_id' });
    };

    return DishImage;
};