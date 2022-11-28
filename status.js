function checkCookie(){
	var username = "";
	if(getCookie("username")==false){
		window.location = "/login/register.html";
        console.log("Cannot get");
	}
    console.log(getCookie("username"));
}

checkCookie(getCookie("name"));
window.onload = userInfo;

function getCookie(name){
	var value = "";
	try{
		value = document.cookie.split("; ").find(row => row.startsWith(name)).split('=')[1]
		return value
	}catch(err){
		return false
	} 
}

function userInfo(){
    var username = getCookie('username');
    document.getElementById("login_screen").href = "#";
	document.getElementById("login_screen").innerHTML = username;
}