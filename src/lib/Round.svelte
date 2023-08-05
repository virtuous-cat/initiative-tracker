<script lang="ts">
  import type { Monster } from "./types";

  export let roundNumber: number = 1;
  export let monsters: Monster[] = [];
</script>

<section class="round">
  <h2>Round {roundNumber}</h2>
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
        <th>Initiative Die</th>
        <th>Dex Bonus</th>
        <th>Initiative Segment</th>
      </tr>
    </thead>
    <tbody>
      {#each monsters as monster (monster.number)}
        <tr class="monster" class:dead={!monster.alive}>
          <td>{monster.number}</td>
          <td>{monster.name}</td>
          <td>{monster.info}</td>
          <td>{monster.ac}</td>
          <td>{monster.hp}</td>
          <td>{monster.status}</td>
          <td>{monster.initiativeDie}</td>
          <td>{monster.dexBonus}</td>
          <td>{monster.initiativeSeg}</td>
          <td><button>Roll Initiative</button></td>
          <td><button>Add Split Initiative Attack</button></td>
          <td><button>{monster.alive ? "Mark Dead" : "Mark Alive"}</button></td>
        </tr>
        {#if monster.extraAttacks.length}
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
  {#if monsters.length}
    <button>Roll All Initiatives</button>
  {/if}
</section>
