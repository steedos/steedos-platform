/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2022-07-04 11:24:28
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2022-07-13 11:21:26
 * @Description: 
 */
import { SessionProvider } from "next-auth/react"
import 'focus-visible';
import '@/styles/tailwind.css';
import { AppLayout } from '@/components/AppLayout';
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const Layout = Component.getLayout ? Component.getLayout() : AppLayout;
  console.log(`Layout`, Layout)
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  )
}
