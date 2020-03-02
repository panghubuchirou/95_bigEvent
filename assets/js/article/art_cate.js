$(function () {
    let layer = layui.layer
    let form = layui.form
    // 两个index用来记录弹出层 关闭弹出层使用
    let index = null
    let index2 = null

    // 页面执行调用一次初始化分类列表
    initTable()
    // 封装 初始化分类列表函数
    function initTable() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                layer.msg('获取文章分类列表成功！')
                let htmlStr = template('tmp_table', res)
                $('tbody').html(htmlStr)
            }
        });
    }

    // 添加按钮点击弹出层
    $('#addSort').on('click', function () {
        index = layer.open({
            type: 1,
            title: '添加文章分类',
            content: $('#tmp_add').html(),
            area: ['500px', '250px'],
        });
    })
    // 委托 添加弹出层的提交事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('添加文章分类失败!')
                }
                layer.msg('添加文章分类成功!')
                initTable()
                layer.close(index)
            }
        });
    })

    // 编辑按钮弹出层
    $('.layui-card-body').on('click', '#edit', function () {
        index2 = layer.open({
            type: 1,
            title: '修改文章分类',
            content: $('#tmp_edit').html(),
            area: ['500px', '250px'],
        });
        let id = $(this).data('id')
        // 弹出层 渲染数据
        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类数据失败!')
                }
                layer.msg('获取文章分类数据成功!')
                form.val('form', res.data)
            }
        });
    });
    // 委托 编辑按钮 提交事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新失败!')
                }
                layer.msg('更新成功!')
                initTable()
                layer.close(index2)
            }
        });
    })


    // 删除操作
    $('body').on('click', '#del', function () {
        let id = $(this).data('id')
        layer.confirm('确定删除吗?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + id,
                success: function (res) {
                    // console.log(id);
                    if (res.status !== 0) {
                        return layer.msg('删除失败!')
                    }
                    layer.msg('删除成功!')
                    initTable()
                }
            });
            layer.close(index);
        })
    })
})