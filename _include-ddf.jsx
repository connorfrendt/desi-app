//@include "_util.jsx"
//@include "json2.jsx"

var DDF = DDF || (function () {
    // Constructor function
    function constructor(partNumber) {
        // Private variables
        var jsonPath = "/Users/Larry/Dropbox/ddf/";
        var jsonExtension = ".json";

        // Private functions
        function twipsToPoints(value) {
            var twips = 1440; // per inch
            var points = 72; // per inch
            return value / twips * points;
        };

        // Public property
        this.partNumber = partNumber;

        // Public methods
        this.loadJSON = function () {
            var jsonFile = new File(jsonPath + this.partNumber + jsonExtension);
            if (jsonFile.exists) {
                // read the contents of the json file
                jsonFile.open("r");
                var ddfText = jsonFile.read();
                jsonFile.close();

                // Parse the JSON content
                try {
                    this.json = JSON.parse(ddfText);
                    return true;
                } catch (e) { };
            }
            return false; // json not loaded
        };

        this.decodeRTF = function (rtfString) {
            // Define regular expressions to match font, font size, text, and text alignment
            // var textRegex = /\\b\\qc\s+([^}]*)/;
            var textRegex = /\\b\\i\\ul[l|c|r]\s+(.*?)}/;
            var fontRegex = /\\f0\\ftnil\s+(.*?);/;
            var fontSizeRegex = /\\fs(\d+)/;

            var alignmentRegex = /\\q[c|l|r]/;

            var boldRegex = /\\b/; // Bold attribute
            var italicRegex = /\\i/; // Italicized attribute
            var underlineRegex = /\\ul/; // Underlined attribute

            // Extract font
            var fontMatch = rtfString.match(fontRegex);
            var font = fontMatch ? fontMatch[1] : null;

            // Extract font size
            var fontSizeMatch = rtfString.match(fontSizeRegex);
            var fontSize = fontSizeMatch ? parseInt(fontSizeMatch[1]) : null;

            // Extract text
            var textMatch = rtfString.match(textRegex);
            var text = textMatch ? textMatch[1] : null;

            // Extract text alignment
            switch (rtfString.match(alignmentRegex)) {
                case "\\ql":
                    alignment = "left"
                    break;
                case "\\qr":
                    alignment = "right"
                    break;
                default:
                    alignment = "center"
            }

            // Extract font attributes
            var bold = rtfString.match(boldRegex) ? true : false;
            var italic = rtfString.match(italicRegex) ? true : false;
            var underline = rtfString.match(underlineRegex) ? true : false;

            return JSON.stringify({
                text: text,
                font: font,
                fontSize: fontSize,
                bold: bold,
                italic: italic,
                underline: underline,
                alignment: alignment
            }, null, 4);
        };

        this.drawTextframe = function (left, top, right, bottom, leftOffset, topOffset, itemName) {

            var doc = app.activeDocument;

            var layer = util.layerAddOrGet(doc, "DDFFields");
            var x = twipsToPoints(left);
            var y = twipsToPoints(top);
            var w = twipsToPoints(right - left);
            var h = twipsToPoints(bottom - top);
            var xo = twipsToPoints(leftOffset);
            var yo = twipsToPoints(topOffset);

            var fillColor = new NoColor(); // transparent

            var strokeColor = new RGBColor(); // magenta
            strokeColor.red = 255;
            strokeColor.green = 0;
            strokeColor.blue = 0;

            var rect = layer.pathItems.rectangle(-(y + yo), x + xo, w, h);
            rect.name = itemName;
            rect.fillColor = fillColor;
            rect.strokeColor = strokeColor;
            rect.strokeWidth = 1;
        };

        this.drawRectangle = function (left, top, right, bottom, leftOffset, topOffset, itemName) {

            var doc = app.activeDocument;

            var layer = util.layerAddOrGet(doc, "DDFObjects");
            var x = twipsToPoints(left);
            var y = twipsToPoints(top);
            var w = twipsToPoints(right - left);
            var h = twipsToPoints(bottom - top);
            var xo = twipsToPoints(leftOffset);
            var yo = twipsToPoints(topOffset);

            var abrect = doc.artboards[0].artboardRect;

            var fillColor = new NoColor(); // transparent

            var strokeColor = new RGBColor(); // magenta
            strokeColor.red = 255;
            strokeColor.green = 0;
            strokeColor.blue = 0;

            var rect = layer.pathItems.rectangle(-(y + yo), x + xo, w, h);
            rect.name = itemName;
            rect.fillColor = fillColor;
            rect.strokeColor = strokeColor;
            rect.strokeWidth = .25;
        };

        this.drawRoundedRectangle = function (left, top, right, bottom, leftOffset, topOffset, itemName) {

            var doc = app.activeDocument;

            var layer = util.layerAddOrGet(doc, "DDFObjects");
            var x = twipsToPoints(left);
            var y = twipsToPoints(top);
            var w = twipsToPoints(right - left);
            var h = twipsToPoints(bottom - top);
            var xo = twipsToPoints(leftOffset);
            var yo = twipsToPoints(topOffset);

            var fillColor = new NoColor(); // transparent

            var strokeColor = new RGBColor(); // magenta
            strokeColor.red = 255;
            strokeColor.green = 0;
            strokeColor.blue = 0;

            var rect = layer.pathItems.roundedRectangle(-(y + yo), x + xo, w, h, 5, 5);
            rect.name = itemName;
            rect.fillColor = fillColor;
            rect.strokeColor = strokeColor;
            rect.strokeWidth = 1;
        };

        this.drawEllipse = function (left, top, right, bottom, leftOffset, topOffset, itemName) {

            var doc = app.activeDocument;

            var layer = util.layerAddOrGet(doc, "DDFObjects");
            var x = twipsToPoints(left);
            var y = twipsToPoints(top);
            var w = twipsToPoints(right - left);
            var h = twipsToPoints(bottom - top);
            var xo = twipsToPoints(leftOffset);
            var yo = twipsToPoints(topOffset);

            var abrect = doc.artboards[0].artboardRect;

            var fillColor = new NoColor(); // transparent

            var strokeColor = new RGBColor(); // magenta
            strokeColor.red = 255;
            strokeColor.green = 0;
            strokeColor.blue = 0;

            var rect = layer.pathItems.ellipse(-(y + yo), x + xo, w, h);
            rect.name = itemName;
            rect.fillColor = fillColor;
            rect.strokeColor = strokeColor;
            rect.strokeWidth = 1;
        };

        // this.drawTextframe = function (rtfString, left, top, right, bottom, leftOffset, topOffset, itemName) {

        //     var doc = app.activeDocument;

        //     var text = this.decodeRTF(rtfString);

        //     var layer = util.layerAddOrGet(doc, "DDF");
        //     var x = twipsToPoints(left);
        //     var y = twipsToPoints(top);
        //     var w = twipsToPoints(right - left);
        //     var h = twipsToPoints(bottom - top);
        //     var xo = twipsToPoints(leftOffset);
        //     var yo = twipsToPoints(topOffset);

        //     var fillColor = new NoColor(); // transparent
        //     // var fillColor = new RGBColor(); // white
        //     // fillColor.red = 255;
        //     // fillColor.green = 255;
        //     // fillColor.blue = 255;

        //     var strokeColor = new RGBColor(); // magenta
        //     strokeColor.red = 255;
        //     strokeColor.green = 0;
        //     strokeColor.blue = 255;

        //     // var rect = layer.pathItems.rectangle(-(y+yo), x+xo, w, h);
        //     // rect.fillColor = fillColor;
        //     // rect.strokeColor = strokeColor;
        //     // rect.strokeWidth = .5;

        //     tf = util.textframeAdd(layer, "66096", x + xo, y + yo);
        //     tf.name = itemName;
        //     tf.contents = text;
        //     tf.textRange.characterAttributes.size = 9;
        //     tf.left = xo + x + ((w - tf.width) / 2);
        //     tf.top = -(yo + y + ((h - tf.height) / 2));

        //     // var item = layer.textFrames.
        //     // item.contents = text;
        //     // item.textRange.paragraphs[0].justification = Justification.CENTER; // Horizontal alignment
        //     // item.textRange.verticalJustification = VerticalJustification.CENTER; // Vertical alignment
        // };

        // this.decodeRTF = function(rtfString) {
        //     return rtfString.match(/\\b\\qc\s+([^}]*)/);
        // };

        this.returnJSONText = function () {
            return JSON.stringify(this.json);
        };
    };

    // Return the constructor function
    return constructor;
})();