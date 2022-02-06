import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot, Div, PanelHeader, ConfigProvider, Group, Card, CardGrid, Panel} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

import Footer from "./panels/footer";
import Feed from "./panels/feed";



let schemes;

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

	render(){
		return (
			<ConfigProvider scheme={schemes}>
				<AdaptivityProvider>
					<AppRoot>
						<View activePanel={this.state.footerState}>
							<Panel id="feed">{this.state.fetchedUser && <Feed user={this.state.fetchedUser}/>}</Panel>
							<Panel id="eshe">1</Panel>
							<Panel id="rating">2</Panel>
						</View>
						<Footer self={this}/>	
					</AppRoot>
				</AdaptivityProvider>
			</ConfigProvider>
			);
	}
}


export default App;
