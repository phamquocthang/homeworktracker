// JavaScript Document
var id = "";
var db = null;
function onDeviceReady() {
	
	db = window.openDatabase("HomeworkTracker3", "2.0", "HomeworkTracker3", 2000);
	
	db.transaction(populateDB, errorCB, successCB);
	
	db.transaction(getDeadlinesList, errorCB);
}

function populateDB(tx) {
	
	 tx.executeSql('CREATE TABLE IF NOT EXISTS deadlines (id varchar(10) primary key, description varchar(500), class varchar(50), duedate date, duetime time, type varchar(50), additionalInfo varchar(200), finished varchar(10))');
}


function getDeadlinesList(tx){
	//////alert('get deadline');
	var sql = "select * from deadlines where finished = 'no' ORDER BY duedate";
	tx.executeSql(sql, [] , getAllDeadlines_success);
	var sql2 = "select * from deadlines where finished = 'no' and type = 'Homework' ORDER BY duedate";
	tx.executeSql(sql2, [] , getHomeworkDeadlines_success);
	//////alert('get test deadline');
	var sql3 = "select * from deadlines where finished = 'no' and type = 'Test' ORDER BY duedate";
	tx.executeSql(sql3, [] , getTestDeadlines_success);
}

function getAllDeadlines_success(tx, results){

	var len = results.rows.length;
	//var s = "";
	for (var i=0; i<len; i++){
		var allDeadline = results.rows.item(i);
		//compare with current time
		var result = isLate(allDeadline.duedate, allDeadline.duetime).toString();
		if ( result == "true"){
			$('#allList').append('<li><a href="#DeadlineDetail" id = "'+allDeadline.id+'" data-transition = "slide">'+ allDeadline.class +'<br>'+ allDeadline.duedate+'  '+ allDeadline.duetime+'<br>'+ allDeadline.description +'</a></li>');
		}
	}
	$("#allList").listview().listview('refresh');
	$('#allList').children().each(function(){
                var anchor = $(this).find('a');
                if(anchor){
                    anchor.click(function(){
						   ////alert(anchor.attr('id'));
                        sessionStorage.setItem("selectedId", anchor.attr('id'));
                    });
                }
    });
	
		////////alert('before append');
}


function getHomeworkDeadlines_success(tx, results){
	
	//////alert('get homework deadlines');
	var len = results.rows.length;
	for (var i=0; i<len; i++){
		var homeworkDeadline = results.rows.item(i);
		var result = isLate(homeworkDeadline.duedate, homeworkDeadline.duetime).toString();
		//////alert('result: ' + result);
		if ( result == "true" ){
			//////alert('append');				
			$('#homeworkList').append('<li><a href="#DeadlineDetail" id = "'+homeworkDeadline.id+'" data-transition = "slide">'+ homeworkDeadline.class + '<br>' + homeworkDeadline.duedate+'    '+ homeworkDeadline.duetime+'<br>'+ homeworkDeadline.description +'</a></li>');
		} 
		
	}
	$("#homeworkList").listview().listview('refresh');
	$('#homeworkList').children().each(function(){
                var anchor = $(this).find('a');
                if(anchor){
                    anchor.click(function(){
						   ////alert(anchor.attr('id'));
                        sessionStorage.setItem("selectedId", anchor.attr('id'));
                    });
                }
    });
		////////alert('before append');
}


function getTestDeadlines_success(tx, results){

	var len = results.rows.length;
	//var s = "";
	for (var i=0; i<len; i++){
		var testDeadline = results.rows.item(i);
		var result = isLate(testDeadline.duedate, testDeadline.duetime).toString();
		if ( result == "true"){
			$('#testList').append('<li><a href="#DeadlineDetail" id = "'+testDeadline.id+'" data-transition = "slide">'+ testDeadline.class + '<br>' + testDeadline.duedate+'    '+ testDeadline.duetime+'<br>'+ testDeadline.description +'</a></li>');
		}
				
	}
	$("#testList").listview().listview('refresh');
	$('#testList').children().each(function(){
                var anchor = $(this).find('a');
                if(anchor){
                    anchor.click(function(){
						   ////alert(anchor.attr('id'));
                        sessionStorage.setItem("selectedId", anchor.attr('id'));
                    });
                }
    });
		////////alert('before append');
}

