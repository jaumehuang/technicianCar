apiready = function() {

    var vm = new Vue({

        el: "#fault_list",
        data() {

            return {

                list1: [],
                index: 1,
                //更新标志
                fage:true
            }
        },

        methods: {

            //列表
            falutList1: function(index) {

                var self = this;
                var param = {
                    PageCount: 20,
                    PageIndex: index
                }
                Ajax({
                        url: https.url+ '?action=GetBreakdownList',
                        dataType: 'json',
                        method: 'get',
                        timeout: 30,
                        data: {
                            values: param,
                        }
                    },
                    function(arryList) {

                        if (arryList != null) {

                            self.index=self.index+1;
                            self.list1 = self.list1.concat(arryList);
                            // alert(JSON.stringify(arryList))

                        }
                    });
            },
            //选中
            changeFault:function(guid,name){

              //发送监听
              SentListen("fault",'closeWin',guid,name);

            }


        },
        created: function() {


            this.falutList1(1);

        },
        mounted: function() {


          //下拉刷新
          var self=this;
          var pullRefresh = new auiPullToRefresh({
            container: document.querySelector('.aui-refresh-content'),
            triggerDistance: 100
          }, function(ret) {

            if(ret.status == "success") {
              setTimeout(function() {

                self.falutList1(self.index);
                pullRefresh.cancelLoading(); //刷新成功后调用此方法隐藏

              }, 1000)
            }
          })

        },
        //数据渲染完
        updated: function() {

          //排序
          if(this.fage){


          }

        }
    })
}
