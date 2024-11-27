# Adventure Game

A console-based text adventure game where the player explores rooms, collects items, solves riddles, and progresses through a mysterious and humorous world. Written in **KN-Lang**, this game offers a fun and interactive experience while utilizing various features such as player inventory, puzzles, and room exploration.

## Features

- **Multiple Rooms**: Explore different rooms with unique descriptions.
- **Item Collection**: Pick up items scattered throughout the rooms.
- **Riddles & Puzzles**: Solve riddles to earn points and progress in the game.
- **Humorous Console Feedback**: The game responds with quirky and funny messages throughout the journey.
- **Inventory System**: Store items and use them later during your adventure.
- **Commands**: Use simple commands like `go <direction>`, `take <item>`, `inventory`, and `solve <answer>` to interact with the game.

## How to Play

### Clone the Repository




#### Clone the repo to your local machine to get started:

```shell
git clone https://github.com/anshuman008/adventure-game.git
```

```shell
cd adventure-game
```

### Run the game

```shell
node game.js
```

## Example

```shell
> look
You're in the Cavern.
A dimly lit cavern with echoes in the distance.
Items: key
Exits: north

> take key
Picked up key!

> go north
Entered Riddle Room.
Symbols cover the walls.
Items: scroll
Exits: south, east
Riddle: What has keys but can't open locks?

> solve keyboard
Correct! Points: 10
```
