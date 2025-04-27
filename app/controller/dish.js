"use strict";
const { Controller } = require("egg");

class DishController extends Controller {
    // 创建菜肴
    async createDish () {
        await this.ctx.service.dish.createDish();
    }

    // 删除菜肴
    async deleteDish () {
        await this.ctx.service.dish.deleteDish();
    }

    // 修改菜肴
    async updateDish () {
        await this.ctx.service.dish.updateDish();
    }

    // 查找当前用户下所有菜肴
    async getDishes () {
        await this.ctx.service.dish.getDishes();
    }

    async getDishesByUserId () {
        await this.ctx.service.dish.getDishesByUserId();
    }

    // 修改菜肴展示隐藏，隐藏时不可以在点餐页面看到
    async disclosureDish () {
        await this.ctx.service.dish.disclosureDish();
    }
}

module.exports = DishController;
