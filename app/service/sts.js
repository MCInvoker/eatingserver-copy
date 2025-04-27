// app/service/sts.js
const Service = require('egg').Service;

const { STS } = require("ali-oss");

import { getObjectFromRedis } from "../utils/util";
import { sts_accessKeyId, sts_accessKeySecret } from "../utils/sensitive"

class StsService extends Service {
    // 获取阿里云sts临时凭证
    async getSts () {
        const { ctx, app } = this;
        try {
            // 先从redis缓存中拿，没有再去阿里云获取
            const redisStsInfo = await getObjectFromRedis(app.redis, "stsInfoLinkIcon"); // 暂时和webhome项目共用
            const isCredentialsExpired = credentials => {
                if (!credentials) {
                    return true;
                }
                const expireDate = new Date(credentials.Expiration);
                const now = new Date();
                // 如果有效期不足一分钟，视为过期。
                return expireDate.getTime() - now.getTime() <= 60000;
            };

            if (!isCredentialsExpired(redisStsInfo)) {
                ctx.body = {
                    success: true,
                    data: {
                        AccessKeyId: redisStsInfo.AccessKeyId,
                        AccessKeySecret: redisStsInfo.AccessKeySecret,
                        SecurityToken: redisStsInfo.SecurityToken,
                        Expiration: redisStsInfo.Expiration,
                    },
                };
                return;
            }

            // 提供角色ARN、策略、过期时间和会话名称
            const roleArn = "acs:ram::1224420219799875:role/webhomeideimg";
            const policy = "";
            // 设置过期时间为一小时（3600秒）
            const expire = 3600;
            // 设置会话名称为一个唯一的标识符，比如当前时间戳
            const sessionName = `session_${Date.now()}`;
            const sts = new STS({
                // 填写步骤1创建的RAM用户AccessKey。
                accessKeyId: sts_accessKeyId,
                accessKeySecret: sts_accessKeySecret,
            });
            const result = await sts.assumeRole(roleArn, policy, expire, sessionName);
            await app.redis.set("stsInfoLinkIcon", JSON.stringify({
                AccessKeyId: result.credentials.AccessKeyId,
                AccessKeySecret: result.credentials.AccessKeySecret,
                SecurityToken: result.credentials.SecurityToken,
                Expiration: result.credentials.Expiration,
            }), "EX", 60 * 5);

            ctx.body = {
                success: true,
                data: {
                    AccessKeyId: result.credentials.AccessKeyId,
                    AccessKeySecret: result.credentials.AccessKeySecret,
                    SecurityToken: result.credentials.SecurityToken,
                    Expiration: result.credentials.Expiration,
                },
            };
        } catch (error) {
            ctx.body = {
                success: false,
                message: "获取阿里云sts临时凭证失败",
            };
            return;
        }
    }
}

module.exports = StsService;
