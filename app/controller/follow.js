"use strict";
const { Controller } = require("egg");
const axios = require('axios');

class FollowController extends Controller {
    async follow () {
        await this.ctx.service.follow.follow();
    }
    async unfollow () {
        await this.ctx.service.follow.unfollow();
    }
    async getFollowingList () {
        await this.ctx.service.follow.getFollowingList();
    }
}

module.exports = FollowController;
