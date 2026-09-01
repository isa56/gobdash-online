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
  image: string;

  constructor(id: number, type: CardTypes) {
    this.id = id;
    this.type = type;
    this.image = this.getImageFromType();
  }

  getImageFromType(): string {
    if (this.type === CardTypes.GO_SALON) {
      return '/images/action_cards/go_salon.png';
    } else if (this.type === CardTypes.GO_STOVE) {
      return '/images/action_cards/go_stove.png';
    } else if (this.type === CardTypes.GO_PANTRY) {
      return '/images/action_cards/go_pantry.png';
    } else if (this.type === CardTypes.GO_COUNTERTOP) {
      return '/images/action_cards/go_countertop.png';
    } else if (this.type === CardTypes.PREPARE) {
      return '/images/action_cards/prepare.png';
    } else if (this.type === CardTypes.GET) {
      return '/images/action_cards/get.png';
    } else if (this.type === CardTypes.LET_GO) {
      return '/images/action_cards/let_go.png';
    } else {
      return '/images/action_cards/default.png'; // Default image for unknown card types
    }
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
