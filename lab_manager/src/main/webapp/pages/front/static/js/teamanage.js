// 全局变量
var userInfo = window.location.href.split('?')[1];
var role = userInfo.split('&')[1].split('=')[1]; // role
var username = userInfo.split('&')[0].split('=')[1]; // username

/**
* 页面初始化事件
*/
function init () {
    /**
    * 初始化导航栏
    */
    $($('.nav-location')[0]).attr('href', '../info/index.html?' + userInfo + '?');
    $($('.nav-location')[1]).attr('href', '../allmanage/index.html?' + userInfo + '?');
    $($('.nav-location')[2]).attr('href', '../stumanage/index.html?' + userInfo + '?');
    $($('.nav-location')[3]).attr('href', '../promanage/index.html?' + userInfo + '?');
    $($('.nav-location')[4]).attr('href', '../dailyjob/index.html?' + userInfo + '?');
    $($('.nav-location')[5]).attr('href', '../aboutus/index.html?' + userInfo + '?');

    if (role !== 'teacher'){
        $('#tea-checkDuty').children().detach();
        $('#tea-checkDuty').append('<h2>本区域只对教师开放</h2>');
        $('#tea-correctGrade').children().detach();
        $('#tea-correctGrade').append('<h2>本区域只对教师开放</h2>');
    } else {
        loadLabNotice();
        loadLabCard();
        basicEvent();
    }
}

/**
* 加载实习课程
*/
function loadLabNotice() {
    var params = {username: username, role: role};
    $.ajax({
        type: 'POST',
        url: '/experiment/teaAllCourse',
        data: params,
        dataType: 'json',
        success: function(data){
            var retData = eval('(' + data + ')');
            $('#tea-course').children().detach();
            var domArr = [];
            $.each(retData, function(i, e){
                domArr.push(
                    '<div class="course hvr-sweep-to-right">',
                        '<div class="tea-courseId">' + e.courseId + '</div>',
                        '<div class="tea-courseContent">' + e.labName + ' ' + e.labWeek + ' ' + e.labWeekday + ' ' + e.labCourse + '</div>',
                        '<button class="btn btn-success tea-course-check-btn" data-toggle="modal" data-target="#tea-checkDuty-modal">考勤</button>',
                    '</div>'
                );
            });
            $('#tea-course').append(domArr.join(''));

            // 加载实习课程事件
            labNoticeEvent();
        },
        error: function(){
            console.log('/experiment/teaAllCourse');
            alert('后台错误');

        }
    });
}

/**
* 实习课程事件
*/
function labNoticeEvent() {
  // 加载学生信息
  $('.tea-course-check-btn').on('click', function(){
      var courseId = $(this).parents('.course').children('.tea-courseId').text();
      $('#tea-checkDuty-modal-label').text($(this).parents('.course').children('.tea-courseContent').text());
      $('#tea-checkDuty-modal-label').attr('data-courseId', courseId);
      $.ajax({
          type: 'POST',
          url: '/experiment/courseStuInfo',
          data: {username: username, role: role, courseId: courseId},
          dataType: 'json',
          success: function(data){
              var retData = eval('(' + data + ')');
              $('#tea-checkDuty-table').children().detach();
              var domArr = [];
              $.each(retData, function(i, e){
                  domArr.push(
                      '<tr>',
                          '<td>' + e.stuId + '</td>',
                          '<td>' + e.stuName + '</td>',
                          '<td><input class="form-control"></input></td>',
                          '<td>',
                              '<select class="form-control">',
                              '<option></option>',
                              '<option>已到</option>',
                              '<option>未到</option>',
                          '</td>',
                      '</tr>'
                  );
              });
              $('#tea-checkDuty-table').append(domArr.join(''));
          },
          error: function(){
              console.log('/experiment/courseStuInfo fail');
              alert('后台错误!');
          }
      });
  });

  // 考勤提交
  $('#post-checkDutyConfirm').on('click', function(){
      var stuArray = [];
      var trs = $('#tea-checkDuty-table').children();
      $.each(trs, function(i, e){
          stuArray.push({
              stuId: $(e).children('td').eq(0).text(),
              stuName: $(e).children('td').eq(1).text(),
              stuGrade: $(e).children('td').eq(2).children('input').val(),
              stuState: $(e).children('td').eq(3).children('select').children('option:selected').text()
          });
      });
      var params = {
        stu: JSON.stringify(stuArray),
        courseId: $('#tea-checkDuty-modal-label').attr('data-courseId'),
        username: username,
        role: role
      };
      $.ajax({
          type: 'POST',
          url: '/experiment/uploadAttendence',
          data: params,
          dataType: 'json',
          success: function(data){
            var retData = eval('(' + data + ')');
            if(retData.status === "0") {
                alert('考勤失败');
            }
            if(retData.status === "1") {
                alert('考勤成功');
            }
            $('#tea-checkDuty-modal').modal('hide');
          },
          error: function(){
              console.log('/experiment/uploadAttendence, fail');
              alert('后台错误');
          }
      });
  });
}

/**
* 加载实验
*/
function loadLabCard () {
    $.ajax({
        type: 'POST',
        url: '/teacher/teaAllLab',
        data: {username: username, role: role},
        dataType: 'json',
        success: function(data){
            var retData = eval('(' + data + ')');
            $('#tea-correctGrade .flex-box').children().detach();
            var domArr = [];
            $.each(retData, function(i, e){
                domArr.push(
                    '<div class="card hvr-bounce-in" data-labName="' + e.labName + '">',
                        '<div class="tea-labId">' + e.labId + '</div>',
                        '<div class="tea-correctGrade-labName">' + e.labName + '</div>',
                        '<button class="btn btn-success tea-correct-btn" data-toggle="modal" data-target="#tea-correctGrade-modal">给成绩</button>',
                    '</div>'
                );
            });
            $('#tea-correctGrade .flex-box').append(domArr.join(''));

            // 加载实验事件
            labCardEvent();
        },
        error: function(){
            console.log('/teacher/teaAllLab fail');
            alert('后台错误');
        }
    });
}

/**
* 实验事件
*/
function labCardEvent() {
  // 加载学生信息
  $('.tea-correct-btn').on('click', function(){
      var labName = $(this).parents('.card').attr('data-labName');
      var labId = $(this).parents('.card').children('.tea-labId').text();
      var params = {
        labName: labName,
        labId: labId,
        username: username,
        role: role
      };
      $('#tea-correctGrade-modal-label').text(labName);
      $('#tea-correctGrade-modal-label').attr('data-labId', labId);
      $.ajax({
          type: 'POST',
          url: '/teacher/getExpStuInfo',
          data: params,
          dataType: 'json',
          success: function(data){
              var retData = eval('(' + data + ')');
              $('#tea-correctGrade-table').children().detach();
              var domArr = [];
              $.each(retData, function(i, e){
                  domArr.push(
                      '<tr><td>' + e.stuId + '</td><td>' + e.stuName + '</td><td><input class="form-control"></input></td></tr>'
                  );
              });
              $('#tea-correctGrade-table').append(domArr.join(''));
          },
          error: function(){
              console.log('/teacher/getExpStuInfo fail');
              alert('后台错误');
          }
      });
  });

  // 发送成绩
  $('#post-correctGradeConfirm').on('click', function(){
      var stuArray = [];
      var trs = $('#tea-correctGrade-table').children();
      $.each(trs, function(i, e){
          stuArray.push({
              stuId: $(e).children('td').eq(0).text(),
              stuGrade: $(e).children('td').eq(2).children('input').val()
          });
      });
      var params = {
          stu: JSON.stringify(stuArray),
          username: username,
          role: role,
          labId: $('#tea-correctGrade-modal-label').attr('data-labId')
      };
      $.ajax({
          type: 'POST',
          url: '/teacher/uploadStuGrade',
          data: params,
          dataType: 'json',
          success: function(data){
            var retData = eval('(' + data + ')');
            if(retData.status === "0") {
                alert('给成绩失败');
            }
            if(retData.status === "1") {
                alert('给成绩成功');
            }
            $('#tea-correctGrade-modal').modal('hide');
          },
          error: function(){
              console.log('/teacher/uploadStuGrade');
              alert('后台出错');
          }
      });
  });
}

/**
* 页面事件
*/
function basicEvent () {

}

init();
