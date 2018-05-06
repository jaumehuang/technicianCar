apiready = function() {

    var vm = new Vue({

        el: "#myquery",
        data() {
            return {

                isBrand: false, //判断是否验证
                BrandGuid: '', //品牌id
                MaintenanceId: '', //项目id
                typeId:'',//类型
                selected: '',
                isMask: false,
                isSelected1: false, //选择器
                isSelected2: false, //选择器
                isSelectedMoue: false, //项目栏
                changeIndex1: '',
                changeIndex2: '',
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

                        //  alert(JSON.stringify(arryList))
                        self.$refs.carName.value = arryList[0].BrandName;
                        self.BrandGuid = arryList[0].BrandGuid;
                        // self.GetMaintenance('', 0, 0);
                    }
                });

            },
            //关闭遮罩层
            CloseMask: function() {

                this.isMask = false;
                this.isSelected1 = false; //选择器
                this.isSelected2 = false; //选择器
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

                            self.list1 = arryList;


                        } else {

                            self.list2 = arryList;

                        }

                    }
                });
            },
            //打开弹窗
            Openselect: function(Level) {

                this.isMask = true;
                if (Level == 1) {

                    this.isSelected1 = true;

                } else if (Level == 2) {

                    this.isSelected2 = true;
                }

            },
            //选中项目
            SwitchIndex: function(index, id, Level, ele) {

                if (Level == 1) {

                    this.changeIndex1 = index;
                    this.isSelectedMoue = true;
                    this.$refs.selected1.value = ele.target.innerText;
                    this.typeId=id;
                    this.GetMaintenance(id, 2);

                } else if (Level == 2) {

                    this.changeIndex2 = index;
                    this.$refs.selected2.value = ele.target.innerText;
                    this.MaintenanceId = id;
                }
                this.CloseMask();
            },
            //维保价格
            GetMaintenancePrice: function() {

              if(this.typeId.length==0)
              {
                api.toast({
                    msg: "请选择维保类型",
                    duration: 2000,
                    location: 'bottom'
                });
                return false;
              };
                if(this.MaintenanceId.length==0)
                {
                  api.toast({
                      msg: "请选择具体项目",
                      duration: 2000,
                      location: 'bottom'
                  });
                  return false;
                };

                var param = {

                    MaintenanceTypes: this.MaintenanceId,
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

                        var dialogBox = api.require('dialogBox');
                        dialogBox.alert({
                            texts: {
                                title: '',
                                content: '¥预估费用:'+arryList[0].Price+'元',
                                // leftBtnTitle: '取消',
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
                                    titleColor: '#ff6634'
                                },
                                content: {
                                    color: '#ff6634',
                                    size: 18,
                                    marginT: 30, //（可选项）数字类型；内容文本顶端与标题栏底端的距离，如果标题栏不存在，则是到窗口顶端的距离；默认：20
                                    marginB: 30,
                                },
                                right: {
                                    marginB: 0,
                                    marginL: 0,
                                    w: 300,
                                    h: 35,
                                    corner: 2,
                                    bg: '#ff6634',
                                    size: 16,
                                    color: '#fff',
                                }
                            }
                        }, function(ret) {

                          if (ret.eventType == 'right') {

                                var dialogBox = api.require('dialogBox');
                                dialogBox.close({
                                    dialogName: 'alert'
                                });

                            }
                        });
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

        },
        created: function() {

            this.GetVehicleInfo();
            this.GetMaintenance(0, 1);
        },
        directives: {

            blur: {
                // select选中指令
                inserted: function(el) {

                    el.focus();
                }
            }
        }

    })
}
