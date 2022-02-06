import React, {useState, useEffect} from 'react';
import bridge from '@vkontakte/vk-bridge';
import '@vkontakte/vkui/dist/vkui.css';
import {View, Group, CardGrid, Card, ContentCard, Panel, Button, Div, Snackbar} from '@vkontakte/vkui';
import axios from "axios";
import "./feed.css";


async function CheckKonkursi(id, from_id){
	var konkursi_data = null;

	var r = await fetch("/abs_bot/konkursi/"+id+".txt").then(resp=>resp.text()).then(data=>{konkursi_data=data;});
	return konkursi_data.split(" ");
}

async function downloadKonkursi(id, from_id){
	var konkursi_data = null;
	var r = await fetch("/abs_bot/konkursi/"+id+".txt").then(resp=>resp.text()).then(data=>{konkursi_data=data;});
	return konkursi_data.split(" ");
}

async function loadData(params, self, from_id){
	switch(params["zadanie"]){
		case "subscribe":
			const d = await bridge.send("VKWebAppJoinGroup", {"group_id":params["public"]});
			var check = 0; 
			var ret = await CheckKonkursi(params["id"], from_id);

			for (const elem of ret){
				if (elem == from_id){
					self.notifyPopup("Вы уже участвуете)");
					check = 1;
				}
			}

			if(d["result"] == true && check == 0){

				self.notifyPopup("Ура, вы участвуете");
			}
			break;
		case "repost":
			break;
	}
}


function GetData(data, self, from_id){
	//const [disabled, setDisabled] = useState(false);
	//console.log(data_json);
	//console.log(prevData);


	var res = [];
    var mn;
	for(const elem of data){

		const header =(<div className="parent"><div className="child money">{elem["name"]}</div><div className="child time">{elem["data"]}</div></div>);

		mn = (
			<ContentCard 
			disable
			key={elem["id"]}
			id={elem["id"]}
			src={elem["url"]}
			header={header}
			text={elem["text"]}
			caption={<Button onClick={()=>loadData(elem, self, from_id)} id={elem["id"]}>Участвовать</Button>}/>
			);
		res.push(mn);
		}

	res.push(<Div key="bebra" style={{height:110}}>&nbsp;</Div>);
   	return res;
}


class Feed extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			snackbar: null,
			feed: null,
			from_id: props["user"]["id"]};


		this.notifyPopup = this.notifyPopup.bind(this);
	}
	updateFeed(){

		var self = this;

		axios.get("https://cw28062.tmweb.ru/1.json", {crossdomain: true})
            .then(res => {
                console.log(res);
            });
	}
	
	notifyPopup(names) {
	    if (this.state.snackbar) return;
	    this.setState({
	      snackbar: (
	        <Snackbar filled onClose={() => this.setState({ snackbar: null })} style={{zIndex:99999999}}>
	          {names}
	        </Snackbar>
	      ),
	    });
  	}

	componentDidMount(){
		this.updateFeed();
	}

	render(){

		return(
				<Group>
			        <CardGrid size="l">
			        	{this.state.feed}
			        	{this.state.snackbar}
			        </CardGrid>
			    </Group>
			);
	}
}

export default Feed;