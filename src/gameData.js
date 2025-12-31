/**
 * Ultimate Risk - WW2 Strategy Game Data
 * Historical data for nations, leaders, units, and territories
 */

export const NATIONS = {
  GERMANY: {
    id: 'germany',
    name: 'Nazi Germany',
    leader: {
      name: 'Adolf Hitler',
      title: 'Führer',
      bio: 'Leader of Nazi Germany during World War II'
    },
    color: '#4a4a4a',
    startingCurrency: 1000,
    units: {
      infantry: { id: 'ss', name: 'SS Infantry', cost: 100, attack: 3, defense: 2, movement: 1 },
      vehicle: { id: 'panzer', name: 'Panzer IV', cost: 400, attack: 6, defense: 4, movement: 2 },
      naval: { id: 'uboat', name: 'U-boat', cost: 600, attack: 5, defense: 3, movement: 3 },
      aircraft: { id: 'bf109', name: 'Bf 109', cost: 500, attack: 5, defense: 2, movement: 4 }
    }
  },
  BRITAIN: {
    id: 'britain',
    name: 'Great Britain',
    leader: {
      name: 'Winston Churchill',
      title: 'Prime Minister',
      bio: 'Led Britain to victory in World War II'
    },
    color: '#c41e3a',
    startingCurrency: 1000,
    units: {
      infantry: { id: 'sas', name: 'SAS Rogue', cost: 120, attack: 4, defense: 2, movement: 1 },
      vehicle: { id: 'churchill', name: 'Churchill Tank', cost: 420, attack: 5, defense: 5, movement: 1 },
      naval: { id: 'uclass', name: 'U-class Submarine', cost: 550, attack: 4, defense: 3, movement: 3 },
      aircraft: { id: 'spitfire', name: 'Supermarine Spitfire', cost: 480, attack: 5, defense: 3, movement: 4 }
    }
  },
  USA: {
    id: 'usa',
    name: 'United States',
    leader: {
      name: 'Franklin D. Roosevelt',
      title: 'President',
      bio: 'Led the United States through the Great Depression and World War II'
    },
    color: '#002868',
    startingCurrency: 1200,
    units: {
      infantry: { id: 'rangers', name: 'Army Rangers', cost: 110, attack: 4, defense: 2, movement: 1 },
      vehicle: { id: 'sherman', name: 'M4 Sherman', cost: 380, attack: 5, defense: 4, movement: 2 },
      naval: { id: 'fletcher', name: 'Fletcher-class Destroyer', cost: 650, attack: 6, defense: 4, movement: 3 },
      aircraft: { id: 'b17', name: 'B-17 Flying Fortress', cost: 700, attack: 7, defense: 3, movement: 3 }
    }
  },
  CANADA: {
    id: 'canada',
    name: 'Canada',
    leader: {
      name: 'William Lyon Mackenzie King',
      title: 'Prime Minister',
      bio: 'Led Canada through World War II'
    },
    color: '#ff0000',
    startingCurrency: 900,
    units: {
      infantry: { id: 'devils', name: 'Devils Brigade', cost: 130, attack: 4, defense: 3, movement: 1 },
      vehicle: { id: 'ram', name: 'Ram Tank', cost: 360, attack: 4, defense: 4, movement: 2 },
      naval: { id: 'tribal', name: 'Tribal-class Destroyer', cost: 580, attack: 5, defense: 4, movement: 3 },
      aircraft: { id: 'mosquito', name: 'de Havilland Mosquito', cost: 450, attack: 5, defense: 2, movement: 4 }
    }
  },
  FRANCE: {
    id: 'france',
    name: 'France',
    leader: {
      name: 'Charles de Gaulle',
      title: 'General',
      bio: 'Leader of Free France during World War II'
    },
    color: '#0055a4',
    startingCurrency: 800,
    units: {
      infantry: { id: 'resistance', name: 'French Resistance', cost: 90, attack: 3, defense: 2, movement: 1 },
      vehicle: { id: 'char', name: 'Char B1', cost: 340, attack: 4, defense: 5, movement: 1 },
      naval: { id: 'surcouf', name: 'Surcouf Submarine', cost: 520, attack: 4, defense: 3, movement: 2 },
      aircraft: { id: 'd520', name: 'Dewoitine D.520', cost: 420, attack: 4, defense: 2, movement: 4 }
    }
  },
  RUSSIA: {
    id: 'russia',
    name: 'Soviet Union',
    leader: {
      name: 'Joseph Stalin',
      title: 'General Secretary',
      bio: 'Led the Soviet Union during World War II'
    },
    color: '#da291c',
    startingCurrency: 1100,
    units: {
      infantry: { id: 'guards', name: 'Guards Infantry', cost: 95, attack: 3, defense: 3, movement: 1 },
      vehicle: { id: 't34', name: 'T-34', cost: 350, attack: 6, defense: 4, movement: 2 },
      naval: { id: 'sclass', name: 'S-class Submarine', cost: 540, attack: 4, defense: 3, movement: 3 },
      aircraft: { id: 'yak3', name: 'Yakovlev Yak-3', cost: 440, attack: 5, defense: 3, movement: 4 }
    }
  }
};

