import React, { Component } from 'react';
import styles from './scss/App.scss';
import cookie from 'react-cookies'
import classNames from 'classnames/bind';
import { Database } from '../src/stores/FirebaseStore.js';
import Home from './Home'
import Join from './Join'

const cb = classNames.bind(styles);

class LoginPanel extends Component {
	constructor() {
		super();
		this.state = {
			loginResult: false,
			joinState: false
		}
	}
	onLogin = (user_id) => {
		this.setState({ user_id })
		cookie.save('user_id', user_id, { path: '/' })
	};
	onSubmit = () => {
		let userInfo= {
			'user_id': this.refs.requestID.value,
			'password' : this.refs.requestPW.value
		};
		let cookieLoginData = this.refs.requestID.value;
		Database.user.once('value').then(snapshot => {
			snapshot.forEach(childSnapShot => {
				let data = childSnapShot.val();
				if(userInfo.user_id === data.user_id && userInfo.password === data.password) {
					this.onLogin(cookieLoginData);
					this.setState({
						loginResult : true
					});
				}
			});
			if(!this.state.loginResult) {
				if(!this.refs.requestPW.value) {
					alert('비밀번호를 입력해 주세요.');
				}
				else {
					alert('일치하는 ID와 PW가 없습니다.');
				}
			}
		})
	};

	handleJoin = () => {
		this.setState({
			joinState: true
		})
	};
	render() {
		const {contentStore, userStore, commentStore, recommentStore, obvStore} = this.props;
		if(!this.state.loginResult && !this.state.joinState) {
			return(
				<div className={cb('login_panel')}>
					<div className={cb('login_layer')}>
						<h1 className={cb('title')}>Colution</h1>
						<div className={cb('login_area')}>
							<h2 className={cb('login_title')}>LOGIN</h2>
							<input type="text" placeholder="아이디를 입력해주세요." className={cb('login_input')} ref="requestID"/>
							<input type="password" placeholder="비밀번호를 입력해주세요." className={cb('login_input')} ref="requestPW"/>
						</div>
						<div className={cb('button_area')}>
							<button type="button" className={cb('join')} onClick={this.handleJoin}>
								join us?
							</button>
							<button type="submit" className={cb('login')} onClick={this.onSubmit}>
								LOGIN
							</button>
						</div>
					</div>
				</div>
			);
		}
		if(this.state.loginResult && !this.state.joinState){
			return (
				<Home user_id={this.state.user_id} contentStore={contentStore} userStore={userStore} commentStore={commentStore} recommentStore={recommentStore} obvStore={obvStore}/>
			)
		}
		if(this.state.joinState) {
			return(
				<Join contentStore={contentStore} userStore={userStore} commentStore={commentStore} recommentStore={recommentStore} obvStore={obvStore}/>
			)
		}
	}
}

export default LoginPanel;

