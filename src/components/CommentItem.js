import React, { Component } from 'react';
import styles from '../scss/App.scss';
import classNames from 'classnames/bind';
import {Database} from '../stores/FirebaseStore'
import {observer} from 'mobx-react'

import AddComment from '../components/AddComment.js'
import RecommentItem from '../components/RecommentItem';

const cb = classNames.bind(styles);

@observer
class CommentItem extends Component {
	constructor() {
		super();
		this.state = {
			commentLiked: false,
			recommend: 0,
			liked: false
		};
	};
	componentWillMount() {
		const {userData,obvStore} = this.props;
		if(userData.likeComments!==undefined) {
			obvStore.userlikeComments=userData.likeComments.toString();
		}
		let likeComments = obvStore.userlikeComments.toString();
		if(likeComments.indexOf(this.props.comment_id)!==-1) {
			this.state.liked = true;
		}
	}
	handleLikedState = () => {
		const {userData,obvStore} = this.props;
		if(!this.state.liked) {
			this.setState({
				liked : true
			});
			this.state.recommend = this.props.recommend + 1;
			Database.comments.child(this.props.comment_id).update({
				recommend : this.state.recommend
			});
			obvStore.userlikeComments = obvStore.userlikeComments+","+this.props.comment_id.toString();
			let userlikeComments = obvStore.userlikeComments.split(",");
			Database.user.child(userData.user_key).update({
				likeComments: userlikeComments
			})
		}
		else {
			this.setState({
				liked: false
			});
			this.state.recommend = this.props.recommend - 1;
			Database.comments.child(this.props.comment_id).update({
				recommend : this.state.recommend
			});
			let userlikeComments = obvStore.userlikeComments.split(",");
			userlikeComments.pop(this.props.comment_id);
			Database.user.child(userData.user_key).update({
				likeComments: userlikeComments
			})
		}
	};
	handleAddComment = () => {
		const {obvStore} = this.props;
		obvStore.layerCommentToggle = true;
		obvStore.commentToggle = 'recomment';
		obvStore.commentID = this.props.comment_id;
	};
	render () {
		let commentLikeBtn = this.state.liked ?  cb('btn','recommend', 'like') : cb('btn','recommend');
		const {recommentStore, obvStore, userStore} = this.props;
		let items = [];
		let RecommentItems = [];
		items = recommentStore.filter((data) => {
			if(data.comment_id !== this.props.comment_id)
				return false;
			return true;
		});
		items.map((data, index) => {
			RecommentItems.push(
				<RecommentItem key={index} nickname={data.nickname} date={data.date} recommend={data.recommend} content={data.content} content_id={data.content_id} comment_id={data.comment_id} recomment_id={data.recomment_id} obvStore={this.props.obvStore} userData={this.props.userData} commentStore={this.props.commentStore} recommentStore={this.props.recommentStore}/>
			);
			return items;
		});
		return (
			<li className={cb('answer_list')}>
				<div className={cb('content_area')}>
					<div className={cb('user_info')}>
						<div className={cb('thumbnail')}>
							<i className={cb('xi-face','xi','ico_user')}></i>
							<img src="sprite.png" alt=""/>
						</div>
						<span className={cb('nickname')}>{this.props.nickname}</span>
					</div>
					<div className={cb('description')}>
						<div className={cb('detail_info','comment')}>
							<dl className={cb('answer')}>
								<dt>답변수: </dt>
								<dd>{this.props.answer}</dd>
							</dl>
							<dl className={cb('recommend')}>
								<dt>추천수: </dt>
								<dd>{this.props.recommend}</dd>
							</dl>
							<span className={cb('date')}>{this.props.date}</span>
						</div>
						<p dangerouslySetInnerHTML={{__html: this.props.content}} />
						<div className={cb('btn_area')}>
							<button type="button" className={commentLikeBtn} onClick={this.handleLikedState}>
								<span className={cb('blind')}>추천버튼</span>
							</button>
							<button type="button" className={cb('btn','add_answer')} onClick={this.handleAddComment}>답글달기</button>
						</div>
						<ul className={cb('recomment_area')}>
							{RecommentItems}
						</ul>
						<AddComment obvStore={obvStore} userStore={userStore} content_id={this.props.content_id} title={this.props.title} comment_id={this.props.comment_id}/>
					</div>
				</div>
			</li>
		)
	}
}

export default CommentItem;