function getFinishedDeadlines(tx) {
    
    var sql = "select * from deadlines where finished = 'yes'";
    tx.executeSql(sql, [], getAllFinishedDeadlines_success);
    var sql2 = "select * from deadlines where finished = 'yes' and type = 'Homework'";
    tx.executeSql(sql2, [], getHomeworkFinishedDeadlines_success);
    var sql3 = "select * from deadlines where finished = 'yes' and type = 'Test'";
    tx.executeSql(sql3, [], getTestFinishedDeadlines_success);
}

function getAllFinishedDeadlines_success(tx, results) {
    var len = results.rows.length;
    //var s = "";
    for (var i = 0; i < len; i++) {
        var allFinishedDeadline = results.rows.item(i);
        $('#allFinishedList').append('<li><a href="deadlineDetail.html?id=' + allFinishedDeadline.id + '"><del>' + allFinishedDeadline.class + '<br>' + allFinishedDeadline.duedate + '  ' + allFinishedDeadline.duetime + '<br>' + allFinishedDeadline.description + '</del></a></li>');

    }
    $("#allFinishedList").listview('refresh');
    //alert('before append');
}

function getHomeworkFinishedDeadlines_success(tx, results) {

    var len = results.rows.length;
    for (var i = 0; i < len; i++) {
        var homeworkFinishedDeadline = results.rows.item(i);

        $('#homeworkFinishedList').append('<li><a href="deadlineDetail.html?id=' + homeworkFinishedDeadline.id + '"><del>' + homeworkFinishedDeadline.class + '<br>' + homeworkFinishedDeadline.duedate + '    ' + homeworkFinishedDeadline.duetime + '<br>' + homeworkFinishedDeadline.description + '</del></a></li>');

    }
    $("#homeworkFinishedList").listview('refresh');
    //alert('before append');
}

function getTestFinishedDeadlines_success(tx, results) {

    var len = results.rows.length;
    //var s = "";
    for (var i = 0; i < len; i++) {
        var testFinishedDeadline = results.rows.item(i);

        $('#testFinishedList').append('<li><a href="deadlineDetail.html?id=' + testFinishedDeadline.id + '"><del>' + testFinishedDeadline.class + '<br>' + testFinishedDeadline.duedate + '    ' + testFinishedDeadline.duetime + '<br>' + testFinishedDeadline.description + '</del></a></li>');

    }
    $("#testFinishedList").listview('refresh');
    //alert('before append');
}

function isLate(deadlineDate, deadlineTime){
	var now = new Date();
	var year = now.getFullYear();
	var month = now.getMonth() + 1;
	var date = now.getDate();
	var hour = now.getHours();
	var minute = now.getMinutes();
	
	var parts = deadlineDate.split('-');
	var time = deadlineTime.split(':');
	
	if ( parts[0] < year ){// previous year
		return false;
	} else if ( ( parts[0] == year ) && ( parts[1] < month)){ // previous month
		return false;
	} else if (( parts[0] == year ) && ( parts[1] == month) && (parts[2] < date)){// previous date
		return false;
	} else if (( parts[0] == year ) && ( parts[1] == month) && (parts[2] == date) && (time[0] < hour)){ // previous hour
		return false;
	} else if (( parts[0] == year ) && ( parts[1] == month) && (parts[2] == date) && (time[0] == hour) && (time[1] < minute)) { // previous minute
		return false;
	} else {
		return true;
	}	
}

function errorCB(tx, err) {
	////alert("Error processing SQL: "+err);
}

function successCB(tx){
}

