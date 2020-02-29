$(function () {

    let layer = layui.layer
    let form = layui.form

    initUserInfo()

    function initUserInfo() {
        $.ajax({
            type: "GET",
            url: "/my/userinfo",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败!')
                }
                form.val('form', res.data)
            }
        });
    }

    // 绑定事件
    $('#editInfo').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            type: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改用户信息失败！')
                }
                layer.msg('修改用户信息成功！')
                window.parent.getUserInfo()
            }
        });
    });


    $('#reset').on('click', function (e) {
        e.preventDefault()
        initUserInfo()
    })
})