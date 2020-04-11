// 添加分类目录
$('#addCategory').on('submit', function () {
    // 获取用户在表单中输入的内容
    var formData = $(this).serialize();
    // 向服务器端发送请求 添加分类
    $.ajax({
        type: 'post',
        url: '/categories',
        data: formData,
        success: function () {
            location.reload();
        }
    })
    // 阻止表单默认提交行为
    return false;
});

// 向服务器端索要分类列表数据
$.ajax({
    type: 'get',
    url: '/categories',
    success: function (response) {
        // 将服务器返回的数据和html模板进行拼接
        var html = template('categoryListTpl', {data: response});
        // 将拼接好的内容放到页面中
        $('#categoryBox').html(html);
    }
});

// 为编辑按钮添加点击事件
$('#categoryBox').on('click', '.edit', function () {
    // 获取要修改的分类数据的id
    var id = $(this).attr('data-id');
    //
    $.ajax({
        type: 'get',
        url: '/categories/' + id,
        success: function (response) {  
            var html = template('modifyCategoryTpl', response);
            $('#formBox').html(html);
            
        }
    })
})

// 当修改分类数据表单发生提交行为
$('#formBox').on('submit', '#modifyCategory', function () {
    var formData = $(this).serialize();
    var id = $(this).attr('data-id');
    $.ajax({
        type: 'put',
        url: '/categories/' + id,
        data: formData,
        success: function () {
            location.reload();
        }
    })
    return false;
});

// 删除分类
$('#categoryBox').on('click', '.delete', function () {
    if(confirm('确认删除')) {
        var id = $(this).attr('data-id');
        $.ajax({
            type: 'delete',
            url: '/categories/' + id,
            success: function () {
                location.reload();
            }
        })
    }
})