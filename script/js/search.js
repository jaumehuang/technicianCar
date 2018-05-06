apiready =function(){

    var  vm =new Vue({

       el:"#search",
       data(){

          return {


          }
       },
       methods:{

         getKeywords :function (){

           if (event.keyCode == 13) {

                 var Keywords=this.$refs.Words.value;

                 api.openWin({
                     name: 'search_list',
                     url: './search_list.html',
                     pageParam: {
                         Words: Keywords
                     }
                 });

           };
        },
       },
       created:function(){

       }
    })
}
