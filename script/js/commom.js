/*路径*/
// document.body.scrollTop = document.body.scrollHeight;
var https = {
        url: 'http://apiqchsc.jshcn.cn/APIInterface.ashx',
        path1: 'http://wap.ddac.net.cn/m/goods-detail.aspx'
    }
//请求ajax;
function Ajax(parameter, callback, Prompt) {

    api.showProgress({
        title: '努力加载中...',
        text: '',
        modal: false
    });
    api.ajax(parameter, function(ret, err) {

        api.hideProgress();

        // if (ret.Msg == undefined) {
        //
        //     api.toast({
        //         msg: 'undefined',
        //         duration: 2000,
        //         location: 'bottom'
        //     });
        //     return false;
        // }
        if (!ret.isError&& ret) {


            if (ret.Msg.indexOf("[") != -1 || ret.Msg.indexOf("{") != -1) {

                var arryList = typeof ret.Msg == 'string' ? JSON.parse(ret.Msg) : ret.Msg;
                callback(arryList)
            } else {

                callback(ret.Msg)

            }

        }else {

            callback(null);
            if (!Prompt) {

                api.toast({
                    msg: ret.Msg,
                    duration: 2000,
                    location: 'bottom'
                });
            }
        };

      if(err) {

           alert(JSON.stringify(err))
            if (err.statusCode == 400) {

                api.toast({
                    msg: '400',
                    duration: 2000,
                    location: 'bottom'
                });

            } else if(err.code) {

                var codeText = ["连接错误", "超时,网络不佳", "授权错误", "数据类型错误"];
                api.toast({
                    msg: codeText[err.code],
                    duration: 2000,
                    location: 'bottom'
                });
            }
        }

    });
};
//获取验证码
var flag = true;

function GetCode(e, minute, CheckType) {

    if (!flag) {
        return false;
    }

    function countDown(minute) {
        var i = minute * 60;

        var time = setInterval(function() {
            if (i == 0) {
                flag = true;
                e.innerHTML = '重新获取';
                e.style.background = '#ff6634';
                clearInterval(time);
            } else {

                e.innerHTML = i + 's';
                e.style.background = '#666';
            }
            i--;
        }, 1000);
    };

    /*判断手机号码*/

    var $phone = document.getElementById("myphone").value;
    var reg = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
    if ($phone.length == 0) {

        api.toast({
            msg: '手机号码为空',
            duration: 2000,
            location: 'bottom'
        });
        return false;
    }
    if (!reg.test($phone)) {

        api.toast({
            msg: '手机号码格式错误',
            duration: 2000,
            location: 'bottom'
        });
        return false;
    }
    api.showProgress({
        title: '',
        text: '加载中,请稍后...',
        modal: false
    });
    /*获取Token*/
    api.ajax({
        url: https.url + '?action=GetToken',
        dataType: 'json',
        method: 'get',
        timeout: 30,

    }, function(ret, err) {

        api.hideProgress();
        if (!ret.isError) {

            var AccountId = '';
            if ($api.getStorage('userData')) {

                AccountId = $api.getStorage('userData').Account;
            }
            param = {

                CheckType: CheckType,
                Phone: $phone,
                Token: ret.Msg,
                MemLoginId: AccountId

            }

            api.ajax({
                url: https.url + '?action=GetIdentifyingCode',
                dataType: 'json',
                method: 'get',
                timeout: 30,
                data: {
                    values: param,
                }
            }, function(ret, err) {
                api.hideProgress();

                if (ret.isError) {

                    alert(JSON.stringify(ret));

                    if (flag) {

                        countDown(minute);
                        flag = false;
                    }

                } else {

                    alert(ret.Msg)
                }
            })

        } else {
            alert(ret.Msg)
        }
    });
};
//发送监听事件

function SentListen(myEvent, type, value1, value2) {

    api.sendEvent({
        name: myEvent,
        extra: {
            key1: value1,
            key2: value2
        }
    });

    if (type == 'closeWin') {
        api.closeWin();
    };

    if (type == 'root') {

        api.closeToWin({
            name: 'root'
        });
    }
};

/*回到根页面*/
function closeToWin() {

    api.closeToWin({
        name: 'root'
    });
}
/*微信分享*/
function Share(contentUrl) {

    var dialogBox = api.require('dialogBox');
    dialogBox.actionMenu({
        rect: {
            h: 180
        },
        texts: {
            cancel: '取消'
        },
        items: [{
            text: '微信',
            icon: 'widget://image/weixin_L.png'
        }, {
            text: '朋友圈',
            icon: 'widget://image/wei_friend.png'
        }],
        styles: {
            bg: '#FFF',
            column: 2,
            itemText: {
                color: '#000',
                size: 16,
                marginT: 8
            },
            itemIcon: {
                size: 70
            },
            cancel: {
                bg: '#ff6634',
                color: '#fff',
                h: 50,
                size: 18
            }
        }
    }, function(ret) {

        if (ret.eventType == 'cancel') {
            dialogBox.close({
                dialogName: 'actionMenu'
            });
        }
        if (ret.index == 0) {

            api.showProgress({
                title: '',
                text: '加载中,请稍后...',
                modal: false
            });

            api.imageCache({
                url: '',
            }, function(ret, err) {

                api.hideProgress();
                var url = ret.url;
                var wx = api.require('wx');
                wx.shareWebpage({
                    apiKey: 'wx1a95c62596b4b2b4',
                    scene: 'session',
                    title: $(".detail_top .product_title").text(),
                    description: "我在嘉阳汇发现了一个不错的商品,赶快来看看吧",
                    thumb: url,
                    contentUrl: contentUrl + '?id=' + api.pageParam.id
                }, function(ret, err) {

                    dialogBox.close({
                        dialogName: 'actionMenu'
                    });
                    if (ret.status) {

                        api.toast({
                            msg: '分享成功',
                            duration: 2000,
                            location: 'bottom'
                        });
                    } else {

                        api.toast({

                            msg: '分享失败',
                            duration: 2000,
                            location: 'bottom'
                        });
                    }

                });
            })

        }
        if (ret.index == 1) {

            api.showProgress({
                title: '',
                text: '加载中,请稍后...',
                modal: false
            });
            api.imageCache({
                url: '',
            }, function(ret, err) {

                api.hideProgress();
                var url = ret.url;
                var wx = api.require('wx');

                wx.shareWebpage({
                    apiKey: 'wx1a95c62596b4b2b4',
                    scene: 'timeline',
                    title: $(".detail_top .product_title").text(),
                    description: "我在嘉阳汇发现了一个不错的商品,赶快来看看吧",
                    thumb: url,
                    contentUrl: contentUrl + '?id=' + api.pageParam.id
                }, function(ret, err) {


                    dialogBox.close({
                        dialogName: 'actionMenu'
                    });
                    if (ret.status) {

                        api.toast({
                            msg: '分享成功',
                            duration: 2000,
                            location: 'bottom'
                        });
                    } else {

                        api.toast({

                            msg: '分享失败',
                            duration: 2000,
                            location: 'bottom'
                        });
                    }
                });
            })
        }
    });

};
//回到根目录
function root() {

    api.closeToWin({
        name: 'root'
    });
}
//页面跳转
function openView(url,guid){

   api.openWin({
       name: url,
       url: url+'.html',
       scrollEnabled:true,
       pageParam: {
           name: url,
           id:guid
       }
   });

}
