"use strict";
const { Controller } = require("egg");

class DishTagController extends Controller {
    // 创建菜肴标签
    async createDishTag () {
        await this.ctx.service.dishTag.createDishTag();
    }

    // 删除菜肴标签
    async deleteDishTag () {
        await this.ctx.service.dishTag.deleteDishTag();
    }

    // 修改菜肴标签
    async updateDishTag () {
        await this.ctx.service.dishTag.updateDishTag();
    }

    // 查找当前用户下所有菜肴标签菜肴标签
    async getDishTags () {
        await this.ctx.service.dishTag.getDishTags();
    }

}

module.exports = DishTagController;
