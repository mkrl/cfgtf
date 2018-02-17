TFTrue
——————–

Description
———–
This plugin was originally created by Red Comet, and it allowed you to control Friendly Fire, Critical hits, Respawn time and Static Damage.
VALVe finally added CVars to control most of those features in the game, and TFTrue development was stopped.
The project was taken by AnAkkk, and TFTrue is currently aimed to be a competitive mod.

Installation
————
Create a directory in your tf folder of the SRCDS installation called addons (don’t worry if one already exists)
Copy all files from the addons folder of this archive into the addons folder of your server
An example directory would be orangebox/tf/addons/TFTrue.dll (or TFTrue.so if it’s a Linux server).
Restart the server and the plugin should automatically load.

CVars / CMDs
—–
Server:

tftrue_gamedesc
Server owners can use this cvar to set specific text in the game description of their server.
There is a 40 character max, and your text will appear after ‘TFTrue’

tftrue_freezecam
Enables/disables the freeze cam. Default is 1 (enabled).

tftrue_maxfov
Sets the maximum fov the players will be able to set with the “!fov” chat command. Default is 90.

tftrue_no_hats
Enables/disables hats. Default is 1 (hats disabled).

tftrue_no_misc
Enables/disables misc items. Default is 0 (misc items enabled).

tftrue_no_action
Enables/disables action items. Default is 0 (action items enabled).

tftrue_whitelist
Sets specific league item whitelists. This can be useful for public servers.
0: None
1: ETF2L 6on6
2: ETF2L 9on9
Default is 0.

tftrue_whitelist_id
Sets a whitelist id from whitelist.tf. If this is set, tftrue_whitelist is ignored. Default is -1 (disabled).

tftrue_tournament_config
Sets specific league configs. It will auto download the configs and execute them depending of the map type.
If you use this, you do not need to set tftrue_whitelist as mp_tournament_whitelist is already set in the league configs.
0: None
1: ETF2L 6on6
2: ETF2L 9on9
Default is 0.

tftrue_tv_delaymapchange
Delay the map change depending of tv_delay value when SourceTV is enabled. This way the spectators will not miss the end of the match.
You should use “changelevel” right after you finished the current map and the map will changes depending of tv_delay value.
A message will be printed in the chat every 30 seconds announcing in how much time the map will change. Default is 1 (enabled).

tftrue_tv_autorecord
Turn on auto STV recording when both teams are ready in tournament mode. It will stops when the win conditions are reached. Default is 1 (enabled).

tftrue_bunnyhop
Turn on/off bunny hopping. The opening speed of the doors will be changed to the max value as well to prevent yourself getting stuck while bunny hopping.
This also enables “pogo stick jumping”, so you can just hold down space to bunny hop. It will let you jump while ducking as well to make bunnyhopping easier. Default is 0 (disabled).

tftrue_tv_demos_path
Let you define a folder inside “tf” where you want the demos recorded by tftrue_tv_autorecord to be stored. The folder will be automatically created if the CVar is set.
They will be stored in “tf” by default.

tftrue_tv_prefix
Sets the prefix to add in the auto recorded demo names.

tftrue_unpause_delay
Sets the delay before someone can unpause the game after it has been paused. Default is 2.

tftrue_logs_apikey
Sets the API key to upload logs to logs.tf (requires mp_tournament). It will automatically “flush” the log before upload, so any content that is still in memory will be wrote to the log.

tftrue_logs_prefix
Sets the prefix to add in the log name when uploading to logs.tf.

tftrue_logs_roundend
Whether to upload logs at every round end or just when a team wins the map. Default is 0 (just when a team wins the map).

tftrue_restorestats
Keeps the player stats on disconnect (Score, Kills, Deaths, etc...) and restore them when he reconnects in both scoreboard and A2S_PLAYER queries (e.g. View Game Info in the Server Browser).
Default is 1 (enabled).

tftrue_logs_includebuffs
Includes buffs within the player_healed event in the logs.
Default is 1 (enabled).

tftrue_logs_accuracy
Log accuracy stats in the logs (shots fired/hit). It can potentially cause performance issues with some servers.
Default is 0 (disabled).

Client:

