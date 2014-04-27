// JavaScript Document
var id = "";
var db = null;


function onDeviceReady() {
	localNotifier.addNotification({
    fireDate        : Math.round(new Date().getTime()/1000 + 5),
    alertBody       : "This is a new local notification.",
    repeatInterval  : "daily",
    soundName       : "horn.caf",
    badge           : 0,
    notificationId  : 123,
    foreground      : function(notificationId){ 
        alert("Hello World! This alert was triggered by notification " + notificationId); 
    },
    background  : function(notificationId){
        alert("Hello World! This alert was triggered by notification " + notificationId);
    }           
});

		
	db = window.openDatabase("HomeworkTracker3", "2.0", "HomeworkTracker3", 2000);
	
	db.transaction(populateDB, errorCB, successCB);
	
	db.transaction(getDeadlinesList, errorCB);
}

function populateDB(tx) {
	
	 tx.executeSql('CREATE TABLE IF NOT EXISTS deadlines (id varchar(10) primary key, description varchar(500), class varchar(50), duedate date, duetime time, type varchar(50), additionalInfo varchar(200), finished varchar(10))');
}


function getDeadlinesList(tx){
	
	var sql = "select * from deadlines where finished = 'no' ORDER BY duedate";
	tx.executeSql(sql, [] , getAllDeadlines_success);
	var sql2 = "select * from deadlines where finished = 'no' and type = 'Homework' ORDER BY duedate";
	tx.executeSql(sql2, [] , getHomeworkDeadlines_success);
	////alert('get test deadline');
	var sql3 = "select * from deadlines where finished = 'no' and type = 'Test' ORDER BY duedate";
	tx.executeSql(sql3, [] , getTestDeadlines_success);
}

function getAllDeadlines_success(tx, results){

	var len = results.rows.length;
	//var s = "";
	$('#allList').empty();
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
                        sessionStorage.setItem("selectedId", anchor.attr('id'));
						  
                    });
                }
    });
	
		//////alert('before append');
}


function getHomeworkDeadlines_success(tx, results){
	
	////alert('get homework deadlines');
	var len = results.rows.length;
	$('#homeworkList').empty();
	for (var i=0; i<len; i++){
		var homeworkDeadline = results.rows.item(i);
		var result = isLate(homeworkDeadline.duedate, homeworkDeadline.duetime).toString();
		
		////alert('result: ' + result);
		if ( result == "true" ){
			////alert('append');				
			$('#homeworkList').append('<li><a href="#DeadlineDetail" id = "'+homeworkDeadline.id+'" data-transition = "slide">'+ homeworkDeadline.class + '<br>' + homeworkDeadline.duedate+'    '+ homeworkDeadline.duetime+'<br>'+ homeworkDeadline.description +'</a></li>');
		} 
		
	}
	$("#homeworkList").listview().listview('refresh');
	$('#homeworkList').children().each(function(){
                var anchor = $(this).find('a');
                if(anchor){
                    anchor.click(function(){
						   //alert(anchor.attr('id'));
                        sessionStorage.setItem("selectedId", anchor.attr('id'));
                    });
                }
    });
		//////alert('before append');
}


function getTestDeadlines_success(tx, results){

	var len = results.rows.length;
	//var s = "";
	$('#testList').empty();
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
						   //alert(anchor.attr('id'));
                        sessionStorage.setItem("selectedId", anchor.attr('id'));
                    });
                }
    });
		//////alert('before append');
}
function getFinishedDeadlines(tx) {
    
    var sql = "select * from deadlines where finished = 'yes' ORDER BY duedate";
    tx.executeSql(sql, [], getAllFinishedDeadlines_success);
    var sql2 = "select * from deadlines where finished = 'yes' and type = 'Homework' ORDER BY duedate";
    tx.executeSql(sql2, [], getHomeworkFinishedDeadlines_success);
    var sql3 = "select * from deadlines where finished = 'yes' and type = 'Test' ORDER BY duedate";
    tx.executeSql(sql3, [], getTestFinishedDeadlines_success);
}

