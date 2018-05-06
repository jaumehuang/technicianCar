apiready = function() {

    var vm = new Vue({

        el: "#export_consult",
        data() {

            return {

                areaText: '',
                num: 0,
                imgarr: [],
                //图片上传标志
                imgFage: false,
                index: 0,
                //选中问题
                promble: '故障咨询',
                //车系
                carguid: '',
                //故障
                faultGuid:''
            }
        },
        methods: {

            //跳转页面
            openView: function(url) {

                api.openWin({
                    name: url,
                    url: url + '.html',
                    pageParam: {
                        name: 0
                    }
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
            //选择问题
            changePromble: function(e, index) {

                this.index = index;
                this.promble = e.target.innerText;
            },
            //提交数据
            BtnData: function() {


                var texTarea = this.$refs.texTarea.value;
                var carType = this.$refs.carType.innerText;
                var fault = this.$refs.fault.innerText;

                if (texTarea.length == 0 || carType.length == 0 || fault.length == 0) {
                    api.toast({
                        msg: '填写完整资料',
                        duration: 2000,
                        location: 'bottom'
                    });
                    return false;
                };
                if (!this.imgFage) {

                    api.toast({
                        msg: '请上传图片',
                        duration: 2000,
                        location: 'bottom'
                    });
                    return false;
                };
                if (texTarea.length<10) {

                    api.toast({
                        msg: '请至少输入10个字',
                        duration: 2000,
                        location: 'bottom'
                    });
                    return false;
                };
                if (texTarea.length>500) {

                    api.toast({
                        msg: '最多输入500字',
                        duration: 2000,
                        location: 'bottom'
                    });
                    return false;
                };
                var self = this;
                var param = {

                    MemLoginId:$api.getStorage("userData").Account,
                    Title: this.promble,
                    Content:texTarea,
                    Images:this.imgarr.join("|"),
                    BrandGuid:this.carguid,
                    BreakdownGuid:this.faultGuid,
                    MemberType:1,

                };
                // console.log(JSON.stringify(param));
                Ajax({

                    url: https.url + '?action=ConsultOrder',
                    dataType: 'json',
                    method: 'post',
                    timeout: 30,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    if (arryList != null) {

                        api.toast({
                            msg: "发布成功,等待跳转",
                            duration: 2000,
                            location: 'bottom'
                        });
                        SentListen('order2', 'closeWin');
                    }
                });

            },
        },
        created: function() {

            var self = this;
            //监听车系
            api.addEventListener({
                name: 'car_brand'
            }, function(ret, err) {
                if (ret) {

                    self.carguid = ret.value.key1;
                    self.$refs.carType.innerText=ret.value.key2
                } else {
                    // alert(JSON.stringify(err));
                }
            });
            //监听故障
            api.addEventListener({
                name: 'fault'
            }, function(ret, err){
                if( ret ){

                  self.faultGuid = ret.value.key1;
                  self.$refs.fault.innerText=ret.value.key2;

                }else{
                    //  alert( JSON.stringify( err ) );
                }
            });

        },
        mounted: function() {

        },
        watch: {

            areaText: function() {

                var txt = this.$refs.texTarea.value;
                this.$refs.num.innerHTML = '字数' + txt.length;
            }
        }
    })
}
