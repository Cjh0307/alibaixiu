// 当表单发生提交行为的时候
$('#userForm').on('submit', function () {
    // 获取到用户在表单中输入的内容并将内容格式化成参数字符串
    var formData = $(this).serialize();
    // 向服务器端发送添加用户的请求
    $.ajax({
        type: 'post',
        url: '/users',
        data: formData,
        success: function () {
            // 刷新页面
            location.reload();
        },
        error: function () {
            alert('用户添加失败')
        }
    })
    // 阻止表单的默认提交行为
    return false;
});

// 当用户选择文件的时候
$('#modifyBox').on('change', '#avatar', function () {
    var formData = new FormData();
    formData.append('avatar', this.files[0]);

    $.ajax({
        type: 'post',
        url: '/upload',
        data: formData,
        // 不解析请求参数
        processData: false,
        // 不设置请求参数的类型
        contentType: false,
        success: function (response) {
            console.log(response);
            // 实现图片预览
            $('#preview').attr('src', response[0].avatar);
            $('#hiddenAvatar').val(response[0].avatar);
        }
    })
});

// 向服务端发送请求 索要用户列表数据
$.ajax({
    type: 'get',
    url: '/users',
    success: function (response) {
        // console.log(response);
        // 使用模板引擎将数据和HTML字符串进行拼接
        var html = template('userTpl', {
            data: response
        });
        // 将拼接好的字符串显示在页面中
        $('#userBox').html(html);

    }
})

// 用户信息修改
$('#userBox').on('click', '.edit', function () {
    // 获取被点击用户的id值
    var id = $(this).attr('data-id');
    // 根据id获取用户详细信息
    $.ajax({
        type: 'get',
        url: '/users/' + id,
        success: function (response) {
            var html = template('modifyTpl', response);
            $('#modifyBox').html(html);
        }
    })
});

// 为修改表单添加表单提交事件
$('#modifyBox').on('submit', '#modifyForm', function () {
    // 获取用户在表单中输入的内容
    var formData = $(this).serialize();
    var id = $(this).attr('data-id');
    $.ajax({
        type: 'put',
        url: '/users/' + id,
        data: formData,
        success: function (response) {
            location.reload();
        }
    })
    // 阻止表单默认提交
    return false;
});

// 删除用户信息
$('#userBox').on('click', '.delete', function () {
    if (confirm('确认删除')) {
        var id = $(this).attr('data-id');
        $.ajax({
            type: 'delete',
            url: '/users/' + id,
            success: function (response) {
                location.reload();
            }
        })
    }
})

//实现批量删除

// 获取全选按钮
var selectAll = $('#selectAll');
// 获取批量删除按钮
var deleteMany = $('#deleteMany');
// 当全选按钮的状态发生改变的时候
selectAll.on('change', function () {
    // 获取到全选按钮当前的状态
    var status = $(this).prop('checked');

    if (status) {
        deleteMany.show();
    } else {
        deleteMany.hide();
    }

    // 获取到所有的用户
    $('#userBox').find('input').prop('checked', status);
});
// 当用户前面的复选框状态发生改变时
$('#userBox').on('change', '.userStatus', function () {
    // 获取到所有用户
    var inputs = $('#userBox').find('input');
    if (inputs.length == inputs.filter(':checked').length) {
        selectAll.prop('checked', true);
    } else {
        selectAll.prop('checked', false);
    }

    if (inputs.filter(':checked').length > 0) {
        deleteMany.show();
    } else {
        deleteMany.hide();
    }
});

// 为批量删除按钮添加点击事件
deleteMany.on('click', function () {
    var ids = [];
    // 获取选中的用户
    var checkedUser = $('#userBox').find('input').filter(':checked');
    // 循环复选框
    checkedUser.each(function (index, element) {
        ids.push($(element).attr('data-id'));
    });

    if (confirm('确认删除')) {
        $.ajax({
            type: 'delete',
            url: '/users/' + ids.join('-'),
            success: function (response) {
                location.reload();
            }
        })
    }

})