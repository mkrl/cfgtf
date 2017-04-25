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

	if (!JSZip.support.blob) {
		showError("This only works with a good browser!");
		return;
	}

	var $form = $("#download_form").on("submit", function() {

		resetMessage();

		var zip = new JSZip();
		var customs = ""; //a var to store all the extra stuff to add to autoexec

		//getting values form inputs
		// !!!!IMPORTANT!!!! All the selectable html fields (non-text forms) should have data-name and data-url attributes or everything breaks

		//viewmodel settings
		if ($("#modeltoggle").is(':checked')) {
			var drawviewmodel = "1";
		} else {
			var drawviewmodel = "0";
		}
		if ($("#minmodtoggle").is(':checked')) {
			var minmodel = "1";
		} else {
			var minmodel = "0";
		}
		if ($("#fliptoggle").is(':checked')) {
			var fliptoggle = "1";
		} else {
			var fliptoggle = "0";
		}
		var v_fov = $('#v_fov').val();
		var vmodelbind = $('#vmodelbind').val();

		//combat text settings
		if ($("#battoggle").is(':checked')) {
			var battoggle = "1";
		} else {
			var battoggle = "0";
		}
		if ($("#comtoggle").is(':checked')) {
			var comtoggle = "1";
		} else {
			var comtoggle = "0";
		}
		if ($("#hittoggle").is(':checked')) {
			var hittoggle = "1";
		} else {
			var hittoggle = "0";
		}
		if ($("#killtoggle").is(':checked')) {
			var killtoggle = "1";
		} else {
			var killtoggle = "0";
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
		if ($("#ds_delete").is(':checked')) {
			var ds_delete = "1";
		} else {
			var ds_delete = "0";
		}
		if ($("#ds_screen").is(':checked')) {
			var ds_screen = "1";
		} else {
			var ds_screen = "0";
		}

		var ds_mode = $('#ds_mode').val();
		var ds_folder = $('#ds_folder').val();
		var ds_notify = $('#ds_notify').val();
		var ds_sound = $('#ds_sound').val();
		var ds_ks = $('#ds_ks').val();

		//get large piece of custom binds
		var bindings = $('#bindings').val();

		//getting switcher values (if selected)

		var xhairs = [];
		if ($("#crosshairswitcherid").is(':checked'))
			for (var c = 1; c < 10; ++c) {
				xhairs[c-1] = [];
				for (var s = 1; s < 4; ++s) {
					var cross = $('[name="cs_col_'+c+'_'+s+'n"]').val();

					var vm = 'off';
					if ($('#cs_draw_'+c+'_'+s).is(':checked')) {
						vm = $('#cs_fov_1_1').val() + '; tf_use_min_viewmodels ';
						vm += $('#cs_draw_'+c+'_'+s+'_min input').is(':checked') ? '1' : '0';
					}

					xhairs[c-1][s-1] = {
						style: cross[0],
						size : cross[1],
						color: cross[2],

						vm: vm
					};
				}
			}


		var bindarr = "";

		// find every checked item
		$(this).find(":checked").each(function() {

			var $this = $(this);
			var url = $this.data("url");
			var iswhat = $this.data("name");
			var filename = url.replace(/.*\//g, "");
			if (iswhat === "gfx") {
				zip.file("cfg/gfx.cfg", urlToPromise(url), {
					binary: true
				});
			}
			if (iswhat === "scripts") {
				zip.file("custom/runfasterpls/scripts/" + filename, urlToPromise(url), {
					binary: true
				});
			}
			if (iswhat === "hitsound") {
				zip.file("custom/damage/sound/ui/hitsound.wav", urlToPromise(url), {
					binary: true
				});
			}
			if (iswhat === "killsound") {
				zip.file("custom/damage/sound/ui/killsound.wav", urlToPromise(url), {
					binary: true
				});
			}
			if (iswhat === "vpks") {
				zip.file("custom/" + filename, urlToPromise(url), {
					binary: true
				});
			}
			if (iswhat === "configs") {
				zip.file("cfg/" + filename, urlToPromise(url), {
					binary: true
				});
			}
			if (iswhat === "crosshairswitcher") {
				zip.file("cfg/demoman.cfg", urlToPromise("../make/cfg/class/demoman.cfg"), {
					binary: true
				});
				zip.file("cfg/demoplayback.cfg", urlToPromise("../make/cfg/class/demoplayback.cfg"), {
					binary: true
				});
				zip.file("cfg/engineer.cfg", urlToPromise("../make/cfg/class/engineer.cfg"), {
					binary: true
				});
				zip.file("cfg/heavyweapons.cfg", urlToPromise("../make/cfg/class/heavyweapons.cfg"), {
					binary: true
				});
				zip.file("cfg/insourcetv.cfg", urlToPromise("../make/cfg/class/insourcetv.cfg"), {
					binary: true
				});
				zip.file("cfg/CROSSHAIRSWITCHER-INSTRUCTIONS.txt", urlToPromise("../make/cfg/class/CROSSHAIRSWITCHER-INSTRUCTIONS.txt"), {
					binary: true
				});
				zip.file("cfg/medic.cfg", urlToPromise("../make/cfg/class/medic.cfg"), {
					binary: true
				});
				zip.file("cfg/pyro.cfg", urlToPromise("../make/cfg/class/pyro.cfg"), {
					binary: true
				});
				zip.file("cfg/scout.cfg", urlToPromise("../make/cfg/class/scout.cfg"), {
					binary: true
				});
				zip.file("cfg/sniper.cfg", urlToPromise("../make/cfg/class/sniper.cfg"), {
					binary: true
				});
				zip.file("cfg/soldier.cfg", urlToPromise("../make/cfg/class/soldier.cfg"), {
					binary: true
				});
				zip.file("cfg/spy.cfg", urlToPromise("../make/cfg/class/spy.cfg"), {
					binary: true
				});
				zip.file("cfg/crosshairswitcher/binds.cfg", urlToPromise("../make/cfg/class/crosshairswitcher/binds.cfg"), {
					binary: true
				});
				zip.file("cfg/crosshairswitcher/crosshairs.cfg", urlToPromise("../make/cfg/class/crosshairswitcher/crosshairs.cfg"), {
					binary: true
				});
				zip.file("cfg/crosshairswitcher/defaultcrosshair.cfg", urlToPromise("../make/cfg/class/crosshairswitcher/defaultcrosshair.cfg"), {
					binary: true
				});
				zip.file("cfg/crosshairswitcher/disable.cfg", urlToPromise("../make/cfg/class/crosshairswitcher/disable.cfg"), {
					binary: true
				});
				var xhair_settings = [
					'//   use the aliases like this: size; color; type; viewmodel FOV or viewmodel off',
					'//  _______________________________________________________________________________',
					'// |SIZES:  tiny      [18] |COLORS:  red    | mint    |TYPES:  cross_with_dot      |',
					'// |IIIIII  smallest  [20] |IIIIIII  green  | lime    |IIIIII  half_cross_with_dot |',
					'// |        small     [24] |         blue   | skyblue |        ring                |',
					'// |        medium    [28] |         yellow | black   |        ex                  |',
					'// |        big       [32] |         cyan   | grey    |        dot                 |',
					'// |        biggest   [36] |         pink   | white   |        open_cross          |',
					'// |        huge      [40] |         orange |         |        cross               |',
					'// |        invisible [00] |         purple |         |        default             |',
					'//  IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII',
					'',
					'alias default_primary_crosshair   "medium; green; cross; 84"',
					'alias default_secondary_crosshair "medium; cyan; cross_with_dot; 84"',
					'alias default_melee_crosshair     "big; yellow; open_cross; 84"',
					'',
					'//SCOUT',
					'alias scout_primary       "'+xhairs[0][0].size+'; '+xhairs[0][0].color+'; '+xhairs[0][0].style+'; '+xhairs[0][0].vm+'"',
					'alias scout_secondary     "'+xhairs[0][1].size+'; '+xhairs[0][1].color+'; '+xhairs[0][1].style+'; '+xhairs[0][1].vm+'"',
					'alias scout_melee         "'+xhairs[0][2].size+'; '+xhairs[0][2].color+'; '+xhairs[0][2].style+'; '+xhairs[0][2].vm+'"',
					'',
					'//SOLDIER',
					'alias soldier_primary     "'+xhairs[1][0].size+'; '+xhairs[1][0].color+'; '+xhairs[1][0].style+'; '+xhairs[1][0].vm+'"',
					'alias soldier_secondary   "'+xhairs[1][1].size+'; '+xhairs[1][1].color+'; '+xhairs[1][1].style+'; '+xhairs[1][1].vm+'"',
					'alias soldier_melee       "'+xhairs[1][2].size+'; '+xhairs[1][2].color+'; '+xhairs[1][2].style+'; '+xhairs[1][2].vm+'"',
					'',
					'//PYRO',
					'alias pyro_primary        "'+xhairs[2][0].size+'; '+xhairs[2][0].color+'; '+xhairs[2][0].style+'; '+xhairs[2][0].vm+'"',
					'alias pyro_secondary      "'+xhairs[2][1].size+'; '+xhairs[2][1].color+'; '+xhairs[2][1].style+'; '+xhairs[2][1].vm+'"',
					'alias pyro_melee          "'+xhairs[2][2].size+'; '+xhairs[2][2].color+'; '+xhairs[2][2].style+'; '+xhairs[2][2].vm+'"',
					'',
					'//DEMOMAN',
					'alias demoman_primary     "'+xhairs[3][0].size+'; '+xhairs[3][0].color+'; '+xhairs[3][0].style+'; '+xhairs[3][0].vm+'"',
					'alias demoman_secondary   "'+xhairs[3][1].size+'; '+xhairs[3][1].color+'; '+xhairs[3][1].style+'; '+xhairs[3][1].vm+'"',
					'alias demoman_melee       "'+xhairs[3][2].size+'; '+xhairs[3][2].color+'; '+xhairs[3][2].style+'; '+xhairs[3][2].vm+'"',
					'',
					'//HEAVY',
					'alias heavy_primary       "'+xhairs[4][0].size+'; '+xhairs[4][0].color+'; '+xhairs[4][0].style+'; '+xhairs[4][0].vm+'"',
					'alias heavy_secondary     "'+xhairs[4][1].size+'; '+xhairs[4][1].color+'; '+xhairs[4][1].style+'; '+xhairs[4][1].vm+'"',
					'alias heavy_melee         "'+xhairs[4][2].size+'; '+xhairs[4][2].color+'; '+xhairs[4][2].style+'; '+xhairs[4][2].vm+'"',
					'',
					'//ENGINEER',
					'alias engineer_primary    "'+xhairs[5][0].size+'; '+xhairs[5][0].color+'; '+xhairs[5][0].style+'; '+xhairs[5][0].vm+'"',
					'alias engineer_secondary  "'+xhairs[5][1].size+'; '+xhairs[5][1].color+'; '+xhairs[5][1].style+'; '+xhairs[5][1].vm+'"',
					'alias engineer_melee      "'+xhairs[5][2].size+'; '+xhairs[5][2].color+'; '+xhairs[5][2].style+'; '+xhairs[5][2].vm+'"',
					'',
					'//MEDIC',
					'alias medic_primary       "'+xhairs[6][0].size+'; '+xhairs[6][0].color+'; '+xhairs[6][0].style+'; '+xhairs[6][0].vm+'"',
					'alias medic_secondary     "'+xhairs[6][1].size+'; '+xhairs[6][1].color+'; '+xhairs[6][1].style+'; '+xhairs[6][1].vm+'"',
					'alias medic_melee         "'+xhairs[6][2].size+'; '+xhairs[6][2].color+'; '+xhairs[6][2].style+'; '+xhairs[6][2].vm+'"',
					'',
					'//SNIPER',
					'alias sniper_primary      "'+xhairs[7][0].size+'; '+xhairs[7][0].color+'; '+xhairs[7][0].style+'; '+xhairs[7][0].vm+'"',
					'alias sniper_secondary    "'+xhairs[7][1].size+'; '+xhairs[7][1].color+'; '+xhairs[7][1].style+'; '+xhairs[7][1].vm+'"',
					'alias sniper_melee        "'+xhairs[7][2].size+'; '+xhairs[7][2].color+'; '+xhairs[7][2].style+'; '+xhairs[7][2].vm+'"',
					'',
					'//SPY',
					'alias spy_primary         "'+xhairs[8][0].size+'; '+xhairs[8][0].color+'; '+xhairs[8][0].style+'; '+xhairs[8][0].vm+'"',
					'alias spy_secondary       "'+xhairs[8][1].size+'; '+xhairs[8][1].color+'; '+xhairs[8][1].style+'; '+xhairs[8][1].vm+'"',
					'alias spy_melee           "'+xhairs[8][2].size+'; '+xhairs[8][2].color+'; '+xhairs[8][2].style+'; '+xhairs[8][2].vm+'"'
				].join('\n');
				zip.file("cfg/crosshairswitcher/settings.cfg", xhair_settings);
				zip.file("cfg/crosshairswitcher/shorten.cfg", urlToPromise("../make/cfg/class/crosshairswitcher/shorten.cfg"), {
					binary: true
				});
				zip.file("cfg/crosshairswitcher/switcher.cfg", urlToPromise("../make/cfg/class/crosshairswitcher/switcher.cfg"), {
					binary: true
				});
				zip.file("cfg/crosshairswitcher/weapons.cfg", urlToPromise("../make/cfg/class/crosshairswitcher/weapons.cfg"), {
					binary: true
				});

			}
			if (iswhat === "sourceres") {
				zip.file("addons/SourceRes.dll", urlToPromise("../make/addons/SourceRes/addons/SourceRes.dll"), {
					binary: true
				});
				zip.file("addons/SourceRes.vdf", urlToPromise("../make/addons/SourceRes/addons/SourceRes.vdf"), {
					binary: true
				});
			}
			if (iswhat === "prec") {
				zip.file("addons/PREC.cfg", urlToPromise("../make/addons/prec/addons/PREC.cfg"), {
					binary: true
				});
				zip.file("addons/PREC.dll", urlToPromise("../make/addons/prec/addons/PREC.dll"), {
					binary: true
				});
				zip.file("addons/PREC.vdf", urlToPromise("../make/addons/prec/addons/PREC.vdf"), {
					binary: true
				});
				zip.file("addons/readme_prec.txt", urlToPromise("../make/addons/prec/addons/readme_prec.txt"), {
					binary: true
				});
			}
			if (iswhat === "casting") {
				zip.file("addons/CastingEssentials.dll", urlToPromise("../make/addons/CastingEssentials/addons/CastingEssentials.dll"), {
					binary: true
				});
				zip.file("addons/CastingEssentials.vdf", urlToPromise("../make/addons/CastingEssentials/addons/CastingEssentials.vdf"), {
					binary: true
				});
				zip.file("materials/debug/debugfbtexture1.vmt", urlToPromise("../make/addons/CastingEssentials/materials/debug/debugfbtexture1.vmt"), {
					binary: true
				});
			}
			if (iswhat === "tweaks") {
				zip.file("cfg/tweaks/" + filename, urlToPromise(url), {
					binary: true
				});
				customs = customs + "exec tweaks/" + filename.slice(0, -4) + "\n";
			}
			if (iswhat === "bindscheck") {
				var i = 1;
				while (i <= room) {
					if (typeof $("#key" + i).val() !== 'undefined' && typeof $("#key" + i).val() !== 'undefined') {
						bindarr = bindarr + "\nbind " + $("#key" + i).val() + " " + $("#command" + i).val();
					}
					i++;
				}
			}

			if (iswhat === "tweaks_fastclass") {


				if ($("#crosshairswitcherid").is(':checked')) {
					zip.file("cfg/tweaks/fastclass.cfg", urlToPromise("../make/cfg/fastclass_cs.cfg"), {
						binary: true
					});
					customs = customs + "exec tweaks/fastclass.cfg\n";
				} else {
					zip.file("cfg/tweaks/fastclass.cfg", urlToPromise("../make/cfg/fastclass.cfg"), {
						binary: true
					});
					customs = customs + "exec tweaks/fastclass.cfg\n";
				}

			}
			zip.file('cfg/custom.cfg', '//Tweaks, custom settings, all the stuff usually goes here\n\n\n' + customs + '\n\n' + bindings + '\necho "------------- Thanks for using CFG.TF -------------"\necho "------------- Create your own custom config at https://cfg.tf -------------"'); //load custom tweaks and config

		});


		//building and downloading static configs
		zip.file("cfg/autoexec.cfg", "exec gfx\nexec binds\nexec settings\nexec network\nexec custom"); //autoexec
		zip.file("cfg/settings.cfg", "//General TF2 settings, like autoheal, min viewmodels, fastswitch, etc.\n\ntf_medigun_autoheal 1\ncl_autoreload 1\nhud_fastswitch 1\ntf_use_min_viewmodels " + minmodel + "\nr_drawviewmodel " + drawviewmodel + "\nfov_desired 90\nviewmodel_fov " + v_fov + "\nbindtoggle " + vmodelbind + " r_drawviewmodel\ncl_flipviewmodels " + fliptoggle + "\n\ntf_remember_activeweapon 1\ntf_remember_lastswitched 1\nsb_dontshow_maxplayer_warning 1\ntf_spectate_pyrovision 0\nviewmodel_fov_demo 75\n\ntf_dingalingaling " + hittoggle + "\ntf_dingalingaling_repeat_delay " + hitdelay + "\ntf_dingaling_pitchmindmg " + hitmin + " \ntf_dingaling_pitchmaxdmg " + hitmax + "\ntf_dingaling_lasthit " + killtoggle + "\ntf_dingaling_lasthit_volume " + killvol + "\ntf_dingaling_lasthit_pitchmindmg " + killmin + "\ntf_dingaling_lasthit_pitchmaxdmg " + killmax + "\n\n\ntf_training_has_prompted_for_training 1\ntf_training_has_prompted_for_offline_practice 1\ntf_training_has_prompted_for_forums 1\ntf_training_has_prompted_for_options 1\ntf_training_has_prompted_for_loadout 1\ntf_mvm_tabs_discovered 3\ntf_matchmaking_ticket_help 0\ntf_coach_request_nevershowagain 1\n\nhud_combattext " + comtoggle + "\nhud_combattext_batching " + battoggle + "\nhud_combattext_batching_window " + batwindow + "\n\nds_kill_delay 15.000000\nds_enable " + ds_mode + "\nds_dir " + ds_folder + "\nds_notify " + ds_notify + "\nds_sound " + ds_sound + "\nds_min_streak " + ds_ks + "\nds_autodelete " + ds_delete + "\nds_screens " + ds_screen); //settings
		zip.file("cfg/network.cfg", "//Connection settings\n\ncl_cmdrate " + cmdrate + "\ncl_interp " + interp + "\ncl_interp_ratio " + intratio + "\ncl_lagcompensation 1\ncl_pred_optimize 2\ncl_smooth 0\ncl_smoothtime 0.01\ncl_updaterate " + uprate + "\nrate " + rate + "\n"); //network
		zip.file("cfg/binds.cfg", "//stock non class-specific binds\n////Made with cfg.tf - custom Team Fortress 2 config generator\n\n" + bindarr); //binds


		// when everything has been downloaded, we can trigger the dl
		zip.generateAsync({
				type: "blob"
			}, function updateCallback(metadata) {
				var msg = "Packing : " + metadata.percent.toFixed(2) + " %";
				if (metadata.currentFile) {
					msg += ", current file = " + metadata.currentFile;
				}
				showMessage(msg);
				updatePercent(metadata.percent | 0);
			})
			.then(function callback(blob) {

				// see FileSaver.js
				saveAs(blob, "config.zip");

				showMessage("Done! Extract this archive to your /tf folder.");
			}, function(e) {
				showError(e);
			});

		return false;
	});


});
