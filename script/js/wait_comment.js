apiready = function() {
    var vm = new Vue({

        el: "#wait-comment",
        data() {
            return {

                details:'',
                OrderNumber:'',
                workerLoginId:'',
                statusText1: ['待接单', '技师取消订单', '待支付', '服务中', '待评价', '已完成', '已退款'],//订单状态
                handleText: ['确定取消该订单?', "确定该订单已完成?"],
            }
        },
        methods: {
            //订单详情
            detailsList: function(OrderNumber,WorkerLoginId) {

                var param = {

                    OrderNumber:OrderNumber,
                    MemLoginId:$api.getStorage("userData").Account,
                    WorkerLoginId:WorkerLoginId
                };
                var self = this;
                Ajax({

                    url: https.url + '?action=GetRepairOrder',
                    dataType: 'json',
                    method: 'get',
                    timeout: 30,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    if (arryList != null) {


                        self.details = arryList[0];
                        // alert(JSON.stringify(arryList));
                    }

                });
            },
            //查看图片
            PhotoBrowser: function(arr,index) {

                var imageBrowser = api.require('imageBrowser');
                imageBrowser.openImages({
                    imageUrls: arr,
                    activeIndex:index
                });

            },
            //订单操作
            handleOrder: function(index,type, orderNumber, workerLoginId, buyPrice) {

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

                            SentListen('changeStatus','closeWin');
                        }
                    }

                });
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
        },
        created: function() {


            if(api.pageParam.id.indexOf('|')>-1){

              var arr = api.pageParam.id.split("|");
              this.OrderNumber = arr[0];
              this.workerLoginId = arr[1];
              this.detailsList(arr[0],arr[1]);

            } else{


               this.OrderNumber = api.pageParam.id;
               this.workerLoginId ='';
               this.detailsList(api.pageParam.id,'');
            }


        }
    })
}
