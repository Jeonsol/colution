import React, { Component } from 'react';

import { Database } from '../../src/stores/FirebaseStore.js';

import {observer} from 'mobx-react'
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
const content = {"entityMap":{},"blocks":[{"key":"637gr","text":"Initialized from content state.","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]};


@observer
class TextEditor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			contentState: EditorState.createEmpty(),
		}
	}

	onEditorStateChange = (contentState) => {
		this.setState({
			contentState,
		});
	};

	shouldComponentUpdate(nextProps) {
		const {obvStore} = this.props;
		if(nextProps.add_issue_status){
			Database.root.ref("wrap/contents/" + nextProps.content_id).update({
				content: draftToHtml(convertToRaw(this.state.contentState.getCurrentContent()))
			});
		}
		if(nextProps.add_comment_status && obvStore.commentToggle == "comment") {
			Database.root.ref("wrap/comments/" + nextProps.comment_id).update({
				content: draftToHtml(convertToRaw(this.state.contentState.getCurrentContent()))
			});
		}
		if(nextProps.add_comment_status && obvStore.commentToggle == "recomment") {
			Database.root.ref("wrap/recomments/" + obvStore.recommentID).update({
				content: draftToHtml(convertToRaw(this.state.contentState.getCurrentContent()))
			});
		}
		return nextProps;
	}

	render() {
		const {contentState} = this.state;
		return (
			<div>
				<Editor
					editorState = {contentState}
					wrapperClassName="demo-wrapper"
					editorClassName="demo-editor"
					onEditorStateChange={this.onEditorStateChange}
				/>
			</div>

		);
	}
}

export default TextEditor;