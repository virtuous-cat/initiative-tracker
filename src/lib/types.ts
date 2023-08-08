export type ExtraAttack = {
  initiativeDie?: "d4" | "d6" | "d8" | "d10" | "d12";
  initiativeSeg?: number;
};

export const INITIATIVE_DIE = {
  NONE: "--",
  D4: "d4",
  D6: "d6",
  D8: "d8",
  D10: "d10",
  D12: "d12",
} as const;

type ObjectValues<T> = T[keyof T];

export type InitiativeDie = ObjectValues<typeof INITIATIVE_DIE>;

export type Monster = {
  number: number;
  alive: boolean;
  name?: string;
  ac?: number;
  hp?: number;
  target?: string;
  initiativeDie?: InitiativeDie;
  dexBonus?: number;
  initiativeSeg?: number;
  extraAttacks?: ExtraAttack[];
  status?: string;
  info?: string;
};

export type Round = {
  roundNumber: number;
  monsters: Monster[];
};
export type Combat = {
  currentRoundNumber: number;
  roundsData: Round[];
};

export type SavedCombat = {
  title: string;
  combat: Combat;
};
