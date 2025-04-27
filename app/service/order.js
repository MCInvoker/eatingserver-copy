// app/service/order.js
const Service = require('egg').Service;
const Op = require('sequelize').Op;
const dayjs = require('dayjs');
// import { check403 } from "../utils/errorMessage";

class OrderService extends Service {
    // 点餐
    async createOrder () {
        const { ctx, app } = this;

        // 从请求体中提取数据
        const { dishes, chef_id, note = '' } = ctx.request.body;

        try {
            // 确认当前用户 ID
            const customer_id = ctx.user.user_id; // 顾客id， 自己点餐，自己是顾客

            // 创建订单
            const newOrder = await ctx.model.Order.create({
                customer_id,
                chef_id,
                note,
                status: '1', // 假设状态1表示新创建的订单
                is_deleted: '0',
            });

            // 处理菜品详情
            const orderDishDetails = dishes.map(dish => ({
                order_id: newOrder.order_id,
                dish_id: dish.dish_id,
                quantity: dish.quantity,
                note: dish.note || null,
                is_deleted: '0',
            }));

            // 批量创建订单菜品详情
            await ctx.model.OrderDishDetail.bulkCreate(orderDishDetails);

            // 获取顾客信息
            const customer = await ctx.model.User.findOne({
                where: {
                    user_id: customer_id,
                },
            });

            // 获取厨师信息
            const chef = await ctx.model.User.findOne({
                where: {
                    user_id: chef_id,
                },
                attributes: ['openid', 'subscribe_order_notify', 'user_id'],
            });

            const thing6 = dishes.map(dish => {
                return dish.quantity === 1 ? dish.name : `${dish.name}x${dish.quantity}`
            }).join(',');

            const date4 = dayjs(newOrder.created_at).format('YYYY-MM-DD HH:mm:ss');
            // 发送订阅消息
            const sendStatus = await ctx.service.wx.sendSubscribeMessage(chef.openid, {
                name3: customer.nickname,
                thing6,
                date4: date4,
                thing5: newOrder.note
            }, chef.user_id);

            ctx.body = {
                success: true,
                data: {
                    orderId: newOrder.order_id,
                    sendStatus,
                },
            };
        } catch (error) {
            ctx.status = 500;
            ctx.body = {
                success: false,
                message: '下单失败',
            };
        }
    }

    // 我的订单列表
    async getMyOrders () {
        const { ctx } = this;

        // 从请求参数中提取分页信息
        let page = 1;
        let pageSize = 10;
        if (ctx.query.page) {
            page = Number(ctx.query.page)
        }
        if (ctx.query.pageSize) {
            pageSize = Number(ctx.query.pageSize)
        }
        const offset = (page - 1) * pageSize;

        // 获取当前用户 ID
        const chef_id = ctx.user.user_id;

        try {
            // 获取订单总数
            const totalCount = await this.ctx.model.Order.count({
                where: {
                    chef_id,
                    is_deleted: '0',
                },
            });
            // 查询我的订单列表
            const orders = await this.ctx.model.Order.findAll({
                where: {
                    chef_id,
                    is_deleted: '0',
                },
                include: [
                    {
                        model: this.ctx.model.OrderDishDetail,
                        include: [{ model: this.ctx.model.Dish }],
                    },
                    {
                        model: this.ctx.model.User, // 关联用户模型
                        as: 'Customer', // 给关联起一个别名
                        foreignKey: 'customer_id', // 指定外键
                        attributes: ['user_id', 'nickname', 'avatar'],
                    },
                ],
                limit: pageSize,
                offset,
                order: [['created_at', 'DESC']],
            });

            const totalPages = Math.ceil(totalCount / pageSize);

            ctx.status = 200;
            ctx.body = {
                success: true,
                data: {
                    orders: orders,
                    currentPage: page,
                    totalPages,
                },
            };
        } catch (error) {
            ctx.status = 500;
            ctx.body = {
                success: false,
                message: 'Failed to fetch orders.',
                error: error.message,
            };
        }
    }

