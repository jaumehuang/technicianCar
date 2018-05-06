apiready = function() {

    var vm = new Vue({

        el: "#person-info",
        data() {

            return {

                isMask: false,
                isPopup: false,
                isConterPopup: false,
                //地址
                address: '',
                person: '',
                photo: '',
                changPhoto: false,
                arr:["女",'男','保密'],
            }
        },
        methods: {

            //更换头像
            ChangePhoto: function() {

                this.isMask = true;
                this.isPopup = true;

            },

            //关闭遮罩层
            CloseMask: function() {

                this.isMask = false;
                this.isPopup = false;
                this.isConterPopup = false;
            },
            //打开性别弹窗
            ChangeSex: function() {

                this.isMask = true;
                this.isConterPopup = true;

            },
            //跳转页面
            openView: function(url) {

                api.openWin({
                    name: url,
                    url: url + '.html',
                });
            },
            //地址列表
            cityList: function() {

                var self = this;
                document.activeElement.blur(); //屏蔽默认键盘弹出；
                var UIActionSelector = api.require('UIActionSelector');
                UIActionSelector.open({
                    datas: cityData,
                    layout: {
                        row: 5,
                        col: 3,
                        height: 30,
                        size: 12,
                        sizeActive: 14,
                        rowSpacing: 5,
                        colSpacing: 10,
                        maskBg: 'rgba(0,0,0,0.2)',
                        bg: '#fff',
                        color: '#888',
                        colorActive: '#f00',
                        colorSelected: '#ff6634',
                    },
                    animation: true,
                    cancel: {
                        text: '取消',
                        size: 14,
                        w: 90,
                        h: 35,
                        bg: '',
                        bgActive: '',
                        color: '#fff',
                        colorActive: '#fff'
                    },
                    ok: {
                        text: '确定',
                        size: 14,
                        w: 90,
                        h: 35,
                        bg: '',
                        bgActive: '#fff',
                        color: '#fff',
                        colorActive: '#fff'
                    },
                    title: {
                        text: '请选择',
                        size: 14,
                        h: 44,
                        bg: '#ff6634',
                        color: '#fff'
                    },
                    fixedOn: api.frameName
                }, function(ret, err) {
                    if (ret.eventType == 'ok') {

                        var str = ret.level1 + ret.level2 + ret.level3;
                        self.address = str;

                    } else {

                        // api.toast({
                        //     msg: JSON.stringify(err),
                        //     duration: 2000,
                        //     location: 'bottom'
                        // });
                    }
                });
            },
            Getperson: function() {

                var self = this;
                var param = {
                    MemLoginId: $api.getStorage("userData").Account
                }
                Ajax({

                    url: https.url + '?action=GetMember',
                    dataType: 'json',
                    method: 'get',
                    timeout: 30,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    self.person = arryList[0];

                    document.getElementById("sex").innerHTML= self.arr[arryList[0].Sex];

                    if(arryList[0].Sex==0){
                        document.getElementById("gril").checked=true;

                    }
                    if(arryList[0].Sex==1){

                        document.getElementById("man").checked=true;
                    }

                });
            },

            //头像选择
            GetPicture: function(type) {

                var sefl = this;
                api.getPicture({
                    sourceType: type,
                    encodingType: 'jpg',
                    mediaValue: 'pic',
                    destinationType: 'base64',
                    allowEdit: true,
                    quality: 50,
                    targetWidth: 100,
                    targetHeight: 100,
                    saveToPhotoAlbum: false
                }, function(ret, err) {

                    if (ret.data) {

                        sefl.CloseMask();

                        Ajax({
                                url: https.url + '?action=fileSave',
                                dataType: 'json',
                                method: 'post',
                                timeout: 30,
                                data: {
                                    values: {
                                        FileName: ret.data,
                                        FileType: 'photo'
                                    },
                                    files: {
                                        file: ret.data
                                    }
                                }
                            },
                            function(arryList) {

                                if (arryList != null) {

                                    document.getElementById("photo").src = arryList;
                                    SentListen('changePhoto', null, arryList);
                                    sefl.GetData(arryList, 'UpdatePhoto')
                                } else {

                                    api.toast({
                                        msg: arryList,
                                        duration: 2000,
                                        location: 'bottom'
                                    });
                                }
                            });
                    }
                });
            },
            //提交数据
            GetData: function(str, type) {

                var param = {
                    MemLoginId: $api.getStorage('userData').Account,
                    OperateType: type,
                    Values: str,
                }
                Ajax({
                        url: https.url + '?action=OperateMember',
                        dataType: 'json',
                        method: 'post',
                        timeout: 30,
                        data: {
                            values: param,
                        }
                    },
                    function(arryList) {

                        if (arryList != null) {

                            api.toast({
                                msg: '修改成功',
                                duration: 2000,
                                location: 'bottom'
                            });

                        }
                    });
            },
            //选择性别
            changeSex: function(index) {


                this.GetData(index, 'UpdateSex');
                document.getElementById("sex").innerHTML= this.arr[index];
                this.CloseMask();
            },

        },
        created: function() {

            this.Getperson();

            //监听昵称变化
            api.addEventListener({
                name: 'changeName'
            }, function(ret, err) {

                if (ret) {

                    window.location.reload();

                } else {

                }
            });
        },
        mounted: function() {

        }


    })
}
