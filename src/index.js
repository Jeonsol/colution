import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import {Database} from './stores/FirebaseStore'
import ObvStore from './stores/ObvStore'
import {convertFromRaw, convertToRaw} from 'draft-js';

import App from './components/App';

let userStore, commentStore = [], recommentStore = [], contentStore;
const obvStore = new ObvStore();

// user 정보
const getUsers = Database.user.on('value', snapshot => {
	userStore = [];
	snapshot.forEach(childSnapshot => {
		userStore.push(childSnapshot.val());
	});
});

//댓글 정보
const getComments = Database.comments.on('value', snapshot => {
	commentStore = [];
	snapshot.forEach(childSnapShot => {
		let data = childSnapShot.val();
		commentStore.push(data);
	});
});

//답글 정보
const getRecomments = Database.recomments.on('value', snapshot => {
	recommentStore = [];
	snapshot.forEach(childSnapShot => {
		let data = childSnapShot.val();
		recommentStore.push(data);
	});
});

//콘텐츠 정보
const getContents = Database.contents.on('value', snapshot => {
	contentStore = [];
	snapshot.forEach(childSnapShot => {
		let data = childSnapShot.val();
		contentStore.push(data);
	});
});

Database.wrap.on('value',snapshot => {
	Promise.all([getUsers, getComments, getRecomments, getContents]).then(function() {
		ReactDOM.render(
			<App contentStore={contentStore} userStore={userStore} commentStore={commentStore} recommentStore={recommentStore} obvStore={obvStore}/>,
			document.getElementById('root')
		);
		registerServiceWorker();
	})
});


