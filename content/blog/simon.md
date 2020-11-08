---
title: "Widget: Simon Game"
created: 2018-06-04
archived: true
---
This is a JavaScript version of the 80’s Simon game. It was built with Vue and can be played on Codepen.

This game was a FreeCodeCamp project. I decided to build it using Vue because I wanted to improve my Vue skills. I originally tried to build it using vanilla JS but ran into timing and state management problems (there are a lot of setTimeouts). Switching to Vue not only made some issues disappear it also gave me access to Vue DevTools which are a godsend for debugging.

I decided to use Vue without a build step so that I could display it on Codepen properly. This meant I couldn’t use single file components (my favorite part of Vue). Without SFCs I found the cleanest way of writing markup was in html directly, rather than the traditional way of breaking things down into re-usable components. This had the disadvantage of putting some of the logic in the html, but due to the small size of this project I think this design is the most understandable.

My apologies if you are on mobile, this project will break completely on screens less than 500px wide (but it should be okay if you turn your screen).

https://codepen.io/jay-aye-see-kay/pen/GyEQRm