function getAllFinishedDeadlines_success(tx, results) {
    var len = results.rows.length;
    //var s = "";
	$('#allFinishedList').empty();
    for (var i = 0; i < len; i++) {
        var allFinishedDeadline = results.rows.item(i);
        $('#allFinishedList').prepend('<li><a href="#DeadlineDetail" id = "'+allFinishedDeadline.id+'" data-transition = "slide"><del>' + allFinishedDeadline.class + '<br>' + allFinishedDeadline.duedate + '  ' + allFinishedDeadline.duetime + '<br>' + allFinishedDeadline.description + '</del></a></li>');

    }
    $("#allFinishedList").listview().listview('refresh');
	$('#allFinishedList').children().each(function(){
                var anchor = $(this).find('a');
                if(anchor){
                    anchor.click(function(){
						   //alert(anchor.attr('id'));
                        sessionStorage.setItem("selectedId", anchor.attr('id'));
                    });
                }
    });
	
    ////alert('before append');
}

function getHomeworkFinishedDeadlines_success(tx, results) {

    var len = results.rows.length;
	$('#homeworkFinishedList').empty();
    for (var i = 0; i < len; i++) {
        var homeworkFinishedDeadline = results.rows.item(i);

        $('#homeworkFinishedList').prepend('<li><a href="#DeadlineDetail" id = "'+homeworkFinishedDeadline.id+'" data-transition = "slide"><del>' + homeworkFinishedDeadline.class + '<br>' + homeworkFinishedDeadline.duedate + '    ' + homeworkFinishedDeadline.duetime + '<br>' + homeworkFinishedDeadline.description + '</del></a></li>');

    }
    $("#homeworkFinishedList").listview().listview('refresh');
	$('#homeworkFinishedList').children().each(function(){
                var anchor = $(this).find('a');
                if(anchor){
                    anchor.click(function(){
						   //alert(anchor.attr('id'));
                        sessionStorage.setItem("selectedId", anchor.attr('id'));
                    });
                }
    });
    ////alert('before append');
}

function getTestFinishedDeadlines_success(tx, results) {

    var len = results.rows.length;
    //var s = "";
	$('#testFinishedList').empty();
    for (var i = 0; i < len; i++) {
        var testFinishedDeadline = results.rows.item(i);

        $('#testFinishedList').prepend('<li><a href="#DeadlineDetail" id = "'+testFinishedDeadline.id+'" data-transition = "slide"><del>' + testFinishedDeadline.class + '<br>' + testFinishedDeadline.duedate + '    ' + testFinishedDeadline.duetime + '<br>' + testFinishedDeadline.description + '</del></a></li>');

    }
    $("#testFinishedList").listview().listview('refresh');
	$('#testFinishedList').children().each(function(){
                var anchor = $(this).find('a');
                if(anchor){
                    anchor.click(function(){
						   //alert(anchor.attr('id'));
                        sessionStorage.setItem("selectedId", anchor.attr('id'));
                    });
                }
    });
    ////alert('before append');
}

function getMissedDeadlines(tx){
	////alert('get missed deadlines');
	var sql = "select * from deadlines where finished = 'no' ORDER BY duedate";
	tx.executeSql(sql, [] , getAllMissedDeadlines_success);
	var sql2 = "select * from deadlines where finished = 'no' and type = 'Homework' ORDER BY duedate";
	tx.executeSql(sql2, [] , getHomeworkMissedDeadlines_success);
	var sql3 = "select * from deadlines where finished = 'no' and type = 'Test' ORDER BY duedate";
	tx.executeSql(sql3, [] , getTestMissedDeadlines_success);
}

