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
		var customs = "";
		
 		//getting values form inputs

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
		
		
		var v_fov = $('#v_fov').val();	
		
		var cmdrate = $('#cmdrate').val();
		var interp = $('#interp').val();
		var intratio = $('#intratio').val();
		var uprate = $('#uprate').val();
		var rate = $('#rate').val();  
		
		//get large piece of custom binds
		var bindings = $('#bindings').val();  
		
		
        // find every checked item
        $(this).find(":checked").each(function () {

            var $this = $(this);
            var url = $this.data("url");
			var iswhat = $this.data("name");
            var filename = url.replace(/.*\//g, "");   //using static filenames for gfx cfg
			if(iswhat == "gfx") {
				zip.file("cfg/gfx.cfg", urlToPromise(url), {binary:true});
            }
			if(iswhat == "scripts") {
				zip.file("custom/runfasterpls/scripts/" + filename, urlToPromise(url), {binary:true});
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
				zip.file("cfg/crosshairswitcher/settings.cfg", urlToPromise("/cfgen/cfg/class/crosshairswitcher/settings.cfg"), {binary:true});
				zip.file("cfg/crosshairswitcher/shorten.cfg", urlToPromise("/cfgen/cfg/class/crosshairswitcher/shorten.cfg"), {binary:true});
				zip.file("cfg/crosshairswitcher/switcher.cfg", urlToPromise("/cfgen/cfg/class/crosshairswitcher/switcher.cfg"), {binary:true});
				zip.file("cfg/crosshairswitcher/weapons.cfg", urlToPromise("/cfgen/cfg/class/crosshairswitcher/weapons.cfg"), {binary:true});
				
            }
			if(iswhat == "tweaks") {
				zip.file("cfg/tweaks/" + filename, urlToPromise(url), {binary:true});
				customs = customs + "exec tweaks/" + filename.slice(0, -4) + "\n";
            }
			zip.file('cfg/custom.cfg', '//Tweaks, custom binds, all the stuff usually goes here\n\n' + bindings + '\n\n' +customs + '\n' + '\necho "------------- Thanks for using config generator by 200 -------------"\necho "------------- Create your own custom config at https://mkrl.github.io/cfgen/ -------------"'); //load custom tweaks and config

        });
		
		
		//building and downloading static configs
		zip.file("cfg/autoexec.cfg", "exec gfx\nexec binds\nexec settings\nexec network\nexec custom"); 				//autoexec
		zip.file("cfg/settings.cfg", "//General TF2 settings, like autoheal, min viewmodels, fastswitch, etc.\n\ntf_medigun_autoheal 1\ncl_autoreload 1\nhud_fastswitch 1\ntf_use_min_viewmodels " + minmodel +"\nr_drawviewmodel " + drawviewmodel + "\nfov_desired 90\nviewmodel_fov " + v_fov + "\n\ntf_remember_activeweapon 1\ntf_remember_lastswitched 1\nsb_dontshow_maxplayer_warning 1\ntf_spectate_pyrovision 0\nviewmodel_fov_demo 75\n\ntf_dingalingaling " + hittoggle + "\ntf_dingalingaling_repeat_delay " + hitdelay + "\ntf_dingaling_pitchmindmg " + hitmin + " \ntf_dingaling_pitchmaxdmg " + hitmax + "\ntf_dingaling_lasthit " + killtoggle + "\ntf_dingaling_lasthit_volume " + killvol + "\ntf_dingaling_lasthit_pitchmindmg " + killmin + "\ntf_dingaling_lasthit_pitchmaxdmg " + killmax + "\n\n\ntf_training_has_prompted_for_training 1\ntf_training_has_prompted_for_offline_practice 1\ntf_training_has_prompted_for_forums 1\ntf_training_has_prompted_for_options 1\ntf_training_has_prompted_for_loadout 1\ntf_mvm_tabs_discovered 3\ntf_matchmaking_ticket_help 0\ntf_coach_request_nevershowagain 1\n\nhud_combattext " + comtoggle + "\nhud_combattext_batching " + battoggle + "\nhud_combattext_batching_window " + batwindow + "\nds_min_streak 4.000000\nds_kill_delay 15.000000"); 	//settings
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
