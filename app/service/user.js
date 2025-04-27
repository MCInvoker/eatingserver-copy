// app/service/user.js
const Service = require('egg').Service;

class UserService extends Service {
    // 登录接口流程
    // 1 客户端使用wx.login获取code
    // 2 服务端使用code调用https://api.weixin.qq.com/sns/jscode2session接口拿到openid
    // 3 服务端通过openid去数据库user表中查找用户
    // 4 找到的话通过userinfo签名，返回给客户端
    // 5 没找到的话新增用户，再通过userinfo签名，返回给客户端
    async getToken (code) {
        const { ctx, app } = this;
        const TOKEN_VALIDITY_PERIOD = 30 * 24 * 60 * 60; // 30天
        // 2 服务端使用code调用https://api.weixin.qq.com/sns/jscode2session接口拿到openid
        const openid = await ctx.service.wx.getOpenid(code);
        if (!openid) {
            ctx.status = 500;
            ctx.body = { message: "获取openid失败" };
            return;
        }
        // 3 服务端通过openid去数据库user表中查找用户
        const user = await ctx.model.User.findOne({
            where: {
                openid,
            },
        });
        // 4 找到的话通过userinfo签名，返回给客户端
        if (user) {
            const token = app.jwt.sign(
                { user_id: user.user_id },
                app.config.jwt.secret,
                {
                    expiresIn: TOKEN_VALIDITY_PERIOD,
                }
            );

            ctx.body = { success: true, message: "登录成功", token };
        } else {
            // 5 没找到的话新增用户，再通过userinfo签名，返回给客户端
            const newUser = await ctx.model.User.create({
                openid,
                nickname: '干饭人'
            });
            // 更新nickname为 干饭人 + 用户id
            await ctx.model.User.update(
                { nickname: `干饭人${newUser.user_id}` },
                { where: { user_id: newUser.user_id } }
            );
            const token = app.jwt.sign(
                { user_id: newUser.user_id },
                app.config.jwt.secret,
                {
                    expiresIn: TOKEN_VALIDITY_PERIOD,
                }
            );

            ctx.body = { success: true, message: "登录成功", token };
        }
    }

    async searchUsers () {
        const { ctx } = this;

        // 从请求参数中提取搜索关键词
        const searchTerm = ctx.query.searchTerm || '';
        const userId = ctx.user ? ctx.user.user_id : null;

        const { Op } = this.app.Sequelize;

        try {
            // 查询所有匹配的用户
            const users = await ctx.model.User.findAll({
                where: {
                    is_deleted: '0',
                    // 模糊搜索
                    [Op.or]: [
                        { nickname: { [Op.like]: `%${searchTerm}%` } },
                        { user_code: searchTerm },
                    ],
                },
                include: userId ? [{
                    model: this.ctx.model.Follow,
                    as: 'followers',
                    where: { follower_id: userId },
                    required: false,
                }] : [],
            });
            // 标记每个用户的关注状态
            const result = users.map(user => ({
                ...user.toJSON(),
                is_followed: user.followers.length > 0,
            }));

            ctx.status = 200;
            ctx.body = {
                success: true,
                data: result,
            };
        } catch (error) {
            ctx.status = 500;
            ctx.body = {
                success: false,
                message: 'Failed to fetch users.',
                error: error.message,
            };
        }
    }

    async userInfo () {
        const { ctx } = this;
        const user_id = ctx.query.userId;
        const user = await ctx.model.User.findOne({
            where: {
                user_id,
            },
            attributes: ['user_id', 'nickname', 'avatar', 'title', 'subscribe_order_notify'], // 只返回这些字段
        });
        ctx.body = {
            success: true,
            data: user,
        };
    }

    async updateUserInfo () {
        const { ctx } = this;
        const user_id = ctx.user.user_id;
        const { user_code = '', nickname, avatar, title = '' } = ctx.request.body;
        const user = await ctx.model.User.findOne({
            where: {
                user_id,
                is_deleted: '0',
            }
        });
        if (!user) {
            ctx.status = 404;
            ctx.body = {
                success: false,
                message: 'User not found',
            };
            return;
        }
        // 更新用户信息
        await user.update({
            nickname,
            avatar,
            title,
            user_code
        });
        ctx.body = {
            success: true,
            data: user,
        };
    }

    async updateSubscribeOrderNotify () {
        const { ctx } = this;
        const user_id = ctx.user.user_id;
        const { subscribe_order_notify } = ctx.request.body;
        await ctx.model.User.update({ subscribe_order_notify }, { where: { user_id } });
        const user = await ctx.model.User.findOne({
            where: {
                user_id,
            },
            attributes: ['user_id', 'nickname', 'avatar', 'title', 'user_code', 'subscribe_order_notify'], // 只返回这些字段
        });
        ctx.body = {
            success: true,
            message: '更新订阅状态成功',
            data: user,
        };
    }

    async details () {
        const { ctx } = this;
        const user_id = ctx.user.user_id;
        const user = await ctx.model.User.findOne({
            where: {
                user_id,
            },
            attributes: ['user_id', 'nickname', 'avatar', 'title', 'user_code', 'subscribe_order_notify'], // 只返回这些字段
        });
        ctx.body = {
            success: true,
            data: user,
        };
    }

    async userCodeCheck () {
        const { ctx } = this;
        const user_id = ctx.user.user_id;
        const user_code = ctx.request.body.user_code;
        const user = await ctx.model.User.findOne({
            where: {
                user_code,
            }
        });
        if (!user) {
            ctx.body = {
                success: true,
                data: false, // 不重复
            };
            return
        } else if (user.user_id === user_id) {
            ctx.body = {
                success: true,
                data: false, // 不重复,是自己
            };
            return
        } else {
            ctx.body = {
                success: true,
                data: true,
            };
        }

    }
}

module.exports = UserService;