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
      getSavedCombats();
      selectedCombat = savedCombats.find((saved) => saved.title === title);
    }}>Save Combat</button
  >
</header>
<main>
  {#if savedCombats.length}
    <select bind:value={selectedCombat}>
      {#each savedCombats as savedCombat (savedCombat.title)}
        <option value={savedCombat}>{savedCombat.title}</option>
      {/each}
    </select>
    <button
      class="delete"
      on:click={() => {
        localStorage.removeItem(selectedCombat.title);
        getSavedCombats();
      }}>Delete</button
    >
    <button
      class="load"
      on:click={() => {
        combat = selectedCombat.combat;
        combatTitle = selectedCombat.title;
      }}>Load Saved Combat</button
    >
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

<style>
  header {
    position: sticky;
    top: 0;
    display: flex;
    background-color: var(--background-color);
    height: 90px;
    overflow: hidden;
    z-index: 1;
  }
  .save {
    margin-inline-start: auto;
    align-self: center;
  }
</style>
