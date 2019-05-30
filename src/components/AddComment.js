import React, { Component } from 'react';
import styles from '../scss/App.scss';
import TextEditor from './TextEditor';
import classNames from 'classnames/bind';
import { Database } from '../../src/stores/FirebaseStore.js';
import { observer } from 'mobx-react';
const cb = classNames.bind(styles);

@observer
class AddComment extends Component {
	constructor() {
		super();
		this.state = {
			user_id: '익명',
			checkPublic: false,
			add_comment_status: false,
			recomment_id: 0
		}
	}
	handleLayer = () => {
		const {obvStore} = this.props;
		obvStore.layerCommentToggle = false;
	};
	shouldComponentUpdate(nextProps, nextState) {
		return nextProps;
	}
	handleSubmit = () => {
		const {obvStore} = this.props;
		obvStore.layerCommentToggle = false;
		let date = new Date().toLocaleString('ko-KR');
		if(this.refs.CheckPublic.checked)
		{
			this.state.user_id = obvStore.userId;
		}
		let newPostRef;
		//comment 처리
		if(obvStore.commentToggle ==="comment") {
			newPostRef = Database.comments.push();
			newPostRef.set({
				comment_id: newPostRef.key,
				content_id: this.props.content_id,
				date: date,
				answer: 0,
				nickname: this.state.user_id,
				recommend: 0
			});
			Database.contents.once('value').then(snapshot => {
				snapshot.forEach(childSnapShot => {
					let comments = [];
					let data = childSnapShot.val();
					if(data.content_id === this.props.content_id) {
						if(data.comments) {
							comments = data.comments;
						}
						comments.push(newPostRef.key);
						Database.root.ref('wrap/contents/'+this.props.content_id).update({
							comments: comments,
							answer: comments.length
						});
					}
				});
			})
		}
		//recomment 처리
		else {
			const {obvStore} = this.props;
			// recommentStore에 저장
			newPostRef = Database.recomments.push();
			newPostRef.set({
				recomment_id: newPostRef.key,
				comment_id: obvStore.commentID,
				content_id: this.props.content_id,
				date: date,
				answer: 0,
				nickname: this.state.user_id,
				recommend: 0,
			});
			Database.comments.once('value').then(snapshot => {
				snapshot.forEach(childSnapShot => {
					let recomments = [];
					let data = childSnapShot.val();
					if(data.comment_id === obvStore.commentID) {
						if(data.recomments) {
							recomments = data.recomments;
						}
						recomments.push(newPostRef.key);
						Database.root.ref('wrap/contents/'+this.props.content_id).update({
							recomments: recomments,
						});
						Database.root.ref('wrap/comments/'+obvStore.commentID).update({
							recomments: recomments,
							answer: recomments.length
						});
					}
				});
			})

			obvStore.recommentID = newPostRef.key;
		}
		// userStore에 저장
		Database.user.once('value').then(snapshot => {
			snapshot.forEach(childSnapShot => {
				let data = childSnapShot.val();
				let user_key = '';
				let myComment = [];
				if(data.myAnswers) {
					myComment= data.myAnswers;
				}
				if(data.user_id === obvStore.userId) {
					user_key = childSnapShot.key;
					let myCommentFilter = myComment.toString();
					// 중복 저장 방지
					if(myCommentFilter.indexOf(this.props.content_id)===-1) {
						myComment.push(this.props.content_id);
						Database.root.ref('user/'+user_key).update({
							myAnswers: myComment
						});
					};
				}
			});
		});
		this.setState({
			add_comment_status: true,
			comment_id: newPostRef.key
		});
	};
	componentDidUpdate() {
		this.state.add_comment_status= false;
		this.state.user_id = '익명';
	}
	render () {
		const {obvStore} = this.props;
		let result = obvStore.layerCommentToggle ? 'add_issue_dimmed' : ['add_issue_dimmed','hide'];
		return (
			<div className={cb(result)}>
				<div className={cb('add_issue_layer','comment')}>
					<div className={cb('ly_heading_section')}>답글 추가</div>
					<div className={cb('ly_content_section')}>
						<div className={cb('ly_title_area')}>
							<span htmlFor="title" className={cb('title')}>제목: <span className="content">{this.props.title}</span></span>
						</div>
						<div className={cb('ly_content_area')}>
							<div className={cb('content_head')}>
								<input type="radio" id="nickname" name="check_public" className={cb('ch_input')}/><label htmlFor="nickname" className={cb('ch_label')} ref="CheckPublic">닉네임</label>
								<input type="radio" id="name" name="check_public" className={cb('ch_input')}/><label htmlFor="name" className={cb('ch_label')} defaultChecked="true">익명</label>
							</div>
							<TextEditor obvStore= {obvStore} add_comment_status={this.state.add_comment_status} comment_id={this.state.comment_id} comment={this.props.comment}/>
						</div>
						<button type="submit" className={cb('btn_add_issue')} onClick={this.handleSubmit}>답글 달기</button>
						<button type="button" className={cb('btn_close')} onClick={this.handleLayer}><span className={cb('blind')}>닫기</span></button>
					</div>
				</div>
			</div>
		)
	}
}

export default AddComment;