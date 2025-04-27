"use strict";
const { Controller } = require("egg");
const axios = require('axios');

class UserController extends Controller {
    async login () {
        const { ctx } = this;
        const { code } = ctx.request.body;
        await ctx.service.user.getToken(code);
    }

    async searchUsers () {
        await this.ctx.service.user.searchUsers();
    }

    async userInfo () {
        await this.ctx.service.user.userInfo();
    }

    async details () {
        await this.ctx.service.user.details();
    }

    // 查询用户编号是否重复（不包括自己） user_code
    async userCodeCheck () {
        await this.ctx.service.user.userCodeCheck();
    }

    async updateUserInfo () {
        await this.ctx.service.user.updateUserInfo();
    }

    async updateSubscribeOrderNotify () {
        await this.ctx.service.user.updateSubscribeOrderNotify();
    }
}

module.exports = UserController;
