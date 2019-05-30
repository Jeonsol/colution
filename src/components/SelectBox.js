import React, { Component } from 'react';
import Select from 'react-select';
import styles from '../scss/App.scss';
import classNames from 'classnames/bind';

import { observer } from 'mobx-react';

const cb = classNames.bind(styles);

@observer
class SelectBox extends Component{
	constructor () {
		super();
		this.state = {
			value: [],
			contents: [
				{ value: 'all', label: '전체보기'},
				{ value: 'my_question', label: '내가 질문한 콘텐츠'},
				{ value: 'my_answer', label: '내가 답변한 콘텐츠'}
			],
			issues: [
				{ value: '', label: '전체보기' },
				{ value: 'MarkUp', label: '마크업' },
				{ value: 'Setting', label: 'Setting' },
				{ value: 'Git', label: 'Git' },
				{ value: 'Gulp', label: 'Gulp' },
				{ value: 'Sass', label: 'Sass' },
				{ value: 'otehrs', label: '기타' }
			],
			add_issues: [
				{ value: 'MarkUp', label: '마크업' },
				{ value: 'Setting', label: 'Setting' },
				{ value: 'Git', label: 'Git' },
				{ value: 'Gulp', label: 'Gulp' },
				{ value: 'Sass', label: 'Sass' },
				{ value: 'others', label: '기타' }
			],
			sorting: [
				{ value: 'all', label: '전체보기' },
				{ value: 'date', label: '최신순' },
				{ value: 'review', label: '답변순' },
				{ value: 'recommend', label: '추천순' },
				{ value: 'hits', label: '조회순' }
			]
		}
	}

// Contents
	updateContents = (newValue) => {
		const {obvStore} = this.props;
		obvStore.contentFilter = newValue.value;
		this.setState({
			selectValue: newValue,
		});
		this.props.handleChangeContent(newValue);
	};

// 정렬
	updateSorting = (newValue) => {
		const {obvStore} = this.props;
		obvStore.issueSort = newValue.value;
		this.setState({
			selectValue: newValue,
		});
	};

//이슈
	updateIssues = (newValue) => {
		const {obvStore} = this.props;
		obvStore.issueFilter = newValue.value;
		this.setState({
			selectValue: newValue,
		});
		this.props.handleChangeContent(newValue);
	};

	handleUpdateData = (newValue) => {
		const {obvStore} = this.props;
		obvStore.addCategory = newValue.value;
		this.setState({
			selectValue: newValue,
		});
	};

	render () {
		if(this.props.filter==='contents'){
			return (
				<div className={cb('combobox')}>
					<Select
						options={this.state.contents}
						placeholder={"콘텐츠선택"}
						clearable={false}
						disabled={false}
						value={this.state.selectValue}
						onChange={this.updateContents}
						searchable={this.props.searchable}
					/>
				</div>
			);
		}
		else if(this.props.filter==='sorting') {
			return (
				<div className={cb('combobox')}>
					<Select
						options={this.state.sorting}
						placeholder={"정렬"}
						clearable={false}
						disabled={false}
						value={this.state.selectValue}
						onChange={this.updateSorting}
						searchable={this.props.searchable}
					/>
				</div>
			);
		}
		else if(this.props.filter==='issues') {
			return (
				<div className={cb('combobox')}>
					<Select
						options={this.state.issues}
						placeholder={"이슈선택"}
						clearable={false}
						disabled={false}
						value={this.state.selectValue}
						onChange={this.updateIssues}
						searchable={this.props.searchable}
					/>
				</div>
			);
		}
		else if(this.props.filter==='add_issues') {
			return (
				<div className={cb('combobox')}>
					<Select
						options={this.state.add_issues}
						placeholder={"이슈선택"}
						clearable={false}
						disabled={false}
						value={this.state.selectValue}
						onChange={this.handleUpdateData}
						searchable={this.props.searchable}
					/>
				</div>
			);
		}
	}
};




export default SelectBox;