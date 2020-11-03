---
title: Arduino LED controller
created: 2018-05-02
updated: 2020-11-02
---

I had some LED strip lighting available and I’d wanted an interesting Arduino project for a while so this was the perfect opportunity.

For the controller I used a standard Arduino Uno, and it was all powered by a 12v 300w power supply. I hung five 5m LED strips from their centre, from the center of an outdoor patio shade. Then I attached the outsides of the LED strip to the edges of the shade and ran a single signal wire through all the LED strip.

Because they were wired this way the LED addresses were not logically layed out, so they had be be re-mapped before I could reasonably create patterns with them. You can see in the github repo the function getPixel takes care of remapping the LEDs, it translates an arm number and a relative pixel number to an absolute pixel number.

After the pixels were re-mapped creating patterns was simply a matter of playing with loops. The code is easy to understand (thanks largely to the FastLED library) and can be viewed on github. The video below shows a quick loop of my favorite patterns, the first view from below, and the second from the side.

[Github repo](https://github.com/jay-aye-see-kay/LED_10_arm_show/blob/master/LED_Show_10arm.ino)

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/dSxiomgX4mY" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
