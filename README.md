nrg
===

A web server "wired" in Node-RED that serves dynamic & static content.
#### *Note: this is a functional work in progress!!!*

### About
NRG is an open source web server "wired" completely in Node-RED. It is capable
of serving static as well as dynamic web pages. It is designed to leverage the
capabilities of Node-RED flows with inline, special server-side tags embedded
into regular web pages. The web sever delivers standard HTML, CSS, most Apache
2.0 mime-types, and the special .nrg (dot n-r-g, i.e. index.nrg) files. The .nrg
files act as "Node-RED gateway" files like cgi files; but more similar to the
popular and prolific ASP and PHP files used by most hosting providers.

NRG accommodates a more MVC-like design pattern allowing web designers
to focus on user interface, theme design, stylesheets, and accessibility; while
preserving the web developer's power to use Node-RED driven logic, data,
conductivity, and functionality.

### Getting Started
To startup NRG simply drag the “nrg” subflow to a tab in the Node-RED editor and
click “Deploy”. Currently, NRG is implemented as a global singleton object and
only one instance of the web server should exist. However, flows that service
browser requests may exist on any tab. By default, NRG will serve files from the
a subfolder titled “public_html” from the current user account (I.e.
/Users/username/public_html). You may change the default configuration by
defining an [ActionFlows](https://flows.nodered.org/node/node-red-contrib-actionflows) segment and naming it "#config". Also by default (and
customizable), the URL path is the same as the Node-RED installation. More
information can be found in the followup section "Creating NRG Flows" below. Lastly, you
can change the admin path for Node-RED via your [Node-RED’s settings.js file](https://nodered.org/docs/configuration).

### Creating NRG Flows
At the heart of NRG’s operation are "NRG flows" which are simply Node-RED
contributed nodes called [ActionFlows](https://flows.nodered.org/node/node-red-contrib-actionflows); a set of nodes that allow you
to define a flow segment. ActonFlows are similar to “virtual wires” and
Node-RED’s native Subflows. Two important nodes you will use to define an NRG
flow segment are:

* action in
* action out

For example, to configure a different web server folder in lieu of the default
(/Users/username/public_html), create an action in/out pair of nodes named
`#config` and use a change node to alter the siteRoot property of the
`msg.payload`. The flow segment you defined will be executed immediately after
you deploy; telling NRG web server where to begin serving files (see image
below).

![Configure NRG](https://raw.githubusercontent.com/Steveorevo/nrg/master/demo/nrg-config.jpg)

The image above shows the flow segment `#config` with the default settings in
`msg.payload`. A definition for each of the settings are:

* slash - Platform dependent directory separator. Do not change this.
* mimeTypes - The default Content-Type/mime types set by extension.
* siteRoot - The site root folder used to deliver content by the server.
* urlPath - The starting URL path used to deliver content by the server.

In addition to the #config flow segment are NRG flows for customizing the 404
Page Not Found error page, and the 403, and 500 pages. You can supply your own
custom error pages by supplying your own NRG flows named:

* 403error
* 404error
* 500error

You may also invoke NRG flows from within your own webpages by simply naming the
file with a .nrg (dot n-r-g) extension (i.e. index.nrg) and using NRG tags. See
"NRG Flows in Webpages" below for details.

### NRG Flows in Webpages
Creating dynamic web pages with NRG flows is easy; simply create an XHTML
compliant file named with a .nrg extension (aka "NRG files"). NRG files are just
like HTML files, but they can include both HTML tags and special "NRG tags".
The NRG tags contain the name of flow segments (ActionFlows) that are executed
by Node-RED when the page is accessed. The resulting output is written as
HTML within the webpage. When a user accesses a NRG page, his or her web browser
only gets sent the HTML code, since Node-RED has run the NRG flows in the
background. A simple "Hello World" web page can illustrate the process:

```
<html>
  <body>
    <#action/>
  </body>
</html>
```

The NRG flow self-closing tag `<#action/>` will run the associated flow segment
of the same named prefix `action` in Node-RED.

![NRG Flow Segment](https://raw.githubusercontent.com/Steveorevo/nrg/master/demo/nrg-hello-world.jpg)

The results of the flow segment's `msg.payload` property will be output and will
replace the tag. In this case, the change node will populate `msg.payload` with
the string "Hello World". The result is a simple white webpage with the text
"Hello World".

#### Tag Syntax for NRG Flows
Authors of .nrg webpages should ensure that their pages are XHTML compliant. NRG
will run a basic XML syntax check and report any errors for broken tags or
incorrect syntax. The special NRG flow tags follow a strict XHTML standard;
internally the # (hashtag) is a shortcut that converts to `nrg_` (i.e.
`<#action />` is the equivalent to `<nrg_action />`. The shortcut # (hashtag) is
the preferred method for embedding server side flows into webpages.

As shown in the example, the contents of the `msg.payload` at the end of the
flow is returned in place of the tag in the webpage. Likewise, a tag can pass
a value into a flow as the initial content of `msg.payload`. The examples above
for `<#action />` pass nothing and therefore always have an empty payload.
However, consider that an XML compliant self-closing tag of
`<nrg_action payload="The quick brown fox" />` would invoke the `action` node in Node-RED with a
`msg.payload` containing "The quick brown fox". In the preferred shortcut syntax:

```
<#action("The quick brown fox"); />
```

#### Passing Template Blocks
Often times, a web designer may wish to send a block of HTML to Node-RED for
processing or to inject dynamic content into mustache syntax template; such as
with the [node-red-contrib-render](https://flows.nodered.org/node/node-red-contrib-render)
node. In this case, use a XHTML begin and end tag (versus self-closing):

```
<#comments>
  <div class="comment">
    <span class="comment-user">Visitor {{username}} says:</span>
    <div class="comment-post">
      <p>{{comment}}</p>
    </div>
    <span class="comment-date">{{comment-date}}</span>
  </div>
</#comments>
```


Using the beginning and ending tag syntax will capture a code block of HTML that
appears between the tags. The captured content will replace the `msg.payload`
property and will be sent to the `action in` node flow segment. I.e.:

Using the beginning and ending syntax (`<#comments>` and `</#comments>`) above
will capture a code block of HTML that appears between the tags. The code block
is provided in the value of the `msg.payload` context property when the Node-RED
flow segment is invoked. In the above example the Node-RED flow segment
(defined using [ActionFlows](https://flows.nodered.org/node/node-red-contrib-actionflows)) named `comments` is invoked.

### Server-side Scripting
NRG flows reserves a few names for special purposes; the `<#script>` tag is of
special importance. When authored with beginning and ending tags, the contents
interpreted as server-side JavaScript; as if they were written inside a native
Node-RED function node. This means that your **must** do a `return msg` or
invoke the `node.send(msg);` method to pass along the msg object. Remember, the
content of the `msg.payload` will be appended to the `msg.outputBuffer` property
which is the current output that will sent to the client's web browser. Consider
the following code block:

```
<#script>
msg.payload = "The quick brown fox";
node.warn("jumps over the lazy dog")
</#script>
```

The special `#script` is a reserved name and you should not attempt to create a
flow segment with the same name. The above code will instead execute immediately
and append "The quick brown fox" to `msg.outputBuffer` and subsequently the web
browser; followed by sending "jumps over the lazy dog" to Node-RED's debug window.

In lieu of inline code block, you can supply a filename using the self-closing
tag syntax:

```
<#script("example.jss"); />
```

Note the .jss (dot j-s-s) filename extension (as in "JavaScript Server-side").
This is the preferred filename extension as it is protected from transmission
by the NRG web server to the web browser. Attempts to load the page by a web
browser will be returned a 403 Forbidden error page.

### NRG Directives
As mentioned above, there are a few reserved NRG tag names that are used for
specific purposed and should not be used as for flows:

* `#script` is used for server-side JavaScript, similar to a function node.
* `#include` is used to include one file content into another. Similar to PHP's include function. Care should be taken to ensure that the included file does not break XHTML beginning and ending tags to ensure proper parsing.
* `#require` (pending) is used at the top of a .nrg file to dynamically deploy a .flow file before executing a .nrg file.

### TODO: incomplete list of items
The following are not implemented yet (but have a good chance that they will be):

* Support objects to be merged into `msg` context i.e.

```
<#action({payload:"Hello World",something:"else"}); />
```

* Implement `<#require("something.flow"); />` dynamically loads a json flow the tab titled "something" (if it does not already exist) before processing the remainder of the .nrg file. This will facilitate code distribution.
* Implement `<#prefix />` tag to enabled prefix naming actionflows.
* Implement a session context? Should include destroy session and the ability to set an expiration time.
* Optimize, optimize, optimize. While it's neat that it's a subflow completely "wired" in Node-RED, consider re-authoring as an actual node.
