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
  BoardState
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

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
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
      
      this.setState({ game: _newProps.game });
    }
  }
  render() {
    let handleButton = (positionX: number, positionY: number): boolean => {
    
      if (this.state.playerId != this.state.game?.playerAllowed) return false;

      if (this.state.buttonsState[positionX][positionY].disable) return false;

      let newButtonState = this.state.buttonsState;
      
      if(this.state.playerOption == 0 ){
        newButtonState[positionX][positionY].styles = styles.player1;
     
      }else{
        newButtonState[positionX][positionY].styles = styles.player2;
   
      }
      
      newButtonState[positionX][positionY].disable = true;
      this.setState({ buttonsState: newButtonState });

      const move: Move = { positionX, positionY };
      this.state.handleEmitMove(move);
      return true
    };

    return (
      <div className={styles.game}>
        <div className={styles.line}>
          <GameButton isDisable={this.state.buttonsState[0][0].disable}
            event={() => handleButton(0, 0)}
            playerOption={this.state.playerOption}
            option={this.state.game.gameState[0][0]}
            toRemove={this.state.buttonsState[0][0].toRemove}
          />
         <GameButton isDisable={this.state.buttonsState[0][1].disable}
            event={() => handleButton(0, 1)}
            playerOption={this.state.playerOption}
            option={this.state.game.gameState[0][1]}
            toRemove={this.state.buttonsState[0][1].toRemove}
          />
         <GameButton isDisable={this.state.buttonsState[0][2].disable}
            event={() => handleButton(0, 2)}
            playerOption={this.state.playerOption}
            option={this.state.game.gameState[0][2]}
            toRemove={this.state.buttonsState[0][2].toRemove}
          />
        </div>
        <div className={styles.line}>
        <GameButton isDisable={this.state.buttonsState[1][0].disable}
            event={() => handleButton(1, 0)}
            playerOption={this.state.playerOption}
            option={this.state.game.gameState[1][0]}
            toRemove={this.state.buttonsState[1][0].toRemove}
          />
         <GameButton isDisable={this.state.buttonsState[1][1].disable}
            event={() => handleButton(1, 1)}
            playerOption={this.state.playerOption}
            option={this.state.game.gameState[1][1]}
            toRemove={this.state.buttonsState[1][1].toRemove}
          />
         <GameButton isDisable={this.state.buttonsState[1][2].disable}
            event={() => handleButton(1, 2)}
            playerOption={this.state.playerOption}
            option={this.state.game.gameState[1][2]}
            toRemove={this.state.buttonsState[1][2].toRemove}
          />
        </div>
        <div className={styles.line}>
        <GameButton isDisable={this.state.buttonsState[2][0].disable}
            event={() => handleButton(2, 0)}
            playerOption={this.state.playerOption}
            option={this.state.game.gameState[2][0]}
            toRemove={this.state.buttonsState[2][0].toRemove}
          />
         <GameButton isDisable={this.state.buttonsState[2][1].disable}
            event={() => handleButton(2, 1)}
            playerOption={this.state.playerOption}
            option={this.state.game.gameState[2][1]}
            toRemove={this.state.buttonsState[2][1].toRemove}
          />
         <GameButton isDisable={this.state.buttonsState[2][2].disable}
            event={() => handleButton(2, 2)}
            playerOption={this.state.playerOption}
            option={this.state.game.gameState[2][2]}
            toRemove={this.state.buttonsState[2][2].toRemove}
          />
        </div>
      </div>
    );
  }
}
