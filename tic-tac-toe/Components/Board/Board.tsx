import GameButton from "Components/GameButton/GameButton";
import { Component } from "react";
import { Socket } from "socket.io-client";
import BoardState from "Types/BoardState";

import Game from "Types/Game";
import Move from "Types/Move";
import styles from "./Board.module.css";

export default class Board extends Component<
  {
    game: Game;
    socket: Socket;
    setMessage: Function;
    gameEnd: Boolean;
    handleEmitMove: Function;
  },
  BoardState & {
    optimisticMoves: { [key: string]: number }; // Track optimistic moves
    pendingMoves: Set<string>; // Track pending moves
  }
> {
  constructor(props: {
    game: Game;
    socket: Socket;
    setMessage: Function;
    gameEnd: Boolean;
    handleEmitMove: Function;
  }) {
    super(props);
    let playerOption:number
    if(props.socket.id == props.game.player1?.id ){
      playerOption = 0
    }else{
      playerOption = 1
    }
    this.state = {
      playerId: props.socket.id!,
      playerOption:playerOption,
      game: props.game,
      isGameEnd: false,
      setMessage: props.setMessage,
      socket: props.socket,
      handleEmitMove: props.handleEmitMove,
      optimisticMoves: {}, // Initialize optimistic moves tracking
      pendingMoves: new Set(), // Initialize pending moves tracking
      buttonsState: [
        [
          { styles: styles.button, disable: true, toRemove: false },
          { styles: styles.button, disable: true, toRemove: false },
          { styles: styles.button, disable: true, toRemove: false },
        ],
        [
          { styles: styles.button, disable: true, toRemove: false },
          { styles: styles.button, disable: true, toRemove: false },
          { styles: styles.button, disable: true, toRemove: false },
        ],
        [
          { styles: styles.button, disable: true, toRemove: false },
          { styles: styles.button, disable: true, toRemove: false },
          { styles: styles.button, disable: true, toRemove: false },
        ],
      ],
    };
  }
  UNSAFE_componentWillReceiveProps(_newProps: {
    game: Game;
    gameEnd: Boolean;
  }) {
    if (_newProps.gameEnd) {
      this.setState({
        buttonsState: [
          [
            { styles: this.state.buttonsState[0][0].styles, disable: true, toRemove: false },
            { styles: this.state.buttonsState[0][1].styles, disable: true, toRemove: false },
            { styles: this.state.buttonsState[0][2].styles, disable: true, toRemove: false },
          ],
          [
            { styles: this.state.buttonsState[1][0].styles, disable: true, toRemove: false },
            { styles: this.state.buttonsState[1][1].styles, disable: true, toRemove: false },
            { styles: this.state.buttonsState[1][2].styles, disable: true, toRemove: false },
          ],
          [
            { styles: this.state.buttonsState[2][0].styles, disable: true, toRemove: false},
            { styles: this.state.buttonsState[2][1].styles, disable: true, toRemove: false },
            { styles: this.state.buttonsState[2][2].styles, disable: true, toRemove: false},
          ],
        ],
      });
    } else {
      let newButtonState = this.state.buttonsState;
      let isAllowed: boolean = false;

      let playerOption:number
      if(this.state.socket.id == _newProps.game.player1?.id ){
        playerOption = 0
      }else{
        playerOption = 1
      }
      
      this.setState({playerOption: playerOption });

      if (_newProps.game.playerAllowed == this.state.playerId) isAllowed = true;

      // Clear confirmed moves from optimistic state
      const newOptimisticMoves = { ...this.state.optimisticMoves };
      const newPendingMoves = new Set(this.state.pendingMoves);

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const key = `${i}-${j}`;
          
          // If the backend confirms a move, remove it from optimistic tracking
          if (_newProps.game.gameState[i][j] !== -1 && newPendingMoves.has(key)) {
            delete newOptimisticMoves[key];
            newPendingMoves.delete(key);
          }

          newButtonState[i][j].toRemove = false;
          if (_newProps.game.gameState[i][j] == 0) {
            newButtonState[i][j].disable = true;
          }
          if (_newProps.game.gameState[i][j] == 1) {
            newButtonState[i][j].disable = true;
          }
          if (_newProps.game.gameState[i][j] == -1) {
            if (isAllowed) newButtonState[i][j].disable = false;
            if (!isAllowed) newButtonState[i][j].disable = true;
          }
        }
      }
      
      if(_newProps.game.positionRemove && _newProps.game.positionRemove.length > 0){
        newButtonState[_newProps.game.positionRemove[0]][_newProps.game.positionRemove[1]].toRemove = true
      }
      
      this.setState({ 
        game: _newProps.game,
        optimisticMoves: newOptimisticMoves,
        pendingMoves: newPendingMoves
      });
    }
  }
  render() {
    let handleButton = (positionX: number, positionY: number): boolean => {
    
      if (this.state.playerId != this.state.game?.playerAllowed) return false;

      if (this.state.buttonsState[positionX][positionY].disable) return false;

      const key = `${positionX}-${positionY}`;
      
      // Check if this move is already pending
      if (this.state.pendingMoves.has(key)) return false;

      // Create optimistic update
      const newOptimisticMoves = { ...this.state.optimisticMoves };
      const newPendingMoves = new Set(this.state.pendingMoves);
      
      // Add optimistic move
      newOptimisticMoves[key] = this.state.playerOption;
      newPendingMoves.add(key);
      
      // Update button state for immediate visual feedback
      let newButtonState = this.state.buttonsState;
      newButtonState[positionX][positionY].disable = true;
      
      if(this.state.playerOption == 0 ){
        newButtonState[positionX][positionY].styles = styles.player1;
      }else{
        newButtonState[positionX][positionY].styles = styles.player2;
      }

      this.setState({ 
        buttonsState: newButtonState,
        optimisticMoves: newOptimisticMoves,
        pendingMoves: newPendingMoves
      });

      const move: Move = { positionX, positionY };
      this.state.handleEmitMove(move);
      return true
    };

    // Helper function to get the effective game state (real + optimistic)
    const getEffectiveGameState = (i: number, j: number): number => {
      const key = `${i}-${j}`;
      // If there's an optimistic move for this position, use it
      if (this.state.optimisticMoves.hasOwnProperty(key)) {
        return this.state.optimisticMoves[key];
      }
      // Otherwise use the real game state
      return this.state.game.gameState[i][j];
    };

    // Helper function to check if a move is optimistic (pending confirmation)
    const isOptimisticMove = (i: number, j: number): boolean => {
      const key = `${i}-${j}`;
      return this.state.pendingMoves.has(key);
    };

    return (
      <div className={styles.game}>
        <div className={styles.line}>
          <GameButton 
            isDisable={this.state.buttonsState[0][0].disable}
            event={() => handleButton(0, 0)}
            playerOption={this.state.playerOption}
            option={getEffectiveGameState(0, 0)}
            toRemove={this.state.buttonsState[0][0].toRemove}
            isOptimistic={isOptimisticMove(0, 0)}
          />
         <GameButton 
            isDisable={this.state.buttonsState[0][1].disable}
            event={() => handleButton(0, 1)}
            playerOption={this.state.playerOption}
            option={getEffectiveGameState(0, 1)}
            toRemove={this.state.buttonsState[0][1].toRemove}
            isOptimistic={isOptimisticMove(0, 1)}
          />
         <GameButton 
            isDisable={this.state.buttonsState[0][2].disable}
            event={() => handleButton(0, 2)}
            playerOption={this.state.playerOption}
            option={getEffectiveGameState(0, 2)}
            toRemove={this.state.buttonsState[0][2].toRemove}
            isOptimistic={isOptimisticMove(0, 2)}
          />
        </div>
        <div className={styles.line}>
        <GameButton 
            isDisable={this.state.buttonsState[1][0].disable}
            event={() => handleButton(1, 0)}
            playerOption={this.state.playerOption}
            option={getEffectiveGameState(1, 0)}
            toRemove={this.state.buttonsState[1][0].toRemove}
            isOptimistic={isOptimisticMove(1, 0)}
          />
         <GameButton 
            isDisable={this.state.buttonsState[1][1].disable}
            event={() => handleButton(1, 1)}
            playerOption={this.state.playerOption}
            option={getEffectiveGameState(1, 1)}
            toRemove={this.state.buttonsState[1][1].toRemove}
            isOptimistic={isOptimisticMove(1, 1)}
          />
         <GameButton 
            isDisable={this.state.buttonsState[1][2].disable}
            event={() => handleButton(1, 2)}
            playerOption={this.state.playerOption}
            option={getEffectiveGameState(1, 2)}
            toRemove={this.state.buttonsState[1][2].toRemove}
            isOptimistic={isOptimisticMove(1, 2)}
          />
        </div>
        <div className={styles.line}>
        <GameButton 
            isDisable={this.state.buttonsState[2][0].disable}
            event={() => handleButton(2, 0)}
            playerOption={this.state.playerOption}
            option={getEffectiveGameState(2, 0)}
            toRemove={this.state.buttonsState[2][0].toRemove}
            isOptimistic={isOptimisticMove(2, 0)}
          />
         <GameButton 
            isDisable={this.state.buttonsState[2][1].disable}
            event={() => handleButton(2, 1)}
            playerOption={this.state.playerOption}
            option={getEffectiveGameState(2, 1)}
            toRemove={this.state.buttonsState[2][1].toRemove}
            isOptimistic={isOptimisticMove(2, 1)}
          />
         <GameButton 
            isDisable={this.state.buttonsState[2][2].disable}
            event={() => handleButton(2, 2)}
            playerOption={this.state.playerOption}
            option={getEffectiveGameState(2, 2)}
            toRemove={this.state.buttonsState[2][2].toRemove}
            isOptimistic={isOptimisticMove(2, 2)}
          />
        </div>
      </div>
    );
  }
}
