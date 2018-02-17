jQuery(function($) {
	"use strict";

	var Promise = window.Promise;
	if (!Promise) {
		Promise = JSZip.external.Promise;
	}

	/**
	 * Reset the message.
	 */
	function resetMessage() {
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
				width: percent + "%"
			});
	}

	/**
	 * Fetch the content and return the associated promise.
	 * @param {String} url the url of the content to fetch.
	 * @return {Promise} the promise containing the data.
	 */
	function urlToPromise(url) {
		return new Promise(function(resolve, reject) {
			JSZipUtils.getBinaryContent(url, function(err, data) {
				if (err) {
					reject(err);
				} else {
					resolve(data);
				}
			});
		});
	}

			/* 	NEW STUFF, can work slow with large files, due to how this works downloaded files take 2x of their size in RAM
				Downloading multiple zips and including contents into config.zip */
	
				// function to read in a list of source zip files and return a merged archive
				function mergeZips(sources,zip) {
					return readSources(sources, zip)
						.then(function() {
							return zip;
						});
				}

				// generate an array of promises for each zip we're reading in and combine them
				// into a single promise with Promise.all()
				function readSources(files, zip) {
					return Promise.all(
						files.map(function(file){
							return readSource(file, zip);
						})
					);
				}

				// promise-ified wrapper function to read & load a zip
				function readSource(file, zip) {
					return new Promise(function(resolve, reject) {
						JSZipUtils.getBinaryContent(file, function (err, data) {
							if (err) {
								reject(err);
							}
							// resolving the promise with another promise will pass the promise
							// down the chain:
							resolve(zip.loadAsync(data, {createFolders: true})); 
						});
					});
				}
				

				
			/* 	/NEW STUFF
				 */	
	
	if (!JSZip.support.blob) {
		showError("This only works with a good browser!");
		return;
	}

	var $form = $("#download_form").on("submit", function() {

		resetMessage();
		
		//An array of zip files that should be inclided. 
		var zippies = []; 
		
		var zip = new JSZip();

		// !!!!IMPORTANT!!!! All the selectable html fields (non-text forms) should have data-name and data-url attributes or everything breaks

		var sv_maxcmdrate = $('#sv_maxcmdrate').val();
		
		//looping through the table rows
		$('#crosslist > tbody  > tr').each(function() {			
			var $this = $(this);
			var c_url = $this.data("url");
			var crossname = $this.data("name");
			var filename = c_url.replace(/.*\//g, "");
			var c_settings = '"crosshair"\n		{\n				"file"		"vgui/replay/thumbnails/'+crossname+'"\n				"x"		"0"\n				"y"		"0"\n				"width"		"64"\n				"height"	"64"\n		}\n		"';
			$.ajax({
				url : c_url,
				dataType: "text",
				success : function (data) {
						var c_temp = data.replace( /"crosshair"\s*\{[^]+\}\s*"/g, c_settings )
						zip.file('crosshairs/scripts/'+filename, c_temp); 
					}
			});
			
			

		});
		
		zippies.push('./xhairs/crosshairs.zip');
		
		//static file text example
		//zip.file('crosshairs/test.cfg', 'hello'); 


			// when everything has been downloaded, we can trigger the dl
			mergeZips(zippies,zip).then(function(zip) { //new thing, nested promisies
				zip.generateAsync({type: 'blob'}, 
				function(metadata) {
					var msg = 'Packing : ' + metadata.percent.toFixed(2) + ' %';
					if (metadata.currentFile) {
						msg += ', current file = ' + metadata.currentFile;
					}
					showMessage(msg);
					updatePercent(metadata.percent | 0);
				})
					.then(function(blob){
						saveAs(blob, 'crosshairs.zip')
						showMessage('Done! Extract this archive to your /tf/custom/ folder.');
					}, function(e) {
					showError(e);
					})
			});

			return false;
	});


});
