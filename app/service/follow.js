// app/service/follow.js
const Service = require('egg').Service;
// import { check403 } from "../utils/errorMessage";

class FollowService extends Service {
    // 关注
    async follow () {
        const { ctx } = this;

        // 从请求体中提取数据
        const { following_id } = ctx.request.body;

        try {
            // 确认当前用户 ID
            const follower_id = ctx.user.user_id;

            // 检查是否已关注
            const existingFollow = await ctx.model.Follow.findOne({
                where: {
                    follower_id,
                    following_id,
                    // is_deleted: '0',
                },
            });

            if (existingFollow) {
                existingFollow.is_deleted = '0';
                await existingFollow.save();
                ctx.status = 200;
                ctx.body = {
                    success: true,
                    message: '关注成功'
                };
                return;
            }

            // 创建关注记录
            await ctx.model.Follow.create({
                follower_id,
                following_id,
                is_deleted: '0',
            });

            ctx.status = 200;
            ctx.body = {
                success: true,
                message: '关注成功'
            };
        } catch (error) {

            ctx.status = 500;
            ctx.body = {
                success: false,
                message: '服务器错误，关注失败',
                error: error.message,
            };
        }
    }
    // 取关
    async unfollow () {
        const { ctx } = this;

        // 从请求体中提取数据
        const { following_id } = ctx.request.body;

        try {
            // 确认当前用户 ID
            const follower_id = ctx.user.user_id;

            // 查找并逻辑删除关注记录
            const followRecord = await ctx.model.Follow.findOne({
                where: {
                    follower_id,
                    following_id,
                    is_deleted: '0',
                },
            });

            if (!followRecord) {
                ctx.status = 404;
                ctx.body = {
                    message: 'Not following this user.',
                };
                return;
            }

            followRecord.is_deleted = '1';
            await followRecord.save();

            ctx.status = 200;
            ctx.body = {
                success: true,
                message: '已取关'
            };
        } catch (error) {

            ctx.status = 500;
            ctx.body = {
                success: false,
                message: '服务器错误，取关失败',
                error: error.message,
            };
        }
    }
    // 获取我的关注列表，包括自己
    async getFollowingList () {
        const { ctx } = this;

        try {
            // 确认当前用户 ID
            const follower_id = ctx.user.user_id;
            const nickname = ctx.query.nickname || '';

            // 查询关注列表
            const followingList = await ctx.model.Follow.findAll({
                where: {
                    follower_id,
                    is_deleted: '0',
                },
                include: [
                    {
                        model: ctx.model.User,
                        where: {
                            nickname: { [this.ctx.model.Sequelize.Op.like]: `%${nickname}%` },
                        },
                        as: 'following',
                        attributes: ['user_id', 'nickname', 'avatar'],
                    },
                ],
            });

            // 自己
            const currentUser = await ctx.model.User.findByPk(follower_id, {
                attributes: ['user_id', 'nickname', 'avatar'],
            });

            ctx.body = {
                success: true,
                data: {
                    followingList: followingList,
                    currentUser: currentUser,
                },
            };
        } catch (error) {

            ctx.status = 500;
            ctx.body = {
                success: false,
                message: 'Failed to fetch following list.',
                error: error.message,
            };
        }
    }
}

module.exports = FollowService;