export const TERRITORIES = {
  // Western Europe
  BRITAIN_HOME: { id: 'britain_home', name: 'Great Britain', owner: 'britain', value: 10, type: 'island' },
  FRANCE_NORTH: { id: 'france_north', name: 'Northern France', owner: 'france', value: 8, type: 'land' },
  FRANCE_SOUTH: { id: 'france_south', name: 'Southern France', owner: 'france', value: 6, type: 'land' },
  NETHERLANDS: { id: 'netherlands', name: 'Netherlands', owner: null, value: 5, type: 'land' },
  BELGIUM: { id: 'belgium', name: 'Belgium', owner: null, value: 5, type: 'land' },

  // Central Europe
  GERMANY_WEST: { id: 'germany_west', name: 'Western Germany', owner: 'germany', value: 10, type: 'land' },
  GERMANY_EAST: { id: 'germany_east', name: 'Eastern Germany', owner: 'germany', value: 10, type: 'land' },
  POLAND: { id: 'poland', name: 'Poland', owner: null, value: 7, type: 'land' },
  CZECHOSLOVAKIA: { id: 'czechoslovakia', name: 'Czechoslovakia', owner: null, value: 6, type: 'land' },
  AUSTRIA: { id: 'austria', name: 'Austria', owner: 'germany', value: 5, type: 'land' },

  // Southern Europe
  ITALY_NORTH: { id: 'italy_north', name: 'Northern Italy', owner: null, value: 6, type: 'land' },
  ITALY_SOUTH: { id: 'italy_south', name: 'Southern Italy', owner: null, value: 5, type: 'land' },
  YUGOSLAVIA: { id: 'yugoslavia', name: 'Yugoslavia', owner: null, value: 5, type: 'land' },
  GREECE: { id: 'greece', name: 'Greece', owner: null, value: 4, type: 'land' },

  // Eastern Europe
  RUSSIA_WEST: { id: 'russia_west', name: 'Western Russia', owner: 'russia', value: 8, type: 'land' },
  RUSSIA_CENTRAL: { id: 'russia_central', name: 'Central Russia', owner: 'russia', value: 10, type: 'land' },
  UKRAINE: { id: 'ukraine', name: 'Ukraine', owner: null, value: 7, type: 'land' },
  BELARUS: { id: 'belarus', name: 'Belarus', owner: null, value: 5, type: 'land' },

  // Northern Europe
  NORWAY: { id: 'norway', name: 'Norway', owner: null, value: 5, type: 'land' },
  DENMARK: { id: 'denmark', name: 'Denmark', owner: null, value: 4, type: 'land' },

  // Naval Zones
  NORTH_SEA: { id: 'north_sea', name: 'North Sea', owner: null, value: 0, type: 'sea' },
  BALTIC_SEA: { id: 'baltic_sea', name: 'Baltic Sea', owner: null, value: 0, type: 'sea' },
  MEDITERRANEAN: { id: 'mediterranean', name: 'Mediterranean Sea', owner: null, value: 0, type: 'sea' },
  ATLANTIC: { id: 'atlantic', name: 'Atlantic Ocean', owner: null, value: 0, type: 'sea' }
};

// Territory connections (adjacency)
export const TERRITORY_CONNECTIONS = {
  britain_home: ['north_sea', 'atlantic', 'france_north'],
  france_north: ['britain_home', 'belgium', 'france_south', 'atlantic'],
  france_south: ['france_north', 'italy_north', 'mediterranean'],
  netherlands: ['north_sea', 'belgium', 'germany_west'],
  belgium: ['north_sea', 'netherlands', 'france_north', 'germany_west'],

  germany_west: ['netherlands', 'belgium', 'france_north', 'germany_east', 'austria', 'czechoslovakia'],
  germany_east: ['germany_west', 'poland', 'czechoslovakia', 'baltic_sea'],
  poland: ['germany_east', 'czechoslovakia', 'belarus', 'ukraine', 'baltic_sea'],
  czechoslovakia: ['germany_west', 'germany_east', 'poland', 'austria', 'yugoslavia'],
  austria: ['germany_west', 'czechoslovakia', 'italy_north', 'yugoslavia'],

  italy_north: ['france_south', 'austria', 'yugoslavia', 'italy_south', 'mediterranean'],
  italy_south: ['italy_north', 'greece', 'mediterranean'],
  yugoslavia: ['austria', 'czechoslovakia', 'italy_north', 'greece'],
  greece: ['yugoslavia', 'italy_south', 'mediterranean'],

  russia_west: ['belarus', 'ukraine', 'russia_central'],
  russia_central: ['russia_west', 'belarus'],
  ukraine: ['poland', 'russia_west', 'belarus'],
  belarus: ['poland', 'ukraine', 'russia_west', 'russia_central'],

  norway: ['north_sea', 'denmark', 'baltic_sea'],
  denmark: ['norway', 'germany_east', 'baltic_sea', 'north_sea'],

  north_sea: ['britain_home', 'netherlands', 'belgium', 'norway', 'denmark', 'atlantic', 'baltic_sea'],
  baltic_sea: ['north_sea', 'norway', 'denmark', 'germany_east', 'poland'],
  mediterranean: ['france_south', 'italy_north', 'italy_south', 'greece', 'atlantic'],
  atlantic: ['britain_home', 'france_north', 'france_south', 'north_sea', 'mediterranean']
};

export const UNIT_TYPES = {
  INFANTRY: 'infantry',
  VEHICLE: 'vehicle',
  NAVAL: 'naval',
  AIRCRAFT: 'aircraft'
};

export const GAME_PHASES = {
  PURCHASE: 'purchase',
  COMBAT: 'combat',
  MOVEMENT: 'movement',
  COLLECT_INCOME: 'collect_income'
};
