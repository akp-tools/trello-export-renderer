import tw from 'twin.macro';
import { useAuthState } from 'react-firebase-hooks/auth';
import Link from 'next/link';

import { Button } from '../components';
import { auth } from '../firebase/app';

const styles = {
  container: ({ hasBackground }: { hasBackground: boolean }) => [
    tw`flex flex-col items-center justify-center h-screen`,
    hasBackground && tw`bg-gradient-to-b from-electric to-ribbon`,
  ],
};

const App = () => {
  const [user, loading, error] = useAuthState(auth);

  return (
    <div css={styles.container({ hasBackground: true })}>
      <div tw="flex flex-col justify-center h-full gap-y-5">
        <Link href="/logout">
          <Button variant="primary">Logout</Button>
        </Link>
      </div>
      <pre style={{ width: 500 }}>
        {JSON.stringify({ user, loading, error }, null, 2)}
      </pre>
    </div>
  );
};

export default App;
