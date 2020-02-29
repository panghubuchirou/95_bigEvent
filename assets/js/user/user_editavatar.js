$(function () {

    let layer = layui.layer

    // 1.1 获取裁剪区域的 DOM 元素
    let $image = $('#image')

    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    $('#upload').on('click', function () {
        $('#file').click()
    })

    $('#file').on('change', function (e) {
        let file = e.target.files
        // console.dir(file);
        if (file.length === 0) {
            return layer.msg('请选择图片!')
        }

        let newImgUrl = URL.createObjectURL(file[0])
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgUrl) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });
    // 点击上传头像
    $('#btn').on('click', function () {
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')
        console.log(dataURL);

        $.ajax({
            type: "POST",
            url: "/my/update/avatar",
            data: dataURL,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败！')
                }
                layer.msg('更新头像成功!')
                // 重新渲染头像
                window.parent.getUserInfo()
            }

        });
    })


})