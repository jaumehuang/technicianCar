apiready =function(){

   var vm =new Vue({

       el:"#technician_answer2",
       data(){

          return {

             list1: [],
          }
       },
       methods:{

         list: function(str) {


             var param = {
                 PageIndex: 1,
                 PageCount: 3,
                //  IsShow: "IsRecommend",
                 IsConsult: 0,
                 CommentType: '1',
                 KeyWords:str ? str : api.pageParam.Words
             };
             var self = this;
             Ajax({

                 url: https.url + '?action=GetBaskOrderListPage',
                 dataType: 'json',
                 method: 'get',
                 timeout: 30,
                 data: {
                     values: param,
                 }
             }, function(arryList) {

               if(arryList!=null){


                 self.list1= arryList;
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
       },
       created:function(){

         this.list();
       },
       mounted:function(){

       }
   })
}
