import { SessionProvider } from "next-auth/react"
import 'focus-visible'
import '@/styles/tailwind.css'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {

  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
