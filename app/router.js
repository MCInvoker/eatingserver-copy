/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    router.get('/', controller.home.index);
    router.post("/eating/user/login", controller.user.login); // 登录注册
    router.get("/eating/user/search", controller.user.searchUsers); // 搜索用户
    router.get("/eating/user/info", controller.user.userInfo); // 获取用户信息
    router.put("/eating/user/info", controller.user.updateUserInfo); // 更新用户信息
    router.put("/eating/user/subscribeOrderNotify", controller.user.updateSubscribeOrderNotify); // 更新用户订阅状态
    router.get("/eating/user/details", controller.user.details); // 获取自己的用户信息，更详细
    router.post("/eating/user/usercodecheck", controller.user.userCodeCheck); // 查询usercode是否重复
    router.post("/eating/dishtag", controller.dishTag.createDishTag); // 新增菜肴标签
    router.put("/eating/dishtag/:tag_id", controller.dishTag.updateDishTag); // 更新菜肴标签
    router.get("/eating/dishtag", controller.dishTag.getDishTags);// 获取菜肴标签
    router.delete("/eating/dishtag/:tag_id", controller.dishTag.deleteDishTag); // 删除菜肴标签
    router.post("/eating/dishcategory", controller.dishCategory.createDishCategory); // 新增菜肴
    router.put("/eating/dishcategory/:category_id", controller.dishCategory.updateDishCategory); // 更新菜肴分类信息
    router.get("/eating/dishcategory", controller.dishCategory.getDishCategories); // 获取菜肴分类
    router.delete("/eating/dishcategory/:category_id", controller.dishCategory.deleteDishCategory); // 删除菜肴分类
    router.post("/eating/dish", controller.dish.createDish); // 新增菜肴
    router.put("/eating/dish/:dish_id", controller.dish.updateDish); // 更新菜肴信息
    router.get("/eating/dish", controller.dish.getDishes); // 获取自己的菜肴列表
    router.get("/eating/user/dish", controller.dish.getDishesByUserId); // 点餐时，通过用户id获取该用户下的菜肴
    router.delete("/eating/dish/:dish_id", controller.dish.deleteDish); // 删除菜肴
    router.put("/eating/dish/disclosureDish/:dish_id", controller.dish.disclosureDish); // 隐藏菜肴
    router.post("/eating/follow", controller.follow.follow); // 关注
    router.post("/eating/unfollow", controller.follow.unfollow); // 取关
    router.get("/eating/follow", controller.follow.getFollowingList); // 获取关注列表
    router.post("/eating/order", controller.order.createOrder); // 点餐， 新增订单
    router.get("/eating/myorder", controller.order.getMyOrders); // 我收到的订单
    router.get("/eating/myorderhistory", controller.order.getMyOrderHistory); // 我的点餐记录
    router.get("/eating/order/:orderId", controller.order.getOrderDetail); // 获取订单详情
    router.get("/eating/stsInfo", controller.sts.getSts); // 获取阿里云sts临时凭证，用于图片上传
};
