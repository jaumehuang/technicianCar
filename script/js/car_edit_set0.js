apiready = function() {

    var vm = new Vue({

        el: "#car_edit_set0",
        data() {

            return {

            }
        },
        methods:{

          //跳转页面
          openView:function(url){

            api.openWin({
                name: url,
                url: url + '.html',

            })
          }
        },
        created:function(){

        },
        mounted:function(){

        }
    })
}
