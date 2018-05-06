apiready = function() {

    var vm = new Vue({

        el: "#brand_list",
        data() {

            return {

                list1: [],
                list2: [],
                index: 1,
                //更新标志
                fage:true,
                changeIndex:0,
            }
        },

        methods: {

            //列表
            brandList1: function(index) {

                var self = this;
                var param = {
                    PageCount: 500,
                    PageIndex: index,
                    CategoryLevel:1
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


                            self.list1 = self.list1.concat(arryList);
                            self.brandList2(self.changeIndex,arryList[0].Guid, arryList[0].Name);

                        }
                    });
            },
            brandList2:function(index,guid,name) {

                this.list2='';
                this.changeIndex=index;
                var self = this;
                var param = {

                    PageCount: 500,
                    PageIndex: 1,
                    CategoryLevel:2,
                    FatherId: guid
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


                            self.list2 = arryList;
                          

                        } else {

                            self.list2 = [{
                                Name: name,
                                Guid:guid
                            }];

                        }
                    },true);
            },

            //选中车系
            changeBrand:function(guid,name){

                //发送监听
                SentListen("car_brand",'closeWin',guid,name);
            }

        },
        created: function() {


            this.brandList1(1);

        },
        mounted: function() {



        },
        //数据渲染完
        updated: function() {

          //排序
          if(this.fage){

            this.fage=false;
            var header = $api.byId('header');
            var headerPos = $api.offset(header);
            document.getElementById("hot_list").style.height=api.winHeight  - headerPos.h - 20;
            document.getElementById("two_list").style.height=api.winHeight - headerPos.h - 20;
            setTimeout(function() {

                citySort("html,body");

             }, 100);

          }

        }
    })
}
