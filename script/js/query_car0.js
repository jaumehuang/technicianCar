apiready = function() {

    var vm = new Vue({

        el: "#collection",
        data() {

            return {

                isUpdate: true,
                changeIndex: 0,
                BrandGuid: '', //品牌id
                list1: [],
                list2: []
            }
        },
        methods: {

            //获取电子档案
            GetVehicleInfo: function() {

                var param = {

                    MemLoginId: $api.getStorage("userData").Account
                };

                var self = this;
                Ajax({

                    url: https.url + '?action=GetVehicleInfo',
                    dataType: 'json',
                    method: 'get',
                    timeout: 30,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    if (arryList != null) {

                        self.BrandGuid = arryList[0].BrandGuid;
                        self.$refs.carName.innerText = arryList[0].BrandName;
                    }
                });

            },
            //维保类型和项目
            GetMaintenance: function(FatherId, Level) {

                var param = {

                    FatherId: FatherId,
                    CategoryLevel: Level
                };

                var self = this;
                Ajax({

                    url: https.url + '?action=GetMaintenance',
                    dataType: 'json',
                    method: 'get',
                    timeout: 30,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    if (arryList != null) {


                        if (Level == 1) {
                           //一级
                            self.list1 = arryList;

                                var param = {

                                    FatherId: arryList[0].Id,
                                    CategoryLevel: 2
                                };

                                Ajax({

                                    url: https.url + '?action=GetMaintenance',
                                    dataType: 'json',
                                    method: 'get',
                                    timeout: 30,
                                    data: {
                                        values: param,
                                    }
                                }, function(arryList2) {

                                    if (arryList2 != null) {

                                        for (var i = 0; i < arryList2.length; i++) {

                                            self.GetMaintenancePrice(arryList2, arryList2[i].Id, i);

                                        }
                                    }
                                })
                        } else if (Level == 2) {

                            //二级

                              for (var i = 0; i < arryList.length; i++) {

                                  self.GetMaintenancePrice(arryList, arryList[i].Id, i);
                              }

                        }

                    }
                });
            },
            //维保价格
            GetMaintenancePrice: function(arr, id, index) {

                var param = {

                    MaintenanceTypes: id,
                    BrandGuid: this.BrandGuid
                };

                var self = this;

                Ajax({

                    url: https.url + '?action=GetMaintenancePrice',
                    dataType: 'json',
                    method: 'get',
                    timeout: 30,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    if (arryList != null) {

                        arr[index].Price = arryList[0].Price;
                        self.list2 = self.list2.concat(arr[index]);
                    }
                },true);
            },
            //选中项目
            SwitchIndex: function(index, id) {

                this.list2 = [];
                this.changeIndex = index;
                this.GetMaintenance(id, 2);

            },
        },
        created: function() {

            var self = this;
            //监听收藏操作
            this.GetVehicleInfo();
            this.GetMaintenance(0, 1);
        },
        mounted: function() {

            // this.init();

        },
        updated: function() {

            var self = this;
            this.$nextTick(function() {

                // var mySwiper = new Swiper('.swiper-container', {
                //
                //     autoHeight: true, //高度随内容变化
                //     speed:400,
                //     observer: true, //修改swiper自己或子元素时，自动初始化swiper
                //     observeParents: true, //修改swiper的父元素时，自动初始化swiper
                //     onTransitionEnd: function(swiper) {
                //
                //         self.changeIndex = mySwiper.activeIndex;
                //         var swiper1 = document.getElementsByClassName('swiper-slide-active')[0];
                //         self.$refs.swiperwrapper.style.height = swiper1.offsetHeight + 80 + 'px';
                //
                //     },
                //     onTouchMove: function(swiper) {
                //
                //
                //         if (swiper.activeIndex == 0) {
                //
                //
                //             var swiper1 = document.getElementsByClassName('swiper-slide-active')[0];
                //             self.$refs.swiperwrapper.style.height = swiper1.offsetHeight + 80 + 'px';
                //
                //         }
                //     }
                // })
                //
                // this.$refs.btn1.onclick = function() {
                //
                //     mySwiper.slideTo(0, 100, false); //切换到第一个slide，速度为1秒
                //     self.changeIndex = 0;
                // };
                // this.$refs.btn2.onclick = function() {
                //
                //     mySwiper.slideTo(1, 100, false); //切换到第一个slide，速度为1秒
                //     self.changeIndex = 1;
                // };
                var mySwiper = new Swiper('.nav-move', {
                    //				autoplay: 5000, //可选选项，自动滑动
                    slidesPerView: 3
                })
                var mySwiper = new Swiper('.main-move', {
                    //				autoplay: 5000, //可选选项，自动滑动
                    onTransitionEnd: function(swiper) {

                        // self.list2=[];
                        self.navList2 = swiper.activeIndex;

                        // alert(swiper1.offsetHeight);

                    },
                })

            })
        }
    })
}