say !tftrue
In the chat, you can type !tftrue (or bind a key to say !tftrue), and it’ll display informations about the
TFTrue version and the current CVar values.

say !fov
In the chat, you can type !fov xxx, where xxx is a value between 75 and tftrue_maxfov. This will set your fov to this value.

say !speedmeter [on/off]
In the chat, you can type !speedmeter [on/off] while tftrue_bunnyhop is enabled, this will print your bunny hopping speed in the middle of your screen.

say !log
In the chat, you can type !log to view the last log which has been uploaded to logs.tf

setinfo tftrue_fov
Same as the chat command to set the fov, but you can set it in your config to automatically set the fov on server connection.
Example: setinfo tftrue_fov 130

Other Features:

- The map will now automatically be reloaded when sv_pure or tv_enable value is changed, as these CVars need a map change to work.
- While using rcon status/status, it will display the plugins currently loaded on the server (prevents server owners to cheat with plugins) when the tournament mode is enabled.
- Logs.tf support
- Tournament classlimits working without tournament mode (for pub servers)
- Tournament whitelists working without tournament mode (for pub servers)
- Changing mp_tournament_whitelist will automatically reload the whitelist without requiring mp_tournament_restart
- Console messages when allowing/removing whitelist items are removed to prevent spam
- You can enable sv_pure even if the server wasn't started with -sv_pure or +sv_pure
- You can write in the chat more than once when the game is paused
- Removes the block on plugin_load that prevents you from using it after a map has been loaded

NOTE: mp_tournament_whitelist will always be reset to TFTrue_item_whitelist.txt, this is perfectly normal.
TFTrue will generate a new whitelist based on the whitelist that was set through mp_tournament_whitelist + TFTrue settings.

Credits
—–
AnAkkk: Current TFTrue coder
Red Comet: Original TFTrue coder
Didrole: Retired coder (2.x)
your_name_here: For fixing the no random damage feature on Linux (2.x)
voogru: For help with the items (3.x)
Evil, GeaR, atreides, Nightbox, AnimaL, Arie, hocz, m0re and many more people: Testing the plugin
redLine-hosting/eSport-tools.net: Hosting the files
sk: Coding help

Version History
—————
4.6 ( August 14, 2014)
- Removed tftrue_scope_hsdelay
- Many improvements to the auto updater
- The auto updater will now check for updates every hour and update if the server has one player or less
- Fixed crash on plugin unload with some specific plugins
- Fixed crash when trying to change the map with the "map" command (never do this)
- Stop loading the plugin if anything fails, it prevents the plugin from crashing later while playing
- Fixed tftrue_restorestats keeping the stats after map changes

4.5 ( May 17, 2014 )
- Added tftrue_whitelist_id to set a whitelist from whitelist.tf
- The restriction on plugin_load added by the last TF2 update will be automatically removed for the auto updater to work correctly
- Fixed crashes after last TF2 update

4.4 ( February 1, 2014 )
- Support Logs.tf Spec v2.0 (Medic Stats, etc).
- Support Logs.tf Spec v2.1 (Weapon accuracies) with the tftrue_logs_accuracy cvar
- Changed download location for ETF2L whitelists to ETF2L site
- Added the plugin name to the “uploader” field for logs.tf
- Prevent from trying to upload the log twice when mp_winlimit is set (it fires twice the end round event)
- Added tftrue_tv_prefix to set a prefix to auto recorded STV demos
- Added etf2l_golden_cap.cfg to the list of configs to download

4.3 ( November 9, 2013 )
- Changed tftrue_tournament_config default to 0 to prevent unwanted download of config files on server start
- etf2l_custom.cfg will no longer be overwritten if it already exists
- Prevent endless mapchange loop due to sv_pure being set to a different value in server.cfg
- Added tftrue_restorestats to keep the player stats on disconnect (Score, Kills, Deaths, etc...) and restore them when he reconnects in both scoreboard and A2S_PLAYER queries (e.g. View Game Info in the Server Browser)

