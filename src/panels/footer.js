import React, {useState, useEffect, setState} from 'react';
import bridge from '@vkontakte/vk-bridge';
import '@vkontakte/vkui/dist/vkui.css';
import {Div, View, PanelHeader, TabbarItem, Tabbar, FixedLayout, Tabs, TabsItem, Panel, Snackbar} from '@vkontakte/vkui';
import { Icon56FireOutline } from '@vkontakte/icons';
import { Icon28Users3Outline } from '@vkontakte/icons';
import { Icon28More } from '@vkontakte/icons';

import "./footer.css";

const PARAMS = {
rate:"rating",
kon:"feed",
esh:"eshe"
}

class Footer extends React.Component {
	constructor(props){
		super(props);
		this.state = {menu:"feed"};
		this.self = props.self;

		this.notifyPopup = this.notifyPopup.bind(this);
	}

	notifyPopup(names) {
	    if (this.self.snackbar) return;
	    this.self.setState({
	      snackbar: (
	        <Snackbar filled onClose={() => this.self.setState({ snackbar: null })} style={{zIndex:99999999}}>
	          {names}
	        </Snackbar>
	      )
	    });
  	}

	render(){

		var self = this.self;

		console.log(self.state.footerState);
		return(<FixedLayout vertical="bottom">
			<Tabs>
			<TabsItem 
				 selected={this.state.menu ===PARAMS.rate}
				 onClick={()=>{this.notifyPopup("В разработке");/*this.setState({menu:PARAMS.rate}); self.setState({footerState:PARAMS.rate});*/}}
				 style={this.state.menu ===PARAMS.rate ? {color:"#5D3FD3", paddingTop:25} : {paddingTop:25}}>
				 <Icon28Users3Outline
				  		style={this.state.menu ===PARAMS.rate ? {background:"", paddingLeft:17} : {paddingLeft:17}}/>
				 Рейтинг
				 </TabsItem>

				 <TabsItem
				  selected={this.state.menu ===PARAMS.kon}
				  onClick={()=>{this.setState({menu:PARAMS.kon}); self.setState({footerState:PARAMS.kon});}}
				  style={this.state.menu ===PARAMS.kon ? {color:"#5D3FD3"} : {}}>
				  <Icon56FireOutline style={this.state.menu ===PARAMS.kon ? {color:"#5D3FD3", paddingLeft:10} : {paddingLeft:10}}/>
				  Конкурсы
				  </TabsItem>


				<TabsItem
				 selected={this.state.menu ===PARAMS.esh} 
				 onClick={()=>{this.setState({menu:PARAMS.esh}); self.setState({footerState:PARAMS.esh});}}
				 style={this.state.menu ===PARAMS.esh ? {color:"#5D3FD3", paddingTop:25} : {paddingTop:25}}>
				 <Icon28More
				  		style={this.state.menu ===PARAMS.esh ? {paddingLeft:2} : {paddingLeft:2}}/>
				 Еще
				 </TabsItem>
			</Tabs>
			</FixedLayout>);
	}
}

export default Footer;
