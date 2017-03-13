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

        // find every checked item
        $(this).find(":checked").each(function () {
			var customs = new Array("");
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
			if(iswhat == "tweaks") {
				zip.file("cfg/tweaks/" + filename, urlToPromise(url), {binary:true});
				customs.push("exec tweaks/" + filename.slice(0, -4));
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
			var cexecs = "";																//writing custom execs to a single variable
			var index;
			for (index = 0; index < customs.length; ++index) {
						cexecs = cexecs + customs[index] + "\n";			
			}		
			zip.file('cfg/custom.cfg', cexecs + 'echo "------------- Thanks for using config generator by 200 -------------"\necho "------------- Create your own custom config at https://mkrl.github.io/cfgen/ -------------"'); //load custom tweaks and config

        });
		
		
		//building and downloading static configs
		zip.file("cfg/autoexec.cfg", "exec gfx\nexec binds\nexec settings\nexec custom"); 				//autoexec
		zip.file("cfg/settings.cfg", urlToPromise("/cfgen/cfg/settings.cfg"), {binary:true}); 	//settings
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

            showMessage("Enjoy your custom stuff!");
        }, function (e) {
            showError(e);
        });

        return false;
    });
});

// vim: set shiftwidth=4 softtabstop=4:
