import React, { Component } from 'react';
import cookie from 'react-cookies'
import styles from './scss/App.scss';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import LoginPanel from "./LoginPanel";
import SelectBox from './components/SelectBox';
import AddIssue from './components/AddIssue'
import ContentSection from './components/ContentSection';

const cb = classNames.bind(styles);

@observer
class Home extends Component {
	contentStore = [];
	constructor () {
		super();
		this.state = {
			user_id: '',
			contentTypeValue: 'all',
			contentTypeLabel: '전체보기',
			searchWord: '',
			userFilter: ''
		};
		this.handleAddIssue = this.handleAddIssue.bind(this);
	}
	componentWillMount() {
		this.state.user_id = this.props.user_id;
	}
	componentWillUpdate() {
		const {obvStore} = this.props;
		obvStore.userId = this.state.user_id;
	}
	componentDidUpdate() {
		this.state.add_issue_status = false;
	}

	handleLogout = () => {
		cookie.remove('user_id', { path: '/' })
		this.setState({user_id: ''})
	};

	handleChangeContent = (select) => {
		this.setState( {
			contentTypeValue: select.value,
			contentTypeLabel: select.label,
		});
	};

	handleSearchItem = () => {
		this.setState({
			searchWord: this.refs.searchItem.value
		});
	};

	handleAddIssue = () => {
		const {obvStore} = this.props;
		obvStore.layerToggle = true;
	};

	render() {
		const {contentStore, obvStore, userStore, commentStore, recommentStore} = this.props;
		if(this.state.user_id) {
			let title = cb('title_section',this.state.contentTypeValue);
			//콘텐츠 정렬
			let userDatas = userStore.filter(data => {
				if(data.user_id === this.state.user_id) return data;
				return false;
			});
			const userData=userDatas[0];
			let myContent = [];
			if(userData!== undefined) {
				if(obvStore.contentFilter==='my_question' || obvStore.contentFilter==='all') {
					myContent.push(userData.myContents);

				}
				else if(obvStore.contentFilter==='my_answer') {
					myContent.push(userData.myAnswers);
				}
			}
			myContent = myContent.toString();

			let commentFilter = commentStore.map(data => {
				if(data.content.indexOf(this.state.searchWord)===-1)
					return false;
				return data.content_id;
			});
			commentFilter = commentFilter.toString();

			//콘텐츠 필터
			this.contentStore = contentStore.filter(data => {
				let contentId = data.content_id;
				//console.log(data.content);
				if(obvStore.contentFilter === 'all') {
					contentId = '';
				}
				if(myContent.indexOf(contentId) === -1) return false;//콘텐츠 정렬
				if(data.content.indexOf(this.state.searchWord)=== -1 && data.title.indexOf(this.state.searchWord)=== -1&&commentFilter.indexOf(data.content_id)===-1) return false; //검색 기능
				if(data.category.indexOf(obvStore.issueFilter)=== -1) return false;//이슈 필터
				return true;
			});

			if(obvStore.issueSort === 'date') {
				this.contentStore.sort(function(a,b) {
					if(a.date > b.date) return -1;
					if(a.date < b.date) return 1;
					return 0;
				})
			}

			//이슈 정렬 - 조회순
			if(obvStore.issueSort === 'hits') {
				this.contentStore.sort(function(a,b) {
					if(a.hits > b.hits) return -1;
					if(a.hits < b.hits) return 1;
					return 0;
				})
			}

			//이슈 정렬 - 추천순
			if(obvStore.issueSort === 'recommend') {
				this.contentStore.sort(function(a,b) {
					if(a.recommend > b.recommend) return -1;
					if(a.recommend < b.recommend) return 1;
					return 0;
				})
			}

			//추천하기
			if(userData.likeContents !== undefined) {
				obvStore.userlikeContents = userData.likeContents.toString();
			}
			//댓글추천하기
			if(userData.likeComments !== undefined) {
				obvStore.userlikeComments = userData.likeComments.toString();
			}
			return (
				<div className={cb('wrap')}>
					<header>
						<div className={cb('header_area')}>
							<div className={cb('search_area')}>
								<input className={cb('search_bar')} type="text" ref="searchItem" onChange={this.handleSearchItem} placeholder="검색어로 검색해보세요."/>
							</div>
							<div className={cb('select_area')}>
								<SelectBox filter="contents" user_id={this.props.user_id} handleChangeContent = {this.handleChangeContent} obvStore={obvStore}/>
								<SelectBox filter="issues" obvStore={obvStore} handleChangeContent = {this.handleChangeContent}/>
								<SelectBox filter="sorting" obvStore={obvStore}/>
							</div>
							<button type="button" className={cb('btn_login')} onClick={this.handleLogout}>
								<span  className={cb('blind')}>로그아웃</span>
							</button>
							<button href="#" className={cb('add_btn')} onClick={this.handleAddIssue}>
								<span className={cb('blind')}>이슈추가하기</span>
							</button>
						</div>
					</header>
					<section>
						<div className={title}>
							<div className={cb('title')}>{this.state.contentTypeLabel}</div>
						</div>
						<ContentSection contentStore={this.contentStore} obvStore={obvStore} userData={userData} commentStore={commentStore} recommentStore={recommentStore}/>
					</section>
					<footer>
						<div className={cb('footer')}>
						</div>
					</footer>
					<AddIssue user_id={this.props.user_id} obvStore={obvStore} userStore={userStore}/>
				</div>
			);
		}
		else {
			return(
				<LoginPanel userStore={userStore} obvStore={obvStore} contentStore={this.contentStore}/>
			)
		}
	}
}

export default Home;
