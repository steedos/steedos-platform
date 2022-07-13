import Head from 'next/head'
import Link from 'next/link'
import { useSession, getProviders, getCsrfToken, signIn } from "next-auth/react"
import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from '@/pages/api/auth/[...nextauth]'

import { useRouter } from 'next/router';
import { XCircleIcon } from '@heroicons/react/solid'

import { AuthLayout } from '@/components/AuthLayout'
import { Input } from '@/components/Input'
import { Logo } from '@/components/Logo'

const errors = {
  Signin: "Try signing in with a different account.",
  OAuthSignin: "Try signing in with a different account.",
  OAuthCallback: "Try signing in with a different account.",
  OAuthCreateAccount: "Try signing in with a different account.",
  EmailCreateAccount: "Try signing in with a different account.",
  Callback: "Try signing in with a different account.",
  OAuthAccountNotLinked:
    "To confirm your identity, sign in with the same account you used originally.",
  EmailSignin: "The e-mail could not be sent.",
  CredentialsSignin:
    "Sign in failed. Check the details you provided are correct.",
  SessionRequired: "Please sign in to access this page.",
  default: "Unable to sign in.",
}
export default function Login({providers={}, csrfToken}) {
  const { data: session } = useSession()
  const router = useRouter();
  const { callbackUrl = '/', error } = router.query
  
  
  if (typeof window !== 'undefined' && session && callbackUrl) {
    router.push(callbackUrl);
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <Link href="/">
          <a>
            <Logo className="h-12 w-auto" />
          </a>
        </Link>
        <h2 className="mt-4 text-lg font-semibold text-gray-900">
        Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-red-500">
          {error && errors[error] && (
            <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{errors[error]}</h3>
              </div>
            </div>
          </div>
          )}
        </p>
      </div>
      <div className="mt-4">
        <div className="">

        {providers && Object.values(providers).map((provider) => {
          if (provider.type === "credentials") 
          return (
            <form method="post" action="/api/auth/callback/credentials" className="rounded-md shadow-sm my-2">
              <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
              <input
                placeholder="Email address"
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-md sm:leading-5"
                required
              />
              <input
                placeholder="Password"
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="-mt-px appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-md sm:leading-5"
                required
              />
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full rounded-full border border-transparent bg-sky-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                >
                  Sign in
                </button>
              </div>
            </form>
          )
        })}

        <div className="pt-5">
          {providers && Object.values(providers).map((provider) => {
            if (provider.type === "oauth") 
            return (
              <>
                <div key={provider.name} className="pt-5"> 
                  <button
                    onClick={() => signIn(provider.id)}
                    className="w-full rounded-full border border-transparent bg-green-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Sign in with {provider.name}
                  </button>
                </div>
              </>
            )
          })}
        </div>
        </div>
      </div>
    </>
  )
}

Login.getLayout = function getLayout(page) {
  return AuthLayout
}


export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(context.req, context.res, authOptions)
  const { callbackUrl = '/', error } = context.query

  if (session && callbackUrl) {
    return {
      redirect: {
        destination: callbackUrl,
        permanent: false,
      },
    }
  }

  const providers = await getProviders()
  const csrfToken = await getCsrfToken(context)
  return {
    props: { 
      providers, 
      csrfToken: csrfToken ? csrfToken : null
    },
  }
}