/*import { io, Socket } from "socket.io-client";
import Game from "../Models/Game";
import Player from "../Models/Player";

describe("Sockets Disconnection Tests", () => {
  let express: any;
  let app: any;
  let ioServer: any;
  let socketServer: Socket; //This is used to recive emits from client to server
  let socketClientEmmitter: Socket; //This is used to emit to server and use in functions
  let players: Player[];
  let games: Game[];
  let playersCheck: Map<string, boolean>;
  const serverPort = 8081;
  const socketServerUrl = "http://localhost:8081";
  beforeAll((done) => {
    players = [];
    games = [];

    playersCheck = new Map<string, boolean>();
    express = require("express");
    app = express();
    ioServer = require("../Connections/SocketConnection")(app, serverPort);
    require("../Modules/SocketListeners")(
      ioServer,
      players,
      games,
      playersCheck
    );
    socketClientEmmitter = io(socketServerUrl);
    socketClientEmmitter.on("connect", () => {
      done();
    });
  });

  afterAll((done) => {
    //Close the server
    ioServer.close();
    socketClientEmmitter.close();
    done();
  });

  beforeEach((done) => {
    while (players.length > 0) {
      players.pop();
    }
    while (games.length > 0) {
      games.pop();
    }
    playersCheck.clear();
    done();
  });

  test("[Client Side] When player leaves during the game but not playing ", (done) => {
    socketClientEmmitter.emit("newPlayerJoin", "Player 1");

    const socketClient = io(socketServerUrl);
    socketClient.on("connect", () => {
      socketClient.on("playerAvailable", () => {
        const game: Game = new Game(players[0], players[1]);
        games.push(game);

        const socketClient2 = io(socketServerUrl);
        socketClient2.on("connect", () => {
          socketClient2.on("gameStart", (game) => {
            socketClient.on("onPlayersChange", () => {
              expect(games.length).toBe(1);
              expect(players[0]).toEqual(game.player1);
              expect(players[1]).toEqual(game.player2);
              expect(players.length).toBe(2);
              socketClient.close();
              socketClient2.close();
              done();
            });
            socketClient2.disconnect();
          });
          socketClient2.emit("newPlayerJoin", "Player 3");
        });
      });
      socketClient.emit("newPlayerJoin", "Player 2");
    });
  });

  test("[Client Side] When player leaves during the game and is playing ", (done) => {
    socketClientEmmitter.emit("newPlayerJoin", "Player 1");

    const socketClient = io(socketServerUrl);
    socketClient.on("connect", () => {
      socketClient.on("playerAvailable", () => {
        const game: Game = new Game(players[0], players[1]);
        games.push(game);
        const socketClient2 = io(socketServerUrl);
        socketClient2.on("connect", () => {
          socketClient2.on("gameStart", (game) => {
            socketClient2.on("playerAvailable", () => {
              expect(games.length).toBe(0);
              expect(players[0].getId()).toEqual(socketClientEmmitter.id);
              expect(players[1].getId()).toEqual(socketClient2.id);
              expect(players.length).toBe(2);
              socketClient.close();
              socketClient2.close();
              done();
            });
            socketClient.disconnect();
          });
          socketClient2.emit("newPlayerJoin", "Player 3");
        });
      });
      socketClient.emit("newPlayerJoin", "Player 2");
    });
  });

  test("[Client Side - waitingPlayer] When player leaves during the game and dont exist 2 or more players on the server", (done) => {
    const socketClient = io(socketServerUrl);
    socketClient.on("connect", () => {
      socketClient.on("onPlayersChange", () => {
        const socketClient2 = io(socketServerUrl);
        socketClient2.on("connect", () => {
          socketClient2.on("onPlayersChange", () => {
            socketClient2.on("waitingPlayer", (arg: string) => {
              expect(games.length).toBe(0);
              expect(arg).toBe("Waiting for player");
              expect(players[0].getId()).toEqual(socketClient2.id);
              expect(players.length).toBe(1);
              socketClient.close();
              socketClient2.close();
              done();
            });
            socketClient.disconnect();
          });
          socketClient2.emit("newPlayerJoin", "Player 2");
        });
      });
      socketClient.emit("newPlayerJoin", "Player 1");
    });
  });
});*/
