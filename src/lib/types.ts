export type ExtraAttack = {
  initiativeDie?: "d4" | "d6" | "d8" | "d10" | "d12";
  initiativeSeg?: number;
};

export type Monster = {
  number: number;
  alive: boolean;
  name?: string;
  ac?: number;
  hp?: number;
  target?: string;
  initiativeDie?: "d4" | "d6" | "d8" | "d10" | "d12";
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