4.2 ( November 3, 2013 )
- Replaced tftrue_tournament_insecure and tftrue_tournament_mapconditions by tftrue_tournament_config
- Added a warning when tournament mode starts if sv_cheats is enabled 
- Added a warning when tournament mode starts if the download of any config files failed
- mp_tournament_whitelist will always be reset to TFTrue_item_whitelist.txt, this is perfectly normal.
TFTrue will generate a new whitelist based on the whitelist that was set through mp_tournament_whitelist + TFTrue settings.
- tftrue_whitelist now supports ETF2L 9on9
- sm_map will now work with tftrue_tv_delaymapchange
- Fixed log upload failing when the server would write to the log during the upload
- Fixed tftrue_bunnyhop not working anymore

4.1 ( September 5, 2013 )
- Fixed crashes and various problems after trying to load the plugin when it is already loaded
- Added the !log chat command to view the log in-game after it has been uploaded to logs.tf

4.0 ( June 2, 2013 )
- The whitelist system is now more efficient, it won't add tokens and other items that don't belong in the whitelist anymore
- Added tftrue_no_action to disable action items
- Added tftrue_whitelist to set a specific league whitelist, it replaces tftrue_unlockable_weapons which will be removed soon
- Console messages when allowing/removing whitelist items are removed to prevent spam
- sv_pure can now be enabled even if the server wasn't started with -sv_pure or +sv_pure

3.9 ( April 1, 2013 )
- Added tftrue_logs_apikey to set the API key for uploading logs to logs.tf (requires mp_tournament). It will automatically “flush” the log before upload, so any content that is still in memory will be wrote to the log
- Fixed a bug with the new item code which caused the whitelist to not be generated correctly
- More support for the upcoming SteamPipe update
- Minor bug fixes

3.8 ( February 1, 2013 )
- Rewrote the item code (tftrue_unlockable_weapons, tftrue_no_hats, tftrue_no_misc), it will now generate an item_whitelist file and set mp_tournament_whitelist to this whitelist
- New feature: mp_tournament_whitelist now works with mp_tournament 0
- Changing mp_tournament_whitelist will automatically reload the whitelist without requiring mp_tournament_restart
- Fixed a crash with tftrue_scope_hsdelay
- Reduced the size of the module on linux

3.7 ( August 29, 2012 )
- Disabled all tournament stuff under MvM as mp_tournament will always be 1, and it would cause cvars to be enforced, map change to be delayed, …
- Made the tf_tournament_classlimit_ cvars work without mp_tournament, can be useful on pub servers.
- Fixed a crash under some Windows servers.
	
3.6 ( June 28, 2012 )
- Added tftrue_unpause_delay to set the delay before someone can unpause the game after it has been paused
- Fixed tftrue_jumpducked crashing the server or preventing players from jumping after latest TF2 update
- Fixed tftrue_bunnyhop crashing the server after latest TF2 update

3.5 ( April 16, 2012 )
- Added tftrue_tournament_insecure to disable the forcing of CVars to league config values

3.4 ( April 12, 2012 )
- Added tftrue_tv_demos_path to specify a folder inside "tf" where you want your demos recorded by TFTrue to be stored
- Changed tftrue_unlockable_weapons 3 to allow the Original
- Changed demo names timestamps format from DD-MM-YYYY-HH-mm to YYYY-MM-DD-HH-mm

3.3 ( October 15, 2011 )
- Fixed all problems caused by the last TF2 update
- Fixed a crash on Windows which prevented TFTrue to work under some systems
- Modified tftrue_unlockable_weapons:
0: Allow all unlockables weapons
1: Allow the Blutsauger, the Kritzkrieg and the Ubersaw
2: Allow the Blutsauger, the Kritzkrieg, the Ubersaw and the Original
3: Allow the Blutsauger, the Kritzkrieg, the Ubersaw, and the Crusaders Crossbow.
- Added tftrue_scope_hsdelay to remove the Sniper Rifle 200ms headshot delay when scoping

3.2 ( August 15, 2011 )
- Added tftrue_bunnyhop to enable bunny hopping
- Added the ability to jump while ducked, useful for bunny hopping
- Added the !speedmeter chat command which prints your speed in the middle of your screen if bunny hopping is enabled
- Removed mp_disable_respawn_times from the list of protected cvars
- Fixed tftrue_unlockable_weapons not giving you new weapons if you are taunting while the cvar value is changed
- Fixed tftrue_unlockable_weapons not removing the Sniper and Demoman shields

