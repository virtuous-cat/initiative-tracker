<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Round } from "./types";
  import { INITIATIVE_DIE } from "./types";

  export let round: Round;
  export let current: boolean;

  let sortBy: string;

  const dispatch = createEventDispatcher<{ next: Round }>();
</script>

<section class="round">
  <h2>Round {round.roundNumber}</h2>
  <label>
    Sort by: <select bind:value={sortBy}>
      <option value="number">Monster #</option>
      <option value="name">Name</option>
      <option value="seg">Initiative Segment</option>
    </select>
  </label>
  <table>
    <thead>
      <tr>
        <th>Monster #</th>
        <th>Name</th>
        <th>Info</th>
        <th>Target</th>
        <th>Status</th>
        <th>HP</th>
        <th>AC</th>
        <th>Dex Bonus</th>
      </tr>
    </thead>
    <tbody>
      {#each round.monsters as monster (monster.number)}
        <tr class="monster" class:dead={!monster.alive}>
          <td>{monster.number}</td>
          <td contenteditable bind:textContent={monster.name} />
          <td class="info">
            <div contenteditable bind:textContent={monster.info} />
            {#if monster.info?.startsWith("http")}
              <a href={monster.info} target="_blank" class="btn">Go</a>
            {/if}
          </td>
          <td contenteditable bind:textContent={monster.target} />
          <td contenteditable bind:textContent={monster.status} />
          <td><input type="number" bind:value={monster.hp} /></td>
          <td><input type="number" bind:value={monster.ac} /></td>
          <td><input type="number" bind:value={monster.dexBonus} /></td>
        </tr>
        <tr>
          <th class="empty" />
          <th>Initiative Die</th>
          <th>Initiative Segment</th>
          <td colspan="5" class="btn-td">
            <button>Add Split Initiative Attack</button>
            <button>{monster.alive ? "Mark Dead" : "Mark Alive"}</button>
            <button>Copy Monster</button>
          </td></tr
        >
        <tr class="base-attacks" class:dead={!monster.alive}>
          <td class="empty" />
          <td
            ><select bind:value={monster.initiativeDie}>
              {#each Object.values(INITIATIVE_DIE) as val}
                <option value={val}>{val}</option>
              {/each}
            </select></td
          >
          <td
            ><input
              type="number"
              bind:value={monster.initiativeSeg}
              min="0"
              max="10"
            /></td
          >
          <td colspan="5">
            <button class="highlighted">Roll Initiative</button>
          </td>
        </tr>
        {#if monster.extraAttacks?.length}
          {#each monster.extraAttacks as attack}
            <tr class="extra-attacks" class:dead={!monster.alive}>
              <td class="empty" />
              <td
                ><select bind:value={attack.initiativeDie}>
                  {#each Object.values(INITIATIVE_DIE) as val}
                    <option value={val}>{val}</option>
                  {/each}
                </select></td
              >
              <td
                ><input
                  type="number"
                  bind:value={attack.initiativeSeg}
                  min="0"
                  max="10"
                /></td
              >
              <td colspan="5"
                ><button class="highlighted">Roll Initiative</button></td
              >
            </tr>
          {/each}
        {/if}
      {/each}
    </tbody>
  </table>
  <div class="buttons">
    <button>Add New Monster</button>
    <button class="highlighted">Roll All Initiatives</button>
    {#if current}
      <button
        class="next highlighted"
        on:click={() => {
          // TODO: handle if sorted by seg
          const nextRound = {
            roundNumber: round.roundNumber + 1,
            monsters: round.monsters.map((monster) => {
              return {
                ...monster,
                initiativeSeg: undefined,
                extraAttacks: monster.extraAttacks.map((attack) => {
                  return { ...attack, initiativeSeg: undefined };
                }),
              };
            }),
          };
          dispatch("next", nextRound);
        }}>Next Round</button
      >
    {/if}
  </div>
</section>
<hr />

<style>
  .dead * {
    text-decoration: line-through;
  }
  table {
    border-collapse: separate;
    border-spacing: 0px;
    margin-block: 1rem;
    border: 1px solid var(--text-color);
  }
  thead {
    position: sticky;
    top: 90px;
    background-color: var(--background-color);
  }
  td,
  th {
    border: 1px solid var(--text-color);
    padding: 0.5rem 1rem;
  }
  .btn-td > :not(:last-child) {
    margin-inline-end: calc(1rem - 4px);
  }
  .empty {
    border-block: none;
  }
  input {
    max-width: 4em;
  }
  .info {
    display: flex;
  }
  .info div {
    flex-grow: 1;
  }
  .btn {
    border-radius: 6px;
    padding: 0 0.25rem;
    margin-inline-start: 14px;
    /* color: var(--text-color); */
  }
  .buttons {
    display: flex;
    gap: 1em;
  }
  .next {
    margin-inline-start: auto;
  }
  hr {
    color: var(--text-color);
    margin-block-start: 1.25em;
    margin-block-end: 1.5em;
  }
</style>
