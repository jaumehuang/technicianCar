apiready = function() {

    var vm = new Vue({

        el: "#change_password",
        data() {

            return {

             person:'',
             rpwd:''
            }
        },
        methods: {

            BtnData: function() {

                var phone = this.$refs.myphone.value;
                var code = this.$refs.code.value;
                var pwd = this.$refs.pwd.value;
                var rpwd =this.$refs.rpwd.value;

                //判断
                if (phone == 0 || code == 0 || pwd == 0||rpwd==0) {

                    api.toast({
                        msg: '输入框为空',
                        duration: 2000,
                        location: 'bottom'
                    });
                    return false;
                };
                if (pwd!=rpwd) {

                    api.toast({
                        msg: '两次输入密码不一致',
                        duration: 2000,
                        location: 'bottom'
                    });
                    return false;
                };
                if (!(/^.{6,20}$/).test(pwd) || (/[\u4e00-\u9fa5]+/ig).test(pwd)) {

                    api.toast({
                        msg: '6~20位数的密码,不包含中文。',
                        duration: 2000,
                        location: 'bottom'
                    });
                    return false;
                }
                var param = {
                    MemLoginId:$api.getStorage("userData").Account,
                    Values: pwd,
                    Code: code,
                    OperateType: 'UpdatePwd',

                };

                var self = this;
                Ajax({

                    url: https.url + '?action=OperateMember',
                    dataType: 'json',
                    method: 'post',
                    timeout: 30,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    if (arryList == null) {

                        api.toast({
                            msg: arryList,
                            duration: 2000,
                            location: 'bottom'
                        });
                        return false;
                    }
                    api.closeWin();
                });

            },
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
                 //  alert(JSON.stringify(arryList[0]))

              });
            }

        },
        created: function() {

            this.Getperson();

        },
        mounted: function() {

        },
        watch:{
            //监听输入框
            rpwd:function(){


            }
        }
    })

}
