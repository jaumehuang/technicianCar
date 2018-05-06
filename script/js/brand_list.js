apiready = function() {

    var vm = new Vue({

        el: "#brand_list",
        data() {

            return {

                list: [],
                index:1
            }
        },

        methods: {

            //列表
            brandList: function(index) {

                var self = this;
                var param = {
                    PageCount: 500,
                    PageIndex: index
                }
                Ajax({
                        url: https.url + '?action=GetBrandList',
                        dataType: 'json',
                        method: 'get',
                        timeout: 30,
                        data: {
                            values: param,
                        }
                    },
                    function(arryList) {

                        if (arryList != null) {

                            self.list = self.list.concat(arryList);

                        }
                    });
            },
            //选中品牌
            changeBrand:function(name,guid){

                 SentListen('Brand','closeWin',name,guid);
            }
        },
        created: function() {

            this.brandList(1);

        },
        mounted: function() {

        },
        updated:function(){

             citySort("html,body");
        }
    })
}
