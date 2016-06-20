var fs = require("fs"),
    REGEX = /\{\s*([^|}]+?)\s*(?:\|([^}]*))?\s*\}/g;

function sub(s, o) {
    return s.replace ? s.replace(REGEX, function(match, key) {
        var path = key.split("."),
            context = o,
            prop;

        while (prop = path.shift()) {
            context = context[prop];

            // if at any point in walking the path, we come across an undefined or null, abort and use the key as the
            // value.
            if ((typeof context === "undefined") || (context === null)) {
                context = match;
                break;
            }
        }

        return context;
    }) : s;
}

function expressStringTemplate(path, options, callback) {
    fs.readFile(path, function(err, data) {
        var out = sub(data.toString(), options);
        callback(err, out);
    });
};

expressStringTemplate.sub = sub;

module.exports = expressStringTemplate;