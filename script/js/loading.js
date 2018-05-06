apiready = function() {

    var footer = $api.byId('footer');
    var footerPos = $api.offset(footer);
    var H = api.winHeight - footerPos.h - 1;
    //本地保存底部
    $api.setStorage('winHeight', H);
    //开启vue框架
    vm = new Vue({

        el: "#footer",
        data: {
            //切换样式
            changeIndex: 0,
            //判断登录
            isLogin: false,
        },
        //方法
        methods: {

            //切换页面
            randomSwitchBtn: function(index, type) {
                //判断是否登录
                if (index == 2 || index == 3) {

                    if ($api.getStorage("userData")) {

                        this.isLogin = $api.getStorage("userData").isLogin;

                    };
                    if (!this.isLogin) {

                        api.openWin({
                            name: 'login',
                            url: 'html/login.html',

                        });
                        return false;
                    }
                };
                if ($api.getStorage("ordertype") && index == 2) {

                    api.openFrame({
                        name: 'myorder2',
                        url: 'html/myorder2.html',
                        rect: {
                            x: 0,
                            y: 0,
                            w: 'auto',
                            h: $api.getStorage("winHeight")
                        },
                        pageParam: {
                            name: 'test'
                        }
                    });
                    api.setFrameAttr({
                        name: 'myorder2',
                        hidden: false
                    });
                    this.changeIndex = index;
                    return false;
                } else {
                    //关掉订单二
                    api.setFrameAttr({
                        name: 'myorder2',
                        hidden: true
                    });

                   if(type == 1){

                        api.openFrame({
                            name: 'myorder2',
                            url: 'html/myorder2.html',
                            rect: {
                                x: 0,
                                y: 0,
                                w: 'auto',
                                h: $api.getStorage("winHeight")
                            },
                            pageParam: {
                                name: 'test'
                            }
                        });
                        api.setFrameAttr({
                            name: 'myorder2',
                            hidden: false
                        });
                       this.changeIndex = index;
                    }else{

                      api.setFrameAttr({
                          name: 'myorder2',
                          hidden: true
                      });

                      api.setFrameGroupIndex({
                          name: 'group',
                          index: index
                      });

                    }

                    this.changeIndex = index;
                };
            },
            //监听事件
            addEventListener: function() {

                var self = this;
                if ($api.getStorage("userData")) {

                    self.isLogin = $api.getStorage("userData").isLogin;

                };
                //监听登录状态
                api.addEventListener({
                    name: 'isLogin'
                }, function(ret, err) {
                    if (ret) {
                        self.isLogin = false;
                    } else {

                    }
                });
                api.addEventListener({
                    name: 'order'
                }, function(ret, err) {
                    if (ret) {

                        self.randomSwitchBtn(ret.value.key1, ret.value.key2);

                    } else {
                        alert(JSON.stringify(err));
                    }
                });
                //监听订单状态
                api.addEventListener({
                    name: 'order2'
                }, function(ret, err) {
                    if (ret) {

                        self.changeIndex = 2;

                    } else {

                    }
                });
                //切换订单分类

            },

            //初始化函数
            init: function() {

                //清除订单类型
                if ($api.getStorage("ordertype")) {

                    $api.rmStorage('ordertype');

                };
                //清除订单状态
                if ($api.getStorage("OrderStatus1")) {

                    $api.rmStorage('OrderStatus1');
                }
                this.addEventListener();

                //切换
                api.openFrameGroup({
                    name: 'group',
                    scrollEnabled: false,
                    preload: 0,
                    rect: {
                        x: 0,
                        y: 0,
                        w: 'auto',
                        h: api.winHeight - footerPos.h - 1
                    },
                    frames: [{
                        name: 'home',
                        url: 'html/home.html',
                        bounces: false,
                    }, {
                        name: 'technician',
                        url: 'html/technician.html',
                        bounces: false,
                    }, {
                        name: 'myorder',
                        url: 'html/myorder1.html',
                        bounces: false,
                    }, {
                        name: 'person',
                        url: 'html/person.html',
                        bounces: false,
                    }]
                }, function(ret, err) {
                    var index = ret.index;
                    this.changeIndex = 0;
                });
            },


        },
        //周期函数
        created: function() {

            this.init();
        },
        mounted: function() {

        }

    });

};
