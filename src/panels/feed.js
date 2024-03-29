import React, {useState, useEffect} from 'react';
import bridge from '@vkontakte/vk-bridge';
import '@vkontakte/vkui/dist/vkui.css';
import {View, Group, CardGrid, Card, ContentCard, Panel, Button, Div, Snackbar, ModalRoot, PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';
import axios from "axios";
import { Icon20Users } from '@vkontakte/icons';
import "./feed.css";

let gl_cors = "https://corsanywhere.herokuapp.com/";

async function CheckKonkursi(id, method){
	var konkursi_data = null;
	var r = await axios.get(gl_cors+"https://cx19346.tmweb.ru/data/"+id+".json")
	.then(resp=>konkursi_data = resp["data"][method]);
	return konkursi_data.split(" ");
}


async function podschet(id, user_id){
	var konkursi_data = new Map();
	var data = null;
	var it = 0;
	var how_much = 0;

	var r = await axios.get(gl_cors+"https://cx19346.tmweb.ru/data/"+id+".json")
	.then(resp=>konkursi_data = resp["data"]);


	for(var key in konkursi_data){
		data =  konkursi_data[key].split(" ");

		if(data.includes(user_id.toString())){
			it++;
		}

		how_much++;
	}

	return [it, how_much];
}

async function PrintPodschet(id, user, self){
	var counts_data = await podschet(id, user);
	if(counts_data[0] == counts_data[1]){
		self.notifyPopup("Вы выполнили все условия");
	}
	else{
		self.notifyPopup("Вы не закончили все условия");
	}
}

async function downloadKonkursi(id, from_id, method){
	var r = await axios.get(gl_cors+"https://cx19346.tmweb.ru/data/update_data.php?id="+id+"&from_id="+from_id+"&method="+method)
			.then(resp=>resp);
}

async function loadData(params, self, from_id, method){

	var counts_data = await podschet(params["id"], from_id);
	switch(method){
		case "twitch":
			var ret = await CheckKonkursi(params["id"], "twitch");
			for (const elem of ret){
				if (elem == from_id){
					self.notifyPopup("Вы выполнили данное условие");
					check = 1;
				}
			}

			window.location.href=params["twitch_url"];
			downloadKonkursi(params["id"], from_id, "twitch");

			break;
		case "tg":
			var ret = await CheckKonkursi(params["id"], "tg");
			for (const elem of ret){
				if (elem == from_id){
					self.notifyPopup("Вы выполнили данное условие");
					check = 1;
				}
			}


			window.location.href=params["tg"];
			downloadKonkursi(params["id"], from_id, "tg");

			break;
		case "subscribe":

			const d = await bridge.send("VKWebAppJoinGroup", {"group_id":params["public"]});
			var check = 0; 
			var ret = await CheckKonkursi(params["id"], "sub");


			for (const elem of ret){
				if (elem == from_id){
					self.notifyPopup("Вы выполнили данное условие");
					check = 1;
				}
			}

			if(d["result"] == true && check == 0){
				if(counts_data[0]+1 == counts_data[1]){
					bridge.send("VKWebAppSendPayload", {"group_id": 210513053, "payload": {"type": from_id, "msg":params["end_msg"], "how":"msg"}});
				}
				downloadKonkursi(params["id"], from_id, "sub");
				self.notifyPopup("Вы подписались");
			}
			break;
		case "repost":
			const res = await bridge.send("VKWebAppGetAuthToken", {"app_id":8075137, "scope":"wall"});

			var ret = await CheckKonkursi(params["id"], "rep");
			var check = 0; 	
			for (const elem of ret){
				if (elem == from_id){
					self.notifyPopup("Вы выполнили данное условие");
					check = 1;
				}
			}
			if(check == 0){
				if(res["scope"] == "wall"){
					/*const ff = await bridge.send("VKWebAppCallAPIMethod", {"method": "wall.get", "request_id": from_id.toString(), "params": {"access_token":res["access_token"], "owner_id":self.state.from_id, "offset":0, "count": 1, "v": "5.131"}});
					if(ff["response"]["items"][0]["copy_history"][0]["owner_id"] == params["owner_id"]){
							downloadKonkursi(params["id"], from_id, "rep");
							self.notifyPopup("Вы репостнули запись");
					}
					self.notifyPopup("Сейчас вас перекинет на запись и репостните, затем снова нажмите на кнопку", ()=>{
							bridge.send("VKWebAppOpenWallPost", {"owner_id": params["owner_id"], "post_id": params["post_id"]});	
					});	*/
					const ff = await bridge.send("VKWebAppShowWallPostBox", {"message": params["text_wall"], "attachments":params["attach_wall"]});
					if(ff["post_id"]){
						if(counts_data[0]+1 == counts_data[1]){
							bridge.send("VKWebAppSendPayload", {"group_id": 210513053, "payload": {"type": from_id, "msg": params["end_msg"], "how":"msg"}});
						}
						downloadKonkursi(params["id"], from_id, "rep");
						self.notifyPopup("Вы репостнули запись");
					}
				}else{
					self.notifyPopup("Чтобы этот метод работал, нужен доступ к стене");
				}
			}
			break;
	}
}

function Сheck_sost(elem, self, from_id){
	var res = [];
	var a = {display:"inline-block",width:"45%", margin:"5px", marginLeft:"10px"}
	if(elem["zadanie"].includes("subscribe")){
		res.push(<Button  style={a} onClick={()=>loadData(elem, self, from_id, "subscribe")} id={elem["id"]} size="l">Подписаться</Button>);
	}
	if(elem["zadanie"].includes("repost")){
		//res.push(<div>&nbsp;</div>);
		res.push(<Button style={a} size="l" onClick={()=>loadData(elem, self, from_id, "repost")} id={elem["id"]}>Репост</Button>);
	}
	if(elem["zadanie"].includes("twitch")){
		//res.push(<div>&nbsp;</div>);
		res.push(<Button style={a} size="l" onClick={()=>loadData(elem, self, from_id, "twitch")} id={elem["id"]}>Подписка Twitch</Button>);
	}
	if(elem["zadanie"].includes("tg")){
		//res.push(<div>&nbsp;</div>);
		res.push(<Button style={a} size="l" onClick={()=>loadData(elem, self, from_id, "tg")} id={elem["id"]}>Подписка Tg</Button>);
	}
	return res;
}



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
	//console.log(r);
}
function panel_update(elem, self, from_id){
	var Ret_modal_okno = Сheck_sost(elem, self, from_id);


	return (
	<Group>
     <img id="image" src={gl_cors+elem["url"]}></img>
     <Div>
     	{Ret_modal_okno}
     </Div>
     <Button style={{width:"100%"}} onClick={()=>{PrintPodschet(elem["id"], from_id, self);}}>Проверка</Button>	

     <Div style={{height:30}}>&nbsp;</Div>
     	<Button onClick={()=>{ads(self);}} className="ads_button">5% к шансу выйгрыша</Button>	
     <Div style={{height:110}}>&nbsp;</Div>
	</Group>);
}

