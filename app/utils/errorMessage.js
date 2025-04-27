// HTTP 状态码 403 表示 "Forbidden"，意味着服务器理解客户端的请求，但拒绝执行该请求。
// 这通常是由于服务器认为客户端没有足够的权限来访问请求的资源或执行请求的操作引起的。
// 简而言之，当服务器知道客户端是谁，但拒绝执行请求时，会返回 403 Forbidden 状态码。
export const check403 = (ctx, user_id, message) => {
    const currentUserId = ctx.user.user_id;
    if (currentUserId !== user_id) {
        ctx.status = 403;
        ctx.body = {
            message: message || "权限不足",
        };
        return false
    }
    return true
};
