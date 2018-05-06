apiready = function() {
    var vm = new Vue({

        el: "#comment2",
        data() {
            return {

                person: [],
                areaText: '', //文本框
                num: 0, //字数
                imgarr: [],//图片路径
                imgFage: false,                //图片上传标志
                index: 0,//图片编号,
                starNum1:0,//星2
                starNum2:0,//星2
                starNum3:0,//星2
            }
        },
        methods: {
            //获取技师的基本信息
            Getperson: function() {

                var self = this;
                var param = {
                    MemLoginId: (api.pageParam.id).split('|')[0]

                };

                Ajax({

                    url: https.url + '?action=GetMember',
                    dataType: 'json',
                    method: 'get',
                    timeout: 30,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    if (arryList != null) {

                        self.person = arryList[0];
                        alert(JSON.stringify(arryList))
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
            //提交数据
            BtnData: function() {

                this.starNum1=0;//故障率
                this.starNum2=0;//服务
                this.starNum3=0;//效率
                var self=this;
                var texTarea = this.$refs.texTarea.value;
                var imgArr1 = this.$refs.readOnly1.getElementsByClassName("star");
                var imgArr2 = this.$refs.readOnly2.getElementsByClassName("star");
                var imgArr3 = this.$refs.readOnly3.getElementsByClassName("star");
                for(var i=0;i<imgArr1.length;i++){

                	    if(imgArr1[i].getAttribute("src")=='../image/star-on.png'){

                	    	   self.starNum1=self.starNum1+1;
                	    };
                	    if(imgArr2[i].getAttribute("src")=='../image/star-on.png'){

                	    	   self.starNum2=self.starNum2+1;
                	    };
                	    if(imgArr3[i].getAttribute("src")=='../image/star-on.png'){

                	    	   self.starNum3=self.starNum3+1;
                	    };

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
                    OrderNumber:(api.pageParam.id).split('|')[1],
                    WorkerLoginId:(api.pageParam.id).split('|')[0],
                    WorkerName:this.person.RealName,
                    ImagePath:this.imgarr.join("|"),
                    Content:texTarea,
                    JudgeGrade:this.starNum1,
                    ServiceGrade:this.starNum2,
                    AnswerGrade:this.starNum3,
                    CommentType:this.person.MemberType

                };
                alert(JSON.stringify(param));

                Ajax({

                    url: https.url + '?action=AddBaskOrder',
                    dataType: 'json',
                    method: 'post',
                    timeout: 30,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    if (arryList != null) {

                        api.toast({
                            msg: "评论成功,等待跳转",
                            duration: 2000,
                            location: 'bottom'
                        });
                        setTimeout(function(){

                           SentListen('technician-comment','closeWin');
                        })
                    }
                });

            },
            //选择星星
            changeStar:function($event,index){

                var imgArr=$event.target.parentNode.getElementsByClassName("star");//img数组
                var targetIndex=$event.target.getAttribute("data-index");
                 if(targetIndex==0){

                	    $event.target.nextElementSibling.setAttribute("src","../image/star-off.png");
                	    $event.target.setAttribute("src","../image/star-on.png");
                	    return false;
                 }
                var prevNodeIndex =$event.target.previousElementSibling.getAttribute("data-index");
                var Url=$event.target.getAttribute("src");

                if(targetIndex>prevNodeIndex){

                	   for(var i=0;i<=imgArr.length;i++){


                        if(i<=prevNodeIndex){

                        	    imgArr[i].setAttribute("src","../image/star-on.png");

                        }else if(i>prevNodeIndex&&i<imgArr.length){

                          	    imgArr[i].setAttribute("src","../image/star-off.png");
                        }
                	   };

                };
                 $event.target.setAttribute("src","../image/star-on.png");
                 console.log(this.starNum1)
            }
        },
        created: function() {


           this.Getperson();


        },
        watch: {

            areaText: function() {

                var txt = this.$refs.texTarea.value;
                this.$refs.num.innerHTML = '字数' + txt.length;
            }
        }
    })
}
