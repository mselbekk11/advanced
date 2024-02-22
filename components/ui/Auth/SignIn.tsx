import {
  RegisterLink,
  LoginLink,
  LogoutLink,
} from '@kinde-oss/kinde-auth-nextjs/components';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

import { Button } from '@/components/ui/button';

export async function SignIn() {
  const { isAuthenticated } = getKindeServerSession();

  return (
    <>
      {(await isAuthenticated()) ? (
        <div className='hidden lg:flex lg:flex-1 lg:justify-end gap-x-5'>
          <LogoutLink>
            <Button>Log out</Button>
          </LogoutLink>
        </div>
      ) : (
        <div className='hidden lg:flex lg:flex-1 lg:justify-end gap-x-5'>
          <LoginLink>
            <Button>Sign in</Button>
          </LoginLink>
          <RegisterLink>
            <Button variant='secondary'>Sign up</Button>
          </RegisterLink>
        </div>
      )}
    </>
  );
}
