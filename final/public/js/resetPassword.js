var url;
var fieldsToFill = ["username", "resetkey"]

$(document).ready(function(){
    setUpURLParams();
    autoFillForm();
})

function setUpURLParams(){
    url = window.location.href;
    url = new URL(url);
}

function autoFillForm(){

    fieldsToFill.forEach(fieldName =>{
        var param = url.searchParams.get(fieldName);
        if (param){
            document.getElementById(fieldName).value = decodeURIComponent(param);
        }
    })

}
