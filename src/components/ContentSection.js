import React, { Component } from 'react';
import styles from '../scss/App.scss';
import classNames from 'classnames/bind';

import ContentItem from './ContentItem';



const cb = classNames.bind(styles);

class ContentSection extends Component {
	constructor(props) {
		super(props);

		this.state = {
			tracks: []
		}
	}
	render () {
		let items = [];
		this.props.contentStore.map((data, index) => {
			items.push(
				<ContentItem key={index} nickname={data.nickname} title={data.title} category={data.category} date={data.date} hits={data.hits} answer={data.answer} recommend={data.recommend} content={data.content} comments={data.comments} recomments={data.recomments} content_id={data.content_id} obvStore={this.props.obvStore} userData={this.props.userData} commentStore={this.props.commentStore} recommentStore={this.props.recommentStore}/>
			);
			return items;
		});

		return (
			<div className={cb('content_section')}>
				<ul className={cb('list_set')}>
					{items}
				</ul>
			</div>
		)
	}
}

export default ContentSection;