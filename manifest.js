/**
 * This code is machine generated.
 */
module.exports = function(RED) {
  var pf = RED.settings.functionGlobalContext.get("publishflows");
  if (typeof pf == "undefined") pf = [];
  pf.push(
    {
      "subflows": [
        {
          "name": "nrg",
          "id": "2b744329.f2992c",
          "checked": "checked"
        }
      ],
      "files": [
        {
          "isDirectory": "true",
          "name": "demo",
          "path": "/demo",
          "id": "demo",
          "checked": ""
        },
        {
          "isDirectory": "false",
          "name": "nrg-config.jpg",
          "path": "/demo/nrg-config.jpg",
          "id": "demo-nrg-config-jpg",
          "checked": ""
        },
        {
          "isDirectory": "false",
          "name": "nrg-hello-world.jpg",
          "path": "/demo/nrg-hello-world.jpg",
          "id": "demo-nrg-hello-world-jpg",
          "checked": ""
        },
        {
          "isDirectory": "true",
          "name": "public_html",
          "path": "/public_html",
          "id": "public-html",
          "checked": ""
        },
        {
          "isDirectory": "false",
          "name": "test.nrg",
          "path": "/public_html/test.nrg",
          "id": "public-html-test-nrg",
          "checked": ""
        }
      ],
      "tabs": [
        {
          "label": "Example",
          "id": "1c7dd13.e21a82f",
          "checked": ""
        }
      ],
      "path": __dirname
    }
  );
  RED.settings.functionGlobalContext.set("publishflows", pf);
};
