$(function () {
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage

    // 设置参数对象
    let parameterObj = {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
    }

    initTable()
    initCate()

    // 给模板引擎封装过滤函数
    template.defaults.imports.dateFormat = function (date1) {
        let date = new Date(date1)
        return reZero(date.getFullYear()) + "-" + reZero((date.getMonth() + 1)) + '-' + reZero(date.getDate()) + ' ' + reZero(date.getHours()) + ':' + reZero(date.getMinutes()) + ':' + reZero(date.getSeconds())
    }

    // 封装过滤时间 补零的三元函数
    function reZero(date) {
        return date > 9 ? date : '0' + date
    }

    // 初始化表格
    function initTable() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: parameterObj,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取失败!')
                }
                layer.msg('获取成功!')
                // console.log(res);
                let htmlStr = template('tmp_moban', res)
                $('tbody').html(htmlStr)
                // console.log(res);
                renderPage(res.total)
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

    // 筛选按钮
    $('#formFilter').on('submit', function (e) {
        e.preventDefault()
        parameterObj.cate_id = $('[name=cate_id]').val()
        parameterObj.state = $('[name=state]').val()
        initTable()
    })

    // 分页渲染方法
    function renderPage(total) {
        laypage.render({
            elem: 'test1',
            count: total, //数据总数，从服务端得到
            curr: parameterObj.pagenum,
            limit: parameterObj.pagesize,
            limits: [2, 3, 5, 10],
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            // jump回调
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                parameterObj.pagenum = obj.curr
                parameterObj.pagesize = obj.limit
                //首次不执行
                if (!first) {
                    initTable()
                }
            }
        })
    }


    // 事件委托 编辑
    $('body').on('click', '#item_edit', function () {
        let tempId = $(this).data('id')
        window.parent.tempId = tempId
        location.href = '/article/art_list_edit.html'
    })



    // -事件委托删除
    //  -这里的layer的回调我设置成了箭头函数
    //  -因为我需要获取上面的this对象的id 但是我在回调中的function会改变this指向
    //  -所以我改成了箭头函数 这样保留了this指向的环境
    //  -避免了没有执行删除操作也会声明一次id变量
    $('body').on('click', '#item_del', function () {
        layer.confirm('确定删除吗?', {
            icon: 3,
            title: '提示'
        }, index => {
            let id = $(this).data('id')
            $.ajax({
                type: "GET",
                url: "/my/article/delete/" + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败!')
                    }
                    layer.msg('删除成功!')
                    initTable()
                }
            })
            layer.close(index)
        })



    })
})