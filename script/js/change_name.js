apiready = function() {

    var vm = new Vue({

        el: "#change_name",
        data() {

            return {


            }
        },
        methods: {

            //提交数据
            GetData: function() {

                var name =document.getElementById("name").value;
                if(name.length==0){

                   api.toast({
                       msg: '输入框为空',
                       duration: 2000,
                       location: 'bottom'
                   });
                  return false;
                }
                var param = {
                    MemLoginId: $api.getStorage('userData').Account,
                    OperateType: 'UpdateRealName',
                    Values: name,
                }
                Ajax({
                        url: https.url + '?action=OperateMember',
                        dataType: 'json',
                        method: 'post',
                        timeout: 30,
                        data: {
                            values: param,
                        }
                    },
                    function(arryList) {

                        if (arryList != null) {

                          SentListen('changeName','closeWin',arryList)

                        }
                    });
            }
        },
        created: function() {

        },
        mounted: function() {

        }
    })
}
