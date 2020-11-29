---
title: '"No JS" NextJS'
created: 2020-11-29
---

## Summary

This post is about removing client-side JavaScript from a website built with the [NextJS](https://nextjs.org/) framework, using this website as an example. It will not work if you use [Next's api routes](https://nextjs.org/docs/api-routes/introduction).


## Wait what, why?

A site built with NextJS will send at least 70KiB of gzipped JavaScript over the network. If I add client-side markdown parsing (which sounds unnecessary but _is_ helpful) that increases to 110KiB. This is not a lot. It's the same as one or two images. NextJS "pre-renders" pages server-side, so this JS bundle doesn't even block the initial page render. As far as client-side JS goes, it's good value.

So why bother removing it?

Because, right now, on this site, I'm not using that JS. In future I might, and it's very easy to turn it back on.


## This seems like a lot of trouble, why even use NextJS like this?

That is a fair question I imagine you have. I mostly work with React and TypeScript at $WORK and intend to continue working with them. These are tools I like and am familiar with. Things I learn messing around with this site are more likely to be helpful in my career because they are part of the same ecosystem.

I did this because I wanted to use React, I wanted my site to work without JavaScript anyway, and I wanted my site to be fast. If you don't _like_ working with React this approach is unlikely to suit you.


## The set up

_Note: I'm currently hosting this site on [Vercel](https://vercel.com) (the company that makes NextJS), with minor tweaks these instructions will work with any static file host. I also use `yarn` but there's no reason `npm` wouldn't work just as well_

In your `package.json` you should have a `build` script, with the value `next build` or similar. In my set up this is the command the deployment step runs to build the files. Let's change it to remove the JS, and keep the old command around too.

```json
// package.json
{
  "scripts": {
    "build-with-js": "next build",
    "export": "next build, && next export",
    "build": "yarn export && yarn node ./scripts/remove-js.js",
    ...
  }
}
```

The `next export` command outputs static files so your site can be hosted without a NodeJS server. This will [break a few things](https://nextjs.org/docs/advanced-features/static-html-export#caveats) but there's no dealbreakers. It leaves the client-side JS which is what the `scripts/remove-js.js` is for, now we just have to write that script.


## Actually removing the JavaScript

A quick solution would be to just delete the JavaScript files before deployment. This works but causes 404s when the page tries to load those files. We can do better. Let's remove the script tags from all the generated html too.

We could use regex to do this, the generated files are unlikely to contain new lines within tags, so the regex would probably be reliable. But it's easier and more reliable to work with a parsed html document. I found the [cheerio](https://github.com/cheeriojs/cheerio) library nicest to work with because of it's familar jQuery-like syntax, but any library based on [parse5](https://github.com/inikulin/parse5) would be fine.

First let's find all the html files. Using the [glob](https://github.com/isaacs/node-glob) library is an easy way to find files at an arbitrary depth without depending on anything from the shell environment.

```javascript
// scripts/remove-js.js
const glob = require("glob");
const BUILD_DIR = "./out";
const htmlBuildFiles = glob.sync(`${BUILD_DIR}/**/*.html`);
```

Then we need a function to remove the script tags from a html file, and to call that function on each html file. You may notice I'm doing everything with synchronous, blocking file system calls which could be parallelized quite easily. I know this isn't the fastest way of doing it, but my build takes 12 seconds, and this script is only 0.4 of them.

```javascript
// scripts/remove-js.js (continued)
const removeJsFromHtml = (filename) => {
  const originalHtml = fs.readFileSync(filename, "utf8");
  const $ = cheerio.load(originalHtml);
  $("script").remove();
  $("link[as=script]").remove();
  fs.writeFileSync(filename, $.root().html());
};

htmlBuildFiles.forEach((filename) => {
  removeJsFromHtml(filename);
});
```

I also included code to remove all the JavaScript files, [view the complete script here](https://github.com/jay-aye-see-kay/jackrose.co.nz/blob/master/scripts/remove-static-js.js).


## Keeping some JavaScript

If you have some script tags you don't want to remove, say for analytics, it's not hard to keep them.

First give any script tags you wish to keep a [data attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*). I called mine `data-keep-script`. Then modify the script above to only delete script tags without the attribute. Because `cheerio` uses a `jQuery`-like api, we can use a css selector.

```javascript
// scripts/remove-js.js (edit)
// before
$("script").remove();
// after
$("script:not([data-keep-script])").remove();
```

```html
// pages/_document.tsx (or in any component)
  ...
  <script src={src} data-keep-script />
  ...
```

I do this as I'd like to know how many people visit each of my posts. Anyone can view the [analytics for this site](https://jackrose.goatcounter.com/). But these analytics are likely incorrect as [uBlock Origin](https://github.com/gorhill/uBlock/) (which I recommend everyone use) blocks this analytics service by default. Ideally I would get my analytics from server logs but I currently use a host that doesn't provide that info.


## Final result

Loading the home page of this site (which is tiny and not the best example) now transfers 10KiB over the wire and loads in 200-300 ms. Before removing JavaScript it transfered 77KiB in 300-600 ms.

A largely unnecessary performance improvement that was interesting to implement.