3.1 ( August 02, 2011 )
- Changed tftrue_tv_delaymapchange to only work when tournament mode is enabled
- Added TF2Logs.com support
- Fixed tftrue_tournament_mapconditions not always working correctly with some game types

3.078 ( July 01, 2011 )
- The Auto Updater should now be more resistant to future updates
- Fixed tftrue_unlockable_weapons not working correctly after one of the last updates
- Fixed a crash with the Auto Updater on Linux
- Removed !plugins. The plugins will now show up when typing "status" in the console
- Fixed the CVars/STV being reported incorrectly on Linux servers while querying the server infos (Source Engine bug)
- Fixed a case where tftrue_tv_autorecord would record a demo with the wrong team names

3.0 ( March 06, 2011 )
- Removed tftrue_soldier_selfdamage, tftrue_tdh_mode, and tftrue_equalizer_damagebuff
- Added tftrue_no_hats to disable hats
- Added tftrue_no_misc to disable misc items
- Added tftrue_unlockable_weapons to control which unlockables weapons to allow
- Added tftrue_tournament_safe to force the server cvars to league values when mp_tournament is enabled
- Added tftrue_tournament_mapconditions to automatically set the correct map conditions (winlimit/timelimit/windifference/maxrounds) based on the map type when mp_tournament is enabled
- Added tftrue_tv_delaymapchange to delay the map change when the SourceTV is enabled
- Added the !plugins chat command to display the current plugins loaded on the server
- The map will now automatically be reloaded when sv_pure or tv_enable value is changed
- Added auto updater

2.8 ( January 16, 2010 )
- Changed tftrue_tdh_minicrits to tftrue_tdh_mode. Values are 0 (normal), 1 (no mini-crits) and 2 (no 25% damage buff)

2.7a ( January 14, 2010 )
- Fixed tftrue_tdh_minicrits after TF2 update

2.7 ( January 10, 2010 )
- Removed tftrue_hitbeeps, tftrue_hitbeeps_pitch and say !hitbeeps since VALVe added a hitbeeps feature to the game
- Fixed tftrue_soldier_selfdamage to work with TDH
- Added tftrue_tdh_minicrits to turn on/off TDH mini-crits on airbone targets
- Added tftrue_equalizer_damagebuff to turn on/off the damage buff depending on health

2.6a ( October 24, 2009 )
- Fixed hit beeps playing on ubered people

2.6 ( August 26, 2009 )
- Removed tickrate changing, it would just cause issues with doors/trains and if we fixed that, it would causes issues with grenades/sticky bombs speed.

2.5a ( August 14, 2009 )
- Fixed !fov crashing the server

2.5 ( August 13, 2009 )
- Re added tftrue_soldier_selfdamage
- Added tftrue_hitbeeps_pitch to modify the pitch of the hit beeps sound

2.4 ( August 12, 2009 )
- Removed tftrue_soldier_self_damage because it would crash the server since an update (and it is possible that VALVe modify the self damage themselves soon)
- Added tftrue_hitbeeps to allows/disallows the players to use the "!hitbeeps on" chat command to enable hit beeps
- Added tftrue_maxfov to set the maximum fov using the "!fov" chat command
- Added the !fov and !hitbeeps on/off chat commands
- Added tickrate.txt file to change the server tickrate

2.3 ( February 4, 2009 )
- Removed tftrue_no_random_damage, it was added in a TF2 update as tf_damage_disablespread (Thanks VALVe!)
- Fixed tftrue_soldier_selfdamage crashing servers
- Fixed the rocket "propulsion force" when modifying tftrue_soldier_selfdamage

2.2 ( January 4, 2009 )
- Added tftrue_soldier_selfdamage which is the coefficient for soldier self damage

2.1 ( January 2, 2009 )
- Added tftrue_freezecam to enable/disable the freeze cam

2.0 ( December 29, 2008 )
- Removed Critical hits, Friendly fire, and respawn cvars
- Fixed the no random damage code
- Added a chat command !tftrue to display informations about the plugin settings