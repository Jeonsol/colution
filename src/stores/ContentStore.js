import { observable } from 'mobx-react';
import { Database } from '../stores/FirebaseStore';

export default class ContentStore {
	addContent(title,user_id,category,content) {
		let date = new Date().toLocaleString('ko-KR');
		let newPostRef = Database.contents.push();
		newPostRef.push({
			title: title,
			date: date,
			user_id: user_id,
			category: category,
			content: content,
			answer: 0,
			hits: 0,
			recommend: 0,
			like: 0
		})
	};
};

