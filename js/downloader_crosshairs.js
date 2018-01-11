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

		//getting values form inputs
		// !!!!IMPORTANT!!!! All the selectable html fields (non-text forms) should have data-name and data-url attributes or everything breaks

		var sv_maxcmdrate = $('#sv_maxcmdrate').val();
		var sv_mincmdrate = $('#tf_use_fixed_weaponspreads').val();

		if ($("#sv_allowdownload").is(':checked')) {
			var sv_allowdownload = "sv_allowdownload 1";
			var sv_downloadurl = 'sv_downloadurl "'+ $('#sv_downloadurl').val() + '"';			
		}
		//maps
		
		// find every checked item
		$(this).find(":checked").each(function() {

			var $this = $(this);
			var url = $this.data("url");
			var iswhat = $this.data("name");
			var filename = url.replace(/.*\//g, "");
			if (iswhat === "tftrue") {
				zip.file("addons/TFTrue.dll", urlToPromise("../server/addons/tftrue/TFTrue.dll"), {
					binary: true
				});
				zip.file("addons/TFTrue.so", urlToPromise("../server/addons/tftrue/TFTrue.so"), {
					binary: true
				});
				zip.file("addons/TFTrue.vdf", urlToPromise("../server/addons/tftrue/TFTrue.vdf"), {
					binary: true
				});
				zip.file("addons/tftrue_readme.txt", urlToPromise("../server/addons/tftrue/tftrue_readme.txt"), {
					binary: true
				});
			}



			if (iswhat === "etf2l") {
				zip.file("cfg/etf2l.cfg", urlToPromise("../server/cfg/etf2l/etf2l.cfg"), {
					binary: true
				});
				zip.file("cfg/etf2l_6v6.cfg", urlToPromise("../server/cfg/etf2l/etf2l_6v6.cfg"), {
					binary: true
				});
				zip.file("cfg/etf2l_6v6_5cp.cfg", urlToPromise("../server/cfg/etf2l/etf2l_6v6_5cp.cfg"), {
					binary: true
				});
				zip.file("cfg/etf2l_6v6_ctf.cfg", urlToPromise("../server/cfg/etf2l/etf2l_6v6_ctf.cfg"), {
					binary: true
				});
				zip.file("cfg/etf2l_6v6_koth.cfg", urlToPromise("../server/cfg/etf2l/etf2l_6v6_koth.cfg"), {
					binary: true
				});
				zip.file("cfg/etf2l_6v6_stopwatch.cfg", urlToPromise("../server/cfg/etf2l/etf2l_6v6_stopwatch.cfg"), {
					binary: true
				});
				zip.file("cfg/etf2l_9v9.cfg", urlToPromise("../server/cfg/etf2l/etf2l_9v9.cfg"), {
					binary: true
				});
				zip.file("cfg/etf2l_9v9_5cp.cfg", urlToPromise("../server/cfg/etf2l/etf2l_9v9_5cp.cfg"), {
					binary: true
				});
				zip.file("cfg/etf2l_9v9_ctf.cfg", urlToPromise("../server/cfg/etf2l/etf2l_9v9_ctf.cfg"), {
					binary: true
				});
				zip.file("cfg/etf2l_9v9_koth.cfg", urlToPromise("../server/cfg/etf2l/etf2l_9v9_koth.cfg"), {
					binary: true
				});
				zip.file("cfg/etf2l_9v9_stopwatch.cfg", urlToPromise("../server/cfg/etf2l/etf2l_9v9_stopwatch.cfg"), {
					binary: true
				});
				zip.file("cfg/etf2l_bball.cfg", urlToPromise("../server/cfg/etf2l/etf2l_bball.cfg"), {
					binary: true
				});
				zip.file("cfg/etf2l_custom.cfg", urlToPromise("../server/cfg/etf2l/etf2l_custom.cfg"), {
					binary: true
				});
				zip.file("cfg/etf2l_golden_cap.cfg", urlToPromise("../server/cfg/etf2l/etf2l_golden_cap.cfg"), {
					binary: true
				});
				zip.file("cfg/etf2l_whitelist_6v6.txt", urlToPromise("../server/cfg/etf2l/etf2l_whitelist_6v6.txt"), {
					binary: true
				});
				zip.file("cfg/etf2l_whitelist_9v9.txt", urlToPromise("../server/cfg/etf2l/etf2l_whitelist_9v9.txt"), {
					binary: true
				});
				zip.file("cfg/etf2l_whitelist_bball.txt", urlToPromise("../server/cfg/etf2l/etf2l_whitelist_bball.txt"), {
					binary: true
				});
				zip.file("cfg/etf2l_whitelist_ultiduo.txt", urlToPromise("../server/cfg/etf2l/etf2l_whitelist_ultiduo.txt"), {
					binary: true
				});
			}
			if (iswhat === "ugc") {
				zip.file("cfg/ugc_4v_base.cfg", urlToPromise("../server/cfg/ugc/ugc_4v_base.cfg"), {
					binary: true
				});
				zip.file("cfg/ugc_4v_custom.cfg", urlToPromise("../server/cfg/ugc/ugc_4v_custom.cfg"), {
					binary: true
				});
				zip.file("cfg/ugc_4v_golden.cfg", urlToPromise("../server/cfg/ugc/ugc_4v_golden.cfg"), {
					binary: true
				});
				zip.file("cfg/ugc_4v_koth.cfg", urlToPromise("../server/cfg/ugc/ugc_4v_koth.cfg"), {
					binary: true
				});
				zip.file("cfg/ugc_4v_koth_overtime.cfg", urlToPromise("../server/cfg/ugc/ugc_4v_koth_overtime.cfg"), {
					binary: true
				});
				zip.file("cfg/ugc_4v_standard.cfg", urlToPromise("../server/cfg/ugc/ugc_4v_standard.cfg"), {
					binary: true
				});
				zip.file("cfg/ugc_4v_standard_overtime.cfg", urlToPromise("../server/cfg/ugc/ugc_4v_standard_overtime.cfg"), {
					binary: true
				});
				zip.file("cfg/ugc_4v_stopwatch.cfg", urlToPromise("../server/cfg/ugc/ugc_4v_stopwatch.cfg"), {
					binary: true
				});
				zip.file("cfg/ugc_6v_base.cfg", urlToPromise("../server/cfg/ugc/ugc_6v_base.cfg"), {
					binary: true
				});
				zip.file("cfg/ugc_6v_custom.cfg", urlToPromise("../server/cfg/ugc/ugc_6v_custom.cfg"), {
					binary: true
				});
				zip.file("cfg/ugc_6v_golden.cfg", urlToPromise("../server/cfg/ugc/ugc_6v_golden.cfg"), {
					binary: true
				});
				zip.file("cfg/ugc_6v_koth.cfg", urlToPromise("../server/cfg/ugc/ugc_6v_koth.cfg"), {
					binary: true
				});
				zip.file("cfg/ugc_6v_koth_overtime.cfg", urlToPromise("../server/cfg/ugc/ugc_6v_koth_overtime.cfg"), {
					binary: true
				});
				zip.file("cfg/ugc_6v_standard.cfg", urlToPromise("../server/cfg/ugc/ugc_6v_standard.cfg"), {
					binary: true
				});
				zip.file("cfg/ugc_6v_standard_overtime.cfg", urlToPromise("../server/cfg/ugc/ugc_6v_standard_overtime.cfg"), {
					binary: true
				});
				zip.file("cfg/ugc_6v_stopwatch.cfg", urlToPromise("../server/cfg/ugc/ugc_6v_stopwatch.cfg"), {
					binary: true
				});
				zip.file("cfg/ugc_HL_base.cfg", urlToPromise("../server/cfg/ugc/ugc_HL_base.cfg"), {
					binary: true
				});
				zip.file("cfg/ugc_HL_ctf.cfg", urlToPromise("../server/cfg/ugc/ugc_HL_ctf.cfg"), {
					binary: true
				});
				zip.file("cfg/ugc_HL_custom.cfg", urlToPromise("../server/cfg/ugc/ugc_HL_custom.cfg"), {
					binary: true
				});
				zip.file("cfg/ugc_HL_koth.cfg", urlToPromise("../server/cfg/ugc/ugc_HL_koth.cfg"), {
					binary: true
				});
				zip.file("cfg/ugc_HL_standard.cfg", urlToPromise("../server/cfg/ugc/ugc_HL_standard.cfg"), {
					binary: true
				});
				zip.file("cfg/ugc_HL_stopwatch.cfg", urlToPromise("../server/cfg/ugc/ugc_HL_stopwatch.cfg"), {
					binary: true
				});
				zip.file("cfg/ugc_off.cfg", urlToPromise("../server/cfg/ugc/ugc_off.cfg"), {
					binary: true
				});
				zip.file("cfg/item_whitelist_ugc_4v4.txt", urlToPromise("../server/cfg/ugc/item_whitelist_ugc_4v4.txt"), {
					binary: true
				});
				zip.file("cfg/item_whitelist_ugc_hl.txt", urlToPromise("../server/cfg/ugc/item_whitelist_ugc_hl.txt"), {
					binary: true
				});
			}
			if (iswhat === "ozfortress") {
				zip.file("cfg/ozfortress.cfg", urlToPromise("../server/cfg/oz/ozfortress.cfg"), {
					binary: true
				});
				zip.file("cfg/ozfortress_6v6.cfg", urlToPromise("../server/cfg/oz/ozfortress_6v6.cfg"), {
					binary: true
				});
				zip.file("cfg/ozfortress_6v6_5cp.cfg", urlToPromise("../server/cfg/oz/ozfortress_6v6_5cp.cfg"), {
					binary: true
				});
				zip.file("cfg/ozfortress_6v6_koth.cfg", urlToPromise("../server/cfg/oz/ozfortress_6v6_koth.cfg"), {
					binary: true
				});
				zip.file("cfg/ozfortress_6v6_push.cfg", urlToPromise("../server/cfg/oz/ozfortress_6v6_push.cfg"), {
					binary: true
				});
				zip.file("cfg/ozfortress_6v6_scrim.cfg", urlToPromise("../server/cfg/oz/ozfortress_6v6_scrim.cfg"), {
					binary: true
				});
				zip.file("cfg/ozfortress_9v9.cfg", urlToPromise("../server/cfg/oz/ozfortress_9v9.cfg"), {
					binary: true
				});
				zip.file("cfg/ozfortress_9v9_5cp.cfg", urlToPromise("../server/cfg/oz/ozfortress_9v9_5cp.cfg"), {
					binary: true
				});
				zip.file("cfg/ozfortress_9v9_koth.cfg", urlToPromise("../server/cfg/oz/ozfortress_9v9_koth.cfg"), {
					binary: true
				});
				zip.file("cfg/ozfortress_9v9_push.cfg", urlToPromise("../server/cfg/oz/ozfortress_9v9_push.cfg"), {
					binary: true
				});
				zip.file("cfg/ozfortress_9v9_scrim.cfg", urlToPromise("../server/cfg/oz/ozfortress_9v9_scrim.cfg"), {
					binary: true
				});
				zip.file("cfg/ozfortress_9v9_stopwatch.cfg", urlToPromise("../server/cfg/oz/ozfortress_9v9_stopwatch.cfg"), {
					binary: true
				});
				zip.file("cfg/ozfortress_golden_cap.cfg", urlToPromise("../server/cfg/oz/ozfortress_golden_cap.cfg"), {
					binary: true
				});
				zip.file("cfg/ozfortress_ultiduo.cfg", urlToPromise("../server/cfg/oz/ozfortress_ultiduo.cfg"), {
					binary: true
				});
				zip.file("cfg/ozfortress_whitelist_6v6.txt", urlToPromise("../server/cfg/oz/ozfortress_whitelist_6v6.txt"), {
					binary: true
				});
				zip.file("cfg/ozfortress_whitelist_9v9.txt", urlToPromise("../server/cfg/oz/ozfortress_whitelist_9v9.txt"), {
					binary: true
				});
				zip.file("cfg/ozfortress_whitelist_ultiduo.txt", urlToPromise("../server/cfg/oz/ozfortress_whitelist_ultiduo.txt"), {
					binary: true
				});
			}
			if (iswhat === "metamod") {
				if (os == "linux") {
				zippies.push('./addons/mmsource-1.10.7-linux.zip');
				} else {
				zippies.push('./addons/mmsource-1.10.7-windows.zip');					
				}
			}
			if (iswhat === "sourcemod") {
				if (os == "linux") {
				zippies.push('./addons/sourcemod-1.8.0-linux.zip');
				} else {
				zippies.push('./addons/sourcemod-1.8.0-windows.zip');					
				}
				
				var smadminsettings = [
					'/**',
					' * Made with CFG.TF - Server config generator.',
					' * USE THIS SECTION TO DECLARE DETAILED ADMIN PROPERTIES.',
					' *',
					' * Each admin should have its own "Admin" section, followed by a name.',
					' * The name does not have to be unique.',
					' *',
					' * Available properties: (Anything else is filtered as custom)',
					' *      "auth"          - REQUIRED - Auth method to use.  Built-in methods are:',
					' *                        "steam"  - Steam based authentication',
					' *                        "name"   - Name based authentication',
					' *                        "ip"	- IP based authentication',
					' *                        Anything else is treated as custom.',
					' *					 Note: Only one auth method is allowed per entry.',
					' *',
					' *      "identity"      - REQUIRED - Identification string, for example, a steamid or name.',
					' *					 Note: Only one identity is allowed per entry.',
					' *',
					' *      "password"      - Optional password to require.',
					' *      "group"         - Adds one group to the users group table.',
					' *      "flags"         - Adds one or more flags to the users permissions.',
					' *		"immunity"		- Sets the users immunity level (0 = no immunity).',
					' *						  Immunity can be any value.  Admins with higher ',
					' *						  values cannot be targetted.  See sm_immunity_mode ',
					' *						  to tweak the rules.  Default value is 0.',
					' *',
					' * Example:',
					'	"BAILOPAN"',
					'	{',
					'		"auth"			"steam"',
					'		"identity"		"STEAM_0:1:16"',
					'		"flags"			"abcdef"',
					'	}',
					' *',
					' */',
					'Admins',
					'{',
					'}'
				];
				var a2 = [''];
				for (var k = 0; k <= admins_c; k++) {
					if(typeof $('#sm_admin_alias'+k).val() !== 'undefined' ){ //checking for undefined that appears extra fields were added and removed
					a2.push('',
						'	"'+$('#sm_admin_alias'+k).val()+'"',
							'		{',
								'			"auth"			"steam"',
								'			"identity"		"'+$('#sm_steamid'+k).val()+'"',
								'			"flags"			"'+$('#sm_flags'+k).val()+'"',
								'			"immunity"			"'+$('#sm_immunity'+k).val()+'"',
							'		}',
					''
					);
					}
				}
				smadminsettings.splice.apply(smadminsettings, [36, 0].concat(a2));
				var smadminsettings_j = smadminsettings.join('\n');
				zip.file('addons/sourcemod/configs/admins.cfg', smadminsettings_j);
				
			}
			if (iswhat === "curl") {
				if ($('#sourcemod').is(":checked")){
					if (os == "linux") {
					zippies.push('./addons/sm_plugins/curl_1.3.0.0_linux.zip');
					} else {
					zippies.push('./addons/sm_plugins/curl_1.3.0.0.zip');					
					}
				}
			}
			if (iswhat === "sm_plugins") {
				if ($('#sourcemod').is(":checked")){
					zippies.push(url);
				}
			}

		});


		//building and downloading static configs
		zip.file('cfg/server.cfg', '//Server settings\nhostname "' + hostname + '"\nsv_password "' + sv_password + '"\nsv_lan ' + sv_lan + '\n\nrcon_password "' + rcon_password + '"\nsv_rcon_banpenalty ' + sv_rcon_banpenalty + '\nsv_rcon_minfailures ' + sv_rcon_minfailures + '\nsv_rcon_maxfailures ' + sv_rcon_maxfailures + '\nlog ' + log + '\nsv_logfile ' + sv_logfile + '\nsv_logecho ' + sv_logecho + '\nsv_logbans ' + sv_logbans + '\n\n\nsv_pure ' + sv_pure + '\nsv_pure_kick_clients ' + sv_pure_kick_clients + '\nsv_alltalk ' + sv_alltalk + '\nmp_allowspectators ' + mp_allowspectators + '\nmp_autoteambalance ' + mp_autoteambalance + '\nmp_teams_unbalance_limit ' + mp_teams_unbalance_limit + '\nmp_forcecamera ' + mp_forcecamera + '\nsv_allow_wait_command ' + sv_allow_wait_command + '\nsv_cheats ' + sv_cheats + '\nsv_pausable ' + sv_pausable + '\nmp_stalemate_enable ' + mp_stalemate_enable + '\nmp_stalemate_timelimit ' + mp_stalemate_timelimit + '\nmp_winlimit ' + mp_winlimit + '\nmp_timelimit ' + mp_timelimit + '\ntf_weapon_criticals ' + tf_weapon_criticals + '\ntf_use_fixed_weaponspreads ' + tf_use_fixed_weaponspreads + '\n\nsv_maxrate ' + sv_maxrate + '\nsv_minrate ' + sv_minrate + '\nsv_maxupdaterate ' + sv_maxupdaterate + '\nsv_minupdaterate ' + sv_minupdaterate + '\nsv_maxcmdrate ' + sv_maxcmdrate + '\nsv_mincmdrate ' + sv_mincmdrate + '\n\n\n//Map settings\n\n'+sv_allowdownload+'\n'+sv_downloadurl+'\n\n\n' + tftrueset + '\n\n\n\n//Custom settings\n\n' + bindings + '\n\necho -----------------------------------------------------------\necho ----------------- Thanks for using CFG.TF -----------------\necho ---------Build your own custom config at cfg.tf------------\necho -----------------------------------------------------------'); //server


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
						saveAs(blob, 'config.zip')
						showMessage('Done! Extract this archive to your /tf folder.');
					}, function(e) {
					showError(e);
					})
			});

			return false;
	});


});
