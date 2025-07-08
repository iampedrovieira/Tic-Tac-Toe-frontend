import * as React from 'react';
import Modal from '@mui/material/Modal';
import styles from "./CheckReadyModal.module.css";


interface propsInput {
  'open':boolean,
  'setOpen':(isOpen:boolean) =>void,
  'check':boolean,
  'onChangeCheck':() =>void,

}
export default class CheckReadyModal extends 
  React.Component<propsInput> {

  constructor(props: propsInput | Readonly<propsInput>){
    super(props);
  }
  render(){
    const handelClose = (event:any, reason:any) => {
      if (reason && reason == "backdropClick")return;
      this.props.setOpen(false)
    }
    return (
      <Modal
        open={this.props.open}
        onClose={handelClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
         <div className={styles.box}>
            <h2 className={styles.text}>Set Ready</h2>
              <input
                className={styles.input} 
                type="checkbox"
                checked={this.props.check}
                onChange={this.props.onChangeCheck}
            />
          </div>
      </Modal>
  );
  }
  
}
