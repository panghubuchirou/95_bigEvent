// 用来 过滤ajax请求 
// 因为每个页面都要用 所以我们要写在一个独立的js文件中每次都引用
$.ajaxPrefilter(fn => {

    // 满足 /my/开头
    if (/^\/my\//.test(fn.url)) {
        fn.headers = {
            Authorization: localStorage.getItem('token')
        }
        fn.complete = function (res) {
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                localStorage.removeItem('token')
                location.href = '/login.html'
            }
        }
    }
    // 修改路径
    fn.url = 'http://www.liulongbin.top:3007' + fn.url
})