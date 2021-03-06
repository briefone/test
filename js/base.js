Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
}

HTMLElement.prototype.empty = function() {
    while (this.firstChild) {
        this.removeChild(this.firstChild);
    }
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
}

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.stripslashes = function(){
    return this.replace(/\\(.)/mg, "$1");
};

Element.prototype.insertAfter = function (element) {
    this.parentNode.insertBefore(element, this.nextSibling);
},false;

HTMLElement.prototype.getparent = function(c) { //class, tag, or id
    var a = this;
    var x = false;
    while ( a ){
        if ( a.classList && a.classList.contains(c) || a.tagName == c.toUpperCase() || a.id == c ){
            x = a;
            break;
        }
        a = a.parentElement
    }
    return x;
};

Object.defineProperty(Object.prototype, "remove", { 
    value: function(x) {
        while(this[0]){
            this[0].parentNode.removeChild(this[0]);
        }
    },
    enumerable : false
});


Object.defineProperty(Object.prototype, "removeclass", { 
    value: function(x) {
        while(this[0]){
            this[0].classList.remove(x);
        }
    },
    enumerable : false
});

Object.defineProperty(Object.prototype, "addclass", { 
    value: function(x) {
        for(var i=0;i<this.length;i++){
            this[i].classList.add(x);
        }
    },
    enumerable : false
});

Object.defineProperty(Object.prototype, "offset", { 
    value: function(x) {
        var coords = this.getBoundingClientRect();
        var top = window.pageYOffset || document.documentElement.scrollTop;
        var left = window.pageXOffset || document.documentElement.scrollLeft;

        var fixed = window.getComputedStyle(this).getPropertyValue('position') == 'fixed' || x ? true : false;

        if ( fixed ){
            top = 0;
            left = 0;
        }

        return {
            x: left + coords.x,
            y: top + coords.y,
            w: coords.width,
            h: coords.height
        };
    },
    enumerable : false
});

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    return JSON.parse(this.getItem(key));
}

function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
  
function rgb2hex(rgb) {
    console.log('rgb2hex', rgb);
    return "#" + componentToHex(Number(rgb[0])) + componentToHex(Number(rgb[1])) + componentToHex(Number(rgb[2]));
}

function toDecimal(num, fixed) {
    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
}

function contrastr(a, b) { //hex
    a = hex2rgb(a);
    b = hex2rgb(b);
    var l1 = luminance(a) + 0.05;
    var l2 = luminance(b) + 0.05;
    var ratio = l1 / l2;

    if (l2 > l1) {
    ratio = 1 / ratio;
    }

    // ratio = 1 / ratio;

    // ratio = Math.round(ratio, 1);

    return ratio;
};

function contrastrrgb(a, b) { //rgb
    var l1 = luminance(a) + 0.05;
    var l2 = luminance(b) + 0.05;
    var ratio = l1 / l2;

    if (l2 > l1) {
      ratio = 1 / ratio;
    }

    // ratio = 1 / ratio;

    // ratio = Math.round(ratio, 1);

    return ratio;
};

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
function hsl2rgb(h, s, l) {
    var r, g, b;

    if (s === 0) {
    r = g = b = l; // achromatic
    } else {
    var hue2rgb = function (p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   {number}  r       The red color value
 * @param   {number}  g       The green color value
 * @param   {number}  b       The blue color value
 * @return  {Array}           The HSL representation
 */
function rgb2hsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
    h = s = 0; // achromatic
    } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
        case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
        case g:
        h = (b - r) / d + 2;
        break;
        case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
    }

    return [h, s, l];
}

function hex2rgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    console.log(hex);
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
    ] : null;
}

function luminance(rgba2) {
    // Formula: http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
    //var rgba = this.rgba.slice();
    var a = [];
    for (var i = 0; i < 3; i++) {
        var rgb = rgba2[i];
        rgb = rgb / 255;
        rgb = rgb < 0.03928 ? rgb / 12.92 : Math.pow((rgb + 0.055) / 1.055, 2.4);
        a[i] = rgb;
    }

    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}
