apiready =function(){

    var  vm = new Vue({

        el:"#bindphone",
        data(){

           return {

           }
        },
        methods:{

          BtnData: function() {

              var phone = this.$refs.myphone.value;
              var code = this.$refs.code.value;
              //判断
              if (phone == 0 || code == 0 ) {

                  api.toast({
                      msg: '输入框为空',
                      duration: 2000,
                      location: 'bottom'
                  });
                  return false;
              };


              var param = {
                  MemLoginId:$api.getStorage("userData").Account,
                  Values: phone,
                  Code: code,
                  OperateType: 'UpdateMobile',

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
                 SentListen('bindphone','closeWin',phone);
              });

          },
        },
        created:function(){

        },
        mounted:function(){


        }
    })
}
