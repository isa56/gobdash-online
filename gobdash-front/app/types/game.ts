export enum CardTypes {
  GO_SALON = 'GO_SALON',
  GO_STOVE = 'GO_STOVE',
  GO_PANTRY = 'GO_PANTRY',
  GO_COUNTERTOP = 'GO_COUNTERTOP',
  PREPARE = 'PREPARE',
  GET = 'GET',
  LET_GO = 'LET_GO',
}

export enum PreparationStep {
  STOVE = 'STOVE',
  COUNTERTOP = 'COUNTERTOP',
}

type PreparationStatus = 'PREPARED' | 'UNPREPARED' | null;

export class Recipe {
  name: string;
  ingredients: Ingredient[];
  preparationSteps: PreparationStep[] = [];

  constructor(
    name: string,
    ingredients: Ingredient[],
    preparationSteps: PreparationStep[] = [],
  ) {
    this.name = name;
    this.ingredients = ingredients;
    this.preparationSteps = preparationSteps;
  }

  checkRecipeCompletion(ingredientStates: Ingredient[]): boolean {
    // Check if all required ingredients are present in the ingredientStates
    this.ingredients.forEach((requiredIngredient) => {
      const matchingIngredient = ingredientStates.find(
        (ingredient) => ingredient.name === requiredIngredient.name,
      );
      if (!matchingIngredient) {
        return false; // Required ingredient is missing
      }

      // If the required ingredient has preparation, check if the preparation status matches
      if (
        requiredIngredient.hasPreparation &&
        matchingIngredient.preparation !== requiredIngredient.preparation
      ) {
        return false; // Preparation status does not match
      }
    });

    return true; // All required ingredients are present
  }
}

export class Ingredient {
  name: string;
  hasPreparation: boolean;
  preparation: PreparationStatus;

  constructor(
    name: string,
    hasPreparation: boolean,
    preparation?: 'PREPARED' | 'UNPREPARED' | null,
  ) {
    this.name = name;
    this.hasPreparation = hasPreparation;
    if (preparation === undefined) {
      this.preparation = hasPreparation ? 'UNPREPARED' : null;
    } else {
      this.preparation = preparation;
    }
  }
}

export type GamePhase = 'PLANNING' | 'EXECUTING' | 'DEBUGGING';

export type ExecutionStep = {
  stepIndex: number; // Card Index of the list
  gobPlacement: CardTypes; // Represents the card that Gob placed
  gobHand: Ingredient[]; // Represents Gob's two hands
  stoveState: Ingredient; // Represents the ingredient state that weas put in the stove
  countertopState: Ingredient; // Represents the ingredient state that weas put in the countertop
  delivered: boolean; // Indicates whether the recipe was delivered to the customer
};

export class Card {
  id: number;
  type: CardTypes;

  constructor(id: number, type: CardTypes) {
    this.id = id;
    this.type = type;
  }
}

export type GameState = {
  roomId: string;
  phase: GamePhase;
  activePlayerId: string;
  drawPileCount: number;
  discardPile: Card[];
  myHand: Card[];
  pendingAnimationQueue: ExecutionStep[];
};
