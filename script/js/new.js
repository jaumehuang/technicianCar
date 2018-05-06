apiready = function() {

    var vm = new Vue({

        el: "#newList",
        data() {

            return {

                list: [],
                //翻页
                index:1,

            }
        },
        methods: {

            getKeywords: function() {

                if (event.keyCode == 13) {

                    var Keywords = this.$refs.Words.value;
                    this.list=[];
                    this.newsList(Keywords,1);
                };
            },
            newsList: function(str,index) {

                var self = this;
                var param = {
                    PageIndex: index,
                    PageCount: 1,
                    KeyWords: str
                }

                Ajax({

                    url: https.url + '?action=GetArticleList',
                    dataType: 'json',
                    method: 'get',
                    timeout: 300,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    if(arryList!=null){

                      self.index=self.index+1;
                      self.list = self.list.concat(arryList);

                    }



                })
            },
            //跳转页面
            openView: function(url, guid) {

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

            this.newsList('',1);
        },
        mounted: function() {

            var self=this;
            //下拉刷新
            var pullRefresh = new auiPullToRefresh({
                container: document.querySelector('.aui-refresh-content'),
                triggerDistance: 100
            }, function(ret) {

                if (ret.status == "success") {
                    setTimeout(function() {

                        self.newsList('',self.index);
                        pullRefresh.cancelLoading(); //刷新成功后调用此方法隐藏

                    }, 1000)
                }
            })
        }
    })

}
