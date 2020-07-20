import Firebase from 'firebase/app';
import 'firebase/auth';
import _Vue from 'vue';
import store from '../store';

console.log(process.env.NODE_ENV);

const config = {
  apiKey: 'AIzaSyBg3iWpAQcNNAcwstqj571w5V3zPnWpZAw',
  authDomain: 'open-website-status-9e70b.firebaseapp.com',
  databaseURL: 'https://open-website-status-9e70b.firebaseio.com',
  projectId: 'open-website-status-9e70b',
  storageBucket: 'open-website-status-9e70b.appspot.com',
  messagingSenderId: '989017010954',
  appId: '1:989017010954:web:781520a1f02d0adefb80f3',
};

export default {
  install (Vue: typeof _Vue) {
    const firebase = Firebase.initializeApp(config);
    const auth = firebase.auth();
    const googleProvider = new Firebase.auth.GoogleAuthProvider();
    const githubProvider = new Firebase.auth.GithubAuthProvider();
    Vue.prototype.$auth = {
      signInWithGoogle: (redirect = false) => (redirect
        ? auth.signInWithRedirect(googleProvider)
        : auth.signInWithPopup(googleProvider)),
      signInWithGithub: (redirect = false) => (redirect
        ? auth.signInWithRedirect(githubProvider)
        : auth.signInWithPopup(githubProvider)),
      signOut: () => auth.signOut(),
      onAuthStateChanged: auth.onAuthStateChanged,
      getIdToken: () => {
        if (auth.currentUser === null) throw new Error('User not signed in');
        return auth.currentUser.getIdToken(true);
      },
      fetchSignInMethodsForEmail: (email: string) => auth.fetchSignInMethodsForEmail(email),
      linkWithCredential: async (credential: Firebase.auth.AuthCredential) => {
        if (auth.currentUser === null) throw new Error('User not signed in');
        const newCredential = await auth.currentUser.linkWithCredential(credential);
        store.commit('setUser', auth.currentUser);
        return newCredential;
      },
    };
    auth.onAuthStateChanged((user) => {
      store.commit('setUser', user);
    });
  },
};
