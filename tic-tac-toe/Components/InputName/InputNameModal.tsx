import * as React from 'react';
import Modal from '@mui/material/Modal';
import styles from "./InputNameModal.module.css";
 
interface propsInput {
  'open':boolean,
  'setOpen':(isOpen:boolean) =>void,
  'name':string,
  'setName':(name:string) =>void,
  'onHandleName':() =>void,

}
export default class DialogInfo extends 
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
        className={styles.modal_main}
        open={this.props.open}
        onClose={handelClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={styles.box}>
          <h2 className={styles.text}> Insert your name </h2>
          <input className={styles.input} type="text" value={this.props.name} 
              onChange={(event)=>this.props.setName(event.target.value)} />
          <button className={styles.button} onClick={()=>this.props.onHandleName()}> DONE </button>
        </div>
      </Modal>
  );
  }
}
