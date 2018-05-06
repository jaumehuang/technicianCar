apiready = function() {

    var vm = new Vue({

        el: '#location',
        data() {

            return {

                addressList: ''
            }
        },
        methods: {

            init: function() {

                var self = this;
                var getLocation = $api.getStorage("getLocation");
                var map = api.require('bMap');
                map.open({
                    rect: {
                        x: 0,
                        y: 52,
                        w: 480,
                        h: 300
                    },
                    center: {
                        lon: getLocation.lon,
                        lat: getLocation.lat
                    },
                    zoomLevel: 15,
                    showUserLocation: true,
                    fixedOn: api.frameName,
                    fixed: true
                }, function(ret) {

                    if (ret.status) {

                        var map = api.require('bMap');
                        //获取附近地址列表列
                        map.getNameFromCoords({
                            lon: getLocation.lon,
                            lat: getLocation.lat
                        }, function(ret, err) {
                            if (ret.status) {

                                self.addressList = ret.poiList;
                                // alert(JSON.stringify(ret));
                            }
                        });
                        //监听点击地图
                        map.addEventListener({
                            name: 'click'
                        }, function(ret) {
                            if (ret.status) {

                                //定位地图中心
                                map.setCenter({
                                    coords: {
                                        lon: ret.lon,
                                        lat: ret.lat
                                    },
                                    animation: true
                                });
                                //显示地图中心图标
                                map.addAnnotations({
                                    annotations: [{
                                        id: 1,
                                        lon: ret.lon,
                                        lat: ret.lat
                                    }],
                                    icon: 'widget://',
                                    draggable: true
                                }, function(ret) {
                                    if (ret) {
                                        alert(ret.id);
                                    }
                                });
                                map.getNameFromCoords({
                                    lon: ret.lon,
                                    lat: ret.lat
                                }, function(ret, err) {
                                    if (ret.status) {

                                        self.addressList = ret.poiList;
                                        // alert(JSON.stringify(ret));
                                    }
                                });
                            }
                        });


                    }
                });
            },
            //
            searchInBounds: function() {

                var getLocation = $api.getStorage("getLocation");
                var word =this.$refs.Words.value;
                var input = document.getElementById("word");
                input.blur();
                var map = api.require('bMap');
                var self=this;
                api.showProgress({
                    title: '检索中,稍后...',
                    text: '',
                    modal: false
                });
                map.searchInBounds({
                    keyword: word,
                    lbLon: getLocation.lon+0.1,
                    lbLat: getLocation.lat+0.05,
                    rtLon:getLocation.lon ,
                    rtLat: getLocation.lat
                }, function(ret, err) {
                  api.hideProgress();
                    if (ret.status) {

                        // alert(JSON.stringify(ret));
                        self.addressList=ret.results


                    } else {

                      //1（检索词有岐义）
                     //2（检索地址有岐义）
                     //3（没有找到检索结果）
                     //4（key错误）
                     //5（网络连接错误）
                     //6（网络连接超时）
                     //7（还未完成鉴权，请在鉴权通过后重试）

                      var arr=['检索词有岐义','检索地址有岐义','没有找到检索结果','key错误','网络连接错误','网络连接超时','还未完成鉴权，请在鉴权通过后重试'];
                      var dialogBox = api.require('dialogBox');
                      dialogBox.alert({
                          texts: {
                              title: '',
                              content: arr[err.code],
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
                          }
                      });
                    }
                });

            }
          ,
           //选择地址
           changeAddress:function(str){

               SentListen('location','closeWin',str);
           }
         },
        created: function() {

            this.init();
        },
        mounted: function() {

        }
    })
}
