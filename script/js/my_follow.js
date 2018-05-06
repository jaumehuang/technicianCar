apiready=function(){

   var vm=new Vue({

       el:"#my-follow",
       data(){

          return {

               changeIndex:0,
               list1:[],
               list2:[],
               companyArr:['../image/up.png','../image/qi.png'],//企业或个人
          }
       },
       methods:{

         //数据
         followList: function(index, type) {

             var self = this;
             var param = {

                 MemLoginId: $api.getStorage("userData").Account,
                 IsAttention: 1,
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

             }, true)
         },
         OpenView:function(url,guid){

               openView(url,guid);
         },
         //滑动
         DeleteCollction: function(collectionGuid) {

             var dialogBox = api.require('dialogBox');
             var self = this;

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

                         guid: collectionGuid,

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
         init: function() {

            //关注
            this.followList(0,1);
            this.followList(1,2);

         },
       },
       created:function(){

       },
       mounted:function(){

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
       }

   })
}
