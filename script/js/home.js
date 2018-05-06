apiready = function() {


    //vue2.0
    var vm = new Vue({

        el: "#home",
        data() {

            return {
                //显示图标
                ok1: false,
                ok2: false,
                ok3: false,
                //判断是否登录
                isLogin: true,
                //banner
                bannerList: [],
                //产品1
                List1: [],
                //产品2
                List2: []
            }

        },
        methods: {

            //判断是否登录
            IsLogin: function(url) {

                this.openView(url);
            },
            //定位功能
            getLocation: function() {

                var bMap = api.require('bMap');
                bMap.getLocation({
                    accuracy: '100m',
                    autoStop: true,
                    filter: 1
                }, function(ret, err) {
                    if (ret.status) {

                        var param = {
                                lon: ret.lon,
                                lat: ret.lat
                            }
                            //本地保存数据
                        $api.setStorage('getLocation', param);

                    } else {

                        var param = {
                                lon: 116.213,
                                lat: 39.213
                            }
                            //本地保存数据
                        $api.setStorage('getLocation', param);
                    }
                });
            },
            //轮播图
            AutoBanner(callback) {

                var param = {
                    ConfigType: 5
                };
                var self = this;
                Ajax({

                    url: https.url + '?action=GetDefaultBanner',
                    dataType: 'json',
                    method: 'get',
                    timeout: 300,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    if (arryList != null) {

                        self.bannerList = arryList;

                        setTimeout(function() {

                            var mySwiper = new Swiper('.swiper-container', {
                                autoplay: 3000, //可选选项，自动滑动
                                loop: true,
                                pagination: '.swiper-pagination',
                                loopAdditionalSlides: 1,
                                autoplayDisableOnInteraction: false,
                            })

                        }, 500)
                    }

                });
            },
            //产品文章
            productList1: function(callback) {


                var param = {
                    PageIndex: 1,
                    PageCount: 3,
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

                      self.List1 = arryList;
                      self.ok1 = true;
                    }


                    callback()
                });

            },
            //评论
            productList2: function() {

                var param = {
                    PageIndex: 1,
                    PageCount: 3,
                    IsShow: "IsRecommend",
                    IsConsult: 1,
                    CommentType: '1,2'
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

                    if (arryList != null) {

                        self.List2 = arryList;
                        self.ok2 = true;
                    }


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
            //初始化函数
            init: function() {

                var self = this;
                this.productList1(function() {

                    self.productList2();
                });
                this.getLocation();
            },
        },
        //周期函数,完成了 data 数据的初始化
        created: function() {

            this.init();


        },
        //周期函数,完成挂载,zhi
        mounted: function() {

            this.AutoBanner();
        }
    })
};
