$(function () {
    let layer = layui.layer

    getUserInfo()

    // 点击退出事件
    $('#exit').on('click', function () {
        layer.confirm('确定退出吗?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            // 清楚数据
            localStorage.removeItem('token')
            location.href = '/login.html'
            // 清除框
            layer.close(index);
        })
    })

})

// 用户信息加载
function getUserInfo() {
    $.ajax({
        type: "GET",
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            renderAvatar(res.data)
        }
    });
}
// 渲染头像
function renderAvatar(data) {
    // 获取name 使用短路
    let name = data.nickname || data.username
    // 设置欢迎
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name).removeClass('lucency')
    // 判断有没有头像
    console.log(data);
    if (data.user_pic) {
        console.log(1);
        //  渲染图片头像
        $('.layui-nav-img').prop('src', data.user_pic).removeClass('lucency').show().next().hide()
    } else {
        console.log(2);
        // 渲染字体头像
        let letter = data.username[0].toUpperCase()
        $('.layui-nav-img').hide().next().text(letter).removeClass('lucency').show()
    }
}