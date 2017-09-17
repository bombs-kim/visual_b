// code from bcmoney at Stackoverflow
// https://stackoverflow.com/questions/13709482/how-to-read-text-file-in-javascript

// [External dependencies]
// initialize: visual.js

var reader; //GLOBAL File Reader object

function checkFileAPI() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        reader = new FileReader();
        return true;  }
    else {
        alert('The File APIs are not fully supported by your browser. Fallback required.');
        return false;  }
}


function readText(filePath) {
    var output = "";
     //placeholder for text output
    if(filePath.files && filePath.files[0]) {
        reader.onload = function (e) {
            output = e.target.result;
            j = JSON.parse(output);
            initialize(window.j);
        };//end onload()
        reader.readAsText(filePath.files[0]);
    }//end if html5 filelist support
    else { return false;  }
    return true;
}

var parse_url = "/toys/visual_b_parse/"

// used for online service
function readAndUploadText(filePath){
     //placeholder for text output
    if(filePath.files && filePath.files[0]) {
        reader.onload = function (e) {
            console.log(e)
            var text = e.target.result;
            setCode("\n"+text);
            $.post({
                url: parse_url,
                data: {'text':text},
                success: function(result){
                    window.j = result['tree']
                    initialize(window.j);
                }
            })
        };
        reader.readAsText(filePath.files[0]);
    }
    else { return false;  }
    return true;
}
