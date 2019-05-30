import React, { Component } from 'react';
import styles from '../scss/App.scss';
import classNames from 'classnames/bind';
import {Database} from '../stores/FirebaseStore'
import {observer} from 'mobx-react'

const cb = classNames.bind(styles);

@observer
class RecommentItem extends Component {
	constructor() {
		super();
		this.state = {
			commentLiked: false,
			comment: false,
			recommend: 0,
			liked: false
		};
	};
	componentWillMount() {
		const {userData,obvStore} = this.props;
		if(userData.likeRecomments!==undefined) {
			obvStore.userlikereComments=userData.likeRecomments.toString();
		}
		let likereComments = obvStore.userlikereComments.toString();
		if(likereComments.indexOf(this.props.recomment_id)!==-1) {
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
			Database.recomments.child(this.props.recomment_id).update({
				recommend : this.state.recommend
			});
			obvStore.userlikereComments = obvStore.userlikereComments+","+this.props.recomment_id.toString();
			let userlikereComments = obvStore.userlikereComments.split(",");
			Database.user.child(userData.user_key).update({
				likeRecomments: userlikereComments
			})
		}
		else {
			this.setState({
				liked: false
			});
			this.state.recommend = this.props.recommend - 1;
			Database.recomments.child(this.props.recomment_id).update({
				recommend : this.state.recommend
			});
			let userlikereComments = obvStore.userlikereComments.split(",");
			userlikereComments.pop(this.props.recomment_id);
			Database.user.child(userData.user_key).update({
				likeRecomments: userlikereComments
			})
		}
	};
	render () {
		let RecommentLikeBtn = this.state.liked ?  cb('btn','recommend', 'like') : cb('btn','recommend');
		return (
			<li className={cb('recomment_list')}>
				<div className={cb('recomment_header')}>
					<div className={cb('user_info','recomment')}>
						<div className={cb('thumbnail')}>
							<i className={cb('xi-face','xi','ico_user')}></i>
							<img src="sprite.png" alt=""/>
						</div>
						<span className={cb('nickname')}>{this.props.nickname}</span>
					</div>
					<div className={cb('cont_info','recomment')}>
						<div className={cb('detail_info')}>
							<dl className={cb('recommend')}>
								<dt>추천수: </dt>
								<dd>{this.props.recommend}</dd>
							</dl>
							<span className={cb('date')}>{this.props.date}</span>
						</div>
					</div>
				</div>
				<div className={cb('description')}>
					<p dangerouslySetInnerHTML={{__html: this.props.content}} />
					<div className={cb('btn_area')}>
						<button type="button" className={RecommentLikeBtn} onClick={this.handleLikedState}>
							<span className={cb('blind')}>추천버튼</span>
						</button>
					</div>
				</div>
			</li>
		)
	}
}

export default RecommentItem;