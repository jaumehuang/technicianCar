apiready = function() {

   var vm =new Vue({

       el:"#expert_detail",
       data(){

          return {

             person:[],
             responseList:'',//回答
             myLoginId:'',
             problem:'',
             isCollection: false,
             IsCollectType: 0, //默认收藏
          }
       },
       methods:{

         //分享
          MyShare:function(){

             Share();
          },
          //跳转页面
          openView:function(url,guid){

            api.openWin({
                name: url,
                url: url + '.html',
                pageParam: {
                    id: guid,
                    name: 0
                }
            });
          },
          //产品2
          productList2:function(){


            var param = {

                BaskGuid:api.pageParam.id
             };
             this.myLoginId=api.pageParam.id;
             var self = this;
             alert(api.pageParam.id)
             Ajax({

                 url: https.url + '?action=GetBaskOrderLog',
                 dataType: 'json',
                 method: 'get',
                 timeout: 30,
                 data: {
                     values: param,
                 }
             }, function(arryList) {

                  //alert(JSON.stringify(arryList))
                  if(arryList!=null){

                      self.problem=arryList[0].Title;
                      self.person=arryList;
                  }

             });

          },
          //查看图片
          PhotoBrowser: function(arr,index) {

              var imageBrowser = api.require('imageBrowser');
              imageBrowser.openImages({
                  imageUrls: arr,
                  activeIndex:index
              });

          },
          //技师回答
        requestList:function(){

           var param = {

               BaskOrderGuid:api.pageParam.id
            };
            var self =this;
           Ajax({

               url: https.url + '?action=GetBaskOrderCommentListPage',
               dataType: 'json',
               method: 'get',
               timeout: 30,
               data: {
                   values: param,
               }
           }, function(arryList) {

                if(arryList!=null){

                    self.responseList=arryList;
                }
           })
         },
         //添加收藏
         addCollection: function() {

             if (!$api.getStorage("userData")) {

                 api.openWin({
                     name: 'login',
                     url: 'login.html',

                 });
                 return false;
             }

             param = {

                 ProductGuid: api.pageParam.id,
                 MemLoginId: $api.getStorage("userData").Account,
                 IsCollect: this.IsCollectType,
                 IsAttention: 0
             }

             var  self =this;
             Ajax({

                 url: https.url + '?action=AddCollect',
                 dataType: 'json',
                 method: 'get',
                 timeout: 100,
                 data: {
                     values: param,
                 }
             }, function(arryList) {

                 if (arryList != null) {

                     self.isCollection = !self.isCollection;

                     self.IsCollectType = self.isCollection  ? 1 : 0;

                     api.toast({
                         msg:self.isCollection ? '收藏成功' :'取消收藏',
                         duration: 2000,
                         location: 'bottom'
                     });
                     SentListen('collectionNum');
                     if(!self.isCollection){

                       SentListen('collection','',api.pageParam.index);

                     }

                 }

             },true);
         },
         MyCollection: function() {

             if (!$api.getStorage("userData")) {

                 return false;
             }

             param = {

                 ProductGuid: api.pageParam.id,
                 MemLoginId: $api.getStorage("userData").Account,
                 IsAttention: 0
             }
             var self = this;
             Ajax({

                 url: https.url + '?action=GetIsCollect',
                 dataType: 'json',
                 method: 'get',
                 timeout: 30,
                 data: {
                     values: param,
                 }
             }, function(arryList) {

                 if (arryList == null) {


                     self.isCollection = false;
                     self.IsCollectType = 0;


                 }else{

                    self.isCollection = true;
                    self.IsCollectType = 1;
                 }

             },true);
         }
       },
       created:function(){

         this.productList2();
         this.requestList();
        //初始化收藏
          this.MyCollection();

       },
       mounted:function(){


       }
   })
}
