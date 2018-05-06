apiready=function(){

    var vm = new Vue({

        el:"#login",
        data(){

           return {

           }
        },
        methods:{

          //跳转页面
            openView:function(url){

              api.openWin({
                  name: url,
                  url: url + '.html',
              });
            },
            //登录
            Login:function(){


              var phone=this.$refs.myphone.value;
              var pwd=this.$refs.pwd.value;
              if(phone.length==0||pwd.length==0){

                 api.toast({
                     msg: '输入框为空',
                     duration: 2000,
                     location: 'bottom'
                 });
                 return false;
              }
              var reg = /^1[3|4|5|7|8][0-9]\d{4,8}$/;

                if (!reg.test(phone)) {

                   api.toast({
                       msg: '手机号码格式错误',
                       duration: 2000,
                       location: 'bottom'
                   });
                   return false;
                };
                var param = {
                    Phone:phone,
                    Pwd: pwd,
                    PwdType:0,
                };
                var self = this;
                Ajax({

                    url: https.url + '?action=MemberLogin',
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
        created:function(){

        },
        mounted:function(){

        }
    })
}