function getAllMissedDeadlines_success(tx, results){
	var len = results.rows.length;
	//var s = "";
	$('#allMissedList').empty();
	for (var i=0; i<len; i++){
		var allMissedDeadline = results.rows.item(i);
		var result = isLate(allMissedDeadline.duedate, allMissedDeadline.duetime).toString();
		if ( result == "false"){
			$('#allMissedList').prepend('<li><a href="#DeadlineDetail" id = "'+allMissedDeadline.id+'" data-transition = "slide">'+ allMissedDeadline.class +'<br>'+ allMissedDeadline.duedate+'  '+ allMissedDeadline.duetime+'<br>'+ allMissedDeadline.description +'</a></li>');
		}
	}
	$("#allMissedList").listview().listview('refresh');
	$('#allMissedList').children().each(function(){
                var anchor = $(this).find('a');
                if(anchor){
                    anchor.click(function(){
						   //alert(anchor.attr('id'));
                        sessionStorage.setItem("selectedId", anchor.attr('id'));
                    });
                }
    });
	
}

function getHomeworkMissedDeadlines_success(tx, results){
	
	var len = results.rows.length;
	$('#homeworkMissedList').empty();
	for (var i=0; i<len; i++){
		var homeworkMissedDeadline = results.rows.item(i);
		var result = isLate(homeworkMissedDeadline.duedate, homeworkMissedDeadline.duetime).toString();
		////alert('result: ' + result);
		if ( result == "false" ){
			////alert('append');				
			$('#homeworkMissedList').prepend('<li><a href="#DeadlineDetail" id = "'+homeworkMissedDeadline.id+'" data-transition = "slide">'+ homeworkMissedDeadline.class + '<br>' + homeworkMissedDeadline.duedate+'    '+ homeworkMissedDeadline.duetime+'<br>'+ homeworkMissedDeadline.description +'</a></li>');
		} 
		else continue;;
	}
	$("#homeworkMissedList").listview().listview('refresh');
	$('#homeworkMissedList').children().each(function(){
                var anchor = $(this).find('a');
                if(anchor){
                    anchor.click(function(){
						   //alert(anchor.attr('id'));
                        sessionStorage.setItem("selectedId", anchor.attr('id'));
                    });
                }
    });
		
}

function getTestMissedDeadlines_success(tx, results){

	var len = results.rows.length;
	//var s = "";
	$('#testMissedList').empty();
	for (var i=0; i<len; i++){
		var testMissedDeadline = results.rows.item(i);
		var result = isLate(testMissedDeadline.duedate, testMissedDeadline.duetime).toString();
		if ( result == "false"){
			$('#testMissedList').prepend('<li><a href="#DeadlineDetail" id = "'+testMissedDeadline.id+'" data-transition = "slide">'+ testMissedDeadline.class + '<br>' + testMissedDeadline.duedate+'    '+ testMissedDeadline.duetime+'<br>'+ testMissedDeadline.description +'</a></li>');
		}		
	}
	$("#testMissedList").listview().listview('refresh');
	$('#testMissedList').children().each(function(){
                var anchor = $(this).find('a');
                if(anchor){
                    anchor.click(function(){
						   //alert(anchor.attr('id'));
                        sessionStorage.setItem("selectedId", anchor.attr('id'));
                    });
                }
    });
		
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
	alert("Error processing SQL: "+err);
}

function successCB(tx){
}

function populateClassDB(tx) {
	//////////alert('starting populate');
	 tx.executeSql('CREATE TABLE IF NOT EXISTS classes (id varchar(10) primary key, name varchar(50), location varchar(50), classdate varchar(50), classtime time, teacher varchar(50), email varchar(200), phone varchar(10))');
	 ////////alert('populate done');
	 //////////alert(tx);
}

