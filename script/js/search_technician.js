apiready = function() {

    var vm = new Vue({

        el: "#search_technicians",
        data() {

            return {

                changeIndex:'',
                switchBool0: false, //切换箭头
                switchBool1: false, //切换箭头
                switchBool2: false, //切换箭头
                list1: [], //技师
                index: 1,//翻页
                GradeSort:'',
                DistanceSort:'',
                OrderCountSort:''

            }
        },
        methods: {

            //切换页面
            randomSwitchBtn: function(e, index) {

                this.changeIndex = index;
                this.iStheme = true;
                this.list1=[];
                switch (index) {
                    case 0:
                        //距离
                        this.switchBool0=!this.switchBool0;

                        if(this.switchBool0){

                          this.List(1,'',this.GradeSort,'desc',this.OrderCountSort);//最远

                        }else{

                           //最近
                           this.List(1,'',this.GradeSort,'asc',this.OrderCountSort)
                        }

                        break;
                    case 1:
                    //评价
                        this.switchBool1=!this.switchBool1;

                        if(this.switchBool1){


                          this.List(1,'','desc',this.DistanceSort,this.OrderCountSort)  ;//最高

                        }else{

                           this.List(1,'','asc',this.DistanceSort,this.OrderCountSort);//最低
                        }

                        break;
                    case 2:
                    //接单
                        this.switchBool2=!this.switchBool2;

                        if(this.switchBool2){

                          this.List(1,'',this.GradeSort,this.OrderCountSort,'desc');//接单最多

                        }else{

                           this.List(1,'',this.GradeSort,this.OrderCountSort,'asc');//接单最低
                        }
                        break;

                    default:

                }
                // this.switchBool=!this.switchBool;

            },
            //修理技师
            List: function(index, str,GradeSort,DistanceSort,OrderCountSort) {

                var self = this;
                //定位
                var getLocation = $api.getStorage("getLocation");
                var param = {
                    PageIndex: index,
                    PageCount: 5,
                    MemberType: 3,
                    KeyWords: str,
                    GradeSort:GradeSort,//评分
                    DistanceSort: DistanceSort,//距离
                    OrderCountSort:OrderCountSort,//接单\次数
                    Coordinate: getLocation.lon + ',' + getLocation.lat,
                }

                Ajax({
                        url: https.url + '?action=GetMemberList',
                        dataType: 'json',
                        method: 'get',
                        timeout: 50,
                        data: {
                            values: param,
                        }
                    },
                    function(arryList) {

                        if (arryList != null) {


                                self.index = self.index + 1;
                                self.list1 = self.list1.concat(arryList);

                        }
                    });
            },
            //搜索
            getKeywords: function() {

                if (event.keyCode == 13) {

                    this.list1 = '';
                    var Keywords = this.$refs.Words.value;
                    this.List1(Keywords);
                };
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
            //选中
        },
        created: function() {

            //修理技术师
            this.List(1);


        },
        mounted: function() {

            var self = this;
            var pullRefresh = new auiPullToRefresh({
                container: document.querySelector('.aui-refresh-content'),
                triggerDistance: 100
            }, function(ret) {
                if (ret.status == "success") {
                    setTimeout(function() {

                        // self.List1(self.index);
                        pullRefresh.cancelLoading(); //刷新成功后调用此方法隐藏
                    }, 1500)
                }
            })
        }

    })


}
