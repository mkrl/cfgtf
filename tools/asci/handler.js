function submit(){
	
	var find = '"';
	var re = new RegExp(find, 'g');
	
	var lines = $('#input').val().split('\n');
	var result = [];
	for(var i = 0;i < lines.length;i++){
		if (lines[i].length > 160) {
			bootbox.alert("This thing is too huge for a TF2 console!");
			lines[i] = "";
		} else {
			lines[i] = lines[i].replace(re, "'");
			lines[i] = 'echo "'+lines[i]+'"';			
		}
		
	}
	
	$('#output').val(lines.join("\n"));
}