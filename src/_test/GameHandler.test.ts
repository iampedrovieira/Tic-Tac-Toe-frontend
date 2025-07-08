/*import { io, Socket } from "socket.io-client";
import Game from "../Models/Game";
import Player from "../Models/Player";
import Move from "../Types/Move";

describe("Sockets Game Tests", () => {
  let express: any;
  let app: any;
  let ioServer: any;
  let socketServer: Socket; //This is used to recive emits from client to server
  let socketClientEmmitter: Socket; //This is used to emit to server and use in functions
  let socketClient1: Socket;
  let socketClient2: Socket;
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
    socketClient1 = io(socketServerUrl);
    socketClient1.on("connect", () => {
      players.push(new Player(socketClient1.id, "Player 1"));
      socketClient2 = io(socketServerUrl);
      socketClient2.on("connect", () => {
        players.push(new Player(socketClient2.id, "Player 2"));
        games.push(new Game(players[0], players[1]));
        done();
      });
    });
  });
  afterEach((done) => {
    while (games.length > 0) {
      games.pop();
    }
    socketClient1.close();
    socketClient2.close();
    done();
  });
  test("[Client Side] When player dont have permission to play ", (done) => {
    const move: Move = { positionX: 0, positionY: 0 };
    socketClient2.on("cannotPlay", (arg) => {
      expect(games[0].getPlayerAllowed()).toBe(players[0].getId());
      expect(arg).toEqual("cannotPlay");
      done();
    });
    socketClient2.emit("playerMove", move);
  });
  test("[Client Side] When player 1 win a game ", (done) => {
    const socketClient3 = io(socketServerUrl);

    socketClient3.on("connect", () => {
      players.push(new Player(socketClient3.id, "Player 3"));

      games[0].move({ positionX: 0, positionY: 0 }, socketClient1.id);
      games[0].move({ positionX: 0, positionY: 1 }, socketClient2.id);
      games[0].move({ positionX: 1, positionY: 1 }, socketClient1.id);
      games[0].move({ positionX: 0, positionY: 2 }, socketClient2.id);

      socketClient1.on("gameEnd", (gameEndStatus) => {
        expect(players[1].getId()).toEqual(socketClient3.id);

        socketClient3.on("playerAvailable", (arg) => {
          expect(gameEndStatus.playerWin).toEqual("Player 1");
          expect(gameEndStatus.isDraw).toBeFalsy;
          expect(gameEndStatus.playerWinId).toEqual(socketClient1.id);
          expect(gameEndStatus.playerLossId).toEqual(socketClient2.id);
          expect(gameEndStatus.playerNextIds[0]).toEqual(socketClient3.id);
          expect(gameEndStatus.nextPlayers[0]).toEqual("Player 3");
          //expect(players[0].wins).toBe(1);
          socketClient3.close();
          done();
        });
      });

      socketClient1.emit("playerMove", { positionX: 2, positionY: 2 });
    });
  });
  test("[Client Side] When player 1 win a game but dont have more players", (done) => {
    games[0].move({ positionX: 0, positionY: 0 }, socketClient1.id);
    games[0].move({ positionX: 0, positionY: 1 }, socketClient2.id);
    games[0].move({ positionX: 1, positionY: 1 }, socketClient1.id);
    games[0].move({ positionX: 0, positionY: 2 }, socketClient2.id);

    socketClient1.on("gameEnd", (gameEndStatus) => {
      expect(players[1].getId()).toEqual(socketClient2.id);

      socketClient2.on("playerAvailable", (arg) => {
        expect(gameEndStatus.playerWin).toEqual("Player 1");
        expect(gameEndStatus.isDraw).toBeFalsy;
        expect(gameEndStatus.playerWinId).toEqual(socketClient1.id);
        expect(gameEndStatus.playerLossId).toEqual(socketClient2.id);
        expect(gameEndStatus.playerNextIds[0]).toEqual(socketClient2.id);
        expect(gameEndStatus.nextPlayers[0]).toEqual("Player 2");
        //expect(players[0].wins).toBe(1);

        done();
      });
    });
    socketClient1.emit("playerMove", { positionX: 2, positionY: 2 });
  });
  test("[Client Side] When player 2 win a game ", (done) => {
    const socketClient3 = io(socketServerUrl);

    socketClient3.on("connect", () => {
      players.push(new Player(socketClient3.id, "Player 3"));

      games[0].move({ positionX: 0, positionY: 1 }, socketClient1.id);
      games[0].move({ positionX: 0, positionY: 0 }, socketClient2.id);
      games[0].move({ positionX: 1, positionY: 0 }, socketClient1.id);
      games[0].move({ positionX: 1, positionY: 1 }, socketClient2.id);
      games[0].move({ positionX: 0, positionY: 2 }, socketClient1.id);

      socketClient1.on("gameEnd", (gameEndStatus) => {
        expect(players[0].getId()).toEqual(socketClient2.id);
        expect(players[1].getId()).toEqual(socketClient3.id);
        expect(players[2].getId()).toEqual(socketClient1.id);

        socketClient3.on("playerAvailable", (arg) => {
          expect(gameEndStatus.playerWin).toEqual("Player 2");
          expect(gameEndStatus.isDraw).toBeFalsy;
          expect(gameEndStatus.playerWinId).toEqual(socketClient2.id);
          expect(gameEndStatus.playerLossId).toEqual(socketClient1.id);
          expect(gameEndStatus.playerNextIds[0]).toEqual(socketClient3.id);
          expect(gameEndStatus.nextPlayers[0]).toEqual("Player 3");
          //expect(players[1].wins).toBe(1);
          socketClient3.close();
          done();
        });
      });

      socketClient2.emit("playerMove", { positionX: 2, positionY: 2 });
    });
  });
  test("[Client Side] When player 2 win a game but dont have more players", (done) => {
    games[0].move({ positionX: 0, positionY: 1 }, socketClient1.id);
    games[0].move({ positionX: 0, positionY: 0 }, socketClient2.id);
    games[0].move({ positionX: 1, positionY: 0 }, socketClient1.id);
    games[0].move({ positionX: 1, positionY: 1 }, socketClient2.id);
    games[0].move({ positionX: 0, positionY: 2 }, socketClient1.id);

    socketClient1.on("gameEnd", (gameEndStatus) => {
      expect(players[0].getId()).toEqual(socketClient2.id);
      expect(players[1].getId()).toEqual(socketClient1.id);

      socketClient2.on("playerAvailable", (arg) => {
        expect(gameEndStatus.playerWin).toEqual("Player 2");
        expect(gameEndStatus.isDraw).toBeFalsy;
        expect(gameEndStatus.playerWinId).toEqual(socketClient2.id);
        expect(gameEndStatus.playerLossId).toEqual(socketClient1.id);
        expect(gameEndStatus.playerNextIds[0]).toEqual(socketClient1.id);
        expect(gameEndStatus.nextPlayers[0]).toEqual("Player 1");
        //expect(players[1].wins).toBe(1);
        socketClient2.close();
        done();
      });
    });
    socketClient2.emit("playerMove", { positionX: 2, positionY: 2 });
  });
  test("[Client Side] When is game end with draw ", (done) => {
    const socketClient3 = io(socketServerUrl);

    socketClient3.on("connect", () => {
      players.push(new Player(socketClient3.id, "Player 3"));

      games[0].move({ positionX: 0, positionY: 1 }, socketClient1.id);
      games[0].move({ positionX: 0, positionY: 0 }, socketClient2.id);
      games[0].move({ positionX: 1, positionY: 0 }, socketClient1.id);
      games[0].move({ positionX: 1, positionY: 1 }, socketClient2.id);
      games[0].move({ positionX: 0, positionY: 2 }, socketClient1.id);
      games[0].move({ positionX: 2, positionY: 0 }, socketClient2.id);
      games[0].move({ positionX: 2, positionY: 2 }, socketClient1.id);
      games[0].move({ positionX: 1, positionY: 2 }, socketClient2.id);

      socketClient1.on("gameEnd", (gameEndStatus) => {
        expect(players[0].getId()).toEqual(socketClient1.id);
        expect(players[1].getId()).toEqual(socketClient2.id);
        expect(players[2].getId()).toEqual(socketClient3.id);

        socketClient2.on("playerAvailable", (arg) => {
          expect(gameEndStatus.isDraw).toBeTruthy;
          socketClient3.close();
          done();
        });
      });

      socketClient1.emit("playerMove", { positionX: 2, positionY: 1 });
    });
  });

  test("[Client Side] When is third draw in row but only have 2 players ", (done) => {
    games[0].draw();
    games[0].draw();
    games[0].move({ positionX: 0, positionY: 1 }, socketClient1.id);
    games[0].move({ positionX: 0, positionY: 0 }, socketClient2.id);
    games[0].move({ positionX: 1, positionY: 0 }, socketClient1.id);
    games[0].move({ positionX: 1, positionY: 1 }, socketClient2.id);
    games[0].move({ positionX: 0, positionY: 2 }, socketClient1.id);
    games[0].move({ positionX: 2, positionY: 0 }, socketClient2.id);
    games[0].move({ positionX: 2, positionY: 2 }, socketClient1.id);
    games[0].move({ positionX: 1, positionY: 2 }, socketClient2.id);

    socketClient1.on("gameEnd", (gameEndStatus) => {
      expect(players[0].getId()).toEqual(socketClient1.id);
      expect(players[1].getId()).toEqual(socketClient2.id);

      socketClient1.on("playerAvailable", (arg) => {
        expect(gameEndStatus.isDraw).toBeTruthy;
        expect(gameEndStatus.playerNextIds[0]).toEqual(socketClient1.id);
        expect(gameEndStatus.nextPlayers[0]).toEqual("Player 1");
        expect(gameEndStatus.playerNextIds[1]).toEqual(socketClient2.id);
        expect(gameEndStatus.nextPlayers[1]).toEqual("Player 2");
        done();
      });
    });

    socketClient1.emit("playerMove", { positionX: 2, positionY: 1 });
  });

  test("[Client Side] When is third draw in row but only have 3 players ", (done) => {
    const socketClient3 = io(socketServerUrl);

    socketClient3.on("connect", () => {
      players.push(new Player(socketClient3.id, "Player 3"));
      games[0].draw();
      games[0].draw();
      games[0].move({ positionX: 0, positionY: 1 }, socketClient1.id);
      games[0].move({ positionX: 0, positionY: 0 }, socketClient2.id);
      games[0].move({ positionX: 1, positionY: 0 }, socketClient1.id);
      games[0].move({ positionX: 1, positionY: 1 }, socketClient2.id);
      games[0].move({ positionX: 0, positionY: 2 }, socketClient1.id);
      games[0].move({ positionX: 2, positionY: 0 }, socketClient2.id);
      games[0].move({ positionX: 2, positionY: 2 }, socketClient1.id);
      games[0].move({ positionX: 1, positionY: 2 }, socketClient2.id);

      socketClient1.on("gameEnd", (gameEndStatus) => {
        expect(players[0].getId()).toEqual(socketClient3.id);
        expect(players[1].getId()).toEqual(socketClient1.id);
        expect(players[2].getId()).toEqual(socketClient2.id);

        socketClient1.on("playerAvailable", (arg) => {
          expect(gameEndStatus.isDraw).toBeTruthy;
          expect(gameEndStatus.playerNextIds[0]).toEqual(socketClient3.id);
          expect(gameEndStatus.nextPlayers[0]).toEqual("Player 3");
          expect(gameEndStatus.playerNextIds[1]).toEqual(socketClient1.id);
          expect(gameEndStatus.nextPlayers[1]).toEqual("Player 1");
          socketClient3.close();
          done();
        });
      });

      socketClient1.emit("playerMove", { positionX: 2, positionY: 1 });
    });
  });

  test("[Client Side] When is third draw in row but only have 4 players or more ", (done) => {
    const socketClient3 = io(socketServerUrl);

    socketClient3.on("connect", () => {
      const socketClient4 = io(socketServerUrl);
      socketClient4.on("connect", () => {
        players.push(new Player(socketClient3.id, "Player 3"));
        players.push(new Player(socketClient4.id, "Player 4"));
        games[0].draw();
        games[0].draw();
        games[0].move({ positionX: 0, positionY: 1 }, socketClient1.id);
        games[0].move({ positionX: 0, positionY: 0 }, socketClient2.id);
        games[0].move({ positionX: 1, positionY: 0 }, socketClient1.id);
        games[0].move({ positionX: 1, positionY: 1 }, socketClient2.id);
        games[0].move({ positionX: 0, positionY: 2 }, socketClient1.id);
        games[0].move({ positionX: 2, positionY: 0 }, socketClient2.id);
        games[0].move({ positionX: 2, positionY: 2 }, socketClient1.id);
        games[0].move({ positionX: 1, positionY: 2 }, socketClient2.id);

        socketClient1.on("gameEnd", (gameEndStatus) => {
          expect(players[0].getId()).toEqual(socketClient3.id);
          expect(players[1].getId()).toEqual(socketClient4.id);
          expect(players[2].getId()).toEqual(socketClient1.id);
          expect(players[3].getId()).toEqual(socketClient2.id);

          socketClient3.on("playerAvailable", (arg) => {
            expect(gameEndStatus.isDraw).toBeTruthy;
            expect(gameEndStatus.playerNextIds[0]).toEqual(socketClient3.id);
            expect(gameEndStatus.nextPlayers[0]).toEqual("Player 3");
            expect(gameEndStatus.playerNextIds[1]).toEqual(socketClient4.id);
            expect(gameEndStatus.nextPlayers[1]).toEqual("Player 4");
            socketClient3.close();
            socketClient4.close();
            done();
          });
        });

        socketClient1.emit("playerMove", { positionX: 2, positionY: 1 });
      });
    });
  });
});*/