function getClasses(tx){
	////////alert('classes');
	var sql = "select * from classes";
	tx.executeSql(sql, [] , getClasses_success);
	
}
function getClasses_success(tx, results){
	
	var len = results.rows.length;
	//avoid duplicate class list 
	$('#classList').empty();
	$('#classAddNew').empty();
	$('#class').empty();
	//
	for (var i=0; i<len; i++){
		var classDB = results.rows.item(i);
		$('#class').append('<option value="'+ classDB.name + '">'+ classDB.name +'</option>');
		$('#classAddNew').append('<option value="'+ classDB.name + '">'+ classDB.name +'</option>');
		$('#classList').append('<li><a href="#classDetail" id = "'+classDB.id+'" data-transition = "slide" >'+ classDB.name +'</a></li>');		
	}
	$("#classList").listview().listview('refresh');
	$('#classList').children().each(function(){
                var anchor = $(this).find('a');
                if(anchor){
                    anchor.click(function(){
						   //alert(anchor.attr('id'));
                        sessionStorage.setItem("selectedId", anchor.attr('id'));
                    });
                }
    });
		//////////alert('before append');
}

function getClassDetail(tx){
	//////alert('classes');
	id = sessionStorage.getItem("selectedId");
	var sql = "select * from classes where id ='"+ id +"'";
	tx.executeSql(sql, [] , getClassDetail_success);	
}

function getClassDetail_success(tx, results){

	var len = results.rows.length;
	//////alert('len: ' + len);
	//var s = "";
	for (var i=0; i<len; i++){
		var classDB = results.rows.item(i);
		var name = classDB.name;
		var location = classDB.location;
		var date = classDB.classdate;
		var time = classDB.classtime;
		var teacher = classDB.teacher;
		var email = classDB.email;
		var phone = classDB.phone;
		document.getElementById("className").value = name;
		document.getElementById("classLocation").value = location;
		document.getElementById("classDate").value = date;
		document.getElementById("classTime").value = time;
		document.getElementById("classTeacher").value = teacher;
		document.getElementById("classTeacherEmail").value = email;
		document.getElementById("classTeacherPhone").value = phone;
	}
		////////alert('before append');
}

function getDeadlineDetail(tx){
	////////alert('get deadline detail');
	//id = getParameterByName('id');
	////////alert(id);
	
	id = sessionStorage.getItem("selectedId");
    sessionStorage.removeItem("selectedId");
	var sql = "select * from deadlines where id = '" + id +"'";
	
	tx.executeSql(sql, [] , getDeadlineDetail_success);
}

function getDeadlineDetail_success(tx, results){
	var len = results.rows.length;
	//var s = "";
	for (var i=0; i<len; i++){
		var deadline = results.rows.item(i);
		var description = deadline.description;
		var classDeadline = deadline.class;
		//////alert(classDeadline);
		var duedate = deadline.duedate;
		var duetime = deadline.duetime;
		var type = deadline.type;
		var additionalInfo = deadline.additionalInfo;
		var finished = deadline.finished;
		//////alert(finished);
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
		
		//////alert('before select finished');
		var selectFinished = $("#finished");
		$("#finished").val(finished);
		selectFinished.flipswitch().flipswitch("refresh");
			
	}
		//////////alert('before append');
}

function getFormInfo(){
	////alert(id);
	var description = document.getElementById("shortDescription").value;
	////alert(description);
	var classDeadline = document.getElementById("class").value;
	////alert(classDeadline);
	var duedate = document.getElementById("dueDate").value;
	////alert(duedate);
	var duetime = document.getElementById("dueTime").value;
	////alert(duetime);
	var type = document.getElementById("type").value;
	////alert(type);
	var additionalInfo = document.getElementById("additionalInfo").value;
	////alert(additionalInfo);
	var finished = document.getElementById("finished").value;	
	////alert(finished);
	updateDeadlineToDB(description,classDeadline,duedate, duetime, type, additionalInfo, finished);
	
}

function getClassFormInfo(){
	//alert(id);
	var name = document.getElementById("className").value;
	//alert(name);
	var location = document.getElementById("classLocation").value;
	//alert(location);
	var date = document.getElementById("classDate").value;
	//alert(date);
	var time = document.getElementById("classTime").value;
	//alert(time);
	var teacher = document.getElementById("classTeacher").value;
	//alert(teacher);
	var email = document.getElementById("classTeacherEmail").value;
	//alert(email);
	var phone = document.getElementById("classTeacherPhone").value;	
	//alert(phone);
	updateClassToDB(name,location,date,time,teacher,email,phone);
}

