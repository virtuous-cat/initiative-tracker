export const INITIATIVE_DIE = {
  NONE: "--",
  D4: "d4",
  D6: "d6",
  D8: "d8",
  D10: "d10",
  D12: "d12",
} as const;

export type InitiativeDie =
  (typeof INITIATIVE_DIE)[keyof typeof INITIATIVE_DIE];

export type ExtraAttack = {
  initiativeDie?: InitiativeDie;
  initiativeSeg?: number;
};

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
