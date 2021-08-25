import Vue from 'vue'
import firebase from 'firebase/app';
import 'firebase/app';
import 'firebase/auth'
import 'firebase/firestore';
import 'firebase/functions'
import 'firebase/storage'
import 'firebase/analytics'
import 'firebase/remote-config'

const config = {
	apiKey: "AIzaSyDUM07Eqo6On-QFErksaVteJMoI7-PJmM0",
	authDomain: "tof-uu.firebaseapp.com",
	projectId: "tof-uu",
	storageBucket: "tof-uu.appspot.com",
	messagingSenderId: "359852580451",
	appId: "1:359852580451:web:89e435a8475505baf0a256",
	measurementId: "G-5H6M2Y9BNH"
};

firebase.initializeApp(config);
const analytics = firebase.analytics()
analytics.logEvent('page_view');

firebase.firestore().settings({});

Vue.prototype.$dbField = firebase.firestore.FieldValue;
Vue.prototype.$db = firebase.firestore();
Vue.prototype.$st = firebase.storage();