function Modal_okno(elem, self, from_id){
	bridge.send("VKWebAppJoinGroup", {"group_id": 210513053, "key": "1"}).then(
	data=>{if(data.result){
			bridge.send("VKWebAppAllowMessagesFromGroup", {"group_id": 210513053, "key": "1"}).then(dats=>{
				if(dats.result){
					self.main_app.setState({footerState:"update"});
					self.main_app.setState({update: panel_update(elem, self, from_id)});
				}
			});
	}});
}

async function get_active(elem, self){

	var res;
	var res1;
	var result;

	if(elem["zadanie"].includes("subscribe")){
		var res = await CheckKonkursi(elem["id"], "sub");
	}
	if(elem["zadanie"].includes("repost")){
		var res1 = await CheckKonkursi(elem["id"], "rep");
	}

	if(res != [] && res1 != []){
		result = res.filter( x => res1.includes(x));
	} else{
		result = res != [] ? res : res1;
	}
	return result.length;
}

async function GetData(data, self, from_id){
	//const [disabled, setDisabled] = useState(false);
	//console.log(data_json);
	//console.log(prevData);

	var res = [];
    var mn;
	for(const elem of data){
		var r = await get_active(elem, self);

		const header =(
			<div className="parent">
				<img id="image1" src={gl_cors+elem["url"]}></img>
				<div className="child money">
				{elem["name"]}
				</div>
				<div className="child time">
				<div>
				{elem["data"]}
				</div>
				<div style={{color:"#B0BF1A"}}>
				<div style={{display:"inline-block"}}>
				<Icon20Users/>
				</div>
				<div style={{display:"inline-block", paddingLeft:"5px"}}>
				{r}
				</div>
				</div>
				</div>
				</div>);
		mn = (
			<ContentCard 
			disable
			key={elem["id"]}
			id={elem["id"]}
			header={header}
			text={elem["text"]}
			maxHeight={500}
			caption={
				<Button onClick={()=>{Modal_okno(elem, self, from_id)}}>Участвовать</Button>}/>
			);
		res.push(mn);
		}

	res.push(<Div key="bebra" style={{height:110}}>&nbsp;</Div>);
   	return res;
}


async function update(self){
	var data;
	var r = await axios.get(gl_cors+"https://cx19346.tmweb.ru/1.json")
            .then(res => {
            	data = res;
            });

    self.setState({feed : await GetData(data["data"]["data"], self, self.state.from_id)});
}

class Feed extends React.Component{
	constructor(props){
		super(props);

		this.state = {
			snackbar: null,
			feed: null,
			people: [],
			from_id: props["user"]["id"]};

		this.main_app = props["self"];

		this.notifyPopup = this.notifyPopup.bind(this);
	}
	updateFeed(){

		var self = this;

		update(self);
	}
	
	notifyPopup(names, func=null) {
	    if (this.main_app.snackbar) return;
	    this.main_app.setState({
	      snackbar: (
	        <Snackbar filled onClose={() => {this.main_app.setState({ snackbar: null });if(func != null){func();}}} style={{zIndex:99999999}}>
	          {names}
	        </Snackbar>
	      )
	    });
  	}

	componentDidMount(){
		this.updateFeed();

	}
	componentWillMount(){
		return;
	}
	render(){
		
		return(
				
				<Group>
			        <CardGrid size="l">
			        	{this.state.feed}
			        </CardGrid>
			    </Group>
			);
	}
}

export default Feed;