function updateClassToDB(name,location,date,time,teacher,email,phone){
	db.transaction(function(tx){
		tx.executeSql("UPDATE classes SET name = ?, location = ?, classdate = ?, classtime =?, teacher = ?, email = ?, phone = ? WHERE id = ?",[name,location,date,time,teacher,email,phone, id], updateClassSuccessCB, errorCB);
		//tx.executeSql('UPDATE deadlines SET description = "' + description + '" WHERE id = "'+ id +'"');
		});
}

function updateDeadlineToDB(description,classDeadline,duedate, duetime, type, additionalInfo, finished){
	db.transaction(populateDB, errorCB, successCB);
	db.transaction(function(tx){
		tx.executeSql("UPDATE deadlines SET description = ?, class = ?, duedate = ?, duetime =?, type = ?, additionalInfo = ?, finished = ? WHERE id = ?",[description,classDeadline,duedate, duetime, type, additionalInfo, finished, id], updateSuccessCB, errorCB);
		});
}
function randomString(L){
    var s= '';
    var randomchar=function(){
    	var n= Math.floor(Math.random()*62);
    	if(n<10) return n; //1-10
    	if(n<36) return String.fromCharCode(n+55); //A-Z
    	return String.fromCharCode(n+61); //a-z
    }
    while(s.length< L) s+= randomchar();
    return s;
}
function saveDeadlineToDB(){
	var dbId = randomString(5);
	//alert(dbId);
	var dbDescription = document.getElementById("shortDescriptionAddNew").value;
	//alert(dbDescription);
	var dbClass = document.getElementById("classAddNew").value;
	//alert(dbClass);
	var dbDueDate = document.getElementById("dueDateAddNew").value;
	//alert(dbDueDate);
	var dbDueTime = document.getElementById("dueTimeAddNew").value;
	//alert(dbDueTime);
	var dbType = document.getElementById("typeAddNew").value;
	//alert(dbType);
	var dbAdditionalInfo = document.getElementById("additionalInfoAddNew").value;
	//alert(dbAdditionalInfo);
	var dbFinished = document.getElementById("finishedAddNew").value;
	//alert(dbFinished);
	insertDeadlineToDB(dbId,dbDescription,dbClass,dbDueDate, dbDueTime, dbType, dbAdditionalInfo, dbFinished);

}

function insertDeadlineToDB(dbId,dbDescription,dbClass,dbDueDate, dbDueTime, dbType, dbAdditionalInfo, dbFinished) {
	////alert('insert called');
	
	////alert('before insert');
	db.transaction(function(tx){
		tx.executeSql('INSERT INTO deadlines (id, description, class, dueDate, dueTime, type, additionalInfo, finished) VALUES (?,?,?,?,?,?,?,?)',[dbId,dbDescription,dbClass,dbDueDate, dbDueTime, dbType, dbAdditionalInfo, dbFinished], insertSuccessCB, errorCB);
		//alert(tx);
   });
}



function updateSuccessCB(tx){
	//alert("Saved successfully");
		
	$.mobile.changePage($("#deadlineList"));
	
	$("#deadlineList").load(".ui-content");	
}

function deleteDeadline(){
	db.transaction(function(tx){
		tx.executeSql("DELETE FROM deadlines WHERE id = ? ",[id], deleteSuccessCB, errorCB);
	});
}

function insertSuccessCB(){
	window.location.hash ="#deadlineList";
}

function deleteSuccessCB(tx){
	//alert("Deleted successfully");
	window.location.hash ="#deadlineList";
}

function updateClassSuccessCB(tx){
	window.location.hash ="#classlist";
}

function getParameterByName(name) {
    		var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    		return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
