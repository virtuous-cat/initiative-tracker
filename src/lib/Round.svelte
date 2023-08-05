<script lang="ts">
  import type { Monster } from "./types";

  export let roundNumber: number = 1;
  export let monsters: Monster[] = [];

  let sortBy: string;
</script>

<section class="round">
  <h2>Round {roundNumber}</h2>
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
        <th>AC</th>
        <th>HP</th>
        <th>Status</th>
        <th>Target</th>
        <th>Dex Bonus</th>
        <th>Initiative Die</th>
        <th>Initiative Segment</th>
      </tr>
    </thead>
    <tbody>
      {#each monsters as monster (monster.number)}
        <tr class="monster" class:dead={!monster.alive}>
          <td>{monster.number}</td>
          <td>{monster.name}</td>
          {#if monster.info?.startsWith("http")}
            <td><a href={monster.info}>Link</a></td>
          {:else}
            <td>{monster.info}</td>
          {/if}
          <td>{monster.ac}</td>
          <td>{monster.hp}</td>
          <td>{monster.status}</td>
          <td>{monster.target}</td>
          <td>{monster.dexBonus}</td>
          <td>{monster.initiativeDie}</td>
          <td>{monster.initiativeSeg}</td>
          <td><button>Roll Initiative</button></td>
          <td><button>Add Split Initiative Attack</button></td>
          <td><button>{monster.alive ? "Mark Dead" : "Mark Alive"}</button></td>
          <td><button>Copy Monster</button></td>
        </tr>
        {#if monster.extraAttacks?.length}
          {#each monster.extraAttacks as attack}
            <tr class="extra-attacks" class:dead={!monster.alive}>
              <td>{attack.initiativeDie}</td>
              <td>{attack.initiativeSeg}</td>
              <td><button>Roll Initiative</button></td>
            </tr>
          {/each}
        {/if}
      {/each}
    </tbody>
  </table>
  <button>Add New Monster</button>
  {#if monsters.length}
    <button>Roll All Initiatives</button>
  {/if}
</section>

<style>
  .dead * {
    text-decoration: line-through;
  }
</style>
