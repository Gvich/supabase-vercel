/*import { Auth as AuthForm, Typography, Button } from '@supabase/ui'
import { useRouter } from 'next/router'
import {supabase} from '../utils/supabaseClient'

const Container = (props) => {
  const { user } = AuthForm.useUser()
    const router = useRouter(); 

  if (user) {
    router.reload();
    return null;
  }
  return props.children
}

export default function Auth() {
  return (
      <div className="container" style={{ width: "25vw" }}>
            <AuthForm.UserContextProvider supabaseClient={supabase}>
                <Container supabaseClient={supabase}>
                    <AuthForm supabaseClient={supabase} />
                </Container>
            </AuthForm.UserContextProvider>
      </div>
  )
}*/
/*
import { Auth as AuthForm } from '@supabase/ui'
import { supabase } from '../utils/supabaseClient'

export default function Auth() {
  return (
    <div className="px-8 py-12 z-10 auth-form">
      <AuthForm supabaseClient={supabase} providers={['google']} magicLink={true} />
    </div>
  )
}*/

import { Auth, Typography, Button } from "@supabase/ui";
import { supabase } from "../utils/supabaseClient";
const Container = (props) => {
  const { user } = Auth.useUser();
  if (user)
    return (
      <>
        <Typography.Text>Signed in: {user.email}</Typography.Text>
        <Button block onClick={() => props.supabaseClient.auth.signOut()}>
          Sign out
        </Button>
      </>
    );
  return props.children;
};

export default function AuthBasic() {
  return (
    <Auth.UserContextProvider supabaseClient={supabase}>
      <Container supabaseClient={supabase}>
        <Auth supabaseClient={supabase} providers={["google"]} />
      </Container>
    </Auth.UserContextProvider>
  );
}
