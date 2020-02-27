$(function () {
    let path = 'http://www.liulongbin.top:3007'
    let form = layui.form
    let layer = layui.layer

    // 登录页面的a
    $('.login-box #link-reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 注册的
    $('.reg-box #link-login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 检测form提交
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function (value) {
            let pwdVal = $('.reg-box [name=password]').val()
            if (value !== pwdVal) {
                return '密码不一致'
            }
        }
    })


    // 登录
    $('#form-login').on('submit', function (event) {
        event.preventDefault()
        $.ajax({
            type: "POST",
            url: path + "/api/login",
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('登录失败!')
                }
                layer.msg('登录成功')
                let token = res.token
                localStorage.setItem('token', token)
                window.location.href = '/index.html'
                // console.log(localStorage.getItem('token'))
            }
        });
    })

    // 注册
    $('#form-reg').on('submit', function (event) {
        event.preventDefault()
        $.ajax({
            type: "POST",
            url: path + "/api/reguser",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功')
                $('.reg-box #link-login').click()
            }
        });
    })
})