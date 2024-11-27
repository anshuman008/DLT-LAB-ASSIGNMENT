import promptSync from 'prompt-sync';

class Player {
    constructor(name) {
        this.name = name;
        this.inventory = [];
        this.currentRoom = null;
        this.points = 0;
        this.solvedRiddles = new Set();
    }

    pickUpItem(item) {
        if (!this.currentRoom) return "No room here!";
        if (this.currentRoom.items.includes(item)) {
            this.inventory.push(item);
            this.currentRoom.items = this.currentRoom.items.filter(i => i !== item);
            return `Picked up ${item}!`;
        }
        return "Item not here.";
    }

    moveToRoom(direction) {
        if (!this.currentRoom) return "You're lost!";
        const nextRoom = this.currentRoom.exits[direction];
        if (nextRoom) {
            this.currentRoom = nextRoom;
            return `Entered ${this.currentRoom.name}.\n${this.currentRoom.describe()}`;
        }
        return "Can't go that way.";
    }

    addPoints(points) {
        this.points += points;
    }
}

class Room {
    constructor(name, description) {
        this.name = name;
        this.description = description;
        this.items = [];
        this.exits = {};
        this.characters = [];
        this.riddle = null;
    }

    addExit(direction, room) {
        this.exits[direction] = room;
    }

    setRiddle(question, answer) {
        this.riddle = { question, answer };
    }

    describe() {
        let desc = `You're in ${this.name}.\n${this.description}\n`;
        if (this.items.length > 0) desc += `Items: ${this.items.join(", ")}\n`;
        desc += `Exits: ${Object.keys(this.exits).join(", ")}\n`;

        if(this.riddle?.question){
           desc += `Riddle: ${this.riddle.question}`
        }
        return desc;
    }
}

class GameManager {
    constructor() {
        this.player = null;
        this.rooms = {};
        this.prompt = promptSync();
    }

    initGame() {
        const startRoom = new Room("Cavern", "A dimly lit cavern.");
        const puzzleRoom = new Room("Riddle Room", "Symbols cover the walls.");
        const challengeRoom = new Room("Challenge Room", "Glowing numbers flicker.");
        const treasureRoom = new Room("Treasure Room", "Filled with shiny treasures.");
        const libraryRoom = new Room("Library", "Dusty books and ancient scrolls.");
        const exitRoom = new Room("Gateway", "A massive door stands ahead.");

        // Connect Rooms
        startRoom.addExit("north", puzzleRoom);
        puzzleRoom.addExit("south", startRoom);
        puzzleRoom.addExit("east", challengeRoom);
        challengeRoom.addExit("west", puzzleRoom);
        challengeRoom.addExit("east", treasureRoom);
        treasureRoom.addExit("west", challengeRoom);
        treasureRoom.addExit("north", libraryRoom);
        libraryRoom.addExit("south", treasureRoom);
        libraryRoom.addExit("east", exitRoom);
        exitRoom.addExit("west", libraryRoom);

        // Add Items
        startRoom.items.push("key");
        puzzleRoom.items.push("scroll");
        treasureRoom.items.push("gold coin");
        libraryRoom.items.push("ancient book");

        // Add Riddles
        puzzleRoom.setRiddle("What has keys but can't open locks?", "keyboard");
        challengeRoom.setRiddle("What is 7 * 6?", "42");
        libraryRoom.setRiddle("I speak without a mouth and hear without ears. What am I?", "echo");

        this.rooms = {
            start: startRoom,
            puzzle: puzzleRoom,
            challenge: challengeRoom,
            treasure: treasureRoom,
            library: libraryRoom,
            exit: exitRoom,
        };

        return startRoom;
    }

    startGame(playerName) {
        this.player = new Player(playerName);
        this.player.currentRoom = this.initGame();
        return `Welcome, ${playerName}!\n${this.player.currentRoom.describe()}`;
    }

    processCommand(command) {
        if (!this.player || !this.player.currentRoom) return "Game not started.";
        const parts = command.toLowerCase().trim().split(' ');
        const action = parts[0];
        const target = parts.slice(1).join(' ');

        switch (action) {
            case "go":
                return this.player.moveToRoom(target);
            case "look":
                return this.player.currentRoom.describe();
            case "take":
                return this.player.pickUpItem(target);
            case "inventory":
                return this.player.inventory.length > 0
                    ? `Inventory: ${this.player.inventory.join(", ")}`
                    : "Inventory is empty.";
            case "solve":
                if (this.player.currentRoom.riddle) {
                    const { question, answer } = this.player.currentRoom.riddle;
                    if (this.player.solvedRiddles.has(question)) return "Riddle already solved!";
                    if (target === answer.toLowerCase()) {
                        this.player.solvedRiddles.add(question);
                        this.player.addPoints(10);
                        return `Correct! Points: ${this.player.points}`;
                    }
                    return "Wrong answer.";
                }
                return "No riddle here.";
            case "help":
                return "Commands: 'go <direction>', 'look', 'take <item>', 'inventory', 'solve <answer>', 'quit'";
            default:
                return "Invalid command.";
        }
    }

    run() {
        console.log(this.startGame("Player"));
        console.log("Type 'help' for commands.");

        while (true) {
            const command = this.prompt('> ');
            if (command.toLowerCase() === 'quit') {
                console.log(`Goodbye! Final Points: ${this.player.points}`);
                break;
            }
            console.log(this.processCommand(command));
        }
    }
}

function main() {
    const game = new GameManager();
    game.run();
}

main();

export { GameManager, Player, Room };
