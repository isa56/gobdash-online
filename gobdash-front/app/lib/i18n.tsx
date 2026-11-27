import { createContext, useContext, useEffect, useState } from 'react';
import { CardTypes } from '~/types/game';

export const languages = ['en', 'pt-BR'] as const;
export type Language = (typeof languages)[number];

const translations = {
  en: {
    language: 'Language',
    welcome: 'Welcome to GobDash!',
    onlineDescriptionBefore: 'Online implementation of the',
    onlineDescriptionAfter: ' board game.',
    checkOut: 'Check out the',
    itchPage: 'Itch.io page',
    createGame: 'Create Game',
    creatingRoom: 'Creating Room...',
    orJoinWithCode: 'Or join with code',
    enterRoomCode: 'Enter Room Code',
    joinGame: 'Join Game',
    joiningRoom: 'Joining Room...',
    unableToCreateRoom: 'Unable to create room.',
    unableToJoinRoom: 'Unable to join room.',
    playingGobDash: 'Playing GobDash',
    gameDescription: 'Game',
    connectionFailed: 'Connection to the game server failed.',
    useCard: '1. Use a card',
    buyCard: '2. Buy a card',
    room: 'Room',
    playerTurn: "Player {player}'s turn",
    turnNumber: 'Turn number: {number}',
    roomCopied: 'Room number copied!',
    pantry: 'Pantry',
    stove: 'Stove',
    countertop: 'Countertop',
    salon: 'Salon',
    delivery: 'Delivery',
    leftHand: 'Left Hand',
    rightHand: 'Right Hand',
    moveSelectedObject: 'Move selected object to {space}',
    chooseFoodForPantry: 'Choose a food token for the pantry',
    objectSelected: 'Object selected. Choose a destination area.',
    noObjectSelected: 'No object selected.',
    chooseFoodToken: 'Choose a food token',
    chooseIngredient: 'Choose an ingredient',
    closeFoodChooser: 'Close food token chooser',
    addFoodToPantry: 'Add {food} to pantry',
    selectedCardDestination: 'Card {card} selected. Choose a destination.',
    selectedTokenDestination: '{token} token selected. Choose a card slot.',
    noDraggableSelected: 'No draggable object selected.',
    tokens: 'Tokens',
    hand: 'Hand',
    buyDeck: 'Buy Deck',
    buyDeckAria: 'Buy deck, {count} cards remaining',
    empty: 'Empty',
    noRecipeAvailable: 'No recipe available',
    clickAgainToCancel: 'Click again to cancel',
    clickToSelect: 'Click to select',
    cardsLeft: '{count} cards left',
    oneCardLeft: '1 card left',
    discard: 'Discard',
    moveCardToDiscard: 'Move selected card to discard',
    discardPile: 'Discard pile',
    returnCardToHand: 'Return staged card to hand',
    willDiscard: 'Will discard',
    releaseToDiscard: 'Release to discard',
    dropToDiscard: 'Drop to discard',
    cardCount: '{count} cards',
    oneCardCount: '1 card',
    moveSelectedCard: 'Move selected card to an action slot',
    cardSlot: 'Action card slot',
    moveSelectedToken: 'Place selected token in a code token slot',
    codeTokenSlot: 'Code token slot',
    removeCodeToken: 'Remove code token',
    removePlayedCard: 'Remove played card',
    dropCardHere: 'Drop card here',
    releaseToPlay: 'Release to play',
    buyCardAria: 'Buy {card}',
    confirmUse: 'Confirm Use',
    confirmUseAria: 'Confirm use action',
    confirmBuy: 'Confirm Buy',
    confirmBuyAria: 'Confirm buy action',
    codeToken: 'Code Token',
    errorToken: 'Error Token',
    selectToken: 'Select {token}',
    tokensPlaced: 'Tokens placed',
    gobToken: 'Gob token',
    gob: 'Gob',
    floatingActionButton: 'Floating action button',
    developedBy: 'Developed by',
    checkOutMy: 'Check out my',
    githubPage: 'GitHub Page',
    loading: 'Loading...',
    cardSelected: 'Card selected',
    tokenSelected: 'Token selected',
    goSalonCard: 'Go to the salon',
    goStoveCard: 'Go to the stove',
    goPantryCard: 'Go to the pantry',
    goCountertopCard: 'Go to the countertop',
    prepareCard: 'Prepare',
    getCard: 'Get',
    letGoCard: 'Let go',
    water: 'Water',
    orange: 'Orange',
    eggs: 'Eggs',
    eggsPrepared: 'Prepared eggs',
    bread: 'Bread',
    meat: 'Meat',
    meatPrepared: 'Prepared meat',
    potato: 'Potato',
    potatoPrepared: 'Prepared potato',
    carrot: 'Carrot',
    carrotPrepared: 'Prepared carrot',
    cheese: 'Cheese',
    flour: 'Flour',
    waterCup: 'Cup of water',
    orangeJuice: 'Orange juice',
    friedEggs: 'Fried eggs',
    potatoChips: 'Potato chips',
    potatoAndMeat: 'Potato and meat',
    eggSandwich: 'Egg sandwich',
    burger: 'Burger',
    soup: 'Soup',
    carrotCake: 'Carrot cake',
    orangePancakes: 'Orange pancakes',
  },
  'pt-BR': {
    language: 'Idioma',
    welcome: 'Bem-vindo ao GobDash!',
    onlineDescriptionBefore: 'Versão online do jogo de tabuleiro',
    onlineDescriptionAfter: '.',
    checkOut: 'Acesse a',
    itchPage: 'página no Itch.io',
    createGame: 'Criar partida',
    creatingRoom: 'Criando sala...',
    orJoinWithCode: 'Ou entre com um código',
    enterRoomCode: 'Digite o código da sala',
    joinGame: 'Entrar na partida',
    joiningRoom: 'Entrando na sala...',
    unableToCreateRoom: 'Não foi possível criar a sala.',
    unableToJoinRoom: 'Não foi possível entrar na sala.',
    playingGobDash: 'Jogando GobDash',
    gameDescription: 'Partida',
    connectionFailed: 'Falha ao conectar ao servidor do jogo.',
    useCard: '1. Use uma carta',
    buyCard: '2. Compre uma carta',
    room: 'Sala',
    playerTurn: 'Turno do jogador {player}',
    turnNumber: 'Turno: {number}',
    roomCopied: 'Número da sala copiado!',
    pantry: 'Despensa',
    stove: 'Fogão',
    countertop: 'Bancada',
    salon: 'Salão',
    delivery: 'Entrega',
    leftHand: 'Mão esquerda',
    rightHand: 'Mão direita',
    moveSelectedObject: 'Mover objeto selecionado para {space}',
    chooseFoodForPantry: 'Escolher um alimento para a despensa',
    objectSelected: 'Objeto selecionado. Escolha um local de destino.',
    noObjectSelected: 'Nenhum objeto selecionado.',
    chooseFoodToken: 'Escolha um alimento',
    chooseIngredient: 'Escolha um ingrediente',
    closeFoodChooser: 'Fechar seleção de alimentos',
    addFoodToPantry: 'Adicionar {food} à despensa',
    selectedCardDestination: 'Carta {card} selecionada. Escolha um destino.',
    selectedTokenDestination: 'Marcador {token} selecionado. Escolha uma carta.',
    noDraggableSelected: 'Nenhum item arrastável selecionado.',
    tokens: 'Marcadores',
    hand: 'Mão',
    buyDeck: 'Comprar do baralho',
    buyDeckAria: 'Comprar do baralho, {count} cartas restantes',
    empty: 'Vazio',
    noRecipeAvailable: 'Nenhuma receita disponível',
    clickAgainToCancel: 'Clique novamente para cancelar',
    clickToSelect: 'Clique para selecionar',
    cardsLeft: '{count} cartas restantes',
    oneCardLeft: '1 carta restante',
    discard: 'Descarte',
    moveCardToDiscard: 'Mover carta selecionada para o descarte',
    discardPile: 'Pilha de descarte',
    returnCardToHand: 'Devolver carta à mão',
    willDiscard: 'Será descartada',
    releaseToDiscard: 'Solte para descartar',
    dropToDiscard: 'Solte para descartar',
    cardCount: '{count} cartas',
    oneCardCount: '1 carta',
    moveSelectedCard: 'Mover carta selecionada para um espaço de ação',
    cardSlot: 'Espaço de carta de ação',
    moveSelectedToken: 'Posicionar marcador selecionado em um espaço de código',
    codeTokenSlot: 'Espaço de marcador de código',
    removeCodeToken: 'Remover marcador de código',
    removePlayedCard: 'Remover carta jogada',
    dropCardHere: 'Solte a carta aqui',
    releaseToPlay: 'Solte para jogar',
    buyCardAria: 'Comprar {card}',
    confirmUse: 'Confirmar uso',
    confirmUseAria: 'Confirmar ação de uso',
    confirmBuy: 'Confirmar compra',
    confirmBuyAria: 'Confirmar ação de compra',
    codeToken: 'Marcador de código',
    errorToken: 'Marcador de erro',
    selectToken: 'Selecionar {token}',
    tokensPlaced: 'Marcadores posicionados',
    gobToken: 'Marcador do Gob',
    gob: 'Gob',
    floatingActionButton: 'Botão de ação flutuante',
    developedBy: 'Desenvolvido por',
    checkOutMy: 'Acesse minha',
    githubPage: 'página no GitHub',
    loading: 'Carregando...',
    cardSelected: 'Carta selecionada',
    tokenSelected: 'Marcador selecionado',
    goSalonCard: 'Ir ao salão',
    goStoveCard: 'Ir ao fogão',
    goPantryCard: 'Ir à despensa',
    goCountertopCard: 'Ir à bancada',
    prepareCard: 'Preparar',
    getCard: 'Pegar',
    letGoCard: 'Soltar',
    water: 'Água',
    orange: 'Laranja',
    eggs: 'Ovos',
    eggsPrepared: 'Ovos preparados',
    bread: 'Pão',
    meat: 'Carne',
    meatPrepared: 'Carne preparada',
    potato: 'Batata',
    potatoPrepared: 'Batata preparada',
    carrot: 'Cenoura',
    carrotPrepared: 'Cenoura preparada',
    cheese: 'Queijo',
    flour: 'Farinha',
    waterCup: 'Copo de água',
    orangeJuice: 'Suco de laranja',
    friedEggs: 'Ovos fritos',
    potatoChips: 'Batata frita',
    potatoAndMeat: 'Batata com carne',
    eggSandwich: 'Sanduíche de ovo',
    burger: 'Hambúrguer',
    soup: 'Sopa',
    carrotCake: 'Bolo de cenoura',
    orangePancakes: 'Panquecas de laranja',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (
    key: TranslationKey,
    values?: Record<string, string | number>,
  ) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const STORAGE_KEY = 'gobdash-language';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem(STORAGE_KEY);
    setLanguage(
      languages.find((candidate) => candidate === savedLanguage) ?? 'en',
    );
    setInitialized(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    if (initialized) {
      window.localStorage.setItem(STORAGE_KEY, language);
    }
  }, [initialized, language]);

  const t: LanguageContextValue['t'] = (key, values = {}) =>
    Object.entries(values).reduce(
      (message, [name, value]) =>
        message.replaceAll(`{${name}}`, String(value)),
      translations[language][key] as string,
    );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider.');
  }
  return context;
}

