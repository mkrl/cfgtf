/* Various page processing stuff for CFG.tf
http://cfg.tf */
function updateConnect() {
    var srvaddr = document.getElementById("ip").value;;
    var srvpass = document.getElementById("sv_password").value;;
    if (srvpass.length !== 0) {
        document.getElementById('loptions').value = 'connect ' + srvaddr + "; password " + srvpass;
    } else {
        document.getElementById('loptions').value = 'connect ' + srvaddr;
    }

}

var room = 40; //dynamic bind fields
function education_fields() {
    room++;
    var objTo = document.getElementById('education_fields')
    var divtest = document.createElement("div");
    divtest.setAttribute("class", "form-group removeclass" + room);
    var rdiv = 'removeclass' + room;
    divtest.innerHTML = '<div class="col-sm-3 nopadding"> <div class="form-group"> <input type="text" class="form-control" id="key' + room + '" name="Keys[]" value="" placeholder="Key" required> </div></div><div class="col-sm-3 nopadding"> <div class="form-group"> <div class="input-group"><input type="text" class="form-control" id="command' + room + '" name="Commands[]" value="" placeholder="Command" required> <div class="input-group-btn"> <button class="btn btn-danger" type="button" onclick="remove_education_fields(' + room + ');"> <span class="glyphicon glyphicon-minus" aria-hidden="true"></span> </button> </div></div></div></div><div class="clear"></div>';
    objTo.appendChild(divtest)
}

function remove_education_fields(rid) {
    $('.removeclass' + rid).remove();
}


function installPackage(file) {
    // todo
    var request = new XMLHttpRequest();
    request.open('GET', '/test.pack', true);
    request.send(null);
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            var type = request.getResponseHeader('Content-Type');
            if (type.indexOf("text") !== 1) {
                return request.responseText;
            }
        }
    }

}


function autoFillGood() { //automatically fill network settings
    document.getElementById('cmdrate').value = "67";
    document.getElementById('interp').value = ".0152";
    document.getElementById('intratio').value = "1";
    document.getElementById('uprate').value = "67";
    document.getElementById('rate').value = "60000";
}

function autoFillBad() {
    document.getElementById('cmdrate').value = "40";
    document.getElementById('interp').value = "0";
    document.getElementById('intratio').value = "2";
    document.getElementById('uprate').value = "40";
    document.getElementById('rate').value = "35000";
}

function autoFillComp() {
    document.getElementById('cmdrate').value = "128";
    document.getElementById('interp').value = ".007";
    document.getElementById('intratio').value = "1";
    document.getElementById('uprate').value = "128";
    document.getElementById('rate').value = "90000";
}

function updateInput(ish) { //updating FOV on user default change
    document.getElementById("v_fov").value = ish;
}




function isNumberKey(evt) //allowing numbers and decimal points
{
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode != 46 && charCode > 31 &&
        (charCode < 48 || charCode > 57))
        return false;

    return true;
}
var dxlevel = "91"; //updating dxlevel below
function updatedxlevel() {
    switch ($("#gfx_selector").val()) {
        case "toaster":
        case "stable":
        case "feliklowend":
        case "rhapsodydx8":
            dxlevel = "81";
            break;
        case "fine":
        case "felik":
        case "rhapsodydx9":
            dxlevel = "91";
            break;
        case "fancy":
        case "felikeyecandy":
            dxlevel = "98";
            break;
        case "myown":
            dxlevel = "91";
            break;
    }

    document.getElementById('loptions').value = "-dxlevel " + dxlevel + " " + screenmod + " -w " + screen.width + " -h " + screen.height + " -console -noborder -novid";
}
var screenmod = "-full";

function updatescreenmode() //updating screen mode
{

    if (document.getElementById('full').checked) {
        screenmod = "-full";
    } else if (document.getElementById('windowed').checked) {
        screenmod = "-sw";
    }
    document.getElementById('loptions').value = "-dxlevel " + dxlevel + " " + screenmod + " -w " + screen.width + " -h " + screen.height + " -console -noborder -novid";
}

$(document).ready(function() { //tooltips
    $('[data-toggle="tooltip"]').tooltip();
});
