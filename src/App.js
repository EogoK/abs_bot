import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {PanelHeader, PanelHeaderBack, SplitLayout, View, ScreenSpinner, AdaptivityProvider, AppRoot, Div, ConfigProvider, Group, Panel, ModalRoot, ModalPage, ModalCard, SplitCol} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Footer from "./panels/footer";
import Feed from "./panels/feed";
import Eshe from "./panels/eshe";


let schemes;

class App extends React.Component {
	constructor(props){
		super(props);
		this.state = {fetchedUser:0, data:null, footerState:"feed", update:null, snackbar:null}
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
			bridge.send("VKWebAppResizeWindow", {"width": 800, "height": 1000});
			self.setState({fetchedUser : user});
			return 1;
		}
		fetchData(this);
	}

	render(){

		return (
			<ConfigProvider scheme={schemes}>
				<AdaptivityProvider>
				<AppRoot>
						<View activePanel={this.state.footerState}>
							<Panel id="eshe"><Eshe self={this}/></Panel>
							<Panel id="rating"></Panel>
							<Panel id="feed">{this.state.fetchedUser && <Feed user={this.state.fetchedUser} self={this}/>}</Panel>
							<Panel id="update"><PanelHeader
            						left={
              						<PanelHeaderBack
                						onClick={() => this.setState({footerState:"feed"})}/>}>
          							</PanelHeader>{this.state.update}</Panel>
						</View>
						<Footer self={this}/>	
						{this.state.snackbar}
				</AppRoot>
				</AdaptivityProvider>
			</ConfigProvider>
			);
	}
}


export default App;
