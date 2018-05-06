apiready = function() {

        var vm = new Vue({

            el: "#car_repair",
            data() {

                return {

                    areaText: '',
                    address: '',
                    isMask: false,
                    isConterPopup: false,
                    arr: ['到厂服务', '上门服务'],
                    addressType:false,
                    imgarr: [],
                    //图片上传标志
                    imgFage: false,
                    mobile: '',
                }
            },
            methods: {

                //地址列表
                cityList: function() {


                  var input = document.getElementById("address");
                      input.blur();
                      api.openWin({
                          name: 'location_frm',
                          url: 'location_frm.html',
                      });
                },
                //选择相片
                OpenImg: function() {

                    var self = this;
                    var UIAlbumBrowser = api.require('UIAlbumBrowser');
                    UIAlbumBrowser.open({
                        max: 3,
                        styles: {
                            bg: '#fff',
                            mark: {
                                icon: '',
                                position: 'bottom_left',
                                size: 20
                            },
                            nav: {
                                bg: 'rgba(0,0,0,0.8)',
                                titleColor: '#fff',
                                titleSize: 18,
                                cancelColor: '#fff',
                                cancelSize: 16,
                                finishColor: '#fff',
                                finishSize: 16
                            }
                        },
                        rotation: true
                    }, function(ret) {

                        if (ret.eventType == "confirm") {

                            var list = ret.list;
                            var systemType = api.systemType; // 比如： ios
                            self.imgFage = true;
                            for (var i = 0; i < list.length; i++) {


                                if (systemType == 'ios') {

                                    UIAlbumBrowser.transPath({
                                        path: list[i].path
                                    }, function(ret, err) {
                                        if (ret) {
                                            self.updatedImg(ret.path);
                                        }
                                    });
                                } else {

                                    self.updatedImg(list[i].path);
                                }
                            }
                        }
                    });

                },
                //上传照片
                updatedImg: function(imgUrl) {

                    var self = this;
                    Ajax({
                            url: https.url + '?action=fileSave',
                            dataType: 'json',
                            method: 'post',
                            timeout: 30,
                            data: {
                                values: {
                                    FileName: imgUrl,
                                    FileType: 'photo'
                                },
                                files: {
                                    file: imgUrl
                                }
                            }
                        },
                        function(arryList) {

                            if (arryList != null) {


                                self.imgarr = self.imgarr.concat(arryList);

                            } else {

                                api.toast({
                                    msg: arryList,
                                    duration: 2000,
                                    location: 'bottom'
                                });
                            }
                        });
                },
                //删除照片
                deleteImg: function(index) {

                    this.imgarr.splice(index, 1);
                },
                //打开弹窗
                ChangeService: function() {

                    this.isMask = true;
                    this.isConterPopup = true;

                },
                //关闭遮罩层
                CloseMask: function() {

                    this.isMask = false;
                    this.isConterPopup = false;
                },
                //选择服务
                changeService: function(index) {

                    document.getElementById("Service").innerHTML = this.arr[index];
                    if(index==1){

                     this.addressType=true;

                    }else{

                      this.addressType=false;
                    }
                    this.CloseMask();
                },
                //提交数据
                BtnData: function() {

                    var texTarea = this.$refs.texTarea.value;
                    var service = this.$refs.service.innerText;
                    var address = this.$refs.address.value;
                    var detail_address = this.$refs.detail_address.value;
                    var time = this.$refs.time.value;
                    var car_num = this.$refs.car_num.value;
                    var name = this.$refs.name.value;
                    var contact = this.$refs.contact.value;

                    if (texTarea.length == 0 || service.length == 0 || time.length == 0 || car_num.length == 0 || name.length == 0 || contact.length == 0 ) {

                        api.toast({
                            msg: '填写完整资料',
                            duration: 2000,
                            location: 'bottom'
                        });
                        return false;
                    };
                    if(this.addressType){

                       if(address.length==0){

                         api.toast({
                             msg: '地址为空',
                             duration: 2000,
                             location: 'bottom'
                         });
                       }
                    }
                    if (!this.imgFage) {

                        api.toast({
                            msg: '请上传图片',
                            duration: 2000,
                            location: 'bottom'
                        });
                        return false;
                    };
                    if (texTarea.length < 10) {

                        api.toast({
                            msg: '请至少输入10个字',
                            duration: 2000,
                            location: 'bottom'
                        });
                        return false;
                    };
                    if (texTarea.length > 500) {

                        api.toast({
                            msg: '最多输入500字',
                            duration: 2000,
                            location: 'bottom'
                        });
                        return false;
                    };
                    var reg = /^1[3|4|5|7|8][0-9]\d{4,8}$/;

                    if (!reg.test(contact)) {

                        api.toast({
                            msg: '手机号码格式错误',
                            duration: 2000,
                            location: 'bottom'
                        });
                        return false;
                    }
                    var self = this;
                    var WorkerLoginId ='';
                    if(api.pageParam.id){

                       WorkerLoginId=api.pageParam.id;
                    }
                    //定位
                    var getLocation = $api.getStorage("getLocation");
                    var param = {

                        MemLoginId: $api.getStorage("userData").Account,
                        ServiceType: service,
                        ServiceAddress: address ? detail_address ? address+detail_address : address : '上门服务,无需地址' ,
                        SubscribeTime: time,
                        CarNumber: car_num,
                        Name: name,
                        Mobile: contact,
                        Content: texTarea,
                        WorkerLoginId:WorkerLoginId,
                        Images: this.imgarr.join("|"),
                        Coordinate: getLocation.lon + ',' + getLocation.lat

                    };

                    Ajax({

                        url: https.url + '?action=RepairOrder',
                        dataType: 'json',
                        method: 'post',
                        timeout: 30,
                        data: {
                            values: param,
                        }
                    }, function(arryList) {

                        alert(JSON.stringify(arryList))
                        if (arryList != null) {

                            api.toast({
                                msg: "上传成功,等待跳转",
                                duration: 2000,
                                location: 'bottom'
                            });
                            SentListen('order1');
                            setTimeout(function(){

                                  openView('wait_comment',arryList);

                            },2000);
                        }
                    });

                },
                Getperson: function() {

                    var self = this;
                    if (!$api.getStorage("userData")) {

                        return false;
                    }
                    var param = {
                        MemLoginId: $api.getStorage("userData").Account
                    }
                    self.isLogin = $api.getStorage("userData").isLogin;
                    Ajax({

                        url: https.url + '?action=GetMember',
                        dataType: 'json',
                        method: 'get',
                        timeout: 30,
                        data: {
                            values: param,
                        }
                    }, function(arryList) {

                        self.$refs.contact.value = arryList[0].Mobile;

                    });
                }
            },
            created: function() {


                 this.Getperson();
                 //监听定位地址
                 var  self=this;
                 api.addEventListener({
                     name: 'location'
                 }, function(ret, err){
                     if( ret ){

                         self.$refs.address.value = ret.value.key1;

                     }else{
                          // alert( JSON.stringify( err ) );
                     }
                 });


            },
            mounted: function() {
                new TimeType('default1');
            },
            watch: {

                areaText: function() {

                    var txt = this.$refs.texTarea.value;
                    this.$refs.num.innerHTML = '字数' + txt.length;
                }
            },
            //数据渲染完
            updated: function() {

                this.$nextTick(function() {
                    var div = document.getElementById('car_repair');
                    div.scrollTop = 0;
                })
            }
        })
    }
    //时间选择器
function TimeType(type) {
    var Year = new Date().getFullYear();
    var Month = new Date().getMonth();
    var Data = new Date().getDay();
    var opt = {

    }
    opt.datetime = {
        preset: 'datetime',
        minDate: new Date(),
        maxDate: new Date(Year + 10, Month, Data),
        stepMinute: 5
    };
    var demo = 'date';
    $(".demos").hide();
    if (!($("#demo_" + demo).length))
        demo = type;

    $("#demo_" + demo).show();
    $('#test_' + demo).val('').scroller('destroy').scroller($.extend(opt['datetime'], {
        theme: 'android-ics light',
        mode: 'scroller',
        display: 'modal',
        lang: 'zh',
        dateFormat: 'yy/mm/dd', //返回结果格式化为年月格式
    }));
};
