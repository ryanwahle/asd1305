
function couchapp_load(scripts) {
  for (var i=0; i < scripts.length; i++) {
    document.write('<script src="'+scripts[i]+'"><\/script>')
  };
};

couchapp_load([
  "/_utils/script/sha1.js",
  "/_utils/script/json2.js",
  "http://code.jquery.com/jquery-1.8.3.min.js",
  "vendor/couchapp/jquery.couch.js",
  "vendor/couchapp/jquery.couch.app.js",
  "vendor/couchapp/jquery.couch.app.util.js",
  "vendor/couchapp/jquery.mustache.js",
  "vendor/couchapp/jquery.evently.js",
  "http://code.jquery.com/mobile/1.2.1/jquery.mobile-1.2.1.min.js"
]);

  //"vendor/couchapp/jquery-1.9.1.min.js",
  //"vendor/couchapp/jquery.mobile-1.3.1.min.js"
  //"/_utils/script/jquery.couch.js",
