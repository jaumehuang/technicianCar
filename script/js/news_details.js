apiready = function() {

    var vm = new Vue({

        el: "#news_detail",
        data() {

            return {

                arrObj: '',
                isCollection: false,
                IsCollectType: 0, //默认收藏
            }
        },
        methods: {

            //文章详情
            GetDetail: function() {

                var id = api.pageParam.id;
                var self = this;
                param = {
                    guid: id
                }
                Ajax({

                    url: https.url + '?action=GetArticle',
                    dataType: 'json',
                    method: 'get',
                    timeout: 30,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    self.arrObj = arryList[0];

                });
            },
            //分享
            MyShare: function() {

                Share()
            },
            addCollection: function() {

                if (!$api.getStorage("userData")) {

                    api.openWin({
                        name: 'login',
                        url: 'login.html',

                    });
                    return false;
                }

                param = {

                    ProductGuid: api.pageParam.id,
                    MemLoginId: $api.getStorage("userData").Account,
                    IsCollect: this.IsCollectType,
                    IsAttention: 0
                }

                var  self =this;
                Ajax({

                    url: https.url + '?action=AddCollect',
                    dataType: 'json',
                    method: 'get',
                    timeout: 100,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    if (arryList != null) {

                        self.isCollection = !self.isCollection;

                        self.IsCollectType = self.isCollection  ? 1 : 0;

                        api.toast({
                            msg:self.isCollection ? '收藏成功' :'取消收藏',
                            duration: 2000,
                            location: 'bottom'
                        });
                        SentListen('collectionNum');
                        if(!self.isCollection){

                          SentListen('collection','',api.pageParam.index);

                        }

                    }

                },true);
            },
            MyCollection: function() {

                if (!$api.getStorage("userData")) {

                    return false;
                }

                param = {

                    ProductGuid: api.pageParam.id,
                    MemLoginId: $api.getStorage("userData").Account,
                    IsAttention: 0
                }
                var self = this;
                Ajax({

                    url: https.url + '?action=GetIsCollect',
                    dataType: 'json',
                    method: 'get',
                    timeout: 30,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    if (arryList == null) {


                        self.isCollection = false;
                        self.IsCollectType = 0;


                    }else{

                       self.isCollection = true;
                       self.IsCollectType = 1;
                    }

                },true);
            }
        },
        created: function() {

            this.GetDetail();
            this.MyCollection();

        },
        mounted: function() {

        }
    })
}
