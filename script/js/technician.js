apiready = function() {

    var vm = new Vue({

        el: "#technicians",
        data() {

            return {

                changeIndex: 0,
                isMask: false,
                iStheme: false,
                //切换页面
                SwitchView: true,
                themeIndex0: 0,
                themeIndex1: '',
                list1: [],//技师
                list2: [],//咨询
                index0: 1,
                index1:1,
                MemberType:['consult','technician'],//咨询,技师
                brandGuid:'',//品牌id
                IsCompany:'',//是否是企业
                companyArr:['../image/up.png','../image/qi.png'],//

            }
        },
        methods: {

            //切换页面
            randomSwitchBtn: function(e, index) {

                this.changeIndex = index;
                this.isMask = true;
                this.iStheme = true;
                if (index == 1) {

                    this.isMask = false;
                    api.openWin({
                        name: 'brand_list',
                        url: './brand_list.html',

                    });
                }
            },
            //选中类别
            themeSwitchBtn: function(index, e, type) {


                this.iStheme = false;
                this.isMask = false;
                switch (type) {

                    case 'one':
                        this.themeIndex0 = index;
                        this.$refs.technician.innerText = e.target.innerText;
                        if(index==0){

                           this.SwitchView=true;

                        }else if(index==1){

                           this.SwitchView=false;
                        }
                        break;
                    case 'three':

                        this.themeIndex1 = index;
                        this.$refs.type.innerText = e.target.innerText;

                        if(this.themeIndex1==0){


                           if(this.SwitchView){

                             this.list1=[];
                             this.List(3,1,'',this.brandGuid,1);
                           }else{

                             this.list2=[];
                             this.List(2,1,'',this.brandGuid,1);
                           }
                           this.IsCompany=1;
                        }
                        if(this.themeIndex1==1){

                          if(this.SwitchView){

                            this.list1=[];
                            this.List(3,1,'',this.brandGuid,0);
                          }else{

                            this.list2=[];
                            this.List(2,1,'',this.brandGuid,0);
                          }
                          this.IsCompany=0;
                        }
                        break;
                    default:
                }
            },
            //关闭遮罩层
            CloseMask: function() {

                this.iStheme = false;
                this.isMask = false;
            },
            //修理技师
            List: function(MemberType,index, str,BrandGuid,IsCompany) {

                var self = this;
                //定位
                var getLocation = $api.getStorage("getLocation");
                var param = {
                    PageIndex: index,
                    PageCount: 5,
                    MemberType: MemberType,
                    KeyWords: str,
                    BrandGuid:BrandGuid,
                    Coordinate: getLocation.lon + ',' + getLocation.lat,
                    IsCompany:IsCompany
                }

                Ajax({
                        url: https.url + '?action=GetMemberList',
                        dataType: 'json',
                        method: 'get',
                        timeout: 30,
                        data: {
                            values: param,
                        }
                    },
                    function(arryList) {
                        //
                        // alert(JSON.stringify(arryList))
                        if (arryList != null) {

                            if(MemberType==3){

                              self.index0 = self.index0 + 1;
                              self.list1 = self.list1.concat(arryList);

                            }else if(MemberType==2){

                              self.index1 = self.index1 + 1;
                              self.list2 = self.list2.concat(arryList);
                            //  alert(JSON.stringify(arryList))
                            }


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
            OpenView: function(url, guid) {

                openView(url,guid)
            },
            //选中
        },
        created: function() {

            //修理技术师
            this.List(3,1);
            //咨询专家
            this.List(2,1);
            //监听品牌
            var self=this;
            api.addEventListener({
                name: 'Brand'
            }, function(ret, err){
                if( ret ){

                     if(self.themeIndex0==0){

                        self.list1=[];
                        self.List(3,1,'',ret.value.key2,self.IsCompany);
                     }
                     if(self.themeIndex0==1){


                       if(self.SwitchView){

                           self.list1=[];
                           self.List(3,1,'',ret.value.key2,self.IsCompany);

                       }else{

                         self.list2=[];
                         self.List(2,1,'',ret.value.key2,self.IsCompany);
                       }

                     }

                     //名称处理
                     if(ret.value.key1.length>4){

                           self.$refs.brand.innerText=ret.value.key1.substr(0,3)+'...';
                     }else{
                           self.$refs.brand.innerText =ret.value.key1;
                     }
                }else{
                     alert( JSON.stringify( err ) );
                }
            });

        },
        mounted: function() {

            var self = this;
            var pullRefresh = new auiPullToRefresh({
                container: document.querySelector('.aui-refresh-content'),
                triggerDistance: 100
            }, function(ret) {
                if (ret.status == "success") {
                    setTimeout(function() {

                        window.location.reload();
                        pullRefresh.cancelLoading(); //刷新成功后调用此方法隐藏
                    }, 1500)
                }
            })
        }

    })


}
