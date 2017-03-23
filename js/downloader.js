jQuery(function ($) {
    "use strict";

    var Promise = window.Promise;
    if (!Promise) {
        Promise = JSZip.external.Promise;
    }

    /**
     * Reset the message.
     */
    function resetMessage () {
        $("#result")
        .removeClass()
        .text("");
    }
    /**
     * show a successful message.
     * @param {String} text the text to show.
     */
    function showMessage(text) {
        resetMessage();
        $("#result")
        .addClass("alert alert-success")
        .text(text);
    }
    /**
     * show an error message.
     * @param {String} text the text to show.
     */
    function showError(text) {
        resetMessage();
        $("#result")
        .addClass("alert alert-danger")
        .text(text);
    }
    /**
     * Update the progress bar.
     * @param {Integer} percent the current percent
     */
    function updatePercent(percent) {
        $("#progress_bar").removeClass("hide")
        .find(".progress-bar")
        .attr("aria-valuenow", percent)
        .css({
            width : percent + "%"
        });
    }

    /**
     * Fetch the content and return the associated promise.
     * @param {String} url the url of the content to fetch.
     * @return {Promise} the promise containing the data.
     */
    function urlToPromise(url) {
        return new Promise(function(resolve, reject) {
            JSZipUtils.getBinaryContent(url, function (err, data) {
                if(err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    if(!JSZip.support.blob) {
        showError("This only works with a good browser!");
        return;
    }

    var $form = $("#download_form").on("submit", function () {

        resetMessage();

        var zip = new JSZip();
		var customs = ""; //a var to store all the extra stuff to add to autoexec
		
 		//getting values form inputs
		// !!!!IMPORTANT!!!! All the selectable html fields (non-text forms) should have data-name and data-url attributes or everything breaks
		
		//viewmodel settings
 		if($("#modeltoggle").is(':checked')){
			var drawviewmodel = "1"
			} else {
			var drawviewmodel = "0"
		} 
 		if($("#minmodtoggle").is(':checked')){
			var minmodel = "1"
			} else {
			var minmodel = "0"
		}
		var v_fov = $('#v_fov').val();			
		
		//combat text settings
 		if($("#battoggle").is(':checked')){
			var battoggle = "1"
			} else {
			var battoggle = "0"
		}		
  		if($("#comtoggle").is(':checked')){
			var comtoggle = "1"
			} else {
			var comtoggle = "0"
		}		
 		if($("#hittoggle").is(':checked')){
			var hittoggle = "1"
			} else {
			var hittoggle = "0"
		}		
 		if($("#killtoggle").is(':checked')){
			var killtoggle = "1"
			} else {
			var killtoggle = "0"
		}	

		var batwindow = $('#batwindow').val();	
		var hitvol = $('#hitvol').val();	
		var hitmin = $('#hitmin').val();	
		var hitmax = $('#hitmax').val();	
		var hitdelay = $('#hitdelay').val();	
		var killvol = $('#killvol').val();	
		var killmin = $('#killmin').val();	
		var killmax = $('#killmax').val();	
		
		

		//network
		var cmdrate = $('#cmdrate').val();
		var interp = $('#interp').val();
		var intratio = $('#intratio').val();
		var uprate = $('#uprate').val();
		var rate = $('#rate').val();  
		
		//demo support		
 		if($("#ds_delete").is(':checked')){
			var ds_delete = "1"
			} else {
			var ds_delete = "0"
		} 		
		if($("#ds_screen").is(':checked')){
			var ds_screen = "1"
			} else {
			var ds_screen = "0"
		} 		
		
		var ds_mode = $('#ds_mode').val();  		
		var ds_folder = $('#ds_folder').val();  		
		var ds_notify = $('#ds_notify').val();  		
		var ds_sound = $('#ds_sound').val();  		
		var ds_ks = $('#ds_ks').val();  		
		
		//get large piece of custom binds
		var bindings = $('#bindings').val();  
		
		//getting switcher values (if selected)
		
		if($("[data-name='crosshairswitcher']").is(':checked')){
			
			//getting a lot of dumb vars for class settings (PLEASE remake this into any kind of loop, is way too ugly. use arrays, maybe?)

			//scout
			var cross1_1  = $("[name='cs_col_1_1n']").val();
			var style1_1=cross1_1[0];
			var size1_1=cross1_1[1];
			var color1_1=cross1_1[2];
			if($("#cs_draw_1_1").is(':checked')){
			var model1_1 = $('#cs_fov_1_1').val()
			} else {
			var model1_1 = "off"
			} 
			
			var cross1_2  = $("[name='cs_col_1_2n']").val();
			var style1_2=cross1_2[0];
			var size1_2=cross1_2[1];
			var color1_2=cross1_2[2];
			if($("#cs_draw_1_2").is(':checked')){
			var model1_2 = $('#cs_fov_1_2').val()
			} else {
			var model1_2 = "off"
			} 
			
			var cross1_3  = $("[name='cs_col_1_3n']").val();
			var style1_3=cross1_3[0];
			var size1_3=cross1_3[1];
			var color1_3=cross1_3[2];
			if($("#cs_draw_1_3").is(':checked')){
			var model1_3 = $('#cs_fov_1_3').val()
			} else {
			var model1_3 = "off"
			} 
			
			

			//soldier
			var cross2_1  = $("[name='cs_col_2_1n']").val();
			var style2_1=cross2_1[0];
			var size2_1=cross2_1[1];
			var color2_1=cross2_1[2];
			if($("#cs_draw_2_1").is(':checked')){
			var model2_1 = $('#cs_fov_2_1').val()
			} else {
			var model2_1 = "off"
			} 
			
			var cross2_2  = $("[name='cs_col_2_2n']").val();
			var style2_2=cross2_2[0];
			var size2_2=cross2_2[1];
			var color2_2=cross2_2[2];
			if($("#cs_draw_2_2").is(':checked')){
			var model2_2 = $('#cs_fov_2_2').val()
			} else {
			var model2_2 = "off"
			} 
			
			var cross2_3  = $("[name='cs_col_2_3n']").val();
			var style2_3=cross2_3[0];
			var size2_3=cross2_3[1];
			var color2_3=cross2_3[2];
			if($("#cs_draw_2_3").is(':checked')){
			var model2_3 = $('#cs_fov_2_3').val()
			} else {
			var model2_3 = "off"
			} 
			
			

			//pyro
			var cross3_1  = $("[name='cs_col_3_1n']").val();
			var style3_1=cross3_1[0];
			var size3_1=cross3_1[1];
			var color3_1=cross3_1[2];
			if($("#cs_draw_3_1").is(':checked')){
			var model3_1 = $('#cs_fov_3_1').val()
			} else {
			var model3_1 = "off"
			} 
			
			var cross3_2  = $("[name='cs_col_3_2n']").val();
			var style3_2=cross3_2[0];
			var size3_2=cross3_2[1];
			var color3_2=cross3_2[2];
			if($("#cs_draw_3_2").is(':checked')){
			var model3_2 = $('#cs_fov_3_2').val()
			} else {
			var model3_2 = "off"
			} 
			
			var cross3_3  = $("[name='cs_col_3_3n']").val();
			var style3_3=cross3_3[0];
			var size3_3=cross3_3[1];
			var color3_3=cross3_3[2];
			if($("#cs_draw_3_3").is(':checked')){
			var model3_3 = $('#cs_fov_3_3').val()
			} else {
			var model3_3 = "off"
			} 
			
			

			//demo
			var cross4_1  = $("[name='cs_col_4_1n']").val();
			var style4_1=cross4_1[0];
			var size4_1=cross4_1[1];
			var color4_1=cross4_1[2];
			if($("#cs_draw_4_1").is(':checked')){
			var model4_1 = $('#cs_fov_4_1').val()
			} else {
			var model4_1 = "off"
			} 
			
			var cross4_2  = $("[name='cs_col_4_2n']").val();
			var style4_2=cross4_2[0];
			var size4_2=cross4_2[1];
			var color4_2=cross4_2[2];
			if($("#cs_draw_4_2").is(':checked')){
			var model4_2 = $('#cs_fov_4_2').val()
			} else {
			var model4_2 = "off"
			} 
			
			var cross4_3  = $("[name='cs_col_4_3n']").val();
			var style4_3=cross4_3[0];
			var size4_3=cross4_3[1];
			var color4_3=cross4_3[2];
			if($("#cs_draw_4_3").is(':checked')){
			var model4_3 = $('#cs_fov_4_3').val()
			} else {
			var model4_3 = "off"
			} 
			
			

			//hwg
			var cross5_1  = $("[name='cs_col_5_1n']").val();
			var style5_1=cross5_1[0];
			var size5_1=cross5_1[1];
			var color5_1=cross5_1[2];
			if($("#cs_draw_5_1").is(':checked')){
			var model5_1 = $('#cs_fov_5_1').val()
			} else {
			var model5_1 = "off"
			} 
			
			var cross5_2  = $("[name='cs_col_5_2n']").val();
			var style5_2=cross5_2[0];
			var size5_2=cross5_2[1];
			var color5_2=cross5_2[2];
			if($("#cs_draw_5_2").is(':checked')){
			var model5_2 = $('#cs_fov_5_2').val()
			} else {
			var model5_2 = "off"
			} 
			
			var cross5_3  = $("[name='cs_col_5_3n']").val();
			var style5_3=cross5_3[0];
			var size5_3=cross5_3[1];
			var color5_3=cross5_3[2];
			if($("#cs_draw_5_3").is(':checked')){
			var model5_3 = $('#cs_fov_5_3').val()
			} else {
			var model5_3 = "off"
			} 
			
			

			//engineer
			var cross6_1  = $("[name='cs_col_6_1n']").val();
			var style6_1=cross6_1[0];
			var size6_1=cross6_1[1];
			var color6_1=cross6_1[2];
			if($("#cs_draw_6_1").is(':checked')){
			var model6_1 = $('#cs_fov_6_1').val()
			} else {
			var model6_1 = "off"
			} 
			
			var cross6_2  = $("[name='cs_col_6_2n']").val();
			var style6_2=cross6_2[0];
			var size6_2=cross6_2[1];
			var color6_2=cross6_2[2];
			if($("#cs_draw_6_2").is(':checked')){
			var model6_2 = $('#cs_fov_6_2').val()
			} else {
			var model6_2 = "off"
			} 
			
			var cross6_3  = $("[name='cs_col_6_3n']").val();
			var style6_3=cross6_3[0];
			var size6_3=cross6_3[1];
			var color6_3=cross6_3[2];
			if($("#cs_draw_6_3").is(':checked')){
			var model6_3 = $('#cs_fov_6_3').val()
			} else {
			var model6_3 = "off"
			} 
			
			

			//medic
			var cross7_1  = $("[name='cs_col_7_1n']").val();
			var style7_1=cross7_1[0];
			var size7_1=cross7_1[1];
			var color7_1=cross7_1[2];
			if($("#cs_draw_7_1").is(':checked')){
			var model7_1 = $('#cs_fov_7_1').val()
			} else {
			var model7_1 = "off"
			} 
			
			var cross7_2  = $("[name='cs_col_7_2n']").val();
			var style7_2=cross7_2[0];
			var size7_2=cross7_2[1];
			var color7_2=cross7_2[2];
			if($("#cs_draw_7_2").is(':checked')){
			var model7_2 = $('#cs_fov_7_2').val()
			} else {
			var model7_2 = "off"
			} 
			
			var cross7_3  = $("[name='cs_col_7_3n']").val();
			var style7_3=cross7_3[0];
			var size7_3=cross7_3[1];
			var color7_3=cross7_3[2];
			if($("#cs_draw_7_3").is(':checked')){
			var model7_3 = $('#cs_fov_7_3').val()
			} else {
			var model7_3 = "off"
			} 
			
			

			//sniper
			var cross8_1  = $("[name='cs_col_8_1n']").val();
			var style8_1=cross8_1[0];
			var size8_1=cross8_1[1];
			var color8_1=cross8_1[2];
			if($("#cs_draw_8_1").is(':checked')){
			var model8_1 = $('#cs_fov_8_1').val()
			} else {
			var model8_1 = "off"
			} 
			
			var cross8_2  = $("[name='cs_col_8_2n']").val();
			var style8_2=cross8_2[0];
			var size8_2=cross8_2[1];
			var color8_2=cross8_2[2];
			if($("#cs_draw_1_2").is(':checked')){
			var model8_2 = $('#cs_fov_8_2').val()
			} else {
			var model8_2 = "off"
			} 
			
			var cross8_3  = $("[name='cs_col_8_3n']").val();
			var style8_3=cross8_3[0];
			var size8_3=cross8_3[1];
			var color8_3=cross8_3[2];
			if($("#cs_draw_8_3").is(':checked')){
			var model8_3 = $('#cs_fov_8_3').val()
			} else {
			var model8_3 = "off"
			} 
			
			

			//spy
			var cross9_1  = $("[name='cs_col_9_1n']").val();
			var style9_1=cross9_1[0];
			var size9_1=cross9_1[1];
			var color9_1=cross9_1[2];
			if($("#cs_draw_9_1").is(':checked')){
			var model9_1 = $('#cs_fov_9_1').val()
			} else {
			var model9_1 = "off"
			} 
			
			var cross9_2  = $("[name='cs_col_9_2n']").val();
			var style9_2=cross9_2[0];
			var size9_2=cross9_2[1];
			var color9_2=cross9_2[2];
			if($("#cs_draw_1_2").is(':checked')){
			var model9_2 = $('#cs_fov_9_2').val()
			} else {
			var model9_2 = "off"
			} 
			
			var cross9_3  = $("[name='cs_col_9_3n']").val();
			var style9_3=cross9_3[0];
			var size9_3=cross9_3[1];
			var color9_3=cross9_3[2];
			if($("#cs_draw_9_3").is(':checked')){
			var model9_3 = $('#cs_fov_9_3').val()
			} else {
			var model9_3 = "off"
			} 
			
		} 
		
		


		
		
        // find every checked item
        $(this).find(":checked").each(function () {

            var $this = $(this);
            var url = $this.data("url");
			var iswhat = $this.data("name");
            var filename = url.replace(/.*\//g, "");   
			if(iswhat == "gfx") {
				zip.file("cfg/gfx.cfg", urlToPromise(url), {binary:true});
            }
			if(iswhat == "scripts") {
				zip.file("custom/runfasterpls/scripts/" + filename, urlToPromise(url), {binary:true});
            }
			if(iswhat == "hitsound") {
				zip.file("custom/damage/sound/ui/hitsound.wav", urlToPromise(url), {binary:true});
            }
			if(iswhat == "killsound") {
				zip.file("custom/damage/sound/ui/killsound.wav", urlToPromise(url), {binary:true});
            }
			if(iswhat == "vpks") {
				zip.file("custom/" + filename, urlToPromise(url), {binary:true});
            }
			if(iswhat == "configs") {
				zip.file("cfg/" + filename, urlToPromise(url), {binary:true});
            }
			if(iswhat == "crosshairswitcher") {
				zip.file("cfg/demoman.cfg", urlToPromise("/cfgen/cfg/class/demoman.cfg"), {binary:true});
				zip.file("cfg/demoplayback.cfg", urlToPromise("/cfgen/cfg/class/demoplayback.cfg"), {binary:true});
				zip.file("cfg/engineer.cfg", urlToPromise("/cfgen/cfg/class/engineer.cfg"), {binary:true});
				zip.file("cfg/heavyweapons.cfg", urlToPromise("/cfgen/cfg/class/heavyweapons.cfg"), {binary:true});
				zip.file("cfg/insourcetv.cfg", urlToPromise("/cfgen/cfg/class/insourcetv.cfg"), {binary:true});
				zip.file("cfg/CROSSHAIRSWITCHER-INSTRUCTIONS.txt", urlToPromise("/cfgen/cfg/class/CROSSHAIRSWITCHER-INSTRUCTIONS.txt"), {binary:true});
				zip.file("cfg/medic.cfg", urlToPromise("/cfgen/cfg/class/medic.cfg"), {binary:true});
				zip.file("cfg/pyro.cfg", urlToPromise("/cfgen/cfg/class/pyro.cfg"), {binary:true});
				zip.file("cfg/scout.cfg", urlToPromise("/cfgen/cfg/class/scout.cfg"), {binary:true});
				zip.file("cfg/sniper.cfg", urlToPromise("/cfgen/cfg/class/sniper.cfg"), {binary:true});
				zip.file("cfg/soldier.cfg", urlToPromise("/cfgen/cfg/class/soldier.cfg"), {binary:true});
				zip.file("cfg/spy.cfg", urlToPromise("/cfgen/cfg/class/spy.cfg"), {binary:true});
				zip.file("cfg/crosshairswitcher/binds.cfg", urlToPromise("/cfgen/cfg/class/crosshairswitcher/binds.cfg"), {binary:true});
				zip.file("cfg/crosshairswitcher/crosshairs.cfg", urlToPromise("/cfgen/cfg/class/crosshairswitcher/crosshairs.cfg"), {binary:true});
				zip.file("cfg/crosshairswitcher/defaultcrosshair.cfg", urlToPromise("/cfgen/cfg/class/crosshairswitcher/defaultcrosshair.cfg"), {binary:true});
				zip.file("cfg/crosshairswitcher/disable.cfg", urlToPromise("/cfgen/cfg/class/crosshairswitcher/disable.cfg"), {binary:true});
				zip.file("cfg/crosshairswitcher/settings.cfg", '//   use the aliases like this: size; color; type; viewmodel FOV or viewmodel off\n//  _______________________________________________________________________________\n// |SIZES:  tiny      [18] |COLORS:  red    | mint    |TYPES:  cross_with_dot      |\n// |IIIIII  smallest  [20] |IIIIIII  green  | lime    |IIIIII  half_cross_with_dot |\n// |        small     [24] |         blue   | skyblue |        ring                |\n// |        medium    [28] |         yellow | black   |        ex                  |\n// |        big       [32] |         cyan   | grey    |        dot                 |\n// |        biggest   [36] |         pink   | white   |        open_cross          |\n// |        huge      [40] |         orange |         |        cross               |\n// |        invisible [00] |         purple |         |        default             |\n//  IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII\n\nalias default_primary_crosshair   "medium; green; cross; 84"\nalias default_secondary_crosshair "medium; cyan; cross_with_dot; 84"\nalias default_melee_crosshair     "big; yellow; open_cross; 84"\n\n//SCOUT\nalias scout_primary       "'+ size1_1 + '; ' + color1_1 + '; ' + style1_1 + '; ' + model1_1 + '"\nalias scout_secondary     "'+ size1_2 + '; ' + color1_2 + '; ' + style1_2 + '; ' + model1_2 + '"\nalias scout_melee         "'+ size1_3 + '; ' + color1_3 + '; ' + style1_3 + '; ' + model1_3 + '"\n\n//SOLDIER\nalias soldier_primary     "'+ size2_1 + '; ' + color2_1 + '; ' + style2_1 + '; ' + model2_1 + '"\nalias soldier_secondary   "'+ size2_2 + '; ' + color2_2 + '; ' + style2_2 + '; ' + model2_2 + '"\nalias soldier_melee       "'+ size2_3 + '; ' + color2_3 + '; ' + style2_3 + '; ' + model2_3 + '"\n\n//PYRO\nalias pyro_primary        "'+ size3_1 + '; ' + color3_1 + '; ' + style3_1 + '; ' + model3_1 + '"\nalias pyro_secondary      "'+ size3_2 + '; ' + color3_2 + '; ' + style3_2 + '; ' + model3_2 + '"\nalias pyro_melee          "'+ size3_3 + '; ' + color3_3 + '; ' + style3_3 + '; ' + model3_3 + '"\n\n//DEMOMAN\nalias demoman_primary     "'+ size4_1 + '; ' + color4_1 + '; ' + style4_1 + '; ' + model4_1 + '"\nalias demoman_secondary   "'+ size4_2 + '; ' + color4_2 + '; ' + style4_2 + '; ' + model4_2 + '"\nalias demoman_melee       "'+ size4_3 + '; ' + color4_3 + '; ' + style4_3 + '; ' + model4_3 + '"\n\n//HEAVY\nalias heavy_primary       "'+ size5_1 + '; ' + color5_1 + '; ' + style5_1 + '; ' + model5_1 + '"\nalias heavy_secondary     "'+ size5_2 + '; ' + color5_2 + '; ' + style5_2 + '; ' + model5_2 + '"\nalias heavy_melee         "'+ size5_3 + '; ' + color5_3 + '; ' + style5_3 + '; ' + model5_3 + '"\n\n//ENGINEER\nalias engineer_primary    "'+ size6_1 + '; ' + color6_1 + '; ' + style6_1 + '; ' + model6_1 + '"\nalias engineer_secondary  "'+ size6_2 + '; ' + color6_2 + '; ' + style6_2 + '; ' + model6_2 + '"\nalias engineer_melee      "'+ size6_3 + '; ' + color6_3 + '; ' + style6_3 + '; ' + model6_3 + '"\n\n//MEDIC\nalias medic_primary       "'+ size7_1 + '; ' + color7_1 + '; ' + style7_1 + '; ' + model7_1 + '"\nalias medic_secondary     "'+ size7_2 + '; ' + color7_2 + '; ' + style7_2 + '; ' + model7_2 + '"\nalias medic_melee         "'+ size7_3 + '; ' + color7_3 + '; ' + style7_3 + '; ' + model7_3 + '"\n\n//SNIPER\nalias sniper_primary      "'+ size8_1 + '; ' + color8_1 + '; ' + style8_1 + '; ' + model8_1 + '"\nalias sniper_secondary    "'+ size8_2 + '; ' + color8_2 + '; ' + style8_2 + '; ' + model8_2 + '"\nalias sniper_melee        "'+ size8_3 + '; ' + color8_3 + '; ' + style8_3 + '; ' + model8_3 + '"\n\n//SPY\nalias spy_primary         "'+ size9_1 + '; ' + color9_1 + '; ' + style9_1 + '; ' + model9_1 + '"\nalias spy_secondary       "'+ size9_2 + '; ' + color9_2 + '; ' + style9_2 + '; ' + model9_2 + '"\nalias spy_melee           "'+ size9_3 + '; ' + color9_3 + '; ' + style9_3 + '; ' + model9_3 + '"');
				zip.file("cfg/crosshairswitcher/shorten.cfg", urlToPromise("/cfgen/cfg/class/crosshairswitcher/shorten.cfg"), {binary:true});
				zip.file("cfg/crosshairswitcher/switcher.cfg", urlToPromise("/cfgen/cfg/class/crosshairswitcher/switcher.cfg"), {binary:true});
				zip.file("cfg/crosshairswitcher/weapons.cfg", urlToPromise("/cfgen/cfg/class/crosshairswitcher/weapons.cfg"), {binary:true});
				
            }
			if(iswhat == "sourceres") {
				zip.file("addons/SourceRes.dll" + filename, urlToPromise("/cfgen/addons/SourceRes/addons/SourceRes.dll"), {binary:true});
				zip.file("addons/SourceRes.vdf" + filename, urlToPromise("/cfgen/addons/SourceRes/addons/SourceRes.vdf"), {binary:true});
            }
			if(iswhat == "prec") {
				zip.file("addons/PREC.cfg" + filename, urlToPromise("/cfgen/addons/prec/addons/PREC.cfg"), {binary:true});
				zip.file("addons/PREC.dll" + filename, urlToPromise("/cfgen/addons/prec/addons/PREC.dll"), {binary:true});
				zip.file("addons/PREC.vdf" + filename, urlToPromise("/cfgen/addons/prec/addons/PREC.vdf"), {binary:true});
				zip.file("addons/readme_prec.txt" + filename, urlToPromise("/cfgen/addons/prec/addons/readme_prec.txt"), {binary:true});
            }
			if(iswhat == "tweaks") {
				zip.file("cfg/tweaks/" + filename, urlToPromise(url), {binary:true});
				customs = customs + "exec tweaks/" + filename.slice(0, -4) + "\n";
            }
			zip.file('cfg/custom.cfg', '//Tweaks, custom binds, all the stuff usually goes here\n\n' + bindings + '\n\n' +customs + '\n' + '\necho "------------- Thanks for using config generator by 200 -------------"\necho "------------- Create your own custom config at https://mkrl.github.io/cfgen/ -------------"'); //load custom tweaks and config

        });
		
		
		//building and downloading static configs
		zip.file("cfg/autoexec.cfg", "exec gfx\nexec binds\nexec settings\nexec network\nexec custom"); 				//autoexec
		zip.file("cfg/settings.cfg", "//General TF2 settings, like autoheal, min viewmodels, fastswitch, etc.\n\ntf_medigun_autoheal 1\ncl_autoreload 1\nhud_fastswitch 1\ntf_use_min_viewmodels " + minmodel +"\nr_drawviewmodel " + drawviewmodel + "\nfov_desired 90\nviewmodel_fov " + v_fov + "\n\ntf_remember_activeweapon 1\ntf_remember_lastswitched 1\nsb_dontshow_maxplayer_warning 1\ntf_spectate_pyrovision 0\nviewmodel_fov_demo 75\n\ntf_dingalingaling " + hittoggle + "\ntf_dingalingaling_repeat_delay " + hitdelay + "\ntf_dingaling_pitchmindmg " + hitmin + " \ntf_dingaling_pitchmaxdmg " + hitmax + "\ntf_dingaling_lasthit " + killtoggle + "\ntf_dingaling_lasthit_volume " + killvol + "\ntf_dingaling_lasthit_pitchmindmg " + killmin + "\ntf_dingaling_lasthit_pitchmaxdmg " + killmax + "\n\n\ntf_training_has_prompted_for_training 1\ntf_training_has_prompted_for_offline_practice 1\ntf_training_has_prompted_for_forums 1\ntf_training_has_prompted_for_options 1\ntf_training_has_prompted_for_loadout 1\ntf_mvm_tabs_discovered 3\ntf_matchmaking_ticket_help 0\ntf_coach_request_nevershowagain 1\n\nhud_combattext " + comtoggle + "\nhud_combattext_batching " + battoggle + "\nhud_combattext_batching_window " + batwindow + "\n\nds_kill_delay 15.000000\nds_enable " + ds_mode + "\nds_dir " + ds_folder + "\nds_notify "+ ds_notify + "\nds_sound " + ds_sound + "\nds_min_streak " + ds_ks + "\nds_autodelete " + ds_delete + "\nds_screens " + ds_screen); 	//settings
		zip.file("cfg/network.cfg", "//Connection settings\n\ncl_cmdrate " + cmdrate + "\ncl_interp " + interp + "\ncl_interp_ratio " + intratio +"\ncl_lagcompensation 1\ncl_pred_optimize 2\ncl_smooth 0\ncl_smoothtime 0.01\ncl_updaterate " + uprate + "\nrate " + rate + "\n");  	//network
		zip.file("cfg/binds.cfg", urlToPromise("/cfgen/cfg/binds.cfg"), {binary:true}); 	//binds
	
		
        // when everything has been downloaded, we can trigger the dl
        zip.generateAsync({type:"blob"}, function updateCallback(metadata) {
            var msg = "Packing : " + metadata.percent.toFixed(2) + " %";
            if(metadata.currentFile) {
                msg += ", current file = " + metadata.currentFile;
            }
            showMessage(msg);
            updatePercent(metadata.percent|0);
        })
        .then(function callback(blob) {

            // see FileSaver.js
            saveAs(blob, "config.zip");

            showMessage("Done! Extract this archive to your /tf folder.");
        }, function (e) {
            showError(e);
        });

        return false;
    });
	
	
});