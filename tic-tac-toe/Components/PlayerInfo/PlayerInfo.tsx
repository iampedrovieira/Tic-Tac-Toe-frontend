import { Component } from "react";
import Player from "Types/Player";
import styles from "./PlayerInfo.module.css";

interface State {
  styleOption: string;
}

export default class PlayerInfo extends Component<{ player: Player }, State> {
  constructor(props: { player: Player } | Readonly<{ player: Player }>) {
    super(props);
    this.state = {
      styleOption: "",
    };
  }
  componentDidMount() {
    if (this.props.player.option == 0)
      this.setState({ styleOption: styles.option1 });
    if (this.props.player.option == 1)
      this.setState({ styleOption: styles.option2 });
    if (this.props.player.option == -1)
      this.setState({ styleOption: styles.spectator });
    if (this.props.player.option == -2)
      this.setState({ styleOption: styles.optionWaitting });
    if (this.props.player.option == -3)
      this.setState({ styleOption: styles.optionReady });
  }
  UNSAFE_componentWillReceiveProps(_newProps: { player: Player }) {
    if (_newProps.player.option == 0)
      this.setState({ styleOption: styles.option1 });
    if (_newProps.player.option == 1)
      this.setState({ styleOption: styles.option2 });
    if (_newProps.player.option == -1)
      this.setState({ styleOption: styles.spectator });
    if (_newProps.player.option == -2)
      this.setState({ styleOption: styles.optionWaitting });
    if (_newProps.player.option == -3)
      this.setState({ styleOption: styles.optionReady });
  }

  render() {
    return (
      <div className={styles.main_box}>
        <div className={styles.player_info}>
          <div className={styles.name}>
            <h4> {this.props.player.name}</h4>
          </div>
          <span className={`${this.state.styleOption} ${styles.option}`}></span>
        </div>
        <div className={styles.separator}></div>
      </div>
    );
  }
}
