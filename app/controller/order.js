"use strict";
const { Controller } = require("egg");

class OrderController extends Controller {
    // 创建菜肴
    async createOrder () {
        await this.ctx.service.order.createOrder();
    }
    // 我的订单列表
    async getMyOrders () {
        await this.ctx.service.order.getMyOrders();
    }
    // 我的点餐记录
    async getMyOrderHistory () {
        await this.ctx.service.order.getMyOrderHistory();
    }

    // 获取订单详情
    async getOrderDetail() {
        const { ctx } = this;
        const { orderId } = ctx.params;
        await ctx.service.order.getOrderDetail(orderId);
    }
}

module.exports = OrderController;
