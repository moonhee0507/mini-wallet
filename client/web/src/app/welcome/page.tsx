"use client";

import Link from 'next/link'
import { Container } from 'shared/ui/container';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const onClickSignIn = () => {
    console.log("create wallet");
  };
  const onClickCreateAccount = () => {
    // create-account page로 이동
    router.push('/create-account');
  };

  return (
    <Container>
      <div className="flex flex-col justify-evenly h-full">
        <div className="bg-gray-300 w-full h-96 rounded-2xl">     
        </div>

        <div className="h-40 flex items-center justify-center">
          <h1 className="text-2xl font-bold">Welcome to mini wallet</h1>
        </div>

        <div className="w-full flex gap-2">
          <button className="btn btn-lg btn-primary capitalize w-full flex-1" onClick={onClickSignIn}>Sign in</button>
          <button className="btn btn-lg btn-primary capitalize w-full flex-1" onClick={onClickCreateAccount}>Create account</button>
        </div>

        <div className="text-center text-sm">
          <p>By continuing, you certify you are over the age of 18 and agree to the <Link href="/terms-of-service" className="underline">Terms of Service</Link> and <Link className="underline" href="/privacy-policy">Privacy Policy</Link>.</p>
        </div>
      </div>
    </Container>
  )
}