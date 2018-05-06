apiready = function() {

    var vm = new Vue({

        el: "#person",
        data() {

            return {

                isLogin: false,
                person: {
                    AdvancePayment: '0.0',
                    Colnum:0,

                }

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
            //判断是否登录
            IsLogin: function(url) {

                this.openView(url);
            },
            //跳转根目录.并且刷新
            rootView: function(str, type) {

                if (str == 'login') {

                    this.openView(str);
                    return false;
                }

                api.sendEvent({

                    name: 'order',
                    extra: {
                        key1: str,
                        key2: type
                    }
                });
                if (type == 1) {

                    $api.setStorage('ordertype', 1);
                } else if (type == 0) {

                    if ($api.getStorage("ordertype")) {

                        $api.rmStorage('ordertype');
                    }

                }
            },
            Getperson: function() {

                var self = this;
                if (!$api.getStorage("userData")) {

                    return false;
                };
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
                    self.$refs.AdvancePayment.innerText = self.SwitchMetering(arryList[0].AdvancePayment);
                    //  alert(JSON.stringify(arryList[0]))

                });
            },
            SwitchMetering: function(n) {

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
            //收藏数量或者关注文章
            collectionNum: function(type) {

              if (!$api.getStorage("userData")) {

                  return false;
              };
                var param = {
                    MemLoginId: $api.getStorage("userData").Account,
                    IsAttention:type
                }
                var self=this;
                Ajax({

                    url: https.url + '?action=GetCollectCount',
                    dataType: 'json',
                    method: 'get',
                    timeout: 30,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    if(arryList!=null){


                       if(type==0){

                         self.$refs.Colnum.innerText=arryList[0].Column1;

                       }else if(type==1){

                         self.$refs.follow.innerText=arryList[0].Column1;
                       }
                    }

                }, true);
            }
        },
        created: function() {

            var self=this;
            this.Getperson();
            //监听登录状态
            api.addEventListener({
                name: 'isLogin'
            }, function(ret, err) {

                if (ret) {

                    window.location.reload();
                }
            });
            //监听修改头像
            api.addEventListener({
                name: 'changePhoto'
            }, function(ret, err) {

                if (ret) {

                    document.getElementById("photo").src = ret.value.key1;

                } else {

                }
            });
            //监听昵称变化
            api.addEventListener({
                name: 'changeName'
            }, function(ret, err) {

                if (ret) {

                    window.location.reload();

                } else {

                }
            });
            api.addEventListener({
                name: 'collection'
            }, function(ret, err){
                if( ret ){
                     window.location.reload();
                }else{
                     alert( JSON.stringify( err ) );
                }
            });
           //收藏初始化
           this.collectionNum(0);
           this.collectionNum(1);
           //监听文章收藏
           api.addEventListener({
               name: 'collectionNum'
           }, function(ret, err){
               if( ret ){

                    self.collectionNum(0);
               }else{
                    alert( JSON.stringify( err ) );
               }
           });


        },
        mounted: function() {



        }
    })
}
