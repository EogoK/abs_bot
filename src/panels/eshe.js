import React, {useState, useEffect} from 'react';
import bridge from '@vkontakte/vk-bridge';
import '@vkontakte/vkui/dist/vkui.css';
import {Cell, Div, Group} from '@vkontakte/vkui';
import axios from "axios";



class Eshe extends React.Component{
	constructor(props){
		super();
		this.state = {};

	}

	render(){
		return(
			<Group>
				<Div style={{height:110}}>&nbsp;</Div>
				<Cell
	              expandable
	              onClick={() => {bridge.send("VKWebAppShowNativeAds", {ad_format:"reward"})
					.then(data => console.log(data.result))
					.catch(error => console.log(error));}}>
	              Просмотр рекламы
	            </Cell>
	        </Group>);
	}
}

export default Eshe;