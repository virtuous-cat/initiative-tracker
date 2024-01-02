<script lang="ts">
  import { onMount } from "svelte";
  import Round from "./lib/Round.svelte";
  import { INITIATIVE_DIE, type Combat, type SavedCombat } from "./lib/types";
  import { fade, slide } from "svelte/transition";

  let combat: Combat = {
    currentRoundNumber: 1,
    roundsData: [
      {
        roundNumber: 1,
        monsters: [
          {
            number: 1,
            alive: true,
            name: "",
            target: "",
            initiativeDie: INITIATIVE_DIE.NONE,
            dexBonus: 0,
            extraAttacks: [],
            status: "",
            info: "",
          },
        ],
      },
    ],
  };
  let savedCombats: SavedCombat[] = [];
  let selectedCombat: SavedCombat;
  let combatTitle: string;
  let lastSavedRound: number;
  let autoSort = false;

  function clearCombat() {
    combat = {
      currentRoundNumber: 1,
      roundsData: [
        {
          roundNumber: 1,
          monsters: [
            {
              number: 1,
              alive: true,
              name: "",
              target: "",
              initiativeDie: INITIATIVE_DIE.NONE,
              dexBonus: 0,
              extraAttacks: [],
              status: "",
              info: "",
            },
          ],
        },
      ],
    };
    combatTitle = undefined;
    lastSavedRound = undefined;
  }

  function getSavedCombats() {
    const combats: SavedCombat[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      console.log(localStorage.key(i));
      if (
        localStorage.key(i) === "admin" ||
        localStorage.key(i) === "autoSort"
      ) {
        continue;
      }
      const combat = JSON.parse(
        localStorage.getItem(localStorage.key(i))
      ) satisfies Combat;
      combats.push({ title: localStorage.key(i), combat });
    }
    savedCombats = combats;
  }

  onMount(() => {
    getSavedCombats();
    if (localStorage.getItem("autoSort")) {
      autoSort = true;
    }
  });
</script>

<header>
  <h1>
    Initiative Tracker{combatTitle ? ` - ${combatTitle}` : ``} - Round: {combat.currentRoundNumber}
  </h1>
  <div class="buttons">
    <button
      class="clear"
      on:click={() => {
        const lastSavedCombatState = combatTitle
          ? JSON.parse(localStorage.getItem(combatTitle))
          : null;
        const lastString = lastSavedCombatState
          ? JSON.stringify(
              lastSavedCombatState.roundsData[
                lastSavedCombatState.currentRoundNumber - 1
              ].monsters
            )
          : null;
        const currentString = JSON.stringify(
          combat.roundsData[combat.currentRoundNumber - 1].monsters
        );
        const dirty =
          (lastSavedRound && lastSavedRound !== combat.currentRoundNumber) ||
          (lastSavedRound &&
            lastSavedCombatState &&
            lastString !== currentString) ||
          (!lastSavedRound && combat.roundsData.length > 1) ||
          (!lastSavedRound && combat.roundsData[0].monsters.length > 1) ||
          (!lastSavedRound && combat.roundsData[0].monsters[0].name);
        if (dirty) {
          const discard = window.confirm(
            "You have unsaved changes to the current combat. Discard changes?"
          );
          if (!discard) {
            return;
          }
        }
        clearCombat();
      }}>Clear</button
    >
    <button
      class="save highlighted"
      on:click={() => {
        const title = window.prompt("Save As:", combatTitle);
        if (!title || !title.length) {
          return;
        }
        localStorage.setItem(title, JSON.stringify(combat));
        combatTitle = title;
        lastSavedRound = combat.currentRoundNumber;
        getSavedCombats();
        selectedCombat = savedCombats.find((saved) => saved.title === title);
      }}>Save Combat</button
    >
  </div>
