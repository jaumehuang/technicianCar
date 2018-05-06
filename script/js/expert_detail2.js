apiready = function() {

    var vm = new Vue({

        el: "#expert_detail2",
        data() {

            return {

                person: [],
                isConterPopup: false,
                PopupIndex:'',
                isMask: false,
                responseList: '', //回答
                myLoginId: '',
                problem: '',
                isCollection: false,
                IsCollectType: 0, //默认收藏
                OrderStatus: '', //订单状态
                AdvancePayment: 0, //金额
                OrderNumber:0,
                allotMoney:0,//分配金额,
                UnusedCommission:0,//可分配金额
            }
        },
        methods: {

            //分享
            MyShare: function() {

                Share();
            },
            //关闭遮罩层
            CloseMask: function() {

                this.isMask = false;
                this.isPopup = false;
                this.PopupIndex = false;
            },
            //打开弹窗
            ChangeMoney: function(index) {
                //获取金额
                this.Getperson();
                this.isMask = true;
                this.PopupIndex=index;
                this.isConterPopup = true;
                console.log(index);

            },
            //提问者信息
            productList2: function() {


                var param = {

                    OrderNumber: api.pageParam.id,
                    MemLoginId: $api.getStorage("userData").Account
                };
                this.myLoginId = api.pageParam.id;
                this.OrderNumber=api.pageParam.id;
                var self = this;

                Ajax({

                    url: https.url + '?action=GetConsultOrder',
                    dataType: 'json',
                    method: 'get',
                    timeout: 30,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    if (arryList != null) {

                        self.person = arryList;
                        self.OrderStatus = arryList[0].OrderStatus;
                        self.UnusedCommission=arryList[0].UnusedCommission;
                    }

                });

            },
            //查看图片
            PhotoBrowser: function(arr, index) {

                var imageBrowser = api.require('imageBrowser');
                imageBrowser.openImages({
                    imageUrls: arr,
                    activeIndex: index
                });

            },
            //技师回答
            requestList: function() {

                var param = {

                    OrderNumber: api.pageParam.id
                };
                var self = this;
                Ajax({

                    url: https.url + '?action=GetConsultOrderComment',
                    dataType: 'json',
                    method: 'get',
                    timeout: 30,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    if (arryList != null) {

                      //  alert(JSON.stringify(arryList))
                        self.responseList = arryList;

                    }
                })
            },
            Getperson: function() {

                var self = this;

                var param = {
                    MemLoginId: $api.getStorage("userData").Account
                }

                Ajax({

                    url: https.url + '?action=GetMember',
                    dataType: 'json',
                    method: 'get',
                    timeout: 30,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    if (arryList != null) {

                        self.AdvancePayment = arryList[0].AdvancePayment > 10000 ? (arryList[0].AdvancePayment) / 10000 + '万' : arryList[0].AdvancePayment;

                    } else {


                    }
                });
            },
            //打开新页面
            openWin:function(url,id){

                openView(url,id)
            },
            //分配佣金
            Commission: function(Type,OrderNumber,WorkerLoginId) {

                var self = this;

                var param = {
                    MemLoginId: $api.getStorage("userData").Account,
                    OperateType:Type,
                    OrderNumber:OrderNumber,
                    WorkerLoginId:WorkerLoginId,
                    Type:0,
                    Commission:this.allotMoney
                };

                Ajax({

                    url: https.url + '?action=OperateConsultOrder',
                    dataType: 'json',
                    method: 'post',
                    timeout:100,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    if (arryList != null) {

                        api.toast({
                            msg: '分配成功',
                            duration: 2000,
                            location: 'bottom'
                        });

                    } else {

                       api.toast({
                          msg:arryList,
                          duration: 2000,
                          location: 'bottom'
                       });
                    }

                    //  alert(JSON.stringify(arryList[0]))

                });
            }
        },
        created: function() {

            this.productList2();
            this.requestList();

        },
        mounted: function() {


        }
    })
}
