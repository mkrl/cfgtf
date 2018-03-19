# Contributing to cfg.tf

The project may look nice on the outside, but whoever wants to sacrifice the time and efforts - behold the terrible code style! 

## General directions of possible contributions:

- Code cleanup. Wrapping repetitive things into functions, making the code easier to read or using best practicies.
- Working on the todos from the [Discord server](https://discord.gg/79cbsTu). The `#todo` channel is public. If the feature or bug is not marked with the green checkmark emote - feel free to open an issue and submit a pull request.
- Working on active issues from the repo issue tracker. Comment on an issue if you want to be assigned to it.
- Proposing new features.
- Implementing new features.

## Contribution process

1. Fork the repository. 
2. If you are working on a new feature or a bug fix - open an issue.
3. Create new branch from `master`. This step can be skipped if you are working on a simple code cleanup. In this case feel free to commit directly to `master`
4. Squashing commits is not mandatory, but please try not to make 100 tiny commits fixing 2 lines of code each.
5. Once you're done - make sure that everything works. 
6. Open a pull request.

## Any contributions you make will be under the MIT Software License
In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Pretty self-explanatory.


## General application structure

This application is using Jekyll as a static site engine. The usage and build process will not be covered in this guide - take a look at the [official documentation](https://jekyllrb.com/docs/home/) instead, it is very simple and clean.

Core application components:

- Layouts and style templates
  - The `_layouts` folder has the basic layouts that wrap around static pages located in the root folder. Usually remain unchanged.
  - `css` folder. Self-explanatory. Please do not modify vendor files like `bootstrap.scss` or `_bootswatch.css`, they are being served from CDN anyway. Make your changes in `main.css` instead.
  - Posts folder that should not be touched by anyone but the project maintainer.
- The "backend" part - `js` folder.
  - Each generator (client, server, crosshair, etc.) has its' own processing file called `downloader-[name].js`. For the client generator it is just `downloader.js`. Those files are responsible for collecting form inputs and packing all the files into a zip archive.
  - `utility.js` is a file that is being loaded on every page of the site. It maintains cookies, loaders, showing/hiding forms depending on a certain condition, lazy loading, updating dxlevel/connect string/etc.
- Images folder. Please try to keep images for new features in a separate folder instead of root of `/img/`. For new configs - see the benchmarking screenshot instructions. All the config screenshots should be held in `cfg` folder.
- Site section directories. Each service or generator provided by the site contains the HTML itself (in the project root folder) and generator/service files located in the subfolders with corresponding names. For articles it is `/read/[article]`, for tools it is `/tools/[name]`, etc. Please keep all the static files like cfgs or specific assets within their folders.
- `_data` folder that has variables and site navigation partials. If you are adding a new feature - don't forget it add it to the navigation file.

## How it (usually) works 

Every generator is a very large HTML <form> with a collection of fields with various attributes.
Every field usually has a `data-name` and `data-url` attributes. `data-name` is being used to find out what type of the resource is being selected - gfx config, custom script, vpk file, mod or anything else. `data-url` contains a relative URL of the resource that will be included in the final archive.
Usually, if you want to add new features - take a look at the part of the downloader script that starts with `$('#download_form').on('submit', function() {`. This is where we start collecting data from inputs and processing all the types of the resources.
Later on after we collected all the text inputs, the `$(this).find(':checked').each(function() {` part loops through checkboxes and radio buttons on the form. Within the loop, you can get the resource type by comparing `iswhat` variable with something you need (remember the data-name?). data-url can be retrieved from the `url` variable.
In the next part we write basic configs into variables, using previously collected user input when necessary. The `zip.file('path/to/file_inside_archive.cfg', file_contents);` function adds files into the archive. `zipbin('path/to/file_inside_archive.cfg', 'path/to/binary_file.vpk');`  is the same function but used for adding binaries to the archive.
And finally, the last part - triggering the dl. Nesting promisies for merged archives (not currently in use so no documentation yet), updating the progress bar - this usually remains unchanged because it works just fine.