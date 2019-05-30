import React, { Component } from 'react';
import styles from '../scss/App.scss';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';

import TextEditor from './TextEditor';
import SelectBox from './SelectBox';
import { Database } from '../../src/stores/FirebaseStore.js';


const cb = classNames.bind(styles);
@observer
class AddIssue extends Component {
	constructor() {
		super();
		this.state = {
			content_id: 0,
			checkPublic: false,
			user_id: '익명',
			add_issue_status : false
		};
	}
	handleLayer = () => {
		const {obvStore} = this.props;
		obvStore.layerToggle = false;
	};
	handleSubmit = () => {
		const {obvStore} = this.props;
		if(!this.refs.inputTitle.value) {
			alert('제목을 입력해 주세요.');
		}
		else if(!obvStore.addCategory){
			alert('카테고리를 등록해 주세요.')
		}
		else if(this.refs.inputTitle.value) {
			obvStore.layerToggle = false;
			let date = new Date().toLocaleString('ko-KR');
			if(this.refs.CheckPublic.checked)
			{
				this.state.user_id = this.props.user_id;
			}
			// contentStore에 저장
			let newPostRef = Database.contents.push();
			newPostRef.set({
				content_id: newPostRef.key,
				title: this.refs.inputTitle.value,
				answer: 0,
				category: obvStore.addCategory,
				date: date,
				hits: 0,
				nickname: this.state.user_id,
				recommend: 0,
			});
			// userStore에 저장
			Database.user.once('value').then(snapshot => {
				snapshot.forEach(childSnapShot => {
					let data = childSnapShot.val();
					let user_key = '';
					let myContent = [];
					if(data.myContents) {
						myContent= data.myContents;
					}
					if(data.user_id === this.props.user_id) {
						user_key = childSnapShot.key;
						myContent.push(newPostRef.key);
						Database.root.ref('user/'+user_key).update({
							myContents: myContent,
						});
					}
				});
			});
			this.setState({
				add_issue_status: true,
				content_id: newPostRef.key
			});
			this.refs.inputTitle.value = "";
		}
	};
	componentWillUpdate() {
		this.state.layerToggle = true;
	}
	componentDidUpdate() {
		this.state.add_issue_status= false;
		this.state.user_id = '익명';
	}
	render () {
		const {obvStore} = this.props;
		let result = obvStore.layerToggle ? 'add_issue_dimmed' : ['add_issue_dimmed','hide'];
		return (
			<div className={cb(result)}>
				<div className={cb('add_issue_layer')}>
					<div className={cb('ly_heading_section')}>이슈 추가</div>
					<div className={cb('ly_content_section')}>
						<div className={cb('ly_title_area')}>
							<label htmlFor="title" className={cb('title')}>제목:</label>
							<input type="text" id="title" ref="inputTitle"/>
						</div>
						<div className={cb('ly_content_area')}>
							<div className={cb('content_head')}>
								<SelectBox filter="add_issues" obvStore={obvStore}/>
								<input type="radio" id="nickname" name="check_public" className={cb('ch_input')} ref="CheckPublic" value="nickname" defaultChecked="true"/>
								<label htmlFor="nickname" className={cb('ch_label')}>닉네임</label>
								<input type="radio" id="name" name="check_public" className={cb('ch_input')}/>
								<label htmlFor="name" className={cb('ch_label')}>익명</label>
							</div>
							<TextEditor add_issue_status={this.state.add_issue_status} content_id={this.state.content_id}/>
						</div>
						<button type="submit" className={cb('btn_add_issue')} onClick={this.handleSubmit}>이슈 생성</button>
						<button type="button" className={cb('btn_close')} onClick={this.handleLayer}><span className={cb('blind')}>닫기</span></button>
					</div>
				</div>
			</div>
		)
	}
}

export default AddIssue;