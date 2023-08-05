<script lang="ts">
  import Round from "./lib/Round.svelte";
  import type { Combat } from "./lib/types";

  let combat: Combat = {
    currentRoundNumber: 1,
    roundsData: [{ roundNumber: 1, monsters: [{ number: 1, alive: true }] }],
  };
</script>

<main>
  <h1>Initiative Tracker</h1>
  <button id="load">Load Saved Combat</button>
  <button id="save">Save Combat</button>
  {#each combat.roundsData as round}
    <Round {...round} />
  {/each}
</main>

<style>
</style>
