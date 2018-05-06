apiready = function() {

    var vm = new Vue({

        el: "#record2",
        data() {

            return {

                recorDate: '',//日期列表
                recordList:''//分期

            }
        },
        methods: {

            //获取日期
            listDate: function() {

                var param = {

                    MemLoginId: $api.getStorage("userData").Account,


                }

                var self = this;
                Ajax({

                    url: https.url + '?action=GetMemberAdvancePaymentModifyLogDate',
                    dataType: 'json',
                    method: 'post',
                    timeout: 30,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    if (arryList != null) {


                        self.recorDate = arryList;
                        for(var i =0; i< arryList.length;i++){

                             self.listRecord(arryList[i].date);
                        }
                    } else {


                    }
                });
            },
            //获取详细的列表
            listRecord: function(date) {

                var param = {

                    MemLoginId: $api.getStorage("userData").Account,
                    Date:date

                }
                console.log(JSON.stringify(param))
                var self = this;
                Ajax({

                    url: https.url + '?action=GetMemberAdvancePaymentModifyLog',
                    dataType: 'json',
                    method: 'post',
                    timeout: 30,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    if (arryList != null) {

                        self.recordList = arryList;
                    } else {

                    }
                });
            },
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

        },
        created: function() {

            this.listDate();
        },
        mounted: function() {

        }
    })
}
