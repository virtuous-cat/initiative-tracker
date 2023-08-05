export type ExtraAttack = {
  initiativeDie?: "d4" | "d6" | "d8" | "d10" | "d12";
  initiativeSeg?: number;
};

export type Monster = {
  number: number;
  name: string;
  alive: boolean;
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

export type Combat = {
  round: number;
  monsters: Monster[];
};