    // 我的点餐记录
    async getMyOrderHistory () {
        const { ctx } = this;

        // 从请求参数中提取分页信息
        let page = 1;
        let pageSize = 10;
        if (ctx.query.page) {
            page = Number(ctx.query.page)
        }
        if (ctx.query.pageSize) {
            pageSize = Number(ctx.query.pageSize)
        }
        const offset = (page - 1) * pageSize;

        // 获取当前用户 ID
        const customer_id = ctx.user.user_id;

        // 提取起始时间和结束时间戳（如果提供）
        const startTimeStamp = ctx.query.startTime ? Number(ctx.query.startTime) : null;
        const endTimeStamp = ctx.query.endTime ? Number(ctx.query.endTime) : null;

        // 将时间戳转换为 Date 对象
        const startTime = startTimeStamp ? new Date(startTimeStamp) : null;
        const endTime = endTimeStamp ? new Date(endTimeStamp) : null;

        try {
            // 构建查询条件
            const whereConditions = {
                customer_id,
                is_deleted: '0',
            };

            if (startTime && endTime) {
                whereConditions.created_at = {
                    [Op.between]: [startTime, endTime],
                };
            } else if (startTime) {
                whereConditions.created_at = {
                    [Op.gte]: startTime,
                };
            } else if (endTime) {
                whereConditions.created_at = {
                    [Op.lte]: endTime,
                };
            }

            // 获取订单总数
            const totalCount = await this.ctx.model.Order.count({
                where: whereConditions,
            });

            // 查询我的订单列表
            const orders = await this.ctx.model.Order.findAll({
                where: whereConditions,
                include: [
                    {
                        model: this.ctx.model.OrderDishDetail,
                        include: [{ model: this.ctx.model.Dish }],
                    },
                    {
                        model: this.ctx.model.User, // 关联用户模型
                        as: 'Chef', // 给关联起一个别名
                        foreignKey: 'chef_id', // 指定外键
                        attributes: ['user_id', 'nickname', 'avatar'],
                    },
                ],
                limit: pageSize,
                offset,
                order: [['created_at', 'DESC']],
            });


            const totalPages = Math.ceil(totalCount / pageSize);

            ctx.status = 200;
            ctx.body = {
                success: true,
                data: {
                    orders: orders,
                    currentPage: page,
                    totalPages,
                },
            };
        } catch (error) {
            ctx.status = 500;
            ctx.body = {
                success: false,
                message: 'Failed to fetch orders.',
                error: error.message,
            };
        }
    }

    // 获取订单详情
    async getOrderDetail (orderId) {
        const { ctx } = this;

        try {
            const order = await ctx.model.Order.findOne({
                where: {
                    order_id: orderId,
                    is_deleted: '0'
                },
                include: [
                    {
                        model: ctx.model.User,
                        as: 'Chef',
                        attributes: ['user_id', 'nickname', 'avatar', 'title'],
                    },
                    {
                        model: ctx.model.User,
                        as: 'Customer',
                        attributes: ['user_id', 'nickname', 'avatar', 'title'],
                    },
                    {
                        model: ctx.model.OrderDishDetail,
                        where: { is_deleted: '0' },
                        required: false,
                        include: [{
                            model: ctx.model.Dish,
                            attributes: ['dish_id', 'name', 'description', 'price'],
                            include: [{
                                model: ctx.model.DishImage,
                                attributes: ['url'],
                                where: { is_deleted: '0' },
                                required: false
                            }]
                        }]
                    }
                ]
            });

            if (!order) {
                ctx.status = 404;
                ctx.body = {
                    success: false,
                    message: '订单不存在'
                };
                return;
            }


            ctx.body = {
                success: true,
                data: {
                    orderId: order.order_id,
                    chef: {
                        userId: order.Chef.user_id,
                        nickname: order.Chef.nickname,
                        avatar: order.Chef.avatar,
                        title: order.Chef.title
                    },
                    customer: {
                        userId: order.Customer.user_id,
                        nickname: order.Customer.nickname,
                        avatar: order.Customer.avatar,
                        title: order.Customer.title
                    },
                    orderTime: order.created_at,
                    // dishes: order.order_dish_details.map(detail => ({
                    //     dishId: detail.Dish.dish_id,
                    //     name: detail.Dish.name,
                    //     description: detail.Dish.description,
                    //     price: detail.Dish.price,
                    //     quantity: detail.quantity,
                    //     note: detail.note,
                    //     image: detail.Dish.dish_images || []
                    // })),
                    dishes: order.order_dish_details,
                    note: order.note,
                    status: order.status
                }
            };
        } catch (error) {
            ctx.status = 500;
            ctx.body = {
                success: false,
                message: '获取订单详情失败',
                error: error.message
            };
        }
    }
}

module.exports = OrderService;