import { observable } from 'mobx-react';
import { Database } from '../stores/FirebaseStore';

export default class UserStore {
    addUser(id,password) {
        let newPostRef = Database.contents.push();
        newPostRef.push({
            id: id,
            password: password,
            myContents: [],
            likeContents: [],
            likeComments: [],
            likeRecomments: []
        })
    };
};