</header>
{#if window?.location.hostname !== "localhost" && window?.location.hostname !== "127.0.0.1"}
  <aside>
    <details>
      <summary>About this initiative system</summary>
      <p>
        This initiative system was created by my DM's DM in the 1980's for 1st
        edition AD&D. I have adapted it for 5E using the house rules below. The
        advantages of this system are that the action being taken effects how
        fast a character goes instead of just their dex, that the initiative
        order changes every round, and that it eliminates 5E Concentration in
        favor of a return to casting times.
      </p>
      <strong class="details-heading">Time:</strong>
      <p>
        How quickly action happens in combat has sped up between 1st ed and 5E,
        but to make this system work we need to revert to the old timing:
      </p>
      <ul>
        <li>1 round = 1 minute</li>
        <li>1 segment = 6 seconds</li>
        <li>
          There are 10 segments per round + the “0” segment <br />
          Going in zero basically means the character managed to finish any setup
          at the end of the last round. This does not include casting time. They
          can start casting in the zero segment but a spell will never go off before
          segment 1.
        </li>
        <li>
          If a 1st ed spell or other source lists time in turns, they mean 1
          turn = 10 minutes, otherwise “turn” just means “when you take your
          next action.”
        </li>
        <li>
          5E combat-related spells with the listed duration of 1 minute will
          have a 10 minute duration.
        </li>
      </ul>
      <strong class="details-heading">Combat sequence: </strong>
      <p>
        Each round, everyone rolls Initiative based on what they plan to do:
      </p>
      <ul>
        <li>
          <strong>Weapon Attacks:</strong> damage die - Dex mod<br />

          I typically ignore the number of dice cast; if an attack does 2d8,
          just roll 1d8 for initiative. The idea is that larger weapons are
          slower, if this formulation doesn't make sense, pick something
          reasonable. For instance, if something does 2d4 damage, 1d8 probably
          makes the most sense for initiative.
        </li>
        <li>
          <strong>Spells:</strong> 1d4 - Dex mod<br />

          The initiative roll denotes when the character can start casting. Add
          the casting time to determine when the spell takes effect. Casting
          time is typically 1 segment per spell level, see 1st ed version of the
          spell for outliers, or DM's call. Cantrips typically have a casting
          time of 0 segments and go off immediately. The player may choose
          whether the rest of their turn happens before or after casting. The
          character may not do anything else during casting.
        </li>
        <li><strong>Other:</strong> 1d10 - Dex mod</li>
      </ul>
      <p>
        The DM goes through the round segment by segment. When the segment #
        rolled for an initiative is called, that character may take their turn
        (Move, take their Action and take their Bonus Action), or choose to hold
        until a later segment in the same round. A spellcaster may hold off on
        beginning to cast a spell or completing it, but if they are holding
        completion they are vulnerable to losing concentration if they take
        damage.
      </p>
      <p>
        If the player changes their mind mid-round they may switch weapons or
        spells with a 1 segment penalty. If you switch spells or switch to a
        non-spell action after you have started casting a spell, the original
        spell slot is lost.
      </p>
      <strong class="details-heading">Spell Casting Concentration:</strong>
      <p>
        If a spellcaster takes damage during casting, they must save or lose the
        spell (it does not take effect and they are down the spell slot).
      </p>
      <p>
        Save DC = 20 - (highest level of spell the caster is capable of - level
        the spell is being cast at)
      </p>
      <p>Roll D20 + spellcasting ability or Con mod (player's choice)</p>
      <p>
        This completely replaces the 5e Concentration mechanic. (Note: This
        inevitably breaks the balance on a few spells, so you may have to tweak
        exactly how they work. The main culprit my players have abused so far is
        Spiritual Guardians.)
      </p>
    </details>
  </aside>
{/if}
<main>
  {#if savedCombats.length}
    <div in:fade out:slide>
      <label class="saved">
        <strong>Saved Combats:</strong>
        <select bind:value={selectedCombat}>
          {#each savedCombats as savedCombat (savedCombat.title)}
            <option value={savedCombat}>{savedCombat.title}</option>
          {/each}
        </select>
      </label>
      <div class="saved-buttons">
        <button
          class="delete"
          on:click={() => {
            localStorage.removeItem(selectedCombat.title);
            combatTitle = undefined;
            lastSavedRound = undefined;
            getSavedCombats();
          }}>Delete</button
        >
        <button
          class="load"
          on:click={() => {
            combat = selectedCombat.combat;
            combatTitle = selectedCombat.title;
            lastSavedRound = selectedCombat.combat.currentRoundNumber;
          }}>Load Saved Combat</button
        >
      </div>
    </div>
  {/if}
  <div class="auto-sort">
    <input
      type="checkbox"
      id="auto-sort"
      bind:checked={autoSort}
      on:change={() => {
        if (autoSort) {
          localStorage.setItem("autoSort", "true");
        } else {
          localStorage.removeItem("autoSort");
        }
      }}
    />
    <label for="auto-sort"
      >Automatically sort by segment when rolling all initiatives</label
    >
  </div>
  {#each combat.roundsData as round}
    <Round
      bind:round
      {autoSort}
      current={round.roundNumber === combat.currentRoundNumber}
      on:next={(event) => {
        combat.roundsData = [...combat.roundsData, event.detail];
        combat.currentRoundNumber = event.detail.roundNumber;
      }}
    />
  {/each}
</main>
<footer>
  <p>
    <strong>Last saved as:</strong>
    {combatTitle ?? "Not saved"} - Round: {lastSavedRound ?? "N/A"}
  </p>
  <button
    class="save highlighted"
    on:click={() => {
      const title = window.prompt("Save As:", combatTitle);
      if (!title || !title.length) {
        return;
      }
      localStorage.setItem(title, JSON.stringify(combat));
      combatTitle = title;
      lastSavedRound = combat.currentRoundNumber;
      getSavedCombats();
      selectedCombat = savedCombats.find((saved) => saved.title === title);
    }}>Save Combat</button
  >
</footer>

<style>
  h1 {
    margin-block-end: 0;
  }
  header,
  footer {
    display: flex;
    flex-wrap: wrap;
    column-gap: 12px;
  }
  header .buttons,
  .save {
    margin-inline-start: auto;
    align-self: flex-end;
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  .clear {
    margin-inline-end: 8px;
  }
  footer .save {
    align-self: center;
  }
  select {
    display: block;
    margin-block: 8px 16px;
    min-width: 10em;
  }
  .saved {
    margin-block-start: 24px;
    display: block;
  }
  .saved-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  footer p {
    font-size: 1.25rem;
    line-height: 1;
  }
  .auto-sort {
    margin-block-start: 24px;
  }
  details {
    margin-block-start: 8px;
    max-width: 900px;
  }
  details > :not(summary) {
    margin-inline-start: 48px;
    line-height: 1.7;
  }
  details > p:first-of-type {
    margin-block: 16px;
  }
  .details-heading {
    display: block;
    margin-block-start: 24px;
  }
</style>
