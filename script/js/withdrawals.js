apiready = function() {

    var vm = new Vue({

        el: "#withrawals",
        data() {

            return {

                isWeixin: true,
                isBank: false,
                isAipay: false,
                isMask: false,
                isConterPopup: false,
                Witype: 'weixin',
                WitypeName: '微信',
                WiImg: '../image/pay1.png',
                type: 'weixin',
                money:'',
                moneyCount:''

            }
        },
        methods: {

             //提现金额
             Getperson:function(){

               var self=this;
               if(!$api.getStorage("userData")){

                  return false;
               }
                var param = {
                   MemLoginId: $api.getStorage("userData").Account
                }
                self.isLogin=$api.getStorage("userData").isLogin;
               Ajax({

                   url: https.url + '?action=GetMember',
                   dataType: 'json',
                   method: 'get',
                   timeout: 30,
                   data: {
                       values: param,
                   }
               }, function(arryList) {

                   self.person = arryList[0];
                   self.money=self.SwitchMetering(arryList[0].AdvancePayment);
                   self.moneyCount=arryList[0].AdvancePayment;

               });
             },
             SwitchMetering :function (n) {

                 if (n >= 10000) {

                     var strArr = (parseFloat(n / 10000)).toString().split('.');
                     if (strArr[1]) {

                         if (strArr[1].length > 4) {
                             //
                             return strArr[0] + '.' + strArr[1].substring(0, 4) + '万';
                             //
                         }
                         return parseFloat(n / 10000) + '万';
                     }

                     return n = parseFloat(n / 10000) + '万';
                 } else {

                     return n;
                 }
             },
            //切换提现方式
            withdrawalsType: function(type) {

                this.Witype = type;
                this.isMask = false;
                this.isConterPopup = false;
                switch (type) {
                    case 'weixin':
                        this.WiImg = '../image/pay1.png';
                        this.WitypeName = "微信";
                        this.type = type;
                        break;
                    case 'bank':
                        this.WiImg = '../image/bank.png';
                        this.WitypeName = "银行";
                        this.type = type;
                        break;
                    case 'aipay':
                        this.WiImg = '../image/aipay.png';
                        this.WitypeName = "支付宝";
                        this.type = type;
                        break;
                    default:

                }
            },
            //关闭遮罩层
            CloseMask: function() {

                this.isMask = false;
                this.isConterPopup = false;
            },
            //打开弹窗
            ChangePay: function() {

                this.isMask = true;
                this.isConterPopup = true;
            },
            //提交数据
            BtnData: function(type) {
                //
                // alert(type)
                switch (type) {
                    case 'weixin':
                        var pay1 = this.$refs.pay1.value;
                        var weixin_acount=this.$refs.weixin_acount.value;
                        var weixin_name=this.$refs.weixin_name.value;
                        if (pay1.length == 0 ||weixin_acount.length||weixin_name.length) {

                            api.toast({
                                msg: '输入框为空',
                                duration: 2000,
                                location: 'bottom'
                            });
                            return false;
                        }
                        var param = {
                            MemLoginId: $api.getStorage("userData").Account,
                            TrueName: weixin_name,
                            OperateMoney: pay1,
                            PaymentName: '微信',
                            BankName: '微信钱包',
                            Account: $api.getStorage("userData").Account
                        };
                        this.GiveData(param);
                        break;
                    case "bank":

                        var pay2 = this.$refs.pay2.value;
                        var bank_acount = this.$refs.bank_acount.value;
                        var bank_num = this.$refs.bank_num.value;
                        var bank_name = this.$refs.bank_name.value;

                        if (pay2.length == 0 || bank_acount.length == 0 || bank_num.length == 0 || bank_name.length == 0) {

                            api.toast({
                                msg: '输入框为空',
                                duration: 2000,
                                location: 'bottom'
                            });
                            return false;
                        };
                        //验证银行卡号;
                        if (bank_num.length < 16 || bank_num.length > 19) {

                            api.toast({
                                msg: '银行卡号长度必须在16到19之间',
                                duration: 2000,
                                location: 'bottom'
                            });

                            return false;
                        }
                        var num = /^\d*$/; //全数字
                        if (!num.exec(bank_num)) {


                            api.toast({
                                msg: '银行卡号必须全为数字',
                                duration: 2000,
                                location: 'bottom'
                            });

                            return false;
                        }
                        //开头6位
                        var strBin = "10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";
                        if (strBin.indexOf(bank_num.substring(0, 2)) == -1) {

                          api.toast({
                              msg: '银行卡号开头6位不符合规范',
                              duration: 2000,
                              location: 'bottom'
                          });

                            return false;
                        }
                        var param = {
                            MemLoginId: $api.getStorage("userData").Account,
                            TrueName: bank_acount,
                            OperateMoney: pay2,
                            PaymentName: '银行',
                            BankName: bank_name,
                            Account: bank_num
                        };
                        this.GiveData(param);

                        break;
                      case "aipay":

                      var pay3 = this.$refs.pay3.value;
                      var aipay_num = this.$refs.aipay_num.value;
                      var aipay_name = this.$refs.aipay_name.value;
                      // var aipay_phone = this.$refs.aipay_phone.value;

                      if (pay3.length == 0||aipay_num.length == 0||aipay_name.length == 0||aipay_phone.length == 0) {

                          api.toast({
                              msg: '输入框为空',
                              duration: 2000,
                              location: 'bottom'
                          });
                          return false;
                      };
                    //  var reg = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
                     //
                    //  if(!reg.test(aipay_phone)){
                     //
                    //    api.toast({
                    //        msg: '手机格式错误',
                    //        duration: 2000,
                    //        location: 'bottom'
                    //    });
                    //     return false;
                     //
                    //  }
                      var param = {
                          MemLoginId: $api.getStorage("userData").Account,
                          TrueName: aipay_name,
                          OperateMoney: pay3,
                          PaymentName: '支付宝',
                          BankName: '支付宝',
                          Account:aipay_num
                      };
                      this.GiveData(param);

                        break;
                    default:

                }
                return false;


            },
            //数据提交
            GiveData: function(param) {

                if(param.OperateMoney>this.moneyCount){

                  api.toast({
                      msg: '提现大于额度',
                      duration: 2000,
                      location: 'bottom'
                  });
                  return false;
                }
                var self = this;
                Ajax({

                    url: https.url + '?action=MemberWithdraw',
                    dataType: 'json',
                    method: 'post',
                    timeout: 30,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    SentListen('MemberWithdraw', 'closeWin');

                });
            },
            //监听输入银行卡号
            formatBankNo: function() {


            }

        },
        created: function() {

            this.Getperson();
        },
        mounted: function() {

        },
        watch: {


        }
    });
    var vm2 = new Vue({

        el: "#header",
        methods: {

            //跳转页面
            openView: function(url) {

                api.openWin({
                    name: url,
                    url: url + '.html',
                });
            },
        }
    })
}
