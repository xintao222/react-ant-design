import Mock from 'mockjs'


//Mock.mock(/\serviceAccount\/selectAccount/,"get",require("./banner.json"))


Mock.mock(/\gselectAccount/,"get",require("./banner.json"))

Mock.mock(/\goodsList/,"get",require("./banner.json"))
Mock.mock( window.ApiUrl+"/postdata1","post",require("./banner.json"))