// app/service/dish.js
const Service = require('egg').Service;
import { check403 } from "../utils/errorMessage";

class DishService extends Service {
    async createDish () {
        const { ctx } = this;
        const { name, description, is_disclosure, categories, tags, images } = ctx.request.body;
        const user_id = ctx.user.user_id;
        try {
            const dish = await ctx.model.Dish.create({
                user_id,
                name,
                description,
                is_disclosure,
                is_deleted: '0',
            })

            // 保存菜肴图片
            if (images && images.length > 0) {
                for (const image of images) {
                    await ctx.model.DishImage.create({
                        dish_id: dish.dish_id,
                        url: image.url,
                        is_deleted: '0',
                        width: image.width || 1,
                        height: image.height || 1,
                    });
                }
            }

            // 保存菜肴分类
            if (categories && categories.length > 0) {
                for (const categoryId of categories) {
                    await ctx.model.DishCategoryRelation.create({
                        dish_id: dish.dish_id,
                        category_id: categoryId,
                        is_deleted: '0',
                    });
                }
            }

            // 保存菜肴标签
            if (tags && tags.length > 0) {
                for (const tagId of tags) {
                    await ctx.model.DishTagRelation.create({
                        dish_id: dish.dish_id,
                        tag_id: tagId,
                        is_deleted: '0',
                    });
                }
            }

            // 返回插入结果
            ctx.body = {
                success: true,
                data: dish,
            };
        } catch (error) {

            ctx.body = {
                success: false,
                message: "Failed to create dish.",
                error: error.message,
            };
        }

    }

    // 删除标签， todo，还有删除相对应的关联关系
    async deleteDish () {
        const { ctx } = this;
        const { dish_id } = ctx.params;
        const dish = await ctx.model.Dish.findByPk(dish_id);
        if (!dish) {
            ctx.status = 404;
            ctx.body = { error: "dish not found" };
            return;
        }
        if (!check403(ctx, dish.user_id)) {
            return
        }
        await dish.update({ is_deleted: '1' });
        ctx.body = {
            success: true,
            data: dish,
        };
    }

    async updateDish () {
        const { ctx } = this;
        const { dish_id } = ctx.params;
        // 从请求体中提取数据
        const { name, description, is_disclosure, categories, tags, images } = ctx.request.body;

        try {
            // 查找并更新菜肴
            const dish = await ctx.model.Dish.findByPk(dish_id);
            if (!dish) {
                ctx.status = 404;
                ctx.body = {
                    message: 'Dish not found.',
                };
                return;
            }

            if (!check403(ctx, dish.user_id)) {
                return;
            }

            // 更新菜肴基本信息
            dish.name = name || dish.name;
            dish.description = description || dish.description;
            dish.is_disclosure = is_disclosure || dish.is_disclosure;
            await dish.save();

            // 更新或插入菜肴图片
            if (images && images.length > 0) {
                // 删除旧的图片
                await ctx.model.DishImage.destroy({
                    where: {
                        dish_id,
                        is_deleted: '0',
                    },
                });

                // 插入新的图片
                for (const image of images) {
                    await ctx.model.DishImage.create({
                        dish_id,
                        url: image.url,
                        is_deleted: '0',
                        width: image.width || 1,
                        height: image.height || 1,
                    });
                }
            }

            // 更新或插入菜肴分类
            if (categories && categories.length > 0) {
                // 删除旧的分类关联
                await ctx.model.DishCategoryRelation.destroy({
                    where: {
                        dish_id,
                        is_deleted: '0',
                    },
                });

                // 插入新的分类关联
                for (const categoryId of categories) {
                    await ctx.model.DishCategoryRelation.create({
                        dish_id,
                        category_id: categoryId,
                        is_deleted: '0',
                    });
                }
            }

            // 更新或插入菜肴标签
            if (tags && tags.length > 0) {
                // 删除旧的标签关联
                await ctx.model.DishTagRelation.destroy({
                    where: {
                        dish_id,
                        is_deleted: '0',
                    },
                });

                // 插入新的标签关联
                for (const tagId of tags) {
                    await ctx.model.DishTagRelation.create({
                        dish_id,
                        tag_id: tagId,
                        is_deleted: '0',
                    });
                }
            }

            ctx.body = {
                success: true,
                data: dish,
            };
        } catch (error) {

            ctx.body = {
                success: false,
                message: "Failed to update dish.",
                error: error.message,
            };
        }
        // const { name, description } = ctx.request.body;
        // const dish = await ctx.model.Dish.findByPk(dish_id);
        // if (!dish) {
        //     ctx.status = 404;
        //     ctx.body = { error: "dish not found" };
        //     return;
        // }
        // if (!check403(ctx, dish.user_id)) {
        //     return;
        // }
        // await dish.update({
        //     name,
        //     description
        // })
        // ctx.body = {
        //     success: true,
        //     data: dish,
        // };
    }

