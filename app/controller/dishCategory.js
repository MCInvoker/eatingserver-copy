"use strict";
const { Controller } = require("egg");

class DishCategoryController extends Controller {
    // 创建菜肴分类
    async createDishCategory () {
        await this.ctx.service.dishCategory.createDishCategory();
    }

    // 删除菜肴分类
    async deleteDishCategory () {
        await this.ctx.service.dishCategory.deleteDishCategory();
    }

    // 修改菜肴分类
    async updateDishCategory () {
        await this.ctx.service.dishCategory.updateDishCategory();
    }

    // 查找当前用户下所有菜肴分类
    async getDishCategories () {
        await this.ctx.service.dishCategory.getDishCategories();
    }

}

module.exports = DishCategoryController;
