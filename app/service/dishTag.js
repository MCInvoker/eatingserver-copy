// app/service/dishTag.js
const Service = require('egg').Service;
import { check403 } from "../utils/errorMessage";

class DishTagService extends Service {
    async createDishTag () {
        const { ctx } = this;
        const { name, description } = ctx.request.body;
        const user_id = ctx.user.user_id;
        const dishTag = await ctx.model.DishTag.create({
            user_id,
            name,
            description
        })
        // 返回插入结果
        ctx.body = {
            success: true,
            data: dishTag,
        };
    }

    // 删除标签， todo，还有删除相对应的关联关系
    async deleteDishTag () {
        const { ctx } = this;
        const { tag_id } = ctx.params;
        const dishTag = await ctx.model.DishTag.findByPk(tag_id);
        if (!dishTag) {
            ctx.status = 404;
            ctx.body = { error: "dishTag not found" };
            return;
        }
        if (!check403(ctx, dishTag.user_id)) {
            return
        }
        await dishTag.update({ is_deleted: '1' });
        ctx.body = {
            success: true,
            data: dishTag,
        };
    }

    async updateDishTag () {
        const { ctx } = this;
        const { tag_id } = ctx.params;
        const { name, description } = ctx.request.body;
        const dishTag = await ctx.model.DishTag.findByPk(tag_id);
        if (!dishTag) {
            ctx.status = 404;
            ctx.body = { error: "dishTag not found" };
            return;
        }
        if (!check403(ctx, dishTag.user_id)) {
            return;
        }
        await dishTag.update({
            name,
            description
        })
        ctx.body = {
            success: true,
            data: dishTag,
        };
    }

    async getDishTags () {
        const { ctx } = this;
        const dishTags = await this.ctx.model.DishTag.findAll({
            where: {
                user_id: ctx.user.user_id,
                is_deleted: '0'
            },
        });
        ctx.body = {
            success: true,
            data: dishTags,
        };
    }
}

module.exports = DishTagService;