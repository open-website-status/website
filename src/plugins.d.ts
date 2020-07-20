import Firebase from 'firebase';
import { State } from '@/store';
import { Store } from 'vuex';

declare module 'vue/types/vue' {
  interface Vue {
    $typedStore: Store<State>;
    $auth: {
      signInWithGoogle(redirect: true): Promise<void>;
      signInWithGoogle(redirect: false): Promise<Firebase.auth.UserCredential>;
      signInWithGithub(redirect: true): Promise<void>;
      signInWithGithub(redirect: false): Promise<Firebase.auth.UserCredential>;
      signOut(): Promise<void>;
      onAuthStateChanged(
        nextOrObserver:
          | Firebase.Observer<unknown>
          | ((a: Firebase.User | null) => unknown),
        error?: (a: Firebase.auth.Error) => unknown,
        completed?: Firebase.Unsubscribe
      ): Firebase.Unsubscribe;
      getIdToken(): Promise<string>;
      fetchSignInMethodsForEmail(email: string): Promise<string[]>;
      linkWithCredential(credential: Firebase.auth.AuthCredential): Promise<Firebase.auth.UserCredential>;
      linkGoogle(): Promise<Firebase.auth.UserCredential>;
      linkGithub(): Promise<Firebase.auth.UserCredential>;
      unlink(providerId: string): Promise<void>;
    };

  }
}
