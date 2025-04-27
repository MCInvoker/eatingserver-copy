// app/service/dishCategory.js
const Service = require('egg').Service;
import { check403 } from "../utils/errorMessage";

class DishCategoryService extends Service {
    async createDishCategory () {
        const { ctx } = this;
        const { name, description } = ctx.request.body;
        const user_id = ctx.user.user_id;
        const dishCategory = await ctx.model.DishCategory.create({
            user_id,
            name,
            description
        })
        // 返回插入结果
        ctx.body = {
            success: true,
            data: dishCategory,
        };
    }

    // 删除分类， todo，还有删除相对应的关联关系
    async deleteDishCategory () {
        const { ctx } = this;
        const { category_id } = ctx.params;
        const dishCategory = await ctx.model.DishCategory.findByPk(category_id);
        if (!dishCategory) {
            ctx.status = 404;
            ctx.body = { error: "dishCategory not found" };
            return;
        }
        if (!check403(ctx, dishCategory.user_id)) {
            return
        }
        await dishCategory.update({ is_deleted: '1' });
        ctx.body = {
            success: true,
            data: dishCategory,
        };
    }

    async updateDishCategory () {
        const { ctx } = this;
        const { category_id } = ctx.params;
        const { name, description } = ctx.request.body;
        const dishCategory = await ctx.model.DishCategory.findByPk(category_id);
        if (!dishCategory) {
            ctx.status = 404;
            ctx.body = { error: "dishCategory not found" };
            return;
        }
        if (!check403(ctx, dishCategory.user_id)) {
            return;
        }
        await dishCategory.update({
            name,
            description
        })
        ctx.body = {
            success: true,
            data: dishCategory,
        };
    }

    async getDishCategories () {
        const { ctx } = this;
        const dishCategories = await this.ctx.model.DishCategory.findAll({
            where: {
                user_id: ctx.user.user_id,
                is_deleted: '0'
            },
        });
        ctx.body = {
            success: true,
            data: dishCategories,
        };
    }
}

module.exports = DishCategoryService;