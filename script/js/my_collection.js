apiready = function() {

    var vm = new Vue({

        el: "#collection",
        data() {

            return {

                changeIndex: 0,
                editType: true,
                footer: false,
                editLi: false,
                allChecked: false,
                list1: [],
                list2: [],
                checkCollection: []
            }
        },
        methods: {

            //编辑
            edit: function() {

                this.editType = !this.editType;
                this.footer = !this.footer;
                this.editLi = !this.editLi;
                this.checkCollection = [];
            },
            //数据
            collectionList: function(index, type) {

                var self = this;
                var param = {

                    MemLoginId: $api.getStorage("userData").Account,
                    IsAttention: 0,
                    Type: type,

                };
                Ajax({

                    url: https.url + '?action=GetCollect',
                    dataType: 'json',
                    method: 'get',
                    timeout: 50,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    if (arryList != null) {

                        if (index == 0) {

                            self.list1 = arryList;

                        } else if (index == 1) {

                            self.list2 = arryList;
                        }

                    }

                })
            },
            //删除收藏
            DeleteCollction: function(index) {

                var dialogBox = api.require('dialogBox');
                var self = this;
                if (this.checkCollection == 0 || this.checkCollection == null) {

                    api.toast({
                        msg: '选择需要删除的选项',
                        duration: 2000,
                        location: 'bottom'
                    });
                    return false;
                }
                dialogBox.alert({
                    texts: {
                        title: '',
                        content: '确定删除吗',
                        leftBtnTitle: '取消',
                        rightBtnTitle: '确认'
                    },
                    styles: {
                        bg: '#fff',
                        w: 300,
                        title: {
                            marginT: 20,
                            icon: 'widget://res/gou.png',
                            iconSize: 40,
                            titleSize: 16,
                            titleColor: '#000'
                        },
                        content: {
                            color: '#333',
                            size: 16,
                            marginT: 30, //（可选项）数字类型；内容文本顶端与标题栏底端的距离，如果标题栏不存在，则是到窗口顶端的距离；默认：20
                            marginB: 30,
                        },
                        left: {
                            marginB: 7,
                            marginL: 20,
                            w: 130,
                            h: 35,
                            corner: 2,
                            bg: '#fff',
                            size: 16,
                            color: '#ff6634',
                        },
                        right: {
                            marginB: 7,
                            marginL: 10,
                            w: 130,
                            h: 35,
                            corner: 2,
                            bg: '#fff',
                            size: 16,
                            color: '#ff6634',
                        }
                    }
                }, function(ret) {

                    if (ret.eventType == 'left') {

                        var dialogBox = api.require('dialogBox');
                        dialogBox.close({
                            dialogName: 'alert'
                        });
                    } else if (ret.eventType == 'right') {

                        var dialogBox = api.require('dialogBox');
                        dialogBox.close({
                            dialogName: 'alert'
                        });
                        //操作数据
                        var param = {

                            guid: self.checkCollection.join(','),

                        };

                        Ajax({

                            url: https.url + '?action=DeleteCollect',
                            dataType: 'json',
                            method: 'get',
                            timeout: 50,
                            data: {
                                values: param,
                            }
                        }, function(arryList) {


                            if (arryList != null) {


                                SentListen('collectionNum');
                                window.location.reload();
                            }

                        }, true)

                    }
                });
            },
            //全选
            allchange: function() {

                var allchecked = this.$refs.all;
                this.checkCollection = []
                var self = this;
                if (allchecked.checked) {

                    if (this.changeIndex == 0) {

                        this.list1.forEach(function(item) {

                            self.checkCollection.push(item.CollectGuid);
                        });
                    } else if (this.changeIndex == 1) {

                        this.list2.forEach(function(item) {

                            self.checkCollection.push(item.CollectGuid);
                        });
                    }
                } else {

                    this.checkCollection = [];
                }

            },
            //跳转页面
            openView: function(url, guid, index) {

                api.openWin({
                    name: url,
                    url: url + '.html',
                    pageParam: {
                        id: guid,
                        index: index,
                        name: 0
                    }
                });

            },
            init: function() {

                //文章收藏
                this.collectionList(1, 2);
            },

        },
        created: function() {

            var self = this;
            //监听收藏操作
            api.addEventListener({
                name: 'collection'
            }, function(ret, err) {
                if (ret) {

                    self.list1.splice(ret.value.key1,1);

                } else {
                    alert(JSON.stringify(err));
                }
            });

        },
        mounted: function() {

            this.init();
            var self = this;
            var mySwiper = new Swiper('.swiper-container', {
                observer: true, //修改swiper自己或子元素时，自动初始化swiper
                autoHeight: true, //高度随内容变化
                speed: 50,
                observeParents: true, //修改swiper的父元素时，自动初始化swiper
                onTransitionEnd: function(swiper) {

                    self.changeIndex = mySwiper.activeIndex;
                    var swiper1 = document.getElementsByClassName('swiper-slide-active')[0];
                    self.$refs.swiperwrapper.style.height = swiper1.offsetHeight + 'px';
                    self.changeIndex = mySwiper.activeIndex;
                    //  alert(mySwiper.activeIndex)
                },
                onTouchMove: function(swiper) {


                    if (swiper.activeIndex == 0) {


                        var swiper1 = document.getElementsByClassName('swiper-slide-active')[0];
                       self.$refs.swiperwrapper.style.height = swiper1.offsetHeight+ 'px';

                    }
                }
            });
            this.$refs.btn1.onclick = function() {

                mySwiper.slideTo(0, 100, false); //切换到第一个slide，速度为1秒
                self.changeIndex = 0;
            };
            this.$refs.btn2.onclick = function() {

                mySwiper.slideTo(1, 100, false); //切换到第一个slide，速度为1秒
                self.changeIndex = 1;
            };
        },
        updated: function() {


        },
        watch: {

            checkCollection: function() {

                var allchecked = this.$refs.all;

                if (this.changeIndex == 0) {

                    if (this.checkCollection.length == this.list1.length) {


                        allchecked.checked = true;

                    } else {

                        allchecked.checked = false;

                    }
                }else if(this.changeIndex == 1){

                  if (this.checkCollection.length == this.list2.length) {


                       allchecked.checked = true;

                  } else {

                      allchecked.checked = false;

                  }
                }

            }
        }

    })
}
