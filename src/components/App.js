import React, { Component } from 'react';
import cookie from 'react-cookies'

import LoginPanel from '../LoginPanel'
import Home from '../Home'


class App extends Component {
	constructor() {
		super();
		this.state = {
			user_id: ''
		}
	}
	componentWillMount() {
		this.setState ({ user_id: cookie.load('user_id') });
	}

	render() {
		const {contentStore, userStore, commentStore, recommentStore, obvStore} = this.props;
		if(this.state.user_id) {
			return <Home user_id={this.state.user_id} contentStore={contentStore} userStore={userStore} commentStore={commentStore} recommentStore={recommentStore} obvStore={obvStore}/>

		}
		return <LoginPanel contentStore={contentStore} userStore={userStore} commentStore={commentStore} recommentStore={recommentStore} obvStore={obvStore}/>;
	}
}

export default App;
