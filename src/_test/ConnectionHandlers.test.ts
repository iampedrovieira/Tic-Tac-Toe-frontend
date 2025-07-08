/*import { io, Socket } from "socket.io-client";
import Game from "../Models/Game";
import Player from "../Models/Player";

describe("Sockets Connection Tests", () => {
  // Applies only to tests in this describe block

  let express: any;
  let app: any;
  let ioServer: any;
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

  test("Server runnig test", (done) => {
    socketClientEmmitter.on("hello", (arg: string) => {
      expect(arg).toBe("world");
      done();
    });

    ioServer.emit("hello", "world");
  });

  describe("New Player Join to Server", () => {
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

    test("[Server Side] First Player", (done) => {
      const { onNewPlayerJoin } =
        require("../Modules/Handlers/ConnectionHandlers")(
          ioServer,
          socketClientEmmitter,
          players,
          games,
          playersCheck
        );
      onNewPlayerJoin("Player 1");
      expect(players.length).toBe(1);
      expect(players[0].getId()).toBe(socketClientEmmitter.id);
      expect(players[0].getName()).toBe("Player 1");
      done();
    });

    test("[Client Side - waitingPlayer] First Player join", (done) => {
      const socketClient = io(socketServerUrl);
      socketClient.on("connect", () => {
        socketClient.on("waitingPlayer", (arg: string) => {
          expect(arg).toBe("Waiting for player");
          expect(players.length).toBe(1);
          expect(players[0].getId()).toBe(socketClient.id);
          expect(players[0].getName()).toBe("Player 1");
          socketClient.close();
          done();
        });
        socketClient.emit("newPlayerJoin", "Player 1");
      });
    });

    test("[Server Side] Second Player Join", (done) => {
      const { onNewPlayerJoin } =
        require("../Modules/Handlers/ConnectionHandlers")(
          ioServer,
          socketClientEmmitter,
          players,
          games,
          playersCheck
        );

      onNewPlayerJoin("Player 1");
      onNewPlayerJoin("Player 2");
      expect(players.length).toBe(2);
      expect(players[1].getId()).toBe(socketClientEmmitter.id);
      expect(players[1].getName()).toBe("Player 2");
      expect(players[0].getOption()).toBe(-2);
      expect(players[1].getOption()).toBe(-2);
      done();
    });
    test("[Client Side - playerAvailable] Second Player Join", (done) => {
      const socketClient = io(socketServerUrl);
      socketClient.on("connect", () => {
        socketClient.on("playerAvailable", (arg: string) => {
          expect(players.length).toBe(2);
          socketClient.close();
          done();
        });
        socketClient.emit("newPlayerJoin", "Player 1");
        socketClientEmmitter.emit("newPlayerJoin", "Player 2");
      });
    });

    test("[Client Side] Third Player Join without Game", (done) => {
      socketClientEmmitter.emit("newPlayerJoin", "Player 1");
      const socketClient = io(socketServerUrl);
      const socketClient2 = io(socketServerUrl);
      socketClient.on("connect", () => {
        socketClient.emit("newPlayerJoin", "Player 2");
      });
      socketClient2.on("connect", () => {
        socketClient2.on("onPlayersChange", (arg: string) => {
          expect(players.length).toBe(3);
          expect(games.length).toBe(0);
          socketClient.close();
          socketClient2.close();
          done();
        });
        socketClient2.emit("newPlayerJoin", "Player 3");
      });
    });
    test("[Client Side] all players received a onPlayersChange", (done) => {
      socketClientEmmitter.emit("newPlayerJoin", "Player 1");
      const socketClient = io(socketServerUrl);
      const socketClient2 = io(socketServerUrl);
      let firstSocketReceived = false;
      let secondSocketReceived = false;

      socketClient.on("connect", () => {
        socketClient.on("onPlayersChange", (arg: string) => {
          firstSocketReceived = true;
        });

        socketClient.emit("newPlayerJoin", "Player 2");
      });

      socketClient2.on("connect", () => {
        socketClient2.on("onPlayersChange", (arg: string) => {
          secondSocketReceived = true;
          expect(firstSocketReceived).toBeTruthy;
          expect(secondSocketReceived).toBeTruthy;
          socketClient.close();
          socketClient2.close();
          done();
        });

        firstSocketReceived = false;
        socketClient2.emit("newPlayerJoin", "Player 3");
      });
    });

    test("[Client Side] Third Player Join with Game", (done) => {
      socketClientEmmitter.emit("newPlayerJoin", "Player 1");

      const socketClient = io(socketServerUrl);

      let clientHasReceivedPlayersChange = false;
      let client2HasReceivedPlayersChange = false;
      let client2HasReceivedGame = false;
      socketClient.on("connect", () => {
        socketClient.on("onPlayersChange", () => {
          clientHasReceivedPlayersChange = true;
        });
        socketClient.on("playerAvailable", () => {
          clientHasReceivedPlayersChange = true;
          const game: Game = new Game(players[0], players[1]);
          games.push(game);
          let gameReceive: Game;
          const socketClient2 = io(socketServerUrl);
          socketClient2.on("connect", () => {
            socketClient2.on("gameStart", (game) => {
              client2HasReceivedGame = true;
              gameReceive = game;
            });
            socketClient2.on("onPlayersChange", () => {
              client2HasReceivedPlayersChange = true;
              expect(clientHasReceivedPlayersChange).toBeTruthy;
              expect(client2HasReceivedPlayersChange).toBeTruthy;
              expect(client2HasReceivedGame).toBeTruthy;
              expect(players.length).toBe(3);
              expect(players[0]).toEqual(gameReceive.player1);
              expect(players[1]).toEqual(gameReceive.player2);
              expect(games[0].getPlayerAllowed()).toEqual(
                gameReceive.playerAllowed
              );
              socketClient.close();
              socketClient2.close();
              done();
            });
            socketClient2.emit("newPlayerJoin", "Player 3");
          });
        });
        socketClient.emit("newPlayerJoin", "Player 2");
      });
    });
  });

  describe("Player uncheck to play", () => {
    beforeEach((done) => {
      const player1 = new Player(socketClientEmmitter.id, "Player 1");

      players.push(player1);

      done();
    });
    afterEach((done) => {
      while (players.length > 0) {
        players.pop();
      }
      while (games.length > 0) {
        games.pop();
      }
      playersCheck.clear();
      done();
    });
    test("[Server Side] Player check value change to uncheck", (done) => {
      const { onPlayerUnCheck } =
        require("../Modules/Handlers/ConnectionHandlers")(
          ioServer,
          socketClientEmmitter,
          players,
          games,
          playersCheck
        );
      onPlayerUnCheck();
      expect(playersCheck.get(socketClientEmmitter.id)).toBeFalsy;
      expect(players[0].getOption()).toBe(-2);
      done();
    });

    test("[Client Side - onPlayersChange] Player receive a check update", (done) => {
      const socketClient = io(socketServerUrl);
      socketClient.on("connect", () => {
        socketClient.on("onPlayersChange", (playersResponse) => {
          expect(playersCheck.get(socketClientEmmitter.id)).toBeFalsy;
          socketClient.close();
          done();
        });
        socketClientEmmitter.emit("playerUnCheck");
      });
    });
  });

  describe("Player check ready to play", () => {
    beforeEach((done) => {
      const player1 = new Player(socketClientEmmitter.id, "Player 1");

      players.push(player1);

      done();
    });
    afterEach((done) => {
      while (players.length > 0) {
        players.pop();
      }
      while (games.length > 0) {
        games.pop();
      }

      playersCheck.clear();
      done();
    });

    test("[Server Side] First Player Check", (done) => {
      const { onPlayerCheck } =
        require("../Modules/Handlers/ConnectionHandlers")(
          ioServer,
          socketClientEmmitter,
          players,
          games,
          playersCheck
        );
      onPlayerCheck();
      expect(playersCheck.get(socketClientEmmitter.id)).toBeTruthy;
      done();
    });
    test("[Client Side] First Player Check", (done) => {
      const socketClient = io(socketServerUrl);
      socketClient.on("connect", () => {
        socketClient.emit("newPlayerJoin", "Player 2");
        socketClient.on("onPlayersChange", () => {
          expect(playersCheck.get(socketClientEmmitter.id)).toBeTruthy;
          socketClient.close();
          done();
        });
        socketClientEmmitter.emit("playerCheck");
      });
    });

    test("[Server Side] Second Player Check without game", (done) => {
      const socketClient = io(socketServerUrl);
      socketClient.on("connect", () => {
        const player2 = new Player(socketClient.id, "Player 2");
        players.push(player2);
        playersCheck.set(socketClient.id, true);
        const { onPlayerCheck } =
          require("../Modules/Handlers/ConnectionHandlers")(
            ioServer,
            socketClientEmmitter,
            players,
            games,
            playersCheck
          );
        onPlayerCheck();
        expect(playersCheck.get(socketClientEmmitter.id)).toBeTruthy;
        expect(games.length).toBe(1);
        expect(players[1].getName()).toBe("Player 2");
        expect(players[0].getOption()).toBe(0);
        expect(players[1].getOption()).toBe(1);
        expect(games.length).toBe(1);
        socketClient.close();
        done();
      });
    });
    test("[Server Side] Second Player Check with game", (done) => {
      const socketClient = io(socketServerUrl);
      socketClient.on("connect", () => {
        const player2 = new Player(socketClient.id, "Player 2");
        players.push(player2);
        games.push(new Game(players[0], players[1]));
        playersCheck.set(socketClient.id, true);

        const { onPlayerCheck } =
          require("../Modules/Handlers/ConnectionHandlers")(
            ioServer,
            socketClientEmmitter,
            players,
            games,
            playersCheck
          );
        onPlayerCheck();
        expect(playersCheck.get(socketClientEmmitter.id)).toBeTruthy;
        expect(games.length).toBe(1);
        expect(players[1].getName()).toBe("Player 2");
        expect(players[0].getOption()).toBe(0);
        expect(players[1].getOption()).toBe(1);
        socketClient.close();
        done();
      });
    });
    test("[Client Side gameStart] Second Player Check ", (done) => {
      const socketClient = io(socketServerUrl);
      socketClient.on("connect", () => {
        const player2 = new Player(socketClient.id, "Player 2");
        players.push(player2);

        socketClient.on("gameStart", () => {
          expect(playersCheck.get(socketClientEmmitter.id)).toBeTruthy;
          expect(games.length).toBe(1);
          expect(players[1].getName()).toBe("Player 2");
          expect(players[0].getOption()).toBe(0);
          expect(players[1].getOption()).toBe(1);
          expect(games.length).toBe(1);
          socketClient.close();
          done();
        });

        socketClientEmmitter.emit("playerCheck");
        socketClient.emit("playerCheck");
      });
    });
  });
});*/
