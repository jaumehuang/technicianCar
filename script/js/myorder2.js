apiready = function() {

    var vm = new Vue({

        el: "#myorder2",
        data() {

            return {

                isMask: false,
                isupdate: false, //是否更新完成
                isupdateData0: true, //是否再加载数据
                isupdateData1: true, //是否再加载数据
                isupdateData2: true, //是否再加载数据
                isupdateData3: true, //是否再加载数据
                isMove: true,
                flag: true, //禁止遮罩层滚动
                changeIndex: 0,
                iStheme: false,
                currentorder: 0, //显示当前页面,默认0
                themeIndex: 1,
                orderType: '咨询订单',
                navList2: 0,
                ajaxCount: 0, //数据请求标志
                pageIndex0: 1, //翻页数
                pageIndex1: 1, //翻页数
                pageIndex2: 1, //翻页数
                pageIndex3: 1, //翻页数
                statusText2: ['待支付', '已支付未接单', '追问中', '问题已得到解决', '待评价', '已完成订单'],
                statusBtn2: ['立即支付', '', '已解决', '分配赏金', '待评价'],
                handleText: ['确定取消该订单?', "确定该订单已完成?"],

                orderlist2: [{
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
                ],
                nullimg: ['../image/null.png'],
                nullText: ['没有订单', '没有待支付订单', '没有追问中订单', '没有待评价订单'],
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
                    this.swiperType2 = true;

                }
            },
            //选中类别
            themeSwitchBtn: function(index, e) {

                this.themeIndex = index;
                this.changeIndex = 0;
                this.iStheme = false;
                this.isMask = false;
                this.orderType = e.target.innerText;
                if (index == 0) {

                    if ($api.getStorage("ordertype")) {

                        $api.rmStorage('ordertype');
                        api.sendEvent({

                            name: 'order',
                            extra: {
                                key1: 2,
                                key2: 0
                            }
                        });
                    }
                    api.setFrameAttr({
                        name: 'myorder2',
                        hidden: true
                    });

                }
                this.flag = false;
                var self = this;
                document.removeEventListener("touchmove", function() {

                    self.flag = false;
                });

            },
            //监听事件
            MyEventListener: function() {

                var self = this;
                api.addEventListener({
                    name: 'order'
                }, function(ret, err) {
                    if (ret) {


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


                    if ($api.getStorage("OrderStatus2")) {

                        if($api.getStorage("OrderStatus2")==0&&self.isupdateData0){

                             //全部
                            self.myorderList2(self.pageIndex0, 0,'');
                            self.isupdate = true;
                            self.pageIndex0 = self.pageIndex0 + 1;
                          }else if($api.getStorage("OrderStatus2")==1&&self.isupdateData1){
                            //待支付
                            self.myorderList2(self.pageIndex1, 1, '0,1');
                            self.isupdate = true;
                           self.pageIndex1 = self.pageIndex1 + 1;

                         }else if($api.getStorage("OrderStatus2")==2&&self.isupdateData2){

                             //待追问
                           self.myorderList2(self.pageIndex2, 2, '2');
                           self.isupdate = true;
                           self.pageIndex2 = self.pageIndex2 + 1;

                          }else if($api.getStorage("OrderStatus2")==3&&self.isupdateData3){

                               //待评价
                               self.myorderList2(self.pageIndex3, 3, '3,4');
                               self.isupdate = true;
                               self.pageIndex3 = self.pageIndex3 + 1;
                          }

                    } else {

                        if (self.isupdateData0) {

                            self.myorderList2(self.pageIndex0, 0, '', getLocation.lon + ',' + getLocation.lat);
                            self.isupdate = true;
                            self.pageIndex0 = self.pageIndex0 + 1;
                        }

                    };

                });

            },
            //咨询订单列表
            myorderList2: function(pageIndex, index, Status, Coordinate) {

                var param = {
                    PageIndex: pageIndex,
                    PageCount: 6,
                    MemLoginId: $api.getStorage("userData").Account,
                    OrderStatus: Status,
                    Type: 0,
                };
                var self = this;
                Ajax({

                    url: https.url + '?action=ConsultOrderList',
                    dataType: 'json',
                    method: 'get',
                    timeout: 30,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    if (arryList != null) {

                        self.orderlist2[index].order = (self.orderlist2[index].order).concat(arryList);
                        self.callback(4);
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

                            default:

                        }
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

                    url: https.url + '?action=ConsultOrderListCount',
                    dataType: 'json',
                    method: 'get',
                    timeout: 50,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    if (arryList != null) {

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
            //switch 订单按钮 跳转页面
            SwitchView: function(item, index) {


                if (item.OrderStatus == 2) {
                    //订单完成
                    this.handleOrder(1, 1, 'OverOrder', item.OrderNumber, item.WorkerLoginId, item.BuyPrice);

                } else if (item.OrderStatus == 3) {
                    //分配赏金
                    this.openView('expert_detail2', item.OrderNumber);

                } else if (item.OrderStatus == 0) {

                    //立即支付
                    alert(item.OrderNumber)
                    this.openView('pay', item.OrderNumber);

                } else if (item.OrderStatus == 4) {
                    //评价
                    this.openView('comment2', item.OrderNumber);
                }
            },
            //订单操作
            handleOrder: function(index, n, type, orderNumber, workerLoginId, Commission) {

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
                        self.OperateRepairOrder(type, orderNumber, workerLoginId, Commission)
                    }
                });
            },
            //提交操作订单数据
            OperateRepairOrder: function(type, orderNumber, workerLoginId, Commission) {

                var param = {

                    MemLoginId: $api.getStorage("userData").Account,
                    OperateType: type,
                    OrderNumber: orderNumber,
                    WorkerLoginId: workerLoginId,
                    Commission: Commission,
                    Type: 0
                }
                console.log(JSON.stringify(param))
                var self = this;
                Ajax({

                    url: https.url + '?action=OperateConsultOrder',
                    dataType: 'json',
                    method: 'post',
                    timeout: 30,
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
            switchSlider: function(i, mySwiper1) {

                mySwiper1.slideTo(i, 5, false);
                var order2 = document.getElementById("order2");
                var swiper2 = order2.getElementsByClassName('swiper-slide-active')[0];
                this.$refs.swiperwrapper2.style.height = swiper2.offsetHeight + 80 + 'px';
                this.navList2 = i;
                this.currentorder = i;
                //记住滑动的订单类型

            },
            //数据初始化
            init: function() {


                //维修订单
                //全部
                this.myorderList2(1, 0, '');
                //待支付
                this.myorderList2(1, 1, '0,1');
                //咨询中
                this.myorderList2(1, 2, '2');
                //待评价
                this.myorderList2(1, 3, '3,4');

                // this.handleOrder()
                this.orderNumber('', 0);
                this.orderNumber('0,1', 1);
                this.orderNumber('2', 2);
                this.orderNumber('3,4', 3);

                this.MyEventListener();
                //监听评价
                api.addEventListener({
                    name: 'technician-comment'
                }, function(ret, err) {
                    if (ret) {

                        window.location.reload();

                    } else {
                        alert(JSON.stringify(err));
                    }
                });
                //监听订单状态
                api.addEventListener({
                    name: 'order'
                }, function(ret, err) {
                    if (ret) {

                        window.location.reload();

                    } else {
                        alert(JSON.stringify(err));
                    }
                });

            },

        },
        created: function() {

            this.init();
            //监听订单状态
            api.addEventListener({
                name: 'order2'
            }, function(ret, err) {
                if (ret) {

                    window.location.reload();

                } else {

                }
            });
        },
        mounted: function() {

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

                    // var order2 = document.getElementById("order2");
                    // var swiper2 = order2.getElementsByClassName('swiper-slide-active')[0];
                    // self.$refs.swiperwrapper2.style.height = swiper2.offsetHeight + 0 + 'px';

                }
            });

        },
        updated: function() {

            var self = this;
            this.$nextTick(function() {

                var mySwiper2 = new Swiper('.order2', {

                    observer: true, //修改swiper自己或子元素时，自动初始化swiper
                    autoHeight: true, //高度随内容变化
                    speed: 50,
                    initialSlide: $api.getStorage("OrderStatus2"),
                    observeParents: true, //修改swiper的父元素时，自动初始化swiper
                    onTransitionEnd: function(swiper) {

                        self.navList2 = swiper.activeIndex;
                        self.currentorder = swiper.activeIndex;
                        $api.setStorage('OrderStatus2', swiper.activeIndex);
                        var order2 = document.getElementById("order2");
                        var swiper2 = order2.getElementsByClassName('swiper-slide-active')[0];
                        self.$refs.swiperwrapper2.style.height = swiper2.offsetHeight + 80 + 'px';
                        // alert(swiper1.offsetHeight);

                    },
                    onTouchMove: function(swiper) {


                        if (self.isMove && swiper.activeIndex == 0) {

                            var order2 = document.getElementById("order2");
                            var swiper2 = order2.getElementsByClassName('swiper-slide-active')[0];
                            self.$refs.swiperwrapper2.style.height = swiper2.offsetHeight + 80 + 'px';
                            self.isMove = false;
                        }
                    }
                });
                //  self.SwitchBtnOrder1(index);
                var $li = document.getElementsByClassName('li');

                $li[0].onclick = function() {

                    self.switchSlider(0, mySwiper2);
                    $api.setStorage('OrderStatus2', 0);
                };
                $li[1].onclick = function() {

                    self.switchSlider(1, mySwiper2);
                    $api.setStorage('OrderStatus2', 1);

                };
                $li[2].onclick = function() {

                    self.switchSlider(2, mySwiper2);
                    $api.setStorage('OrderStatus2', 2);
                };
                $li[3].onclick = function() {
                    //
                    self.switchSlider(3, mySwiper2);
                    $api.setStorage('OrderStatus2', 3);
                };


                //下拉刷新数据状态
                if ($api.getStorage("OrderStatus2")) {


                    var order2 = document.getElementById("order2");
                    var swiper2 = order2.getElementsByClassName('swiper-slide-active')[0];
                    self.$refs.swiperwrapper2.style.height = swiper2.offsetHeight + 80 + 'px';
                    //  $api.rmStorage('OrderStatus1');
                }
                if (self.isupdate) {


                    var order2 = document.getElementById("order2");
                    var swiper2 = order2.getElementsByClassName('swiper-slide-active')[0];
                    self.$refs.swiperwrapper2.style.height = swiper2.offsetHeight + 80 + 'px';

                }
            })
        }


    })
}
