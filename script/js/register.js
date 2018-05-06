apiready = function() {

    var vm = new Vue({

        el: "#register",
        data() {

            return {

                phone: '',
                pwd: '',
                code: ''
            }
        },
        methods: {

            //跳转页面
            openView: function(url) {

                api.openWin({
                    name: url,
                    url: url + '.html',
                });
            },
            //提交数据
            GetData: function() {

                 var phone=this.$refs.phone.value;
                 var code =this.$refs.code.value;
                 var pwd=this.$refs.pwd.value;

                //判断
                if (phone == 0 || code == 0 || pwd == 0) {

                    api.toast({
                        msg: '输入框为空',
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
                    Phone:phone,
                    Pwd: pwd,
                    Code: code,
                    MemberType: 0,

                };


                var self = this;
                Ajax({

                    url: https.url + '?action=MemberRegister',
                    dataType: 'json',
                    method: 'post',
                    timeout: 30,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                     if(arryList==null){

                        api.toast({
                            msg: arryList,
                            duration: 2000,
                            location: 'bottom'
                        });
                        return false;
                     }

                    var param={
                          Account:arryList.MemLoginId,
                          isLogin:true
                        }
                     //本地保存数据
                   $api.setStorage('userData',param);
                   SentListen('isLogin','root');
                });
            }
        },
        created: function() {


        },
        mounted: function() {

        }
    })
}
