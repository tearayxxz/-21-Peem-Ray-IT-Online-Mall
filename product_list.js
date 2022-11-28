function checkCookie(){
	var username = "";
	if(getCookie("username")==false){
		window.location = "/login/register.html";
        console.log("Cannot get");
	}
    console.log(getCookie("username"));
}

checkCookie(getCookie("name"));
window.onload = pageLoad;

function getCookie(name){
	var value = "";
	try{
		value = document.cookie.split("; ").find(row => row.startsWith(name)).split('=')[1]
		return value
	}catch(err){
		return false
	} 
}

function pageLoad(){
    getCart();
    getData();
    userInfo();
    document.getElementById("ShowProduct").onclick = ShowProduct;
    document.getElementById("AddCart").onclick = AddCart;
    var x = document.getElementById("cart-form");
    x.style.display = "none";
    x.style.display.length 
    document.getElementById("UpdateButton").onclick = showUpdate;
    var y = document.getElementById("QuannityUpdate");
    y.style.display = "none";
    document.getElementById("ShowCart").onclick = showCart;
    var z = document.getElementById("ShowCarts");
    z.style.display = "none";
    document.getElementById("Cart").onclick = showUpdate;
    const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	if (urlParams.get("error")==1){
		document.getElementById('WrongName1').style.color = "red";
		document.getElementById('WrongName1').innerHTML = "กรุณากรอกชื่อสินค้าหรือusernameใหม่";
	}
    if (urlParams.get("error")==2){
		document.getElementById('WrongName2').style.color = "red";
		document.getElementById('WrongName2').innerHTML = "กรุณากรอกชื่อสินค้าใหม่";
	}
}

function userInfo(){
    var username = getCookie('username');
    document.getElementById("login_screen").href = "#";
	document.getElementById("login_screen").innerHTML = username;
}

async function getData(){
	const response = await fetch("\showDB");
	const content = await response.json();
	showTable(content);
}

function showTable(data){
	var keys = Object.keys(data);
	var tablearea = document.getElementById("list")
	for (var i=0; i < keys.length; i++){
        var show = document.createElement("div");
        show.className = "col-md-4 margin_bottom1";
        var product_box = document.createElement("div");
        product_box.className = "product_box";
        var figure_img = document.createElement("figure");
        var image = document.createElement("img");
        var text = document.createElement("h3");
        image.src = data[keys[i]].Product_img;
		text.innerHTML = data[keys[i]].Product_name + "</br>" + "Price: " + data[keys[i]].Product_price;
       
        tablearea.appendChild(show);
        show.appendChild(product_box);
        product_box.appendChild(figure_img);
        figure_img.appendChild(image);
        product_box.appendChild(text);
	}
}

function ShowProduct() {
    var z = document.getElementById("ShowCarts");
    z.style.display = "none";
    var y = document.getElementById("QuannityUpdate");
    y.style.display = "none";
    var x = document.getElementById("cart-form");
    x.style.display = "none";
    var a = document.getElementById("list");
    if (a.style.display === "none") {
        a.style.display = "flex";
    } else {
        a.style.display = "none";
    }
}

function AddCart() {
    var a = document.getElementById("list");
    a.style.display = "none";
    var z = document.getElementById("ShowCarts");
    z.style.display = "none";
    var y = document.getElementById("QuannityUpdate");
    y.style.display = "none";
    var x = document.getElementById("cart-form");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function showUpdate() {
    var a = document.getElementById("list");
    a.style.display = "none";
    var z = document.getElementById("ShowCarts");
    z.style.display = "none";
    var x = document.getElementById("cart-form");
    x.style.display = "none";
    var y = document.getElementById("QuannityUpdate");
    if (y.style.display === "none") {
        y.style.display = "block";
    } else {
        y.style.display = "none";
    }
}

function showCart() {
    var a = document.getElementById("list");
    a.style.display = "none";
    var x = document.getElementById("cart-form");
    x.style.display = "none";
    var y = document.getElementById("QuannityUpdate");
    y.style.display = "none";
    var z = document.getElementById("ShowCarts");
    if (z.style.display === "none") {
        z.style.display = "flex";
    } else {
        z.style.display = "none";
    }
}

async function getCart(){
	const response = await fetch("/showCarts");
	const content = await response.json();
	showCarts(content);
}

function showCarts(data){
	var keys = Object.keys(data);
	var tablearea = document.getElementById("ShowCarts")
	for (var i=0; i < keys.length; i++){
        var show = document.createElement("div");
        show.className = "col-md-4 margin_bottom1";
        var product_box = document.createElement("div");
        product_box.className = "product_box";
        var figure_img = document.createElement("figure");
        var image = document.createElement("img");
        var text = document.createElement("h3");
        image.src = data[keys[i]].Product_img;
		text.innerHTML = data[keys[i]].Product_name + "</br>" + "QUANNITY: " + data[keys[i]].ITEM_QUANNITY + "</br>"  + "Price: " + data[keys[i]].Product_price+ "</br>"  + "Total: " + data[keys[i]].Product_price * data[keys[i]].ITEM_QUANNITY ;

        tablearea.appendChild(show);
        show.appendChild(product_box);
        product_box.appendChild(figure_img);
        figure_img.appendChild(image);
        product_box.appendChild(text);
	}
    var PurchaseBlock = document.createElement("div");
    var PurchaseLink = document.createElement("a");
    PurchaseLink.href = "/Purchased";
    PurchaseLink.id = "Purchased"
    PurchaseLink.innerHTML = "Purchase";

    tablearea.appendChild(PurchaseBlock);
    PurchaseBlock.appendChild(PurchaseLink);
}