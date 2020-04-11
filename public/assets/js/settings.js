// 当管理员选择logo图片的时候
$('#logo').on('change', function () {
    // 用户选择到的文件
	var file = this.files[0];
	// 创建formData对象实现二进制文件上传
	var formData = new FormData();
	// 将管理员选择到的文件添加到formData对象中
	formData.append('logo', file);
	// 向服务器端发送请求 实现图片上传
	$.ajax({
		type: 'post',
		url: '/upload',
		data: formData,
		processData: false,
		contentType: false,
		success: function (response) {
            $('#hiddenLogo').val(response[0].logo);
            // 将logo图片显示在页面中
            $('#preview').attr('src', response[0].logo);
		}
	})
});

$('#settingsForm').on('submit', function () {

    var formData = $(this).serialize();

    $.ajax({
        type: 'post',
        url: '/settings',
        data: formData,
        success: function () {
            location.reload();
        }
    })

    return false;
});

// 向服务器端发送请求 索要网站设置数据
$.ajax({
    type: 'get',
    url: '/settings',
    success: function (response) {
        console.log(response);
        if(response) {
            // 将logo地址存储在隐藏域中
            $('#hiddenLogo').val(response.logo);
            // 将logo显示在页面当中
            $('#preview').attr('src', response.logo);
            // 将网站标题显示在页面中
            $('input[name = "title"]').val(response.title);
            // 将是否开启评论功能显示在页面中
            $('input[name = "comment"]').prop('checked', response.comment);
            // 将评论是否经过人工审核显示在页面中
            $('input[name = "review"]').prop('checked', response.review);
        }
    }
})