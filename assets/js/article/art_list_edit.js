$(function () {
    /**
     * 图片初始化不出来 bug
     */

    // - 前面页面的id存在了全局中
    // -在页面获取id来进行修改
    let id = null
    let layer = layui.layer
    let form = layui.form
    // 初始化富文本编辑器
    initEditor()
    // 初始化下拉框
    initCate()


    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 初始化加载原始数据
    initData()


    // 初始化加载原始数据函数
    function initData() {
        id = window.parent.tempId
        $.ajax({
            type: "GET",
            url: "/my/article/" + id,
            success: function (res) {
                //给表单赋值
                if (res.status !== 0) {
                    return layer.msg('加载数据失败!')
                }
                layer.msg('加载数据成功!')
                // console.log(res.data.cover_img);
                let imgUrl = res.data.cover_img
                $image.prop('src', 'http://www.liulongbin.top:3007' + imgUrl)

                form.val("formTest", res.data)
            }
        });
    }


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
    $('#btnPub').on('submit', function (e) {
        e.preventDefault()

        let fd = new FormData(this)
        fd.append('state', tempStats)

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                fd.append('Id', id)
                // fd.forEach(item => console.log(item))
                addPub(fd)
            })
    })



    // 最后提交的ajax封装在外面看起来会干净一点
    function addPub(fd) {
        $.ajax({
            type: "POST",
            url: "/my/article/edit",
            data: fd,
            contentType: false,
            processData: false,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('修改失败!')
                }
                layer.msg('修改成功!')
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