const ingredientTranslationKeys: Record<string, TranslationKey> = {
  Water: 'water',
  Orange: 'orange',
  Eggs: 'eggs',
  Eggs_Prepared: 'eggsPrepared',
  Bread: 'bread',
  Meat: 'meat',
  Meat_Prepared: 'meatPrepared',
  Potato: 'potato',
  Potato_Prepared: 'potatoPrepared',
  Carrot: 'carrot',
  Carrot_Prepared: 'carrotPrepared',
  Cheese: 'cheese',
  Flour: 'flour',
};

const recipeTranslationKeys: Record<string, TranslationKey> = {
  Water_Cup: 'waterCup',
  Orange_Juice: 'orangeJuice',
  Fried_Eggs: 'friedEggs',
  Potato_Chips: 'potatoChips',
  Potato_and_Meat: 'potatoAndMeat',
  Egg_Sandwich: 'eggSandwich',
  Burger: 'burger',
  Soup: 'soup',
  Carrot_Cake: 'carrotCake',
  Orange_Pancakes: 'orangePancakes',
};

export function getIngredientLabel(
  name: string,
  t: LanguageContextValue['t'],
): string {
  const key = ingredientTranslationKeys[name];
  return key ? t(key) : name;
}

export function getRecipeLabel(
  name: string,
  t: LanguageContextValue['t'],
): string {
  const key = recipeTranslationKeys[name];
  return key ? t(key) : name;
}

const cardTranslationKeys: Record<CardTypes, TranslationKey> = {
  [CardTypes.GO_SALON]: 'goSalonCard',
  [CardTypes.GO_STOVE]: 'goStoveCard',
  [CardTypes.GO_PANTRY]: 'goPantryCard',
  [CardTypes.GO_COUNTERTOP]: 'goCountertopCard',
  [CardTypes.PREPARE]: 'prepareCard',
  [CardTypes.GET]: 'getCard',
  [CardTypes.LET_GO]: 'letGoCard',
};

export function getCardLabel(
  type: CardTypes,
  t: LanguageContextValue['t'],
): string {
  return t(cardTranslationKeys[type]);
}
