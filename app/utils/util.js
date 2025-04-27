export const getObjectFromRedis = async (redisClient, key) => {
    try {
        // 从 Redis 中获取 key 的值
        const value = await redisClient.get(key);
        // 如果没有找到值，则直接返回 null
        if (!value) {
            return null;
        }
        // 尝试将字符串解析为对象
        const parsedValue = JSON.parse(value);
        return parsedValue;
    } catch (error) {
        // 如果解析出错，返回 null
        return null;
    }
};