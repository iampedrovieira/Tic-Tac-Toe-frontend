/*import Game from "../../Models/Game";
import Player from "../../Models/Player"
import Move from "../../Types/Move";
import StatusGame from "../../Types/StatusGame";

describe('Game Class', () => {
    
  let player1:Player;
  let player2:Player;

  beforeAll((done)=>{

    player1 = new Player('1x','Player 1');
    player2 = new Player('2x','Player 2');
    done();
  })
   
  test('Constructor test',()=>{
      
    const game = new Game(player1,player2);
    player1.setOption(0);
    player2.setOption(1);
    expect(game.getGameState()).toEqual([[-1,-1,-1],[-1,-1,-1],[-1,-1,-1]]);
    expect(game.getPlayer1()).toBe(player1);
    expect(game.getPlayer2()).toBe(player2);
    expect(game.getPlayerAllowed()).toBe(player1.getId());
    expect(game.getDraws()).toBe(0);
  });

  describe('Player Moves Tests',()=>{
    let game:Game 
    beforeEach((done)=>{
        game = new Game(player1,player2);
        done();
    });
  
    test('First play move by player 1 is allowed',(done)=>{
    
            const move:Move = {positionX :0,positionY:0}
            const result:StatusGame = game.move(move,player1.getId());
      
            expect(result.message).toBe('');
            expect(result.win).toBe(false);
            expect(result.draw).toBe(false)
            expect(game.getGameState()[0][0]).toBe(player1.getOption());
            expect(game.getPlayerAllowed()).toBe(player2.getId());
            done();

    });
    test('First player move by player 2 is rejected',(done)=>{

          const move:Move = {positionX :0,positionY:0}
          const result:StatusGame = game.move(move,player2.getId());

          expect(result.message).toBe('Not allowed to play');
          expect(result.win).toBe(false);
          expect(result.draw).toBe(false)
          expect(game.gameState[0][0]).toBe(-1);
          done();
    });
    test('Player move to position already played',(done)=>{
     
      const move:Move = {positionX :0,positionY:0}
      game.move(move,player1.getId());
     
      const result:StatusGame = game.move(move,player2.getId());
      expect(result.message).toBe('Cannot play here');
      expect(result.win).toBe(false);
      expect(result.draw).toBe(false);
      done();
      
    });
    test('Game Draw',()=>{

    });
    test('Game Win with Line 1',(done)=>{
      
      const move1:Move = {positionX :0,positionY:0}
      game.move(move1,player1.getId());
      const move2:Move = {positionX :1,positionY:0}
      game.move(move2,player2.getId());
      const move3:Move = {positionX :0,positionY:1}
      game.move(move3,player1.getId());
      const move4:Move = {positionX :1,positionY:1}
      game.move(move4,player2.getId());
      const move5:Move = {positionX :0,positionY:2}
      const result:StatusGame = game.move(move5,player1.getId());

      expect(result.message).toBe('');
      expect(result.win).toBe(true);
      expect(result.draw).toBe(false);
      expect(result.playerWin).toBe(player1.getId());
      expect(result.playerWinOption).toBe(player1.getOption());
      done();

    });
    test('Game Win with Line 2',(done)=>{
      const move1:Move = {positionX :1,positionY:0}
      game.move(move1,player1.getId());
      const move2:Move = {positionX :2,positionY:0}
      game.move(move2,player2.getId());
      const move3:Move = {positionX :1,positionY:1}
      game.move(move3,player1.getId());
      const move4:Move = {positionX :0,positionY:1}
      game.move(move4,player2.getId());
      const move5:Move = {positionX :1,positionY:2}
      const result:StatusGame = game.move(move5,player1.getId());

      expect(result.message).toBe('');
      expect(result.win).toBe(true);
      expect(result.draw).toBe(false);
      expect(result.playerWin).toBe(player1.getId());
      expect(result.playerWinOption).toBe(player1.getOption());
      done();
    });
    test('Game Win with Line 3',(done)=>{
      const move1:Move = {positionX :2,positionY:0}
      game.move(move1,player1.getId());
      const move2:Move = {positionX :1,positionY:0}
      game.move(move2,player2.getId());
      const move3:Move = {positionX :2,positionY:1}
      game.move(move3,player1.getId());
      const move4:Move = {positionX :1,positionY:1}
      game.move(move4,player2.getId());
      const move5:Move = {positionX :2,positionY:2}
      const result:StatusGame = game.move(move5,player1.getId());

      expect(result.message).toBe('');
      expect(result.win).toBe(true);
      expect(result.draw).toBe(false);
      expect(result.playerWin).toBe(player1.getId());
      expect(result.playerWinOption).toBe(player1.getOption());
      done();
    });
    test('Game Win with Column 1',(done)=>{
      const move1:Move = {positionX :0,positionY:0}
      game.move(move1,player1.getId());
      const move2:Move = {positionX :1,positionY:1}
      game.move(move2,player2.getId());
      const move3:Move = {positionX :1,positionY:0}
      game.move(move3,player1.getId());
      const move4:Move = {positionX :1,positionY:2}
      game.move(move4,player2.getId());
      const move5:Move = {positionX :2,positionY:0}
      const result:StatusGame = game.move(move5,player1.getId());

      expect(result.message).toBe('');
      expect(result.win).toBe(true);
      expect(result.draw).toBe(false);
      expect(result.playerWin).toBe(player1.getId());
      expect(result.playerWinOption).toBe(player1.getOption());
      done();
    });
    test('Game Win with Column 2',(done)=>{
      const move1:Move = {positionX :0,positionY:1}
      game.move(move1,player1.getId());
      const move2:Move = {positionX :1,positionY:2}
      game.move(move2,player2.getId());
      const move3:Move = {positionX :1,positionY:1}
      game.move(move3,player1.getId());
      const move4:Move = {positionX :0,positionY:2}
      game.move(move4,player2.getId());
      const move5:Move = {positionX :2,positionY:1}
      const result:StatusGame = game.move(move5,player1.getId());

      expect(result.message).toBe('');
      expect(result.win).toBe(true);
      expect(result.draw).toBe(false);
      expect(result.playerWin).toBe(player1.getId());
      expect(result.playerWinOption).toBe(player1.getOption());
      done();
    });
    test('Game Win with Column 3',(done)=>{
      const move1:Move = {positionX :0,positionY:2}
      game.move(move1,player1.getId());
      const move2:Move = {positionX :1,positionY:1}
      game.move(move2,player2.getId());
      const move3:Move = {positionX :1,positionY:2}
      game.move(move3,player1.getId());
      const move4:Move = {positionX :1,positionY:0}
      game.move(move4,player2.getId());
      const move5:Move = {positionX :2,positionY:2}
      const result:StatusGame = game.move(move5,player1.getId());

      expect(result.message).toBe('');
      expect(result.win).toBe(true);
      expect(result.draw).toBe(false);
      expect(result.playerWin).toBe(player1.getId());
      expect(result.playerWinOption).toBe(player1.getOption());
      done();
    });
  });
  test('Draw function Test',()=>{
    const game = new Game(player1,player2);
    const expectedValue:Number = game.getDraws() + 1;
    game.draw();
    expect(game.getDraws()).toBe( expectedValue);
  });

  test('Restart function test',()=>{

    const game = new Game(player1,player2);
    const move:Move = {positionX :0,positionY:0}
    game.move(move,player1.getId());
    game.restart();
    expect(game.getGameState()).toEqual([[-1,-1,-1],[-1,-1,-1],[-1,-1,-1]]);
    expect(player1.getOption()).toBe(0);
    expect(player2.getOption()).toBe(1);

  })
})*/