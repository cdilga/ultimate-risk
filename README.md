# Ultimate Risk - WW2 Strategy Game

A turn-based World War 2 strategy game featuring historically accurate nations, units, and territories in the European theatre.

## 🎮 Game Features

- **6 Historical Nations**: Nazi Germany, Great Britain, United States, Canada, France, Soviet Union
- **Historical Leaders**: Each nation led by their actual WW2 leader (Hitler, Churchill, Roosevelt, etc.)
- **24 European Territories**: Historically accurate map of Europe including land and naval zones
- **4 Unit Types**: Infantry, Vehicles, Naval, and Aircraft - all historically accurate
- **Turn-Based Gameplay**: Purchase phase, Combat phase, Movement phase, and Income collection
- **Currency System**: Earn income from controlled territories to purchase units
- **Combat System**: Dice-based combat with attack and defense values
- **Mobile & Desktop**: Fully responsive design works on all devices

## 🌐 Live Deployment

🚀 **Production**: [https://ultimate-risk.dilger.dev](https://ultimate-risk.dilger.dev)

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/cdilga/ultimate-risk.git
cd ultimate-risk

# Install dependencies
npm install

# Run locally
npm run dev
```

Visit `http://localhost:8787` to play the game.

## 🎯 How to Play

1. **Start a New Game**: Click "New Game" to begin with 4 players (Germany, Britain, USA, Russia)
2. **Purchase Phase**: Use your starting currency to buy units (Infantry, Vehicles, Naval, Aircraft)
3. **Deploy Units**: Place purchased units in territories you control
4. **Movement Phase**: Move units to adjacent territories
5. **Combat**: When units move into enemy territories, combat is automatically resolved
6. **Collect Income**: At the end of your turn, collect income based on territory values
7. **Next Turn**: Click "Next Phase" to advance through the game phases

## 🗺️ Nations & Units

### Nazi Germany
- Leader: Adolf Hitler (Führer)
- Infantry: SS Infantry
- Vehicle: Panzer IV
- Naval: U-boat
- Aircraft: Bf 109

### Great Britain
- Leader: Winston Churchill (Prime Minister)
- Infantry: SAS Rogue
- Vehicle: Churchill Tank
- Naval: U-class Submarine
- Aircraft: Supermarine Spitfire

### United States
- Leader: Franklin D. Roosevelt (President)
- Infantry: Army Rangers
- Vehicle: M4 Sherman
- Naval: Fletcher-class Destroyer
- Aircraft: B-17 Flying Fortress

### Canada
- Leader: William Lyon Mackenzie King (Prime Minister)
- Infantry: Devils Brigade
- Vehicle: Ram Tank
- Naval: Tribal-class Destroyer
- Aircraft: de Havilland Mosquito

### France
- Leader: Charles de Gaulle (General)
- Infantry: French Resistance
- Vehicle: Char B1
- Naval: Surcouf Submarine
- Aircraft: Dewoitine D.520

### Soviet Union
- Leader: Joseph Stalin (General Secretary)
- Infantry: Guards Infantry
- Vehicle: T-34
- Naval: S-class Submarine
- Aircraft: Yakovlev Yak-3

## 🔌 API Endpoints

The game exposes a RESTful API for all game operations:

### Game Management
- `POST /api/game/new` - Create a new game
- `GET /api/game/state?gameId={id}` - Get current game state
- `POST /api/game/next-phase` - Advance to next phase

### Game Actions
- `POST /api/game/purchase` - Purchase units
- `POST /api/game/deploy` - Deploy units to territories
- `POST /api/game/move` - Move units between territories
- `POST /api/game/combat` - Resolve combat in a territory

### Data
- `GET /api/nations` - Get all nation data
- `GET /api/territories` - Get all territory data

## 📦 Deployment

This project automatically deploys to Cloudflare Workers when you push to the main branch.

### Manual Deployment
```bash
npm run deploy
```

## 🛠️ Development

### Local Development
```bash
# Start development server
npm run dev

# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Test against deployed site
npm run test:deployed
```

### Project Structure
```
src/
├── index.js          # Main Worker with API routes and UI
├── gameData.js       # Historical data (nations, territories, units)
└── gameLogic.js      # Game state and rules engine
```

### Testing
- Unit tests use Vitest with Cloudflare Workers pool
- E2E tests use Playwright
- Tests can run against local dev server or production

## 🎵 Audio

The game includes a placeholder for background audio. To add the Erika Marschlied music:
1. Host the audio file on a CDN or include it in the project
2. Update the `<audio>` tag source in `src/index.js` (line 83)

## 🏗️ Architecture

Built on the Cloudflare Workers platform:
- **Runtime**: Cloudflare Workers (V8 isolates)
- **Frontend**: Vanilla JavaScript with Tailwind CSS
- **Storage**: In-memory (can be upgraded to Durable Objects or KV)
- **Deployment**: Automated via GitHub Actions

## 🎨 Technology Stack

- **Backend**: Cloudflare Workers
- **Frontend**: Vanilla JavaScript, Tailwind CSS
- **Testing**: Vitest, Playwright
- **Deployment**: Wrangler CLI

## 🔐 Environment Variables

- `CLOUDFLARE_API_TOKEN`: Used for deployment (set in GitHub Secrets)
- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare account ID

## 🤝 Contributing

This is a solo project created with Claude Code. Feel free to fork and modify for your own use.

## 📝 Future Enhancements

Potential improvements for the future:
- Persistent game storage with Durable Objects
- Multiplayer real-time synchronization
- More detailed combat animations
- Additional nations and territories
- Diplomacy and alliance mechanics
- Save/load game functionality

## 🤖 Created with Claude

This project was automatically generated using [the-ultimate-bootstrap](https://github.com/cdilga/the-ultimate-bootstrap) and implemented by Claude Code.

## 📜 License

Open source - feel free to use and modify.
