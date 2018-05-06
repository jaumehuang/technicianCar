apiready =function(){

    var vm =new Vue({

        el:"#technician_home2",
        data(){

           return{

              isFollow:false,
              companyArr:['../image/up.png','../image/qi.png'],//企业或个人
              person:'',
              repCount:'',//技师回答数量
           }
        },
        methods:{

          //分享
          MyShare:function(){

                Share()
           },
           //获取技师信息
           Getperson: function() {

               var self = this;
               if (!$api.getStorage("userData")) {

                   return false;
               };
               var param = {
                   MemLoginId: api.pageParam.id
               }
              //  alert(api.pageParam.id);
               Ajax({

                   url: https.url + '?action=GetMember',
                   dataType: 'json',
                   method: 'get',
                   timeout: 30,
                   data: {
                       values: param,
                   }
               }, function(arryList) {

                   alert(JSON.stringify(arryList))
                   if(arryList!=null){

                     self.person = arryList[0];
                    // self.$refs.AdvancePayment.innerText = self.SwitchMetering(arryList[0].AdvancePayment);

                   }


               });
           },
           addCollection: function() {

               if (!$api.getStorage("userData")) {

                   api.openWin({
                       name: 'login',
                       url: 'login.html',

                   });
                   return false;
               }

               param = {

                   WorkerLoginId: api.pageParam.id,
                   MemLoginId: $api.getStorage("userData").Account,
                   IsCollect: this.IsCollectType,
                   IsAttention: 1
               };
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

                       self.isFollow = !self.isFollow;

                       self.IsCollectType = self.isCollection  ? 1 : 0;

                       api.toast({
                           msg:self.isFollow ? '关注成功' :'取消关注',
                           duration: 2000,
                           location: 'bottom'
                       });
                       SentListen('collectionNum');
                       if(!self.isFollow){

                         SentListen('Follow','',api.pageParam.index);

                       }

                   }

               },true);
           },
           MyCollection: function() {

               if (!$api.getStorage("userData")) {

                   return false;
               }

               param = {

                   WorkerLoginId: api.pageParam.id,
                   MemLoginId: $api.getStorage("userData").Account,
                   IsAttention: 1
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


                       self.isFollow = false;
                       self.IsCollectType = 0;


                   }else{

                      self.isFollow = true;
                      self.IsCollectType = 1;
                   }

               },true);
           },
           //技师回答问题数量
          PrombleCount:function(){

            var self=this;
            var param = {
                MemLoginId: api.pageParam.id,
                MemberType:3
            }
            Ajax({

                url: https.url + '?action=GetMemberReceivingOrderCount',
                dataType: 'json',
                method: 'get',
                timeout: 30,
                data: {
                    values: param,
                }
            }, function(arryList) {

              //  alert(JSON.stringify(arryList))
                if(arryList!=null){

                   self.repCount = arryList[0];
                 // self.$refs.AdvancePayment.innerText = self.SwitchMetering(arryList[0].AdvancePayment);

                }


            });

          },
           myFollow:function(){

              this.isFollow=!this.isFollow;
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

        },
        created:function(){

           //初始化信息
           this.Getperson();
           //初始问题细信息
           this.PrombleCount();
           //初始化是否关注
           this.MyCollection();
        },
        mounted:function(){

        }
    })
}
