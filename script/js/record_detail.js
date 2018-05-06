apiready = function() {

    var vm = new Vue({

        el: "#record_detail",
        data() {

            return {

               record:''
            }
        },
        methods: {
            //详情
            record_detail: function() {

                var param = {
                    MemLoginId: $api.getStorage("userData").Account,
                            Id:api.pageParam.id
                }
              
                var self = this;
                Ajax({

                    url: https.url + '?action=GetMemberAdvancePaymentModifyLogDetail',
                    dataType: 'json',
                    method: 'get',
                    timeout: 30,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    if (arryList != null) {

                        self.record = arryList[0];
                    }



                });
            }
        },
        created: function() {

           this.record_detail()
        },
        mounted: function() {


        }

    })
}
