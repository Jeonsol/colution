import React, { Component } from 'react';
import styles from '../scss/App.scss';
import classNames from 'classnames/bind';
import {Database} from '../stores/FirebaseStore'
import {observer} from 'mobx-react'
import AddComment from '../components/AddComment.js'
import CommentItem from '../components/CommentItem.js'

const cb = classNames.bind(styles);

@observer
class ContentItem extends Component {
	constructor() {
		super();
		this.state = {
			expanded: false,
			liked: false,
			hit: 0,
			recommend: 0
		};
	};
	componentWillMount() {
		const {userData,obvStore} = this.props;
		if(userData.likeContents!==undefined) {
			obvStore.userlikeContents=userData.likeContents.toString();
		}
		let likeContents = obvStore.userlikeContents.toString();
		if(likeContents.indexOf(this.props.content_id)!==-1) {
			this.state.liked = true;
		}
	}
	handleListState = () => {
		this.setState({
			expanded : !this.state.expanded
		});
		if(!this.state.expanded) {
			this.state.hit = this.props.hits + 1;
			Database.contents.child(this.props.content_id).update({
				hits: this.state.hit
			});
		}
	};
	handleLikedState = () => {
		const {userData,obvStore} = this.props;
		if(!this.state.liked) {
			this.setState({
				liked : true
			});
			this.state.recommend = this.props.recommend + 1;

			Database.contents.child(this.props.content_id).update({
				recommend : this.state.recommend
			});
			obvStore.userlikeContents = obvStore.userlikeContents+","+this.props.content_id.toString();
			let userlikeContents = obvStore.userlikeContents.split(",");
			Database.user.child(userData.user_key).update({
				likeContents: userlikeContents
			})
		}
		else {
			this.setState({
				liked: false
			});
			this.state.recommend = this.props.recommend - 1;
			Database.contents.child(this.props.content_id).update({
				recommend : this.state.recommend
			});
			let userlikeContents = obvStore.userlikeContents.split(",");
			userlikeContents.pop(this.props.content_id);
			Database.user.child(userData.user_key).update({
				likeContents: userlikeContents
			})
		}
	};
	handleAddComment = () => {
		const {obvStore} = this.props;
		obvStore.layerCommentToggle = true;
		obvStore.commentToggle = 'comment';
	};
	handleDelete = () => {
		let confirm = window.confirm('정말 삭제하시겠습니까?');
		if(confirm) {
			if(this.props.comments) {
				Database.comments.once('value').then(snapshot=> {
					snapshot.forEach(childSnapshot=> {
						if(this.props.comments.includes(childSnapshot.key)) {
							Database.comments.child(childSnapshot.key).remove();
						}
					})
				});
			}
			if(this.props.recomments) {
				Database.recomments.once('value').then(snapshot=> {
					snapshot.forEach(childSnapshot=> {
						if(this.props.recomments.includes(childSnapshot.key)) {
							Database.recomments.child(childSnapshot.key).remove();
						}
					})
				});
			}
			//user 정보 변경
			//myContents
			let index1 = this.props.userData.myContents.indexOf(this.props.content_id);
			if(index1 > -1) {
				this.props.userData.myContents.splice(index1,1);
				Database.user.child(this.props.userData.user_key).update({
					myContents: this.props.userData.myContents
				})
			}
			//likeContents
			let index2 = this.props.userData.likeContents.indexOf(this.props.content_id);
			if(index2 > -1) {
				this.props.userData.likeContents.splice(index2,1);
				Database.user.child(this.props.userData.user_key).update({
					likeContents: this.props.userData.likeContents
				})
			}

			Database.contents.child(this.props.content_id).remove();
		}
	};
	render () {
		const {obvStore, userStore,commentStore} = this.props;
		let likeBtn = this.state.liked ?  cb('btn','recommend', 'like') : cb('btn','recommend');
		let openItem = this.state.expanded ? cb('btn_open','close') : cb('btn_open') ;
		let deleteItem = this.props.userData.myContents.includes(this.props.content_id) ? cb('btn_delete') : cb('btn_delete','none');
		let items = [];
		let commentItems = [];
		items = commentStore.filter((data) => {
			if(data.content_id !== this.props.content_id)
				return false;
			return true;
		});
		items.map((data, index) => {
			commentItems.push(
				<CommentItem key={index} nickname={data.nickname} date={data.date} answer={data.answer} recommend={data.recommend} content={data.content} content_id={data.content_id} comment_id={data.comment_id} obvStore={this.props.obvStore} userData={this.props.userData} commentStore={this.props.commentStore} recommentStore={this.props.recommentStore}/>
			);
			return items;
		});
		return (
			<li className={cb('list')}>
				<a href="#" className={cb('title_area')} aria-expanded={this.state.expanded} onClick={this.handleListState}>
					<div className={cb('user_info')}>
						<div className={cb('thumbnail')}>
							<i className={cb('xi-profile','ico_user')}></i>
						</div>
						<span className={cb('nickname')}>{this.props.nickname}</span>
						<span className={cb('state')}><span className={cb('blind')}>명예훈장</span></span>
					</div>
					<div className={cb('cont_info')}>
						<strong className={cb('title')}>{this.props.title}</strong>
						<span className={cb('category')}>{this.props.category}</span>
						<div className={cb('detail_info')}>
							<dl className={cb('hits')}>
								<dt>조회수: </dt>
								<dd>{this.props.hits}</dd>
							</dl>
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
					</div>
				</a>
				<div className={cb('btn_set')}>
					<button className={deleteItem} onClick={this.handleDelete}><span className={cb('blind')}>삭제</span></button>
					<button className={openItem} onClick={this.handleListState}><span className={cb('blind')}>펼쳐보기</span></button>
				</div>
				<a href="#" className={cb('solution_toggle')}>
					<span className={cb('blind')}>문제해결</span>
				</a>
				<div className={cb('description')}>
					<p dangerouslySetInnerHTML={{__html: this.props.content}} />
					<div className={cb('btn_area')}>
						<button type="button" className={likeBtn} onClick={this.handleLikedState}>
							<span className={cb('blind')}>추천버튼</span>
						</button>
						<button type="button" className={cb('btn','add_answer')} onClick={this.handleAddComment}>답글달기</button>
					</div>
				</div>
				<div className={cb('answer_area')}>
					<div className={cb('answer_title')}>
						<span className={cb('title')}>답변</span>
					</div>
					<ul className={cb('answer_set')}>
						{commentItems}
					</ul>
					<AddComment obvStore={obvStore} userStore={userStore} content_id={this.props.content_id} title={this.props.title} comment="comment"/>
				</div>
			</li>
		)
	}
}

export default ContentItem;