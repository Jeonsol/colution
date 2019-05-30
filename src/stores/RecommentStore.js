import { observable } from 'mobx-react';
import { Database } from '../stores/FirebaseStore';

export default class RecommentStore {
    addRecomment(commentId,user_id,content) {
        let date = new Date().toLocaleString('ko-KR');
        let newPostRef = Database.contents.push();
        newPostRef.push({
            commentId: commentId,
            date: date,
            commentCnt: 0,
            like: 0,
            user_id: user_id,
            content: content
        })
    };
};

