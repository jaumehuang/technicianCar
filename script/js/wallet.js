apiready = function() {

    var vm = new Vue({

        el: "#wallet",
        data() {

            return {

                Ismoney: false,
                record:[],
                nullrecord:false,

            }
        },
        methods: {

            //跳转页面
            openView: function(url,guid) {

                api.openWin({
                    name: url,
                    url: url + '.html',
                    pageParam: {
                        id: guid,
                        name: 0
                    }
                });
            },
            Getperson: function() {

                var self = this;

                var param = {
                    MemLoginId: $api.getStorage("userData").Account
                }

                Ajax({

                    url: https.url + '?action=GetMember',
                    dataType: 'json',
                    method: 'get',
                    timeout: 30,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    if (arryList != null) {

                        self.$refs.AdvancePayment.innerText = (arryList[0].AdvancePayment) / 10000 + '万';
                        self.Ismoney = true;
                    }else{

                       self.nullrecord =true;
                    }

                    //  alert(JSON.stringify(arryList[0]))

                });
            },
            //交易记录
            TransactionRecord: function() {

                var param = {
                    MemLoginId: $api.getStorage("userData").Account,
                    PageIndex:1,
                    PageCount:8,
                    OperateType:''
                }
                var self=this;
                Ajax({

                    url: https.url + '?action=GetMemberAdvancePaymentModifyLogList',
                    dataType: 'json',
                    method: 'get',
                    timeout: 30,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    if (arryList != null) {

                      self.record=self.record.concat(arryList);
                    }

                    //  alert(JSON.stringify(arryList))

                });
            },

        },
        created: function() {

            this.Getperson();
            this.TransactionRecord();
        },
        mounted: function() {

        }

    })
}
