<script lang="ts">
  import { onMount } from "svelte";
  import Round from "./lib/Round.svelte";
  import { INITIATIVE_DIE, type Combat, type SavedCombat } from "./lib/types";

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

  function getSavedCombats() {
    const combats: SavedCombat[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      console.log(localStorage.key(i));
      if (localStorage.key(i) === "admin") {
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
  });
</script>

<header>
  <h1>
    Initiative Tracker{combatTitle ? ` - ${combatTitle}` : ``} - Round: {combat.currentRoundNumber}
  </h1>
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
</header>
<main>
  {#if savedCombats.length}
    <label>
      Saved Combats:
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
  {/if}
  {#each combat.roundsData as round}
    <Round
      bind:round
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
  }
  .save {
    margin-inline-start: auto;
    align-self: flex-end;
  }
  footer .save {
    align-self: center;
  }
  select {
    display: block;
    margin-block: 0.5rem 1rem;
    min-width: 10em;
  }
  label {
    margin-block-start: 1.5rem;
    display: block;
  }
  .saved-buttons {
    display: flex;
    gap: 0.75rem;
  }
  footer p {
    font-size: 1.25rem;
    line-height: 1;
  }
</style>
