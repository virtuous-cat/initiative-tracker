A Dungeons & Dragons enemy initiative tracker for our homebrew initiative system. This initiative system was created by my DM's DM in the 1980's for 1st edition AD&D. I have adapted it for 5E using the house rules described on the site.

## Impetus

Existing turn trackers are built for the canonical 5E initiative system in which initiative dice are rolled at the beginning of a combat to determine the relative turn order, which then remains the same for subsequent rounds. In contrast, our homebrew system has new initiatives rolled every round and those rolls indicate which numbered time segment of the round the character can take their action in. This allows for more dynamic combat and keeps players more engaged as it it up to them to jump in when their character's segment comes around, but when there are a lot of enemies in a combat, rolling and keeping track of all their initiatives each round can be a substantial burden on the DM.

## Solution

This app allows you to create a list of monsters for a combat, with their initiative dice and bonuses, and then roll initiatives for them for each round by either clicking the button to roll all initiives for the round, or individually. 

There are also spaces for tracking hit points, statuses, target, AC, and additional info (the first URL entered in this box will generate a link to that page), and buttons that allow you to mark monsters as dead. New monsters can be added to the list either as a blank row or as a copy of an existing monster.

The list can be sorted by Monster Number, Monster Name, or Initiative Segment, and there is a togglable global setting to automatically sort by Initiative Segment when rolling All Initiatives, the state of which is saved to local storage so it persists between sessions.

When you click the button to move to the next round, the list of monsters and it's current state is retained and copied down to a new round which is appended to the document with the initiative segments zeroed out, allowing you to roll for the next round, but still look back at previous rounds and see the history of the combat.

Combats can be saved to local storage at any point, which enables both pre-building future combats to be pulled up as the players encounter them, and saving a combat in progress to be returned to in a later game session.

## Technology

This app is built with Typescript, Svelte and Vite. 

My goal in building the UI for this app was to stick as much as possible to native semantic HTML elements and browser APIs while implementing the functionality I needed, and to keep the styling minimal, but clear and pleasant. That included rendering the monster list as an HTML table, which brings challenges in making it resposive that I have implemented solutions for in other projects and may one day add here, but as I do not foresee using the app on mobile myself or it having any other users, it is not currently a priority.

Other functionality I may consider adding in future updates includes more robust auto-linking in the Info box, enabling rolling for attacks and damage in the app, and integrating with the Roll 20 API to send dice rolls directly to the VTT.

If despite my expectations, you are in fact using this app for your game and you have things you would like to see added or improved, I welcome feature requests in the Issues.


