<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import type { InitiativeDie, Round } from "./types";
  import { INITIATIVE_DIE } from "./types";
  import { Random } from "random-js";
  import { fade, slide } from "svelte/transition";

  export let round: Round;
  export let current: boolean;
  export let autoSort = false;

  let sortBy: string;
  let roundHeading;

  const dispatch = createEventDispatcher<{ next: Round }>();

  const random = new Random();

  onMount(() => {
    if (roundHeading) {
      roundHeading.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  function rollInitiative({
    initiativeDie,
    dexBonus,
  }: {
    initiativeDie: InitiativeDie;
    dexBonus: number;
  }) {
    if (initiativeDie === INITIATIVE_DIE.NONE) {
      return;
    }
    const roll = random.die(parseInt(initiativeDie.slice(1)));
    const rawSeg = roll - dexBonus;
    return rawSeg < 0 ? 0 : rawSeg > 10 ? 10 : rawSeg;
  }

  function sortBySeg() {
    round.monsters = round.monsters.sort((monsterA, monsterB) => {
      if (monsterA.extraAttacks?.length || monsterB.extraAttacks?.length) {
        const attacksA = [
          monsterA.initiativeSeg,
          ...monsterA.extraAttacks.map((attack) => attack.initiativeSeg),
        ];
        const earliestA = attacksA.sort((a, b) => a - b)[0];
        const attacksB = [
          monsterB.initiativeSeg,
          ...monsterB.extraAttacks.map((attack) => attack.initiativeSeg),
        ];
        const earliestB = attacksB.sort((a, b) => a - b)[0];
        return earliestA - earliestB;
      }
      return monsterA.initiativeSeg - monsterB.initiativeSeg;
    });
  }
</script>

<section class="round" transition:fade={{ duration: 500 }}>
  <h2 bind:this={roundHeading}>Round {round.roundNumber}</h2>
  <div class="buttons">
    <label class="sort">
      Sort by: <select
        bind:value={sortBy}
        on:change={() => {
          switch (sortBy) {
            case "number":
              round.monsters = round.monsters.sort(
                (monsterA, monsterB) => monsterA.number - monsterB.number
              );
              break;
            case "name":
              round.monsters = round.monsters.sort((monsterA, monsterB) => {
                const nameA = monsterA.name.toUpperCase();
                const nameB = monsterB.name.toUpperCase();
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }
                return 0;
              });
              break;
            case "seg":
              sortBySeg();
              break;
            default:
              break;
          }
        }}
      >
        <option value="number">Monster #</option>
        <option value="name">Name</option>
        <option value="seg">Earliest Initiative Segment</option>
      </select>
    </label>
    <button
      class="highlighted"
      on:click={() => {
        round.monsters = round.monsters.map((monster) => {
          return {
            ...monster,
            initiativeSeg: rollInitiative({
              initiativeDie: monster.initiativeDie,
              dexBonus: monster.dexBonus,
            }),
            extraAttacks: monster.extraAttacks?.map((attack) => {
              return {
                ...attack,
                initiativeSeg: rollInitiative({
                  initiativeDie: attack.initiativeDie,
                  dexBonus: monster.dexBonus,
                }),
              };
            }),
          };
        });
        if (autoSort) {
          sortBySeg();
          sortBy = "seg";
        }
      }}>Roll All Initiatives</button
    >
  </div>
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
            {#if monster.info?.includes("http")}
              <a
                href={monster.info
                  .split(" ")
                  .find((word) => word.startsWith("http"))}
                target="_blank"
                class="info-btn">Go</a
              >
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
            <button
              on:click={() => {
                monster.extraAttacks = [
                  ...monster.extraAttacks,
                  { initiativeDie: INITIATIVE_DIE.NONE },
                ];
              }}>Add Split Initiative Attack</button
            >
            <button
              on:click={() => {
                round.monsters = round.monsters.filter(
                  ({ number }) => number !== monster.number
                );
              }}>Delete</button
            >
            <button
              on:click={() => {
                monster.alive = !monster.alive;
              }}>{monster.alive ? "Mark Dead" : "Mark Alive"}</button
            >
            <button
              on:click={() => {
                const newMonster = {
                  ...monster,
                  number: round.monsters.length + 1,
                  alive: true,
                  initiativeSeg: undefined,
                  extraAttacks: monster.extraAttacks?.map((attack) => {
                    return { ...attack, initiativeSeg: undefined };
                  }),
                };
                round.monsters = [...round.monsters, newMonster];
              }}>Copy Monster</button
            >
          </td>
        </tr>
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
            <button
              class="highlighted"
              on:click={() => {
                monster.initiativeSeg = rollInitiative({
                  initiativeDie: monster.initiativeDie,
                  dexBonus: monster.dexBonus,
                });
                if (autoSort) {
                  sortBySeg();
                }
              }}>Roll Initiative</button
            >
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
                ><button
                  class="highlighted"
                  on:click={() => {
                    attack.initiativeSeg = rollInitiative({
                      initiativeDie: attack.initiativeDie,
                      dexBonus: monster.dexBonus,
                    });
                  }}>Roll Initiative</button
                ></td
              >
            </tr>
          {/each}
        {/if}
      {/each}
    </tbody>
  </table>
  <div class="buttons">
    <button
      on:click={() => {
        const newMonster = {
          number: round.monsters.length + 1,
          alive: true,
          name: "",
          target: "",
          initiativeDie: INITIATIVE_DIE.NONE,
          dexBonus: 0,
          extraAttacks: [],
          status: "",
          info: "",
        };
        round.monsters = [...round.monsters, newMonster];
      }}>Add New Monster</button
    >
    <button
      class="highlighted"
      on:click={() => {
        round.monsters = round.monsters.map((monster) => {
          return {
            ...monster,
            initiativeSeg: rollInitiative({
              initiativeDie: monster.initiativeDie,
              dexBonus: monster.dexBonus,
            }),
            extraAttacks: monster.extraAttacks?.map((attack) => {
              return {
                ...attack,
                initiativeSeg: rollInitiative({
                  initiativeDie: attack.initiativeDie,
                  dexBonus: monster.dexBonus,
                }),
              };
            }),
          };
        });
        if (autoSort) {
          sortBySeg();
          sortBy = "seg";
        }
      }}>Roll All Initiatives</button
    >
    {#if current}
      <button
        class="next highlighted"
        on:click={() => {
          const nextRound = {
            roundNumber: round.roundNumber + 1,
            monsters: round.monsters
              .map((monster) => {
                return {
                  ...monster,
                  initiativeSeg: undefined,
                  extraAttacks: monster.extraAttacks.map((attack) => {
                    return { ...attack, initiativeSeg: undefined };
                  }),
                };
              })
              .sort((monsterA, monsterB) => monsterA.number - monsterB.number),
          };
          dispatch("next", nextRound);
        }}>Next Round</button
      >
    {/if}
  </div>
</section>
<hr transition:fade={{ duration: 500 }} />

<style>
  .dead * {
    text-decoration: line-through;
    opacity: 0.7;
  }
  table {
    border-collapse: separate;
    border-spacing: 0px;
    margin-block: 16px;
    border: 1px solid var(--text-color);
    border-top-color: var(--button-border-hover);
  }
  thead {
    position: sticky;
    top: 0px;
    background-color: var(--background-color);
    z-index: 1;
  }
  td,
  th {
    border: 1px solid var(--text-color);
    padding: 8px 16px;
  }
  thead th {
    border: 2px solid var(--button-border-hover);
  }
  tbody :first-child td {
    border-top-color: var(--button-border-hover);
  }
  .btn-td > :not(:last-child) {
    margin-inline-end: 12px;
  }
  .btn-td > button {
    margin-block-end: 4px;
  }
  .btn-td {
    padding-block-end: 4px;
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
    min-height: 24.4px;
  }
  .info-btn {
    border-radius: 6px;
    padding: 0 4px;
    line-height: 1.2;
    margin-inline-start: 14px;
  }
  .buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  .next {
    margin-inline-start: auto;
  }
  hr {
    color: var(--text-color);
    margin-block-start: 20px;
    margin-block-end: 24px;
  }
</style>
