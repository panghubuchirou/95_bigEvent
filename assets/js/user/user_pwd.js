$(function () {
    let form = layui.form
    let layer = layui.layer


    $('#editPwd').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            type: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新密码失败!')
                }
                layer.msg('更新密码成功!')
                $('#reset').click()
            }
        });
    });


    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        newPwd: function (val) {
            let pwd = $('[name=oldPwd]').val()
            if (pwd === val) {
                return '新密码不能与旧密码相同'
            }
        },
        samePwd: function (val) {
            let pwd = $('[name=newPwd]').val()
            if (pwd !== val) {
                return '两次密码不一致'
            }
        }
    })
})