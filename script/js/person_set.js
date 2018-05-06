apiready = function() {

    var vm = new Vue({

        el: "#person_set",
        data() {

            return {

                isMask: false,
                isConterPopup1: false,
                isConterPopup2: false,
                person: ''

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
            //关闭遮罩层
            CloseMask: function() {

                this.isMask = false;
                this.isPopup = false;
                this.isConterPopup1 = false;
                this.isConterPopup2 = false;
            },
            OutLogin: function() {

                this.isMask = true;
                this.isConterPopup2 = true;

            },
            BtnOut :function() {

              $api.rmStorage('userData');
              SentListen('isLogin', 'closeWin');
            },
              //询问框
            clearCache: function() {

                this.isMask = true;
                this.isConterPopup1 = true;
            },
            //确定键
            BtnCache:function(){

              var self=this;
              api.clearCache(function(ret, err) {

                  if (ret) {
                      self.isMask = false;
                      self.isConterPopup1 =false;
                      document.getElementById("Cache").innerHTML=0+'M';
                      api.toast({
                          msg: '清除完成'
                      });
                  }
              });
            },
            Getperson: function() {

                var self = this;
                var param = {
                    MemLoginId: $api.getStorage("userData").Account
                }
                self.isLogin = $api.getStorage("userData").isLogin;
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


                });
            },


        },
        created: function() {
            //缓存
            api.getCacheSize(function(ret) {

              var size = parseInt((ret.size) / 1024 / 1024);
               document.getElementById("Cache").innerHTML=size+'M';

             });
            this.Getperson();
            //监听手机绑定事件
            api.addEventListener({
                name: 'bindphone'
            }, function(ret, err){
                if( ret ){
                    document.getElementById("bindphone").innerHTML=ret.value.key1;
                }else{
                     alert( JSON.stringify( err ) );
                }
            });

        },
        mounted: function() {

        }
    })
}
