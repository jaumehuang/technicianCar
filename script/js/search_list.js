apiready = function() {

    var vm = new Vue({

        el: "#search_list",
        data() {

            return {

                list1: [],
                list2: [],
                list3: [],
                list4: [],
                ok1: false,
                ok2: false,
                ok3: false,
                ok4: false,

            }
        },
        methods: {

            //技师
            search1: function(str) {


                var param = {
                    PageIndex: 1,
                    PageCount: 3,
                    MemberType: 3,
                    KeyWords:  str ? str : api.pageParam.Words ,
                };
                var self = this;
                Ajax({

                    url: https.url + '?action=GetMemberList',
                    dataType: 'json',
                    method: 'get',
                    timeout: 30,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                   if(arryList!=null){

                     self.ok1 = true;
                     self.list1 = arryList;
                   }else{

                     self.ok1 = false;
                   }

                }, true);

            },
            //专家
            search2: function(str) {


                var param = {
                    PageIndex: 1,
                    PageCount: 3,
                    MemberType: 2,
                    KeyWords: str ? str : api.pageParam.Words,
                };
                var self = this;
                Ajax({

                    url: https.url + '?action=GetMemberList',
                    dataType: 'json',
                    method: 'get',
                    timeout: 30,
                    data: {
                        values: param,
                    }
                }, function(arryList) {


                  if(arryList!=null){

                    self.ok2 = true;
                    self.list2 = arryList;
                  }else{

                    self.ok2 = false;
                  }

                }, true);

            },
            //评价
            search3: function(str) {


                var param = {
                    PageIndex: 1,
                    PageCount: 3,
                    IsShow: "IsRecommend",
                    IsConsult: 0,
                    CommentType: '1',
                    KeyWords:str ? str : api.pageParam.Words
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

                  if(arryList!=null){

                    self.ok3 = true;
                    self.list3= arryList;
                  }else{

                    self.ok3 = false;
                  }

                }, true);

            },
            //资讯
            search4: function(str) {


                var param = {
                    PageIndex: 1,
                    PageCount: 3,
                    KeyWords:str ? str : api.pageParam.Words
                };
                var self = this;
                Ajax({

                    url: https.url + '?action=GetArticleList',
                    dataType: 'json',
                    method: 'get',
                    timeout: 30,
                    data: {
                        values: param,
                    }
                }, function(arryList) {


                  if(arryList!=null){

                    self.ok4 = true;
                    self.list4 = arryList;
                  }else{

                    self.ok4 = false;
                  }

                }, true);

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
            //查看图片
            PhotoBrowser: function(arr,index) {

                var imageBrowser = api.require('imageBrowser');
                imageBrowser.openImages({
                    imageUrls: arr,
                    activeIndex:index
                });

            },
            //搜索
            getKeywords: function() {

                if (event.keyCode == 13) {

                    this.list1='';
                    this.list2='';
                    this.list3='';
                    this.list4='';
                    var Keywords = this.$refs.Words.value;
                    this.search1(Keywords);
                    this.search2(Keywords);
                    this.search3(Keywords);
                    this.search4(Keywords);

                };
            },
        },
        //数据创建中
        created: function() {

            this.search1();
            this.search2();
            this.search3();
            this.search4();
        },
        //数据编译完成
        mounted: function() {

        },
        //数据渲染完
        updated: function() {

            this.$nextTick(function() {
                var div = document.getElementById('search_list');
                div.scrollTop = 0;
            })
        }
    })
}
