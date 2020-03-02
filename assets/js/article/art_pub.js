$(function () {

    let form = layui.form
    let layer = layui.layer


    initCate()

    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)



    // 模拟fd stats状态
    let tempStats = '已发布'

    // 点击草稿的时候改变字符串 用于最后FormData提交
    $('#btnDraft').on('click', function () {
        tempStats = '草稿'
    })



    // 点击选择封面 文件域触发点击
    $('#chooseImg').on('click', function () {
        $('#file_pub').click()
    })

    // 文件域change 选择新图
    $('#file_pub').on('change', function (e) {
        var files = e.target.files
        if (files.length === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(files[0])

        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    })


    // -监听form表单提交事件
    //      -formdata取到3个属性 手动添加两个图片和状态,状态模拟了图片使用canvas的回调取到
    //      -然后fd append进去 然后就可以使用fd进行ajax了
    //      -最后防止代码太乱 封账了ajax 然后最后再跳转到文章列表页面
    $('#btnPub').on('submit', function (e) {
        e.preventDefault()

        let fd = new FormData(this)
        fd.append('state', tempStats)
        // fd.forEach(item => console.log(item))
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                addPub(fd)
            })
    })

    // 最后提交的ajax封装在外面看起来会干净一点
    function addPub(fd) {
        $.ajax({
            type: "POST",
            url: "/my/article/add",
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布失败!')
                }
                layer.msg('发布成功!')
                window.location.href = '/article/art_list.html'
            }
        })
    }


    // 初始化下拉框
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取失败!')
                }
                layer.msg('获取成功!')
                let htmlStr = template('tmp_list', res)
                $('#classList').html(htmlStr)
                form.render()
            }
        })
    }
})