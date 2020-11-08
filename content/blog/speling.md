---
title: "Customer Site: Speling"
created: 2018-06-04
updated: 2020-11-08
archived: true
---

This is a web app to help people improve English pronunciation by teaching them a simplified phonetic alphabet. It is being built using Laravel, Vue, and Docker.

The home page opens to a phonemic chart showing how to spell with this new alphabet. Beneath that are two search boxes to lookup up words from the alphabet. This uses the Bloodhound.js library to handle api requests with throttling and caching, the lookup itself it a custom Vue component.

The entire site is built as a Vue SPA, the only page reloads are on login and logout.

A interesting part of this site is the lesson/game (shown below). Users are given a set of words written in phonetics and they have to type it in English. The game can also be played in reverse. The lesson data is fetched from the server at the start, and results sent back at the end, all other game actions are front end only so it has a very quick feel to it.

The site is currently still is the prototype phase, contact me if you are interested in seeing a demo of the site.

Design by Josh from [Superminimal](https://superminimal.com.au/), development by me.

---

CLARIFICATION: The site name is intentionaly spelled incorrectly

---

UPDATE: Unfortunately this project is still not completed and I am no longer involved. I can no longer show anyone it's current state. Which is a shame because I thought the site was really helpful and almost complete. But software is hard, and doesn't always succeed.
