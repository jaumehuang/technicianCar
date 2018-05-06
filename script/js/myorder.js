apiready = function() {

    var vm = new Vue({

        el: "#myorder",
        data() {

            return {

                isMask: false,
                isupdate: false, //是否更新完成
                isupdateData0: true, //是否再加载数据
                isupdateData1: true, //是否再加载数据
                isupdateData2: true, //是否再加载数据
                isupdateData3: true, //是否再加载数据
                isupdateData4: true, //是否再加载数据
                isMove: true, //是否滑动
                flag: true, //禁止遮罩层滚动
                changeIndex: 0, //切换页面,你默认0
                iStheme: false, //开启类别
                themeIndex: 0, //类别数
                currentorder: 0, //显示当前页面,默认0
                orderType: '维修订单',
                navList1: 0,
                ajaxCount: 0, //数据请求标志
                ajaxCount2: 0, //数据请求标志
                pageIndex0: 1, //翻页数
                pageIndex1: 1, //翻页数
                pageIndex2: 1, //翻页数
                pageIndex3: 1, //翻页数
                pageIndex4: 1, //翻页数
                statusText1: ['待接单', '技师取消订单', '待支付', '服务中', '待评价', '已完成', '已退款'],
                statusBtn1: ['', '选择技师', '立即支付', '订单完成', '评价', '再来一单'],
                handleText: ['确定取消该订单?', "确定该订单已完成?"],
                orderlist1: [{
                        "order": []
                    }, //全部
                    {
                        "order": []
                    }, //待接单
                    {
                        "order": []
                    }, //待待付款
                    {
                        "order": []
                    }, //服务中
                    {
                        "order": []
                    } //已完成
                ],
                nullimg: ['../image/null.png'],
                nullText: ['没有订单', '没有待接单', '没有待付款', '服务中没有订单', '没有待评价订单'],
                numArr: [], //订单数目
            }
        },
        methods: {

            //切换页面

            randomSwitchBtn: function() {


                if (this.changeIndex == 0) {

                    this.changeIndex = 1;
                    this.isMask = true;
                    this.iStheme = true;
                    this.flag = true;
                    var self = this;
                    document.addEventListener('touchmove', function(event) {　　 //监听滚动事件
                        if (self.flag) { //判断是遮罩显示时执行，禁止滚屏
                            event.preventDefault();　　 //最关键的一句，禁止浏览器默认行为
                        }
                    })

                } else if (this.changeIndex == 1) {

                    this.changeIndex = 0;
                    this.iStheme = false;
                    this.isMask = false;
                    this.flag = false;
                    var self = this;
                    document.removeEventListener("touchmove", function() {

                        self.flag = false;
                    });

                }
            },
            //选中类别
            themeSwitchBtn: function(index, e) {

                this.themeIndex = index;
                this.changeIndex = 0;
                this.iStheme = false;
                this.isMask = false;

                if (index == 1) {

                    // this.openView('ask');
                    $api.setStorage('ordertype', 1);
                    api.openFrame({
                        name: 'myorder2',
                        url: './myorder2.html',
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
                } else {

                    this.orderType = e.target.innerText;

                }
                this.flag = false;
                var self = this;
                document.removeEventListener("touchmove", function() {

                    self.flag = false;
                });

            },
            //切换订单状态
            SwitchBtnOrder1: function(index) {

                this.navList1 = index;

            },
            //监听事件
            addEventListener: function() {

                var self = this;
                var getLocation = $api.getStorage("getLocation");
                api.addEventListener({
                    name: 'order'
                }, function(ret, err) {
                    if (ret) {

                        // if (ret.value.key2 == 0) {
                        //
                        //     self.orderType = '维修订单';
                        //
                        // } else if (ret.value.key2 == 1) {
                        //
                        //
                        //     self.orderType = '咨询订单';
                        // }

                    } else {
                        alert(JSON.stringify(err));
                    }
                });

                api.addEventListener({
                    name: 'scrolltobottom',
                    extra: {
                        threshold: 70
                    }
                }, function(ret, err) {

                    if ($api.getStorage("OrderStatus1")) {

                        if ($api.getStorage("OrderStatus1") == 0 && self.isupdateData0) {

                            //全部
                            self.myorderList1(self.pageIndex0, 0, '', getLocation.lon + ',' + getLocation.lat);
                            self.isupdate = true;
                            self.pageIndex0 = self.pageIndex0 + 1;
                        } else if ($api.getStorage("OrderStatus1") == 1 && self.isupdateData1) {
                            //待接单
                            self.myorderList1(self.pageIndex1, 1, '0,1', getLocation.lon + ',' + getLocation.lat);
                            self.isupdate = true;
                            self.pageIndex1 = self.pageIndex1 + 1;

                        } else if ($api.getStorage("OrderStatus1") == 2 && self.isupdateData2) {

                            //待追问
                            self.myorderList1(self.pageIndex2, 2, '2', getLocation.lon + ',' + getLocation.lat);
                            self.isupdate = true;
                            self.pageIndex2 = self.pageIndex2 + 1;

                        } else if ($api.getStorage("OrderStatus1") == 3 && self.isupdateData3) {

                            //待服务
                            self.myorderList1(self.pageIndex3, 3, '3', getLocation.lon + ',' + getLocation.lat);
                            self.isupdate = true;
                            self.pageIndex3 = self.pageIndex3 + 1;
                        } else if ($api.getStorage("OrderStatus1") == 4 && self.isupdateData3) {

                            //待评价
                            self.myorderList1(self.pageIndex4, 4, '4', getLocation.lon + ',' + getLocation.lat);
                            self.isupdate = true;
                            self.pageIndex4 = self.pageIndex4 + 1;
                        }

                    } else {

                        if (self.isupdateData0) {

                            self.myorderList1(self.pageIndex0, 0, '', getLocation.lon + ',' + getLocation.lat);
                            self.isupdate = true;
                            self.pageIndex0 = self.pageIndex0 + 1;
                        }

                    };

                });

            },
            //修车订单列表
            myorderList1: function(pageIndex, index, Status, Coordinate) {

                var param = {
                    PageIndex: pageIndex,
                    PageCount: 6,
                    MemLoginId: $api.getStorage("userData").Account,
                    OrderStatus: Status,
                    Type: 0,
                    Coordinate: Coordinate
                };
                var self = this;
                Ajax({

                    url: https.url + '?action=RepairOrderList',
                    dataType: 'json',
                    method: 'get',
                    timeout: 30,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    if (arryList != null) {

                        self.orderlist1[index].order = (self.orderlist1[index].order).concat(arryList);
                        switch (index) {
                            case 0:
                                self.pageIndex0 = self.pageIndex0 + 1;
                                break;
                            case 1:
                                self.pageIndex1 = self.pageIndex1 + 1;
                                break;
                            case 2:
                                self.pageIndex2 = self.pageIndex2 + 1;
                                break;
                            case 3:
                                self.pageIndex3 = self.pageIndex3 + 1;
                                break;
                            case 4:
                                self.pageIndex4 = self.pageIndex4 + 1;
                                break;

                            default:

                        }
                        // alert(JSON.stringify(self.pageIndex1))
                        self.callback(4);

                    } else {

                        //禁止更新数据
                        switch (index) {
                            case 0:
                                self.isupdateData0 = false;
                                break;
                            case 1:
                                self.isupdateData1 = false;
                                break;
                            case 2:
                                self.isupdateData2 = false;
                                break;
                            case 3:
                                self.isupdateData3 = false;
                                break;
                            case 4:
                                self.isupdateData4 = false;
                                break;
                            default:

                        };

                    }


                }, true);

            },
            //订单数目
            orderNumber: function(Status, index) {

                var param = {

                    MemLoginId: $api.getStorage("userData").Account,
                    OrderStatus: Status,
                    Type: 0,

                };

                var self = this;
                Ajax({

                    url: https.url + '?action=RepairOrderListCount',
                    dataType: 'json',
                    method: 'get',
                    timeout: 50,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    if (arryList != null) {


                        //  alert(JSON.stringify(self.numArr))
                        switch (index) {
                            case 0:

                                if (arryList > 0) {

                                    self.$refs.num0.innerText = arryList;
                                    self.$refs.num0.style.display = 'block';
                                }

                                break;
                            case 1:

                                if (arryList > 0) {

                                    self.$refs.num1.innerText = arryList;
                                    self.$refs.num1.style.display = 'block';
                                }
                                break;
                            case 2:
                                if (arryList > 0) {

                                    self.$refs.num2.innerText = arryList;
                                    self.$refs.num2.style.display = 'block';
                                }
                                break;
                            case 3:
                                if (arryList > 0) {

                                    self.$refs.num3.innerText = arryList;
                                    self.$refs.num3.style.display = 'block';
                                }
                                break;
                            case 4:
                                if (arryList > 0) {

                                    self.$refs.num4.innerText = arryList;
                                    self.$refs.num4.style.display = 'block';
                                }
                                break;

                            default:

                        }
                        self.callback1(4);
                    }

                })
            },
            //订单操作
            handleOrder: function(index, n, type, orderNumber, workerLoginId, buyPrice) {

                var dialogBox = api.require('dialogBox');
                var self = this;
                dialogBox.alert({
                    texts: {
                        title: '',
                        content: index == 0 ? this.handleText[0] : this.handleText[1],
                        leftBtnTitle: '取消',
                        rightBtnTitle: '确认'
                    },
                    styles: {
                        bg: '#fff',
                        w: 300,
                        title: {
                            marginT: 20,
                            icon: 'widget://res/gou.png',
                            iconSize: 40,
                            titleSize: 16,
                            titleColor: '#000'
                        },
                        content: {
                            color: '#333',
                            size: 16,
                            marginT: 30, //（可选项）数字类型；内容文本顶端与标题栏底端的距离，如果标题栏不存在，则是到窗口顶端的距离；默认：20
                            marginB: 30,
                        },
                        left: {
                            marginB: 7,
                            marginL: 20,
                            w: 130,
                            h: 35,
                            corner: 2,
                            bg: '#fff',
                            size: 16,
                            color: '#ff6634',
                        },
                        right: {
                            marginB: 7,
                            marginL: 10,
                            w: 130,
                            h: 35,
                            corner: 2,
                            bg: '#fff',
                            size: 16,
                            color: '#ff6634',
                        }
                    }
                }, function(ret) {

                    if (ret.eventType == 'left') {

                        var dialogBox = api.require('dialogBox');
                        dialogBox.close({
                            dialogName: 'alert'
                        });
                    } else if (ret.eventType == 'right') {

                        var dialogBox = api.require('dialogBox');
                        dialogBox.close({
                            dialogName: 'alert'
                        });
                        self.OperateRepairOrder(type, orderNumber, workerLoginId, buyPrice);
                    }
                });
            },
            //提交操作订单数据
            OperateRepairOrder: function(type, orderNumber, workerLoginId, buyPrice) {

                var param = {

                    MemLoginId: $api.getStorage("userData").Account,
                    OperateType: type,
                    OrderNumber: orderNumber,
                    WorkerLoginId: workerLoginId,
                    BuyPrice: buyPrice

                }

                var self = this;
                Ajax({

                    url: https.url + '?action=OperateRepairOrder',
                    dataType: 'json',
                    method: 'post',
                    timeout: 50,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    if (arryList != null) {

                        if (type == 'CancelOrder' || type == 'OverOrder') {

                            window.location.reload()
                        }
                    }

                });
            },
            //AJAX加载数目处理
            callback: function(n) {
                //n为数据请求数目
                this.ajaxCount = this.ajaxCount + 1;
                if (n == this.ajaxCount);
                return false;
            },
            callback1: function(n) {
                //n为数据请求数目
                this.ajaxCount2 = this.ajaxCount2 + 1;
                if (n == this.ajaxCount2);
                return false;
            },
            //跳转页面
            openView: function(url, OrderNumber) {


                api.openWin({
                    name: url,
                    url: url + '.html',
                    pageParam: {
                        id: OrderNumber,
                        name: 0
                    }
                });
            },
            //switch 跳转页面
            SwitchView: function(item, index) {

                var arr = ['', 'technician', 'pay', '', 'comment2','car_repair'];
                if (item.OrderStatus == 1) {

                    api.sendEvent({

                        name: 'order',
                        extra: {
                            key1: 1,
                            key2: item.OrderNumber
                        }
                    });
                } else if (item.OrderStatus == 3) {
                    //订单完成
                    this.handleOrder(1, index, item.OrderStatus, item.OrderNumber, item.WorkerLoginId, item.BuyPrice);

                } else if(item.OrderStatus == 4){
                    //评价
                    this.openView(arr[item.OrderStatus], item.WorkerLoginId + '|' + item.OrderNumber);
                }else if(item.OrderStatus == 5){

                    this.openView(arr[item.OrderStatus]);
                }
            },
            //数据初始化
            init: function() {


                //定位
                var getLocation = $api.getStorage("getLocation");
                //维修订单
                //全部
                this.myorderList1(1, 0, '', getLocation.lon + ',' + getLocation.lat);
                //待接单
                this.myorderList1(1, 1, '0,1', getLocation.lon + ',' + getLocation.lat);
                //待支付
                this.myorderList1(1, 2, '2', getLocation.lon + ',' + getLocation.lat);
                //服务中
                this.myorderList1(1, 3, '3', getLocation.lon + ',' + getLocation.lat);
                //待评价
                this.myorderList1(1, 4, '4', getLocation.lon + ',' + getLocation.lat);


                //订单数目
                this.orderNumber('', 0);
                this.orderNumber('0,1', 1);
                this.orderNumber('2', 2);
                this.orderNumber('3', 3);
                this.orderNumber('4', 4);

                //监听订单状态
                api.addEventListener({
                    name: 'changeStatus'
                }, function(ret, err) {
                    if (ret) {

                        window.location.reload();

                    } else {
                        // alert( JSON.stringify( err ) );
                    }
                });


            },
            switchSlider: function(i, mySwiper1) {

                mySwiper1.slideTo(i, 5, false);
                var order1 = document.getElementById("order1");
                var swiper1 = order1.getElementsByClassName('swiper-slide-active')[0];
                this.$refs.swiperwrapper1.style.height = swiper1.offsetHeight + 80 + 'px';
                this.navList1 = i;
                this.currentorder = i;
                //记住滑动的订单类型

            },




        },
        created: function() {


            this.init();
            //监听订单状态
            api.addEventListener({
                name: 'order'
            }, function(ret, err) {
                if (ret) {


                    window.location.reload();

                } else {

                }
            });
            api.addEventListener({
                name: 'order1'
            }, function(ret, err) {
                if (ret) {

                    window.location.reload();

                } else {

                }
            });

        },
        mounted: function() {

            this.addEventListener();

            var self = this;
            var pullRefresh = new auiPullToRefresh({
                container: document.querySelector('.aui-refresh-content'),
                triggerDistance: 30
            }, function(ret) {


                if (ret.status == "success") {
                    setTimeout(function() {
                        window.location.reload()
                        pullRefresh.cancelLoading(); //刷新成功后调用此方法隐藏
                    }, 1500)
                } else {

                    // var order1 = document.getElementById("order1");
                    // var swiper1 = order1.getElementsByClassName('swiper-slide-active')[0];
                    // self.$refs.swiperwrapper1.style.height = swiper1.offsetHeight + 0 + 'px';

                }
            });

        },
        updated: function() {


            this.$nextTick(function() {
                var self = this;
                var mySwiper1 = new Swiper('.order1', {

                    observer: true, //修改swiper自己或子元素时，自动初始化swiper
                    autoHeight: true, //高度随内容变化
                    speed: 50,
                    initialSlide: $api.getStorage("OrderStatus1"),
                    observeParents: true, //修改swiper的父元素时，自动初始化swiper
                    onTransitionEnd: function(swiper) {

                        self.navList1 = swiper.activeIndex;
                        self.currentorder = swiper.activeIndex;
                        $api.setStorage('OrderStatus1', swiper.activeIndex);
                        var order1 = document.getElementById("order1");
                        var swiper1 = order1.getElementsByClassName('swiper-slide-active')[0];
                        self.$refs.swiperwrapper1.style.height = swiper1.offsetHeight + 80 + 'px';
                        // alert(swiper1.offsetHeight);

                    },
                    onTouchMove: function(swiper) {


                        if (self.isMove && swiper.activeIndex == 0) {

                            var order1 = document.getElementById("order1");
                            var swiper1 = order1.getElementsByClassName('swiper-slide-active')[0];
                            self.$refs.swiperwrapper1.style.height = swiper1.offsetHeight + 80 + 'px';
                            self.isMove = false;
                        }
                    }
                });
                //  self.SwitchBtnOrder1(index);
                var $li = document.getElementsByClassName('li');

                $li[0].onclick = function() {

                    self.switchSlider(0, mySwiper1);
                    $api.setStorage('OrderStatus1', 0);
                };
                $li[1].onclick = function() {

                    self.switchSlider(1, mySwiper1);
                    $api.setStorage('OrderStatus1', 1);

                };
                $li[2].onclick = function() {

                    self.switchSlider(2, mySwiper1);
                    $api.setStorage('OrderStatus1', 2);
                };
                $li[3].onclick = function() {

                    self.switchSlider(3, mySwiper1);
                    $api.setStorage('OrderStatus1', 3);
                };
                $li[4].onclick = function() {

                    self.switchSlider(4, mySwiper1);
                    $api.setStorage('OrderStatus1', 4);

                };


                //下拉刷新数据状态
                if ($api.getStorage("OrderStatus1")) {


                    var order1 = document.getElementById("order1");
                    var swiper1 = order1.getElementsByClassName('swiper-slide-active')[0];
                    self.$refs.swiperwrapper1.style.height = swiper1.offsetHeight + 80 + 'px';
                    //  $api.rmStorage('OrderStatus1');
                }
                if (self.isupdate) {


                    var order1 = document.getElementById("order1");
                    var swiper1 = order1.getElementsByClassName('swiper-slide-active')[0];
                    self.$refs.swiperwrapper1.style.height = swiper1.offsetHeight + 80 + 'px';

                }
            })

        }
    })
}
