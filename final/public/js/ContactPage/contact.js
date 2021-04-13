document.getElementById('form').onsubmit = function(){
    if (!submit()){
        return false;
    }
    return true
}

function isEmpty(){
    if (document.getElementById('fname').value === "") {
        document.getElementById('fname').style.border = '1px solid red';
        return true;
    }
    else if (document.getElementById('lname').value === "") {
        document.getElementById('lname').style.border = '1px solid red';
        return true;
    }
    else if (document.getElementById('email').value === "") {
        document.getElementById('email').style.border = '1px solid red';
        return true;
    }
    else if (document.getElementById('text').value === "") {
        document.getElementById('text').style.border = '1px solid red';
        return true;
    }
}

function submit(){
    if(isEmpty()){
        return  false;
    }
    sendCommentToServer();
}


function sendCommentToServer(){
    function requestUtils(method, url, body) {//https://stackoverflow.com/questions/59511205/how-to-send-string-from-client-to-server-via-post
        var xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(body);
    }
    var body = "comment=" + document.getElementById("text").value;
    body += "&email=" + document.getElementById("email").value;
    body += "&fname=" + document.getElementById("fname").value;
    body += "&lname=" + document.getElementById("lname").value;
    requestUtils('post', '/addCommentFromContact', body);
}