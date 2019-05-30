import React, { Component } from 'react';
import styles from './scss/App.scss';
import classNames from 'classnames/bind';
import { Database } from '../src/stores/FirebaseStore.js';
//import "../node_modules/react-select/dist/react-select.css";
import Home from './Home'
const cb = classNames.bind(styles);


class Join extends Component {
	constructor () {
		super();
		this.state = {
			user_id: '',
			idAbleCheck: true,
			idCheck: false,
			loginCheck: false
		};
	};

	CheckUserId = () => {
		Database.user.once('value').then(snapshot => {
			if(snapshot.val()) {
				snapshot.forEach(childSnapShot => {
					let data = childSnapShot.val();
					if(data.user_id === this.refs.requestID.value) {
						this.state.idAbleCheck = false;
					}
				});
				if(this.state.idAbleCheck) {
					this.state.idCheck = true;
					alert(this.refs.requestID.value + "는 사용 가능한 ID 입니다.")
				}
				else {
					alert(this.refs.requestID.value + "는 사용중인 ID 입니다.");
				}

			}
			else {
				this.state.idCheck = true;
				alert(this.refs.requestID.value + "는 사용 가능한 ID 입니다.")
			}
		});
		this.state.idAbleCheck = true;
	};
	onSubmit = () => {
		if(this.state.idCheck && this.refs.requestPW.value) {
			var newPostRef = Database.user.push();
			newPostRef.set({
				user_id: this.refs.requestID.value,
				password: this.refs.requestPW.value,
				user_key: newPostRef.key,
				myContents: null,
				likeContents: null,
				likeComments: null,
				likeRecomments: null
			});
			this.setState({
				idCheck: false,
				loginCheck: true,
				user_id: this.refs.requestID.value
			});
			alert("환영합니다!")
		}
	};

	render() {
		if(!this.state.loginCheck) {
			return(
				<div className={cb('login_panel')}>
					<div className={cb('login_layer')}>
						<h1 className={cb('title')}>Colution</h1>
						<div className={cb('login_area')}>
							<h2 className={cb('login_title')}>회원가입</h2>
							<div className={cb('id_input')}>
								<input type="text" placeholder="아이디를 입력해주세요." className={cb('login_input')} ref="requestID"/>
								<button type="button" className={cb('btn_confirm')} onClick={this.CheckUserId}>중복확인</button>
							</div>
							<input type="password" placeholder="비밀번호를 입력해주세요." className={cb('login_input')} ref="requestPW"/>
						</div>
						<div className={cb('button_area')}>
							<button type="submit" className={cb('login')} onClick={this.onSubmit}>
								JOIN
							</button>
						</div>
					</div>
				</div>
			);
		}
		else {
			const {contentStore, userStore, commentStore, recommentStore, obvStore} = this.props;
			return (
				<Home user_id={this.state.user_id} contentStore={contentStore} userStore={userStore} commentStore={commentStore} recommentStore={recommentStore} obvStore={obvStore}/>
			);
		}

	}
}

export default Join;

