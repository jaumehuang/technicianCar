apiready = function() {

    var vm = new Vue({

       el:"#new",
        data() {

            return {

                  null:false,
            }
        },
        methods: {

            list: function() {

                var param = {

                    MemLoginId: $api.getStorage("userData").Account,


                }
                console.log(JSON.stringify(param))
                var self = this;
                Ajax({

                    url: https.url + '?action=GetMessage',
                    dataType: 'json',
                    method: 'post',
                    timeout: 30,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    if (arryList != null) {

                          alert(arryList);
                    }else{

                       self.null=true
                    }
                });
            }
        },
        created: function() {

           this.list();

        },
        mounted:function(){

        },
        updated:function(){

             if(self.null){
               
             }

        }

    })

}
