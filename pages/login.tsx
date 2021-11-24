import tw from 'twin.macro';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

import { auth, firebase } from '../firebase/app';

const styles = {
  container: ({ hasBackground }: { hasBackground: boolean }) => [
    tw`flex flex-col items-center justify-center h-screen`,
    hasBackground && tw`bg-gradient-to-b from-electric to-ribbon`,
  ],
};

const uiConfig = {
  autoUpgradeAnonymousUsers: true,
  signInSuccessUrl: '/',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    'apple.com',
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    'anonymous',
  ],
  callbacks: {
    signInFailure: (error: any) => {
      if (error.code !== 'firebaseui/anonymous-upgrade-merge-conflict') {
        return Promise.resolve();
      }

      return firebase
        .auth()
        .signInWithCredential(error.credential)
        .then(() => {}); // extra then required because callbacks.signInFailure is expected to return Promise<void>.
    },
  },
};

const Login = () => {
  return (
    <div css={styles.container({ hasBackground: true })}>
      <div tw="flex flex-col justify-center h-full gap-y-5">
        <StyledFirebaseAuth
          uiCallback={ui => ui.disableAutoSignIn()}
          uiConfig={uiConfig}
          firebaseAuth={auth}
        />
      </div>
    </div>
  );
};

export default Login;
