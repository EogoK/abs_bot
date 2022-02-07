import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {Button, View, ScreenSpinner, AdaptivityProvider, AppRoot, Div, PanelHeader, ConfigProvider, Group, Card, CardGrid, Panel} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Footer from "./panels/footer";
import Feed from "./panels/feed";
import Eshe from "./panels/eshe";


let schemes;

function func() {

	bridge.send("VKWebAppShowNativeAds", {"ad_format": "reward"});
}

class App extends React.Component {
	constructor(props){
		super(props);
		this.state = {fetchedUser:0, data:null, footerState:"feed"}
	}
	componentDidMount(){
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				const schemeAttribute = document.createAttribute('scheme');
				schemeAttribute.value = data.scheme ? data.scheme : 'client_light';
				schemes = data.scheme;

				document.body.attributes.setNamedItem(schemeAttribute);
			}
		});

		async function fetchData(self) {
			const user = await bridge.send('VKWebAppGetUserInfo');
			self.setState({fetchedUser : user});
			return 1;
		}
		fetchData(this);
	}
/*
<View activePanel={this.state.footerState}>
							<Panel id="eshe"><Eshe/></Panel>
							<Panel id="rating">2</Panel>
							<Panel id="feed">{this.state.fetchedUser && <Feed user={this.state.fetchedUser}/>}</Panel>
						</View>
						<Footer self={this}/>*/

	render(){
		
		return (
			<ConfigProvider scheme={schemes}>
				<AdaptivityProvider>
					<AppRoot>
					<Button onClick={()=>{bridge.send("VKWebAppShowNativeAds", {ad_format:"reward"})}}>1</Button>
					</AppRoot>
				</AdaptivityProvider>
			</ConfigProvider>
			);
	}
}


export default App;
