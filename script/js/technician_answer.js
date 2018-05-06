apiready = function() {

    var vm = new Vue({

        el: "#technician_answer",
        data() {

            return {

                List2: '',
                iStheme:false,
                isMask:false,
                changeIndex:'',
                themeIndex0:'',
            }
        },
        methods: {
            //搜索
            getKeywords: function() {

                if (event.keyCode == 13) {

                    var Keywords = this.$refs.Words.value;

                    this.productList2(Keywords);

                };
            },
            //产品2
            productList2: function(str) {


                var param = {
                    PageIndex: 1,
                    PageCount: 5,
                    IsShow: "IsRecommend",
                    IsConsult: 1,
                    CommentType: '1,2',
                    KeyWords: str
                };
                var self = this;
                Ajax({

                    url: https.url + '?action=GetBaskOrderListPage',
                    dataType: 'json',
                    method: 'get',
                    timeout: 30,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    alert(JSON.stringify(arryList))
                    self.List2 = arryList;
                    self.ok2 = true;

                });
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
            //切换页面
            randomSwitchBtn: function( index) {

                this.changeIndex = index;
                this.isMask = true;
                if(index == 0){

                  this.iStheme = true;

                } else if (index == 1) {

                    this.isMask = false;
                    api.openWin({
                        name: 'brand_list',
                        url: './brand_list.html',

                    });
                }else if(index == 2){

                  this.isMask = false;
                  api.openWin({
                      name: 'falut_list',
                      url: './fault_list.html',

                  });
                }
            },
            //选中类别
            themeSwitchBtn: function(index, e, type) {


                this.iStheme = false;
                this.isMask = false;
                this.themeIndex0 = index;
                this.$refs.problem.innerText = e.target.innerText;

            },
            //关闭遮罩层
            CloseMask: function() {

                this.iStheme = false;
                this.isMask = false;
            },
            //查看图片
            PhotoBrowser: function(arr,index) {

                var imageBrowser = api.require('imageBrowser');
                imageBrowser.openImages({
                    imageUrls: arr,
                    activeIndex:index
                });

            }
        },
        created: function() {

            this.productList2();

        },
        mounted: function() {

            var self = this;
            //下拉刷新
            var pullRefresh = new auiPullToRefresh({
                container: document.querySelector('.aui-refresh-content'),
                triggerDistance: 100
            }, function(ret) {

                if (ret.status == "success") {
                    setTimeout(function() {
                        pullRefresh.cancelLoading(); //刷新成功后调用此方法隐藏

                    }, 1000)
                }
            })
        }

    })
}
