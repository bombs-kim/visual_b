// code from bcmoney at Stackoverflow
// https://stackoverflow.com/questions/13709482/how-to-read-text-file-in-javascript

var reader; //GLOBAL File Reader object

function checkFileAPI() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        reader = new FileReader();
        return true; 
    } else {
        alert('The File APIs are not fully supported by your browser. Fallback required.');
        return false;
    }
}

// var output;
function readText(filePath) {
    var output = "";    
     //placeholder for text output
    if(filePath.files && filePath.files[0]) {     
        reader.onload = function (e) {
            output = e.target.result;
            j = JSON.parse(output);
            var width_and_tree = drawTree(j);
            var width = width_and_tree[0];
            moveCenterTo2([width/2, paper.view.size.height/2 - 20]);

            $("#print table").empty();
            j2 = JSON.parse(output);
            var result_output = eval(j2);
            $(".result h4#r").text(result_output[0] ? result_output[0] : "unit");
            for (var i = 0; i < result_output[1].length; i++)
                $("#print table").append(
                    "<tr><td>" + result_output[1][i] + "</td></tr>")
            // alert(eval_exp({}, j));
        };//end onload()
        reader.readAsText(filePath.files[0]);
    }//end if html5 filelist support
    else if(ActiveXObject && filePath) { //fallback to IE 6-8 support via ActiveX
        try {
            reader = new ActiveXObject("Scripting.FileSystemObject");
            var file = reader.OpenTextFile(filePath, 1); //ActiveX File Object
            output = file.ReadAll(); //text contents of file
            file.Close(); //close file "input stream"
        } catch (e) {
            if (e.number == -2146827859) {
                alert('Unable to access local files due to browser security settings. ' + 
                 'To overcome this, go to Tools->Internet Options->Security->Custom Level. ' + 
                 'Find the setting for "Initialize and script ActiveX controls not marked as safe" and change it to "Enable" or "Prompt"'); 
            }
        }       
    }
    else { //this is where you could fallback to Java Applet, Flash or similar
        return false;
    }       
    return true;
}   