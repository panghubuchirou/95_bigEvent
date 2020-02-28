$(function () {
    let path = 'http://www.liulongbin.top:3007'
    let form = layui.form
    let layer = layui.layer

    // 登录切换注册
    $('.login-box #link-reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 注册切换登录
    $('.reg-box #link-login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 检测form必填项
    // 自定义写法
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samePwd: function (value) {
            let pwdVal = $('.reg-box [name=password]').val()
            if (value !== pwdVal) {
                return '两次密码不一致'
            }
        }
    })

    // 登录提交
    $('#form-login').on('submit', function (event) {
        // 阻止默认提交
        event.preventDefault()
        $.ajax({
            type: "POST",
            url: path + "/api/login",
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('登录失败!')
                }
                // 弹出层
                layer.msg('登录成功')
                // 本地储存 token 用来身份验证
                localStorage.setItem('token', res.token)
                // bom跳转到后台主页
                window.location.href = '/index.html'
            }
        });
    })

    // 注册提交
    $('#form-reg').on('submit', function (event) {
        // 阻止默认提交
        event.preventDefault()
        // 发送ajax
        $.ajax({
            type: "POST",
            url: path + "/api/reguser",
            // 获取表单数据
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 弹出层
                layer.msg('注册成功')
                // dom对象方法清空注册表单
                this.reset()
                // 模拟点击跳转
                $('.reg-box #link-login').click()
            }
        });
    })
})