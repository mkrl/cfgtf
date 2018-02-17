/* global jQuery, JSZip, JSZipUtils, saveAs, room */

jQuery(function($) {
	'use strict';

	var Promise = window.Promise;
	if (!Promise) {
		Promise = JSZip.external.Promise;
	}

	/**
	 * Reset the message.
	 */
	var resetMessage = function() {
		$('#result')
			.removeClass()
			.text('');
	};
	/**
	 * show a successful message.
	 * @param {String} text the text to show.
	 */
	var showMessage = function(text) {
		resetMessage();
		$('#result')
			.addClass('alert alert-success')
			.text(text);
	};
	/**
	 * show an error message.
	 * @param {String} text the text to show.
	 */
	var showError = function(text) {
		resetMessage();
		$('#result')
			.addClass('alert alert-danger')
			.text(text);
	};
	/**
	 * Update the progress bar.
	 * @param {Integer} percent the current percent
	 */
	var updatePercent = function(percent) {
		$('#progress_bar').removeClass('hide')
			.find('.progress-bar')
			.attr('aria-valuenow', percent)
			.css({
				width: percent + '%'
			});
	};

	/**
	 * Fetch the content and return the associated promise.
	 * @param {String} url the url of the content to fetch.
	 * @return {Promise} the promise containing the data.
	 */
	var urlToPromise = function(url) {
		return new Promise(function(resolve, reject) {
			JSZipUtils.getBinaryContent(url, function(err, data) {
				if (err) {
					reject(err);
				}
				else {
					resolve(data);
				}
			});
		});
	};

	var surround = function(a, x, b) {
		if (x !== '') return (a == null ? '' : a)+x+(b == null ? '' : b);
		return x;
	};

	if (!JSZip.support.blob) {
		showError('This only works with a good browser!');
		return;
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





	$('#download_form').on('submit', function() {
		resetMessage();

		//An array of zip files that should be inclided.
		var zippies = [];

		var zip = new JSZip();
		var zipbin = function(src, dest) {
			zip.file(dest, urlToPromise(src), {binary: true});
		};

		var customs = ''; //a var to store all the extra stuff to add to autoexec

		//getting values form inputs
		// !!!!IMPORTANT!!!! All the selectable html fields (non-text forms) should have data-name and data-url attributes or everything breaks

		//viewmodel settings
		var drawviewmodel = $('#modeltoggle').is(':checked');
		var minmodel = $('#minmodtoggle').is(':checked');
		var vm_flip = $('#fliptoggle').is(':checked');
		var v_fov = $('#v_fov').val();
		var vmodelbind = $('#vmodelbind').val();

		//combat text settings
		var dn              = $('#comtoggle').is(':checked');
		var dn_batching     = $('#battoggle').is(':checked');
		var dn_batching_win = $('#batwindow').val();

		var ding        = $('#hittoggle').is(':checked');
		var ding_volume = $('#hitvol').val();
		var ding_min    = $('#hitmin').val();
		var ding_max    = $('#hitmax').val();
		var ding_delay  = $('#hitdelay').val();

		var ding_kill        = $('#killtoggle').is(':checked');
		var ding_kill_volume = $('#killvol').val();
		var ding_kill_min    = $('#killmin').val();
		var ding_kill_max    = $('#killmax').val();

		//network
		var cmdrate = $('#cmdrate').val();
		var interp = $('#interp').val();
		var intratio = $('#intratio').val();
		var uprate = $('#uprate').val();
		var rate = $('#rate').val();
		var cl_smooth = $('#cl_smooth').val();

		//demo support
		var ds_del    = $('#ds_delete').is(':checked');
		var ds_screen = $('#ds_screen').is(':checked');

		var ds_mode   = $('#ds_mode').val();
		var ds_dir    = $('#ds_folder').val();
		var ds_notify = $('#ds_notify').val();
		var ds_snd    = $('#ds_sound').val();
		var ds_ks     = $('#ds_ks').val();

		// forced gfx settings
		var gfx_force_mode = $('#gfx_force_settings_cb').is(':checked');
		var gfx_force_eyes = $('#gfx_force_eyes').is(':checked');
		var gfx_force_ragdolls = $('#gfx_force_ragdolls').is(':checked');
		var gfx_force_gib = $('#gfx_force_gib').is(':checked');
		var gfx_force_shadows = $('#gfx_force_shadows').is(':checked');
		var gfx_force_glow = $('#gfx_force_glow').is(':checked');
		var gfx_force_sprays = $('#gfx_force_sprays').is(':checked');
		var gfx_nohats_enabled = $('#nohats_checkbox').is(':checked')

		//get custom binds
		var bindings = $('#bindings').val();
		var bindings_scout = $('#bindings_scout').val();
		var bindings_soldier = $('#bindings_soldier').val();
		var bindings_pyro = $('#bindings_pyro').val();
		var bindings_demo = $('#bindings_demo').val();
		var bindings_heavy = $('#bindings_heavy').val();
		var bindings_engineer = $('#bindings_engineer').val();
		var bindings_medic = $('#bindings_medic').val();
		var bindings_sniper = $('#bindings_sniper').val();
		var bindings_spy = $('#bindings_spy').val();

		//medigun check bind key
		var medicheckbind = $('#medicheckbind').val();


		//getting switcher values (if selected)

		var xhair = $('#crosshairswitcherid').is(':checked');
		var xhairs = [];
		if (xhair)
			for (var c = 1; c < 10; ++c) {
				xhairs[c-1] = [];
				for (var s = 1; s < 4; ++s) {
					var cross = $('#cs_col_'+c+'_'+s).val();

					var vm = 'off';
					if ($('#cs_draw_'+c+'_'+s).is(':checked')) {
						vm = $('#cs_fov_'+c+'_'+s).val() + '; tf_use_min_viewmodels ';
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


		var bindarr = '';
		var scout_switcher = '';
		var soldier_switcher = '';
		var pyro_switcher = '';
		var demo_switcher = '';
		var heavy_switcher = '';
		var engineer_switcher = '';
		var medic_switcher = '';
		var sniper_switcher = '';
		var spy_switcher = '';

		// find every checked item
		$(this).find(':checked').each(function() {
			var $this = $(this);
			var url = $this.data('url');
			var iswhat = $this.data('name');
			var filename = url.replace(/.*\//g, '');
			if (iswhat === 'gfx')
				zipbin(url, 'cfg/gfx.cfg');
			if (iswhat === 'scripts')
				zipbin(url, 'custom/runfasterpls/scripts/' + filename);
			if (iswhat === 'hitsound')
				zipbin(url, 'custom/damage/sound/ui/hitsound.wav');
			if (iswhat === 'killsound')
				zipbin(url, 'custom/damage/sound/ui/killsound.wav');
			if (iswhat === 'vpks')
				if ($this.attr('name') === 'nohats') {
					if (gfx_nohats_enabled && $this.val() != 'off') {
						zipbin(url, 'custom/' + filename);
					}
				} else {
					zipbin(url, 'custom/' + filename);
				}
			if (iswhat === 'configs')
				zipbin(url, 'cfg/' + filename);
			if (iswhat === 'crosshairswitcher') {
				zipbin('../make/cfg/class/demoplayback.cfg', 'cfg/demoplayback.cfg');
				zipbin('../make/cfg/class/insourcetv.cfg', 'cfg/insourcetv.cfg');
				zipbin('../make/cfg/class/CROSSHAIRSWITCHER-INSTRUCTIONS.txt', 'cfg/CROSSHAIRSWITCHER-INSTRUCTIONS.txt');
				zipbin('../make/cfg/class/crosshairswitcher/binds.cfg', 'cfg/crosshairswitcher/binds.cfg');
				zipbin('../make/cfg/class/crosshairswitcher/crosshairs.cfg', 'cfg/crosshairswitcher/crosshairs.cfg');
				zipbin('../make/cfg/class/crosshairswitcher/defaultcrosshair.cfg', 'cfg/crosshairswitcher/defaultcrosshair.cfg');
				zipbin('../make/cfg/class/crosshairswitcher/disable.cfg', 'cfg/crosshairswitcher/disable.cfg');
				scout_switcher += '//crosshair switcher\nexec crosshairswitcher/switcher; scout';
				soldier_switcher += '//crosshair switcher\nexec crosshairswitcher/switcher; soldier';
				pyro_switcher += '//crosshair switcher\nexec crosshairswitcher/switcher; pyro';
				demo_switcher += '//crosshair switcher\nexec crosshairswitcher/switcher; demoman';
				heavy_switcher += '//crosshair switcher\nexec crosshairswitcher/switcher; heavy';
				engineer_switcher += '//crosshair switcher\nexec crosshairswitcher/switcher; engineer';
				medic_switcher += '//crosshair switcher\nexec crosshairswitcher/switcher; medic';
				sniper_switcher += '//crosshair switcher\nexec crosshairswitcher/switcher; sniper';
				spy_switcher += '//crosshair switcher\nexec crosshairswitcher/switcher; spy';
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
				zip.file('cfg/crosshairswitcher/settings.cfg', xhair_settings);
				zipbin('../make/cfg/class/crosshairswitcher/shorten.cfg', 'cfg/crosshairswitcher/shorten.cfg');
				zipbin('../make/cfg/class/crosshairswitcher/switcher.cfg', 'cfg/crosshairswitcher/switcher.cfg');
				zipbin('../make/cfg/class/crosshairswitcher/weapons.cfg', 'cfg/crosshairswitcher/weapons.cfg');

			}
			if (iswhat === 'sourceres') {
				zipbin('../make/addons/SourceRes/addons/SourceRes.dll', 'addons/SourceRes.dll');
				zipbin('../make/addons/SourceRes/addons/SourceRes.vdf', 'addons/SourceRes.vdf');
			}
			if (iswhat === 'hud') {
				zippies.push(url); //new stuff
			}
			if (iswhat === 'prec') {
				zipbin('../make/addons/prec/addons/PREC.cfg', 'addons/PREC.cfg');
				zipbin('../make/addons/prec/addons/PREC.dll', 'addons/PREC.dll');
				zipbin('../make/addons/prec/addons/PREC.vdf', 'addons/PREC.vdf');
				zipbin('../make/addons/prec/addons/readme_prec.txt', 'addons/readme_prec.txt');
			}
			if (iswhat === 'casting') {
				zipbin('../make/addons/CastingEssentials/addons/CastingEssentials.dll', 'addons/CastingEssentials.dll');
				zipbin('../make/addons/CastingEssentials/addons/CastingEssentials.vdf', 'addons/CastingEssentials.vdf');
				zipbin('../make/addons/CastingEssentials/materials/debug/debugfbtexture1.vmt', 'materials/debug/debugfbtexture1.vmt');
			}
			if (iswhat === 'tweaks') {
				zipbin(url, 'cfg/tweaks/' + filename);
				customs += 'exec tweaks/' + filename.slice(0, -4) + '\n';
			}
			if (iswhat === 'medicheck') {
				var medichecksettings = [
					'//Medigun check script',
					'//Made with cfg.tf - custom Team Fortress 2 config generator',
					'',
					'alias medcheck medcheck1',
					'alias medcheck1 "join_class spy; alias medcheck medcheck2"',
					'alias medcheck2 "disguise 5 -1; slot2; alias medcheck medcheck3"',
					'alias medcheck3 "lastdisguise; alias medcheck medcheck4"',
					'alias medcheck4 "originalclass"',
					'',
					'bind '+medicheckbind+' medcheck',
					'',
					'alias orig_scout "alias originalclass "join_class scout""',
					'alias orig_soldier "alias originalclass "join_class soldier""',
					'alias orig_pyro "alias originalclass "join_class pyro""',
					'alias orig_demoman "alias originalclass "join_class demoman""',
					'alias orig_heavyweapons "alias originalclass "join_class heavyweapons""',
					'alias orig_engineer "alias originalclass "join_class engineer""',
					'alias orig_medic "alias originalclass "join_class medic""',
					'alias orig_sniper "alias originalclass "join_class sniper""'
				].join('\n');
				zip.file('cfg/medicheck.cfg', medichecksettings);
				scout_switcher += '\n\n//medigun checker script\nexec medicheck; orig_scout\n\n';
				soldier_switcher += '\n\n//medigun checker script\nexec medicheck; orig_soldier\n\n';
				pyro_switcher += '\n\n//medigun checker script\nexec medicheck; orig_pyro\n\n';
				demo_switcher += '\n\n//medigun checker script\nexec medicheck; orig_demoman\n\n';
				heavy_switcher += '\n\n//medigun checker script\nexec medicheck; orig_heavyweapons\n\n';
				engineer_switcher += '\n\n//medigun checker script\nexec medicheck; orig_engineer\n\n';
				medic_switcher += '\n\n//medigun checker script\nexec medicheck; orig_medic\n\n';
				sniper_switcher += '\n\n//medigun checker script\nexec medicheck; orig_sniper\n\n';


			}
			if (iswhat === 'bindscheck') {
				var i = 1;
				while (i <= room) {
					if (typeof $('#key' + i).val() !== 'undefined' && typeof $('#key' + i).val() !== 'undefined') {
						bindarr = bindarr + '\nbind ' + $('#key' + i).val() + ' ' + $('#command' + i).val();
					}
					i++;
				}
			}

			if (iswhat === 'tweaks_fastclass') {
				var src = '../make/cfg/fastclass'+(xhair?'_cs':'')+'.cfg';
				zipbin(src, 'cfg/tweaks/fastclass.cfg');
				customs += 'exec tweaks/fastclass\n';
			}

			var custom = [
				'//tweaks and custom settings',
				'//Made with cfg.tf - custom Team Fortress 2 config generator',
				surround('\n', customs, '///---\n')+
				surround('\n', bindings, '\n///---\n'),
				'//shameless promotion',
				'echo "-----             Thanks for using CFG.TF             -----"',
				'echo "----- Create your own custom config at https://cfg.tf -----"'
			].join('\n');
			zip.file('cfg/custom.cfg', custom);

		});

		//building and downloading static configs
		var autoexec = [
			'//autoexec',
			'//Made with cfg.tf - custom Team Fortress 2 config generator',
			'',
			'exec gfx',
			'exec binds',
			'exec settings',
			'exec network',
			'exec custom'
		].join('\n');
		var settings = [
			'//tf2 settings',
			'//Made with cfg.tf - custom Team Fortress 2 config generator',
			'',
			'//Autoheal, min viewmodels, fastswitch etc.',
			'',
			'con_enable 1',
			'developer 0',
			'///---',
			'',
			'fov_desired 90',
			'viewmodel_fov '+v_fov,
			'viewmodel_fov_demo 75',
			surround('\n', [
				!xhair && !drawviewmodel ? 'r_drawviewmodel 0\n'       : '',
				!xhair &&  minmodel      ? 'tf_use_min_viewmodels 1\n' : '',
				vm_flip ? 'cl_flipviewmodels 1\n' : ''
			].join('')),
			'bindtoggle '+vmodelbind+' r_drawviewmodel',
			'///---',
			'',
			'hud_medicautocallers 1',
			'// 100 - 20.5*2 (2 small first aid kits)',
			'hud_medicautocallersthreshold 59',
			'tf_medigun_autoheal 1',
			'///---',
			surround('\n', [
				!dn                ? 'hud_combattext 0\n'                                   : '',
				 dn && dn_batching ? 'hud_combattext_batching 1\n'                          : '',
				 dn && dn_batching ? 'hud_combattext_batching_window '+dn_batching_win+'\n' : '',
			].join(''), '///---'),
			surround('',
				surround('\n', [
					ding ? 'tf_dingalingaling 1\n'                            : '',
					ding ? 'tf_dingalingaling_repeat_delay '+ding_delay +'\n' : '',
					ding ? 'tf_dingaling_volume '           +ding_volume+'\n' : '',
					ding ? 'tf_dingaling_pitchmindmg '      +ding_min   +'\n' : '',
					ding ? 'tf_dingaling_pitchmaxdmg '      +ding_max   +'\n' : '',
				].join('')) +
				surround('\n', [
					ding_kill ? 'tf_dingalingaling_lasthit 1\n'                           : '',
					ding_kill ? 'tf_dingaling_lasthit_volume '     +ding_kill_volume+'\n' : '',
					ding_kill ? 'tf_dingaling_lasthit_pitchmindmg '+ding_kill_min   +'\n' : '',
					ding_kill ? 'tf_dingaling_lasthit_pitchmaxdmg '+ding_kill_max   +'\n' : '',
				].join('')), '///---'),
			'',
			'tf_remember_activeweapon 1',
			'tf_remember_lastswitched 1',
			'///---',
			surround('\n', [
				ds_mode !== 0 ? 'ds_enable '+ds_mode+'\n' : '',
				'ds_dir '       +ds_dir   +'\n',
				'ds_notify '    +ds_notify+'\n',
				'ds_sound '     +ds_snd   +'\n',
				'ds_min_streak '+ds_ks    +'\n',
				ds_del    ? 'ds_autodelete 1\n' : '',
				ds_screen ? 'ds_screens 1\n' : ''
			].join(''), '///---'),
			surround('\n', [
				gfx_force_mode ? '///--- forced graphics settings enabled\n' : '',
				gfx_force_mode && gfx_force_eyes ? '///--- facial features\nr_eyes 1\nr_flex 1\nr_lod 1\nr_rootlod 1\nr_teeth 1\n' : '',
				gfx_force_mode && gfx_force_ragdolls ? '///--- ragdolls\ncl_ragdoll_fade_time 15\ncl_ragdoll_forcefade 0\ncl_ragdoll_physics_enable 1\ng_ragdoll_fadespeed 600\ng_ragdoll_lvfadespeed 100\nragdoll_sleepaftertime "5.0f"\n' : '',
				gfx_force_mode && gfx_force_gib ? '///--- gibs\ncl_phys_props_enable 1\ncl_phys_props_max 128\nprops_break_max_pieces -1\nr_propsmaxdist 1000\nviolence_agibs 1\nviolence_hgibs 1\n' : '',
				gfx_force_mode && gfx_force_shadows ? '///---shadows \nmat_shadowstate 1\nr_shadowmaxrendered 11\nr_shadowrendertotexture 1\nr_shadows 1\nnb_shadow_dist 400\n' : '',
				gfx_force_mode && gfx_force_glow ? '///--- glow outline\nglow_outline_effect_enable 1\n' : '',
				gfx_force_mode && gfx_force_sprays ? '///--- sprays\ncl_playerspraydisable 0\nr_spray_lifetime 2\n' : '',
			].join(''), '///---'),
			'',
			'cl_training_class_unlock_all',
			'// > Bitfield representing what classes have been used to complete training.',
			'// 111 111 111',
			'cl_training_completed_with_classes 511',
			'',
			'tf_training_has_prompted_for_forums 1',
			'tf_training_has_prompted_for_loadout 1',
			'tf_training_has_prompted_for_offline_practice 1',
			'tf_training_has_prompted_for_options 1',
			'tf_training_has_prompted_for_training 1',
			'',
			'tf_explanations_backpackpanel 1',
			'tf_explanations_charinfo_armory_panel 1',
			'tf_explanations_charinfopanel 1',
			'tf_explanations_craftingpanel 1',
			'tf_explanations_discardpanel 1',
			'tf_explanations_store 1',
			'',
			'tf_show_preset_explanation_in_class_loadout 0',
			'tf_show_taunt_explanation_in_class_loadout 0',
			'',
			'tf_casual_welcome_hide_forever 1',
			'tf_comp_welcome_hide_forever 1',
			'tf_matchmaking_ticket_help 0',
			'tf_show_maps_details_explanation_count 0',
			'',
			'cl_ask_blacklist_opt_out 1',
			'cl_ask_favorite_opt_out 1',
			'',
			'sb_dontshow_maxplayer_warning 1',
			'cl_hud_playerclass_playermodel_showed_confirm_dialog 1',
			'tf_mvm_tabs_discovered 3',
			'tf_coach_request_nevershowagain 1',
			'///---',
			'',
			'cl_autoreload 1',
			'm_rawinput 1',
			'hud_fastswitch 1',
			'tf_scoreboard_ping_as_text 1'
		].join('\n');
		var network = [
			'//network settings',
			'//Made with cfg.tf - custom Team Fortress 2 config generator',
			'',
			'cl_updaterate ' + uprate,
			'cl_cmdrate ' + cmdrate,
			'rate ' + rate,
			'',
			'cl_interp ' + interp,
			'cl_interp_ratio ' + intratio,
			'',
			'cl_smooth ' + cl_smooth,
			''
		].join('\n');
		//general custom binds
		var binds = [
			'//stock non class-specific binds',
			'//Made with cfg.tf - custom Team Fortress 2 config generator',
			'',
			bindarr
		].join('\n');
		//class binds
		var binds_scout = [
					'//scout settings',
					'//Made with cfg.tf - custom Team Fortress 2 config generator',
					'',
					'exec binds',
					'',
					bindings_scout,
					'',
					'',
					scout_switcher
				].join('\n');
		var binds_soldier = [
					'//soldier settings',
					'//Made with cfg.tf - custom Team Fortress 2 config generator',
					'',
					'exec binds',
					'',
					bindings_soldier,
					'',
					'',
					'',
					soldier_switcher
				].join('\n');
		var binds_pyro = [
					'//pyro settings',
					'//Made with cfg.tf - custom Team Fortress 2 config generator',
					'',
					'exec binds',
					'',
					bindings_pyro,
					'',
					'',
					pyro_switcher
				].join('\n');
		var binds_demo = [
					'//demoman settings',
					'//Made with cfg.tf - custom Team Fortress 2 config generator',
					'',
					'exec binds',
					'',
					bindings_demo,
					'',
					'',
					demo_switcher
				].join('\n');
		var binds_heavy = [
					'//heavy settings',
					'//Made with cfg.tf - custom Team Fortress 2 config generator',
					'',
					'exec binds',
					'',
					bindings_heavy,
					'',
					'',
					heavy_switcher
				].join('\n');
		var binds_engineer = [
					'//engineer settings',
					'//Made with cfg.tf - custom Team Fortress 2 config generator',
					'',
					'exec binds',
					'',
					bindings_engineer,
					'',
					'',
					engineer_switcher
				].join('\n');
		var binds_medic = [
					'//medic settings',
					'//Made with cfg.tf - custom Team Fortress 2 config generator',
					'',
					'exec binds',
					'',
					bindings_medic,
					'',
					'',
					medic_switcher
				].join('\n');
		var binds_sniper = [
					'//sniper settings',
					'//Made with cfg.tf - custom Team Fortress 2 config generator',
					'',
					'exec binds',
					'',
					bindings_sniper,
					'',
					'',
					sniper_switcher
				].join('\n');
		var binds_spy = [
					'//spy settings',
					'//Made with cfg.tf - custom Team Fortress 2 config generator',
					'',
					'exec binds',
					'',
					bindings_spy,
					'',
					'',
					spy_switcher
				].join('\n');

		zip.file('cfg/autoexec.cfg', autoexec);
		zip.file('cfg/settings.cfg', settings);
		zip.file('cfg/network.cfg', network);
		zip.file('cfg/binds.cfg', binds);

		zip.file('cfg/scout.cfg', binds_scout);
		zip.file('cfg/soldier.cfg', binds_soldier);
		zip.file('cfg/pyro.cfg', binds_pyro);
		zip.file('cfg/demoman.cfg', binds_demo);
		zip.file('cfg/heavyweapons.cfg', binds_heavy);
		zip.file('cfg/engineer.cfg', binds_engineer);
		zip.file('cfg/medic.cfg', binds_medic);
		zip.file('cfg/sniper.cfg', binds_sniper);
		zip.file('cfg/spy.cfg', binds_spy);

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
