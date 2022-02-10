import React, {useState, useEffect} from 'react';
import bridge from '@vkontakte/vk-bridge';
import '@vkontakte/vkui/dist/vkui.css';
import {Cell, Div, Group, Button, Snackbar} from '@vkontakte/vkui';
import axios from "axios";

async function send_pack(){

}

async function ads(self_class){
	var ret;
	var j = await bridge.send("VKWebAppAllowMessagesFromGroup", {"group_id": 210513053, "key": self_class.main_app.state.fetchedUser["id"].toString()})
	.then(data=>{
		ret = data.result;
	});
	if(ret == true){
		var r = await bridge.send("VKWebAppShowNativeAds", {ad_format:"reward"})
		.then(data => {
			//console.log(data);
			if(data.result == true){
				bridge.send("VKWebAppSendPayload", {"group_id": 210513053, "payload": {"type": self_class.main_app.fetchedUser["id"], "how":"random_pack"}});
			}})
			.catch(error => {
				//console.log(error);
				self_class.notifyPopup("Рекламы нет :(");
		});
		//console.log(r);
	}else{
		self_class.notifyPopup("Разрешите отправку сообщений от сообщества");
	}
}

class Eshe extends React.Component{
	constructor(props){
		super();
		this.state = {};
		this.main_app = props["self"];
		this.notifyPopup = this.notifyPopup.bind(this);
	}

	notifyPopup(names) {
	    if (this.main_app.snackbar) return;
	    this.main_app.setState({
	      snackbar: (
	        <Snackbar filled onClose={() => this.main_app.setState({ snackbar: null })} style={{zIndex:99999999}}>
	          {names}
	        </Snackbar>
	      )
	    });
  	}

	render(){
		var self = this;
		return(
			<Group>
				<Div style={{height:110}}>&nbsp;</Div>
				<div style={{textAlign: "center"}}>
				<div>
	              Получите бесплатный аниме пак по кнопке
	            </div>
	             <Div style={{height:20}}>&nbsp;</Div>
	              <Button onClick={()=>{ads(self);}} style={{width:"100%"}}>Получить пак</Button>
	            </div> 
	        </Group>);
	}
}

export default Eshe;