function splitLines(binds, limit) {
    // Init vars.
    var start = 0;
    var lastTry = 0;
    var out = [];
    var sliceTest;

    for (var end = 0; end < binds.length; end++) {
        var c = binds[end];
        // Splits the long strings into segments that will not break the line
        // limit of Source game chat (127 characters). Also, this will split
        // by using newlines for varied chat spamming.
        if (c == " " || c == "\n" || end == binds.length - 1) {
            testStr = binds.slice(start, end);  // String segment.
            if (end == binds.length - 1) {
                // Test what we're adding is empty.
                sliceTest = binds.slice(start);
                if (/\S/.test(sliceTest)) {
                    out.push(sliceTest);
                }
            } else if (testStr.length > limit) {
                // First we need to test if what we're adding is empty.
                sliceTest = binds.slice(start, lastTry);
                if (/\S/.test(sliceTest)) {
                    out.push(sliceTest);
                }
                start = lastTry + 1;
            } else if (c == "\n") {
                // End early when newline is reached.
                // Yet again test what we're adding is empty.
                sliceTest = binds.slice(start, end);
                if (/\S/.test(sliceTest)) {
                    out.push(binds.slice(start, end));
                }
                start = end + 1;
            } else {
                // Keep going until a terminal condition, e.g.: long enough.
                lastTry = end;
            }
        } else if (end - lastTry >= 127) {
            return [];  // Exit w/ err: single word exceeds 127 chars.
        }
    }
    return out;
}


function memewriter(key, input, limit, comments, aliasName, cycleName) {
    // Init vars.
    // Split into array so we can pass it through.
    var bindList = splitLines(input, limit);
    var out = "";
    var suffix = 0;
    
    // Check if there is an error before we even begin.
    if (bindList.length == 0) {
        return "Error in input. Word limit is 127 chars before a space.";
    }

    // Write first bind.
    if (comments) {
        out = out.concat("// ------------------------------------------\n");
        out = out.concat("// -- 	cfg.tf bind rotation generator	 --\n");
        out = out.concat("// ------------------------------------------\n\n");
    }
    out = out.concat("bind ", key, " ", cycleName, "\n\n");
    // Write the bind references.
    if (comments) {
        out = out.concat("// Bind references are called in the latter half " +
                         "of the script to keep it shorter.\n\n");
    }
    for (var i=0; i < bindList.length; i++) {
        var line = bindList[i];
        out = out.concat('alias ', aliasName, suffix, ' "say ', line, '"\n');
        suffix += 1;
    }
    // Write actual binds.
    out = out.concat("\n");
    if (comments) {
        out = out.concat("// Rotation scripts are what are called directly " +
                         "by the binding.\n\n");
    }
    out = out.concat('alias ', cycleName, ' ', cycleName, '0\n');
    for (var e = 0; e < suffix; e++) {
        var indlast = suffix - 1;
        if (e < suffix - 1) {
            j = e + 1;
        } else {
            j = 0;
        }
        out = out.concat('alias ', cycleName, e, ' "', aliasName, e, '; alias ',
                         cycleName, ' ', cycleName, j, '"\n');
    }
    return out;
}

function submit() {
    // Get key field.
    var e = document.getElementById("key");
    var key = e.options[e.selectedIndex].value;
    var comments = document.getElementById("comments").checked;
    
    // Get input field.
    var text = document.getElementById("input").value;
    
    // Get alias name field.
    var aliasRead = document.getElementById("aliasName").value;
    var cycleRead = document.getElementById("cycleName").value;
    
    if (!(aliasRead && cycleRead)) {
        document.getElementById("output")
                .value = "You must supply alias names.";
        return 1;
    } else if (aliasRead == cycleRead) {
        document.getElementById("output")
                .value = "Aliases must be non-identical.";
        return 1;
    } else if (/\s/g.test(aliasRead) || /\s/g.test(cycleRead)) {
        document.getElementById("output")
                .value = "Aliases cannot contain whitespace.";
        return 1;
    }
    
    // Send to output field if valid, otherwise return warning message.
    var out = memewriter(key, text, 127, comments, aliasRead, cycleRead);
    if (text) {
        // When there's only one line, 
        document.getElementById("output").value = out;
    } else {
        document.getElementById("output").value = "No input, try again."
        return 1;
    }
    return 0;
}
