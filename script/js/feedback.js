apiready = function() {

    var vm = new Vue({

        el: "#feedback",
        data() {

            return {

                areaText: '',
                num: ''
            }
        },
        methods: {

            BtnData: function() {

                var txt = this.$refs.texTarea.value;
                var qq = this.$refs.qq.value;
                //判断
                if (txt == 0 || qq == 0 ) {

                    api.toast({
                        msg: '输入框为空',
                        duration: 2000,
                        location: 'bottom'
                    });
                    return false;
                };


                var param = {
                    MemLoginId: $api.getStorage("userData").Account,
                    MeaageType: '留言',
                    Content:"问题描述:"+txt+';' +'联系方式:'+qq,
                    Title: '意见反馈',

                };

                var self = this;
                Ajax({

                    url: https.url + '?action=GetMessageBoard',
                    dataType: 'json',
                    method: 'post',
                    timeout: 30,
                    data: {
                        values: param,
                    }
                }, function(arryList) {

                    if (arryList == null) {

                        api.toast({
                            msg: arryList,
                            duration: 2000,
                            location: 'bottom'
                        });
                        return false;
                    }
                    api.closeWin();
                });

            },
        },
        created: function() {

        },
        mounted: function() {

        },
        watch: {
            //监听输入框
            areaText: function() {

                var txt = this.$refs.texTarea.value;
                this.$refs.num.innerHTML = '字数' + txt.length;
            }
        }
    })
}