function populateClassDB(tx) {
	////////////alert('starting populate');
	 tx.executeSql('CREATE TABLE IF NOT EXISTS classes (id varchar(10) primary key, name varchar(50), location varchar(50), classdate varchar(50), classtime time, teacher varchar(50), email varchar(200), phone varchar(10))');
	 //////////alert('populate done');
	 ////////////alert(tx);
}

function getClasses(tx){
	//////////alert('classes');
	var sql = "select * from classes";
	tx.executeSql(sql, [] , getClasses_success);
	
}
function getClasses_success(tx, results){
	
	var len = results.rows.length;
	//////////alert('len: ' + len);
	//var s = "";
	for (var i=0; i<len; i++){
		var classDB = results.rows.item(i);
		$('#class').append('<option value="'+ classDB.name + '">'+ classDB.name +'</option>');
	}
		////////////alert('before append');
}

function getDeadlineDetail(tx){
	//////////alert('get deadline detail');
	//id = getParameterByName('id');
	//////////alert(id);
	id = sessionStorage.getItem("selectedId");
	////alert(id);
    sessionStorage.removeItem("selectedId");
	var sql = "select * from deadlines where id = '" + id +"'";
	////alert('before exe')
	tx.executeSql(sql, [] , getDeadlineDetail_success);
}

function getDeadlineDetail_success(tx, results){
	var len = results.rows.length;
	//var s = "";
	for (var i=0; i<len; i++){
		var deadline = results.rows.item(i);
		var description = deadline.description;
		var classDeadline = deadline.class;
		////////alert(classDeadline);
		var duedate = deadline.duedate;
		var duetime = deadline.duetime;
		var type = deadline.type;
		var additionalInfo = deadline.additionalInfo;
		var finished = deadline.finished;
		////////alert(finished);
		document.getElementById("shortDescription").value = description;
		document.getElementById("dueDate").value = duedate;
		document.getElementById("dueTime").value = duetime;
		document.getElementById("additionalInfo").value = additionalInfo;
		
		var selectClass = $("#class"); 
		$("#class").val(classDeadline);
		selectClass.selectmenu().selectmenu("refresh");

		var selectType = $("#type");
		$("#type").val(type);
		selectType.selectmenu().selectmenu("refresh");
		
		////////alert('before select finished');
		var selectFinished = $("#finished");
		$("#finished").val(finished);
		selectFinished.flipswitch().flipswitch("refresh");
			
	}
		////////////alert('before append');
}

function getFormInfo(){
	//alert(id);
	var description = document.getElementById("shortDescription").value;
	//alert(description);
	var classDeadline = document.getElementById("class").value;
	//alert(classDeadline);
	var duedate = document.getElementById("dueDate").value;
	//alert(duedate);
	var duetime = document.getElementById("dueTime").value;
	//alert(duetime);
	var type = document.getElementById("type").value;
	//alert(type);
	var additionalInfo = document.getElementById("additionalInfo").value;
	//alert(additionalInfo);
	var finished = document.getElementById("finished").value;	
	//alert(finished);
	updateDeadlineToDB(description,classDeadline,duedate, duetime, type, additionalInfo, finished);
	
}

function updateDeadlineToDB(description,classDeadline,duedate, duetime, type, additionalInfo, finished){
	db.transaction(populateDB, errorCB, successCB);
	db.transaction(function(tx){
		tx.executeSql("UPDATE deadlines SET description = ?, class = ?, duedate = ?, duetime =?, type = ?, additionalInfo = ?, finished = ? WHERE id = ?",[description,classDeadline,duedate, duetime, type, additionalInfo, finished, id], updateSuccessCB, errorCB);
		});
}

function updateSuccessCB(tx){
	////alert("Saved successfully");
		
	$.mobile.changePage($("#deadlineList"));
	
	$("#deadlineList").load(".ui-content");
	
	
	
	
}

function getParameterByName(name) {
    		var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    		return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
