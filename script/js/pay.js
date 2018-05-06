apiready = function() {

    var vm = new Vue({

        el: "#pay",
        data() {

            return {

                changeIndex: 0,//支付方式
            }
        },
        methods: {

            //切换支付方式
            SwitchPay: function(index) {

                this.changeIndex = index;
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

                    self.$refs.AdvancePayment.innerText = "当前余额" + arryList[0].AdvancePayment+'元';

                });
            },
            //获取订单价格
            GetRepairOrderPayPrice: function() {

                var param = {

                    MemLoginId: $api.getStorage("userData").Account,
                    OrderNumber: api.pageParam.id
                }
                var self = this;
                Ajax({

                    url: https.url + '?action=GetRepairOrderPayPrice',
                    dataType: 'json',
                    method: 'get',
                    timeout: 30,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    if (arryList != null) {

                        //  alert(JSON.stringify(arryList))
                        self.$refs.shouldpay.innerText = '需支付' + arryList + '元';
                    }

                });
            },
            //跳转页面
            openView: function(url, guid) {

                api.openWin({
                    name: url,
                    url: url + '.html',
                    pageParam: {
                        id: guid,
                        name: 0
                    }
                });
            },
            //开启支付键盘
            OpenKeyborad: function() {

                var self=this;
                var $keyboard = $('#J_KeyBoard');

                /* 初始化参数 */
                $keyboard.keyBoard({
                    disorder: false,
                    /* 是否打乱数字顺序 */
                    title: '安全键盘' /* 显示标题 */
                });

                /* 打开键盘 */

                $keyboard.keyBoard('open');


                /* 六位密码输入完毕后执行 */
                $keyboard.on('done.ydui.keyboard', function(ret) {

                    // console.log('输入的密码是：' + ret.password);

                    YDUI.dialog.loading.open('验证支付密码');
                    // setTimeout(function() {
                    //     /* 显示错误信息 */
                    //
                    //
                    // }, 1500);

                    self.BtnPay($keyboard,ret.password);
                    /* 关闭键盘 */
                    /* $keyboard.keyBoard('close'); */
                });
            },
            //支付
            BtnPay:function($keyboard,payPwd){

              var param = {

                  MemLoginId: $api.getStorage("userData").Account,
                  OrderNumber: api.pageParam.id,
                  PayPwd:payPwd
              }
              var self = this;
              Ajax({

                  url: https.url + '?action=PayAdvancepayment',
                  dataType: 'json',
                  method: 'post',
                  timeout: 30,
                  data: {
                      values: param,
                  }
              }, function(arryList) {

                   YDUI.dialog.loading.close();
                  if (arryList != null) {

                       //发送监听
                       SentListen('order', 'root');

                  }else{

                     $keyboard.keyBoard('error', '对不起，您的支付密码不正确，请重新输入。');
                  }

              },true);

            }
        },
        created: function() {

            this.Getperson();
            this.GetRepairOrderPayPrice();

        },
        mounted: function() {


        }
    })
}
