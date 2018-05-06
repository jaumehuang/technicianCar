apiready = function() {

   var vm =new Vue({

      el:"#mymore",
      data(){
         return {

         }
      },
      methods:{

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

      }

   })
}
