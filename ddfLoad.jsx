(function () {
    //@include "_include/_util.jsx"
    //@include "_include/_include-ddf.jsx"

    var doc = app.activeDocument;

    util.fixCoordinateSystem();

    var args = util.getArgs();
    if (typeof args === 'object' && typeof args[1] !== 'undefined') {
        var partNumber = args[1];
    } else {
        var partNumber = doc.fullName.name.match(/^\d+/)[0]; // gets the part number from the document name
    }

    var ddf = new DDF(partNumber); // opening a ddf.json file

    var loaded = ddf.loadJSON();

    if (!loaded) {
        alert("DDF for Part Number " + partNumber + " not found!");
        return;
    }

    // var rtfString = "{\\rtf1\\ansi{\\fonttbl{\\f0\\ftnil Arial;}}{\\colortbl;}\\f0\\cf0\\fs16\\b\\qc HOLD}"; // center, bold
    // var rtfString = "{\\rtf1\\ansi{\\fonttbl{\\f0\\ftnil Arial;}}{\\colortbl;}\\f0\\cf0\\fs16\\b\\qc LINE 2}"; // center, bold, space in text
    // var rtfString = "{\\rtf1\\ansi{\\fonttbl{\\f0\\ftnil Arial;}}{\\colortbl;}\\f0\\cf0\\fs12\\qc \\par D\\par A\\par T\\par A}"; // center, vertial text
    // var rtfString = "{\\rtf1\\ansi{\\fonttbl{\\f0\\ftnil Arial;}}{\\colortbl;}\\f0\\cf0\\fs14\\ql }"; // left, no text
    // var rtfString = "{\\rtf1\\ansi{\\fonttbl{\\f0\\ftnil Arial;}}{\\colortbl;}\\f0\\cf0\\fs14\\qc }"; // center, no text
    // var rtfString = "{\\rtf1\\ansi{\\fonttbl{\\f0\\ftnil Arial;}}{\\colortbl;}\\f0\\cf0\\fs14\\qr }"; // right, no text

    // var rtfProps = ddf.decodeRTF(rtfString);
    // $.writeln(rtfProps);


    for (var i = 0; i < ddf.json.origins.length; i++) {
        var lo = ddf.json.origins[i][0];
        var to = ddf.json.origins[i][1];

        for (var key in ddf.json.objects) {
            if (ddf.json.objects.hasOwnProperty(key)) {
                var kind = ddf.json.objects[key].kind;
                var l = ddf.json.objects[key].position[0];
                var t = ddf.json.objects[key].position[1];
                var r = ddf.json.objects[key].position[2];
                var b = ddf.json.objects[key].position[3];

                if (kind == 'dottedLine') {
                    ddf.drawRectangle(l, t, r, b, lo, to, key);
                }
                if (kind == 'rectangle') {
                    ddf.drawRectangle(l, t, r, b, lo, to, key);
                }
                if (kind == 'roundedRect') {
                    ddf.drawRoundedRectangle(l, t, r, b, lo, to, key);
                }
                if (kind == 'ellipse') {
                    ddf.drawEllipse(l, t, r, b, lo, to, key);
                }
                if (kind == 'text') {
                    ddf.drawTextframe(l, t, r, b, lo, to, key)
                }

            }
        }
    }

    var layerDDFObjects = util.layerGetByName(doc, "DDFObjects");
    // var layerDDFFields = util.layerGetByName(doc, "DDFFields");
    var layerPERF = util.layerGetByName(doc, "PERF");
    var layerKERF = util.layerGetByName(doc, "KERF");
    var layerKISSCUT = util.layerGetByName(doc, "KISSCUT");
    var layerArtwork = util.layerGetByName(doc, "Artwork");

    util.layersAllVisible(doc, true);
    util.layersAllLocked(doc, true);

    util.layerVisible(layerDDFObjects, false);
    util.layerLocked(layerPERF, false);
    util.layerLocked(layerKERF, false);
    util.layerLocked(layerKISSCUT, false);
    util.layerLocked(layerArtwork, false);

    util.pageitemsSelectAll();

    // layer = util.layerGetByName(doc, "DDF");
    // frame = util.textframeGetByName(layer, "frame");
    // $.writeln(frame.contents);


    // var ddf = new DDF("16265"); // opening a ddf.json file
    // $.writeln("partNumber = " + ddf.partNumber);

    // $.writeln("desctiption = " + ddf.json.description);
    // $.writeln("group = " + ddf.json.group);

    // ddf.drawTextframe("HOLD", 2752, 10941, 3513, 11212, 3353, 1969);
    // ddf.drawRoundedRectangle(2812, 11242, 3453, 11663, 3353, 1969);
    // ddf.drawEllipse(3768, 11089, 4494, 11815, 3353, 1969);
    // ddf.drawRectangle(100, 950, 4664, 11963, 3353, 1969);

    // var description = util.jsonGetKeyValue(DDF.json, 'description');
    // $.writeln(description)

    // var objectKeys = [];
    // for (var key in jsonData.objects) {
    //     if (jsonData.objects.hasOwnProperty(key)) {
    //         $.writeln(key)
    //         objectKeys.push(key);
    //     }
    // }
    // alert("Keys within 'objects': " + objectKeys.join(", "));

})();