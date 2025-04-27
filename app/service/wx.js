// app/service/wx.js
const Service = require('egg').Service;
const axios = require('axios');

class WxService extends Service {
    async getOpenid (code) {
        const { ctx } = this;
        let openid = '';
        try {
            const response = await axios.get('https://api.weixin.qq.com/sns/jscode2session', {
                params: {
                    appid: 'xxx', // 替换为你的 App ID
                    secret: 'xxx', // 替换为你的 App Secret
                    js_code: code,
                    grant_type: 'authorization_code'
                }
            });
            openid = response.data.openid;
            return openid
        } catch (error) {
            ctx.status = 500;
            ctx.body = { message: "获取openid失败" };
            return;
        }
    }

    async getAccessToken () {
        const { app } = this;
        let accessToken = await app.redis.get('wechat_access_token');
        if (!accessToken) {
            const response = await axios.get('https://api.weixin.qq.com/cgi-bin/token', {
                params: {
                    appid: 'xxx',
                    secret: 'xxx',
                    grant_type: 'client_credential'
                }
            });
            accessToken = response.data.access_token;
            await app.redis.set('wechat_access_token', accessToken, 'EX', 7200);
        }
        return accessToken;
    }

    // 发送订阅消息
  async sendSubscribeMessage(openid, data, chef_id) {
    const templateId = 'xxx';
    
    try {
      const accessToken = await this.getAccessToken();
      const url = `https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${accessToken}`;

      const payload = {
        touser: openid,
        template_id: templateId,
        page: 'pages/myOrder/index', // 点击消息后跳转的页面
        data: {
          name3: { value: data.name3 }, // 提交人
          thing6: { value: data.thing6.length > 20 ? data.thing6.slice(0, 17) + '...' : data.thing6 }, // 菜单信息
          date4: { value: data.date4 }, // 提交时间
          thing5: { value: data.thing5.length > 20 ? data.thing5.slice(0, 17) + '...' : data.thing5 ? data.thing5 : '-' }, // 操作备注
        },
      };

      const response = await axios.post(url, payload);
      if (response.data.errcode === 0) {
        // 更新用户表的订阅状态
        await this.ctx.model.User.update({
          subscribe_order_notify: false
        }, {
          where: { user_id: chef_id }
        });
        return true;
      }
      return false;
    } catch (error) {
      this.ctx.logger.error('发送订阅消息失败', error);
      return false;
    }
  }
}

module.exports = WxService;