var db = null;
var id = "";
document.addEventListener("deviceready", onDeviceReady, false);
// PhoneGap is ready
//
function onDeviceReady() {
	db = window.openDatabase("HomeworkTracker3", "2.0", "HomeworkTracker3", 2000);
	db.transaction(populateDB, errorCB, successCB);
	//////alert('populate db done');
	//////alert('populate class db done');
	db.transaction(getClassDetail, errorCB);
	
}

function populateDB(tx) {
	 tx.executeSql('CREATE TABLE IF NOT EXISTS classes (id varchar(10) primary key, name varchar(50), location varchar(50), classdate varchar(50), classtime time, teacher varchar(50), email varchar(200), phone varchar(10))');
}

function getClassDetail(tx){
	//////alert('classes');
	id = GET.id;
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
GET = (function () {
    var get = {
        push:function (key,value){
            var cur = this[key];
            if (cur.isArray){
                this[key].push(value);
            }else {
                this[key] = [];
                this[key].push(cur);
                this[key].push(value);
            }
        }
    },
    search = document.location.search,
    decode = function (s,boo) {
        var a = decodeURIComponent(s.split("+").join(" "));
        return boo? a.replace(/\s+/g,''):a;
    };
    search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function (a,b,c) {
        if (get[decode(b,true)]){
            get.push(decode(b,true),decode(c));
        }else {
            get[decode(b,true)] = decode(c);
        }
    });
    return get;
})();


function getFormInfo(){
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
		tx.executeSql("UPDATE classes SET name = ?, location = ?, classdate = ?, classtime =?, teacher = ?, email = ?, phone = ? WHERE id = ?",[name,location,date,time,teacher,email,phone, id], updateSuccessCB, errorCB);
		//tx.executeSql('UPDATE deadlines SET description = "' + description + '" WHERE id = "'+ id +'"');
		});
}

function updateSuccessCB(tx){
	window.location.href ="classList.html";
}
function errorCB(tx, err) {
	alert("Error processing SQL: "+err);
}

function successCB(tx){
}
