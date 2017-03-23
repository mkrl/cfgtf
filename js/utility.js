/* Various page processing stuff for CFGen
https://mkrl.github.io/cfgen/ */

		

		
		
		function autoFillGood() {											//automatically fill network settings
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
		
		function updateInput(ish){													//updating FOV on user default change
			document.getElementById("v_fov").value = ish;
		}
				
		
		

       function isNumberKey(evt) 					//allowing numbers and decimal points
       {
          var charCode = (evt.which) ? evt.which : evt.keyCode;
          if (charCode != 46 && charCode > 31 
            && (charCode < 48 || charCode > 57))
             return false;

          return true;
       }
	   	var dxlevel = "81";										//updating dxlevel below
		function updatedxlevel()
		{

			if(document.getElementById('toaster').checked) {
			dxlevel = "81";
			}else if(document.getElementById('stable').checked) {
			dxlevel = "81";
			}else if(document.getElementById('fine').checked) {
			dxlevel = "91";
			}else if(document.getElementById('fancy').checked) {
			dxlevel = "98";
			}
			document.getElementById('loptions').value = "-dxlevel " + dxlevel + " " + screenmod +" -w " + screen.width + " -h " + screen.height + " -console -noborder -novid"; 
		}
		var screenmod = "-full";	
		function updatescreenmode()									//updating screen mode
		{

			if(document.getElementById('full').checked) {
			screenmod = "-full";
			}else if(document.getElementById('windowed').checked) {
			screenmod = "-sw";
			}
			document.getElementById('loptions').value = "-dxlevel " + dxlevel + " " + screenmod +" -w " + screen.width + " -h " + screen.height + " -console -noborder -novid"; 
		}
		
		$(document).ready(function(){											//tooltips
		$('[data-toggle="tooltip"]').tooltip();   
		});
	
