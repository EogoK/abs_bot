import React, {useState, useEffect} from 'react';
import bridge from '@vkontakte/vk-bridge';
import '@vkontakte/vkui/dist/vkui.css';
import {Cell, Div, Group, Button} from '@vkontakte/vkui';
import axios from "axios";

async function ads(self_class){

	var r = await bridge.send("VKWebAppShowNativeAds", {ad_format:"reward"})
	.then(data => {
		if(data.result == true){
			self_class.notifyPopup("Ура вы получили 5% шанса к выйгрышу");
		}})
	.catch(error => {
		bridge.send("VKWebAppShowNativeAds", {ad_format:"interstitial"})
		.then(data => {
		if(data.result == true){
			self_class.notifyPopup("Ура вы получили 5% шанса к выйгрышу");
		}})
		.catch(error => {
			self_class.notifyPopup("Рекламы нет :(");
		});
	});
	console.log(r);
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
	              Чтобы получить бонус, нажми на кнопку(просмотр рекламы)
	              <Button onClick={()=>{ads(self);}}>Получить бонус</Button>
	            </div>
	        </Group>);
	}
}

export default Eshe;