// Bookmarklet: 🎨 Lospec > JSON extractor
// javascript:(function(){function f(a){return a.trim().replace(/ PALETTE$/i,'').replace(/\b([A-Za-z]{4,})\b/g,w=>w[0].toUpperCase()+w.slice(1).toLowerCase())}var c=document.createElement('canvas');c.width=c.height=1;var x=c.getContext('2d');function b(h){x.filter='grayscale(1)';x.fillStyle=h;x.fillRect(0,0,1,1);return x.getImageData(0,0,1,1).data[0]/255}var t=f(document.querySelector('h1').innerText),o=document.querySelector('.attribution a'),u=o?o.innerText.trim():'',C=(document.body.innerText.match(/#[0-9A-Fa-f]{6}/g)||[]).filter((h,i,a)=>a.indexOf(h)===i).map(h=>h.toLowerCase());if(b(C[0])<b(C[C.length-1]))C.reverse();var out='{\n    "title": "'+t+'", "origin": "'+u+'",\n    "source": "'+location.href+'",\n    "colors": ["'+C.join('","')+'"],\n    "tags": ["Lospec"]\n  },';if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(out).then(()=>alert("🎨 Copied ~\n"+out)).catch(()=>prompt("📋",out))}else prompt("📋",out)})();


javascript:(function() {
    // Format the palette title: trim, remove trailing " PALETTE", Title-Case words ≥4 letters
    function formatPaletteTitle(rawTitle) {
        return rawTitle.trim()
            .replace(/ PALETTE$/i, '')
            .replace(/\b([A-Za-z]{4,})\b/g, word => word[0].toUpperCase() + word.slice(1).toLowerCase());
    }

    // Set up a 1×1 canvas for color brightness sampling
    var brightnessCanvas = document.createElement('canvas');
    brightnessCanvas.width = 1;
    brightnessCanvas.height = 1;
    var brightnessContext = brightnessCanvas.getContext('2d');

    // Compute brightness [0–1] by drawing in grayscale and sampling the pixel
    function computeBrightness(hexColor) {
        brightnessContext.filter = 'grayscale(1)';
        brightnessContext.fillStyle = hexColor;
        brightnessContext.fillRect(0, 0, 1, 1);
        var pixel = brightnessContext.getImageData(0, 0, 1, 1).data;
        return pixel[0] / 255;
    }

    // Extract unique hex colors from page text
    function extractHexColors() {
        var matches = document.body.innerText.match(/#[0-9A-Fa-f]{6}/g) || [];
        return matches.filter((hex, idx, arr) => arr.indexOf(hex) === idx)
                      .map(hex => hex.toLowerCase());
    }

    // Main execution
    var rawTitle   = document.querySelector('h1').innerText,
        paletteTitle = formatPaletteTitle(rawTitle),
        authorLink  = document.querySelector('.attribution a'),
        paletteAuthor = authorLink ? authorLink.innerText.trim() : '',
        colorList   = extractHexColors();

    // Ensure palette is ordered lightest → darkest
    if (computeBrightness(colorList[0]) < computeBrightness(colorList[colorList.length - 1])) {
        colorList.reverse();
    }

    // Build formatted JSON string
    var resultJson = '{\n'
        + '    "title": "' + paletteTitle  + '", "origin": "' + paletteAuthor + '",\n'
        + '    "source": "' + location.href + '",\n'
        + '    "colors": ["' + colorList.join('\",\"') + '"],\n'
        + '    "tags": ["Lospec"]\n'
        + '  },';

    // Copy to clipboard or fall back to prompt
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(resultJson)
            .then(() => alert("🎨 Copied ~\n" + resultJson))
            .catch(() => prompt("📋", resultJson));
    } else {
        prompt("📋", resultJson);
    }
})();
