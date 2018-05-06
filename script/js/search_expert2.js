apiready = function() {

    var vm = new Vue({

        el: "#search-expert2",
        data() {

            return {

                list1: [],
                index: 1,
                //更新标志
                fage:true,
                companyArr:['../image/up.png','../image/qi.png'],//企业图片
            }
        },

        methods: {

            //列表
            List1: function(index,str) {

                var self = this;
                var param = {
                  PageIndex: index,
                  PageCount: 5,
                  MemberType: 2,
                  KeyWords: str,
                }
                Ajax({
                        url: https.url+ '?action=GetMemberList',
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

                        }
                    });
            },
            //搜索
            getKeywords: function() {

                if (event.keyCode == 13) {

                    this.list1='';
                    var Keywords = this.$refs.Words.value;
                    this.List1(Keywords);
                };
            },
            //跳转页面
            openView:function(url,guid){

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


            this.List1(1);

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

                self.List1(self.index);
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