    // 获取当前用户下所有菜肴
    async getDishes () {
        const { ctx } = this;
        const searchName = ctx.query.name || '';
        const dish_id = ctx.query.id || null;
        // 构建动态的查询条件
        const whereConditions = {
            user_id: ctx.user.user_id,
            is_deleted: '0',
            // 模糊搜索
            name: { [this.ctx.model.Sequelize.Op.like]: `%${searchName}%` },
        };
        // 如果传入了 dish_id，则添加到查询条件中
        if (dish_id !== null) {
            whereConditions.dish_id = dish_id;
        }
        const dishes = await this.ctx.model.Dish.findAll({
            where: whereConditions,
            include: [
                {
                    model: ctx.model.DishImage,
                    attributes: ['url', 'width', 'height'], // 需要返回的字段
                    where: { is_deleted: '0' },
                    required: false, // 即使没有匹配的 DishImage 也要返回结果
                },
                {
                    model: ctx.model.DishCategory,
                    where: { is_deleted: '0' },
                    through: { attributes: [] }, // 不包含关联表中的字段
                    required: false, // 即使没有匹配的 DishCategory 也要返回结果
                },
                {
                    model: ctx.model.DishTag,
                    where: { is_deleted: '0' },
                    through: { attributes: [] }, // 不包含关联表中的字段
                    required: false, // 即使没有匹配的 DishTag 也要返回结果
                },
            ],
        });
        ctx.body = {
            success: true,
            data: dishes,
        };
    }

    // 获取指定用户下菜肴，进行点餐，所以删除的、隐藏的数据不要返回
    async getDishesByUserId () {
        const { ctx } = this;
        const searchName = ctx.query.name || '';
        const userId = ctx.query.userId;
        const dishes = await this.ctx.model.Dish.findAll({
            where: {
                user_id: userId,
                is_deleted: '0',
                is_disclosure: '1',
                name: { [this.ctx.model.Sequelize.Op.like]: `%${searchName}%` },
            },
            include: [
                {
                    model: ctx.model.DishImage,
                    attributes: ['url', 'width', 'height'], // 需要返回的字段
                    where: { is_deleted: '0' },
                    required: false, // 即使没有匹配的 DishImage 也要返回结果
                },
                {
                    model: ctx.model.DishCategory,
                    where: { is_deleted: '0' },
                    required: false, // 即使没有匹配的 DishCategory 也要返回结果
                },
                {
                    model: ctx.model.DishTag,
                    where: { is_deleted: '0' },
                    required: false, // 即使没有匹配的 DishTag 也要返回结果
                },
            ],
        });
        ctx.body = {
            success: true,
            data: dishes,
        };
    }

    async disclosureDish () {
        const { ctx } = this;
        const { dish_id } = ctx.params;
        const { is_disclosure } = ctx.request.body;
        const dish = await ctx.model.Dish.findByPk(dish_id);
        if (!dish) {
            ctx.status = 404;
            ctx.body = { error: "dish not found" };
            return;
        }
        if (!check403(ctx, dish.user_id)) {
            return
        }
        await dish.update({ is_disclosure: is_disclosure });
        ctx.body = {
            success: true,
            data: dish,
        };
    }
}

module.exports = DishService;