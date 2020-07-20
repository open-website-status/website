import Vue from 'vue';
import Firebase from 'firebase/app';

declare module 'vue/types/vue' {
  interface Vue {
    $auth: {
      signInWithGoogle(redirect: true): Promise<void>;
      signInWithGoogle(redirect: false): Promise<Firebase.auth.UserCredential>;
      signInWithGithub(redirect: true): Promise<void>;
      signInWithGithub(redirect: false): Promise<Firebase.auth.UserCredential>;
      signOut(): Promise<void>;
      onAuthStateChanged(
        nextOrObserver:
          | firebase.Observer<unknown>
          | ((a: firebase.User | null) => unknown),
        error?: (a: firebase.auth.Error) => unknown,
        completed?: firebase.Unsubscribe
      ): firebase.Unsubscribe;
      getIdToken: Promise<string>;
      fetchSignInMethodsForEmail(email: string): Promise<string[]>;
      linkWithCredential(credential: Firebase.auth.AuthCredential): Promise<Firebase.auth.UserCredential>;
    };
  }
}
