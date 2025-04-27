"use strict";
const { Controller } = require("egg");

class StsController extends Controller {
    // 获取阿里云sts临时凭证
    async getSts () {
        await this.ctx.service.sts.getSts();
    }
}

module.exports = StsController;
