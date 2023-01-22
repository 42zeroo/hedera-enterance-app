import LayoutWrapper from '@/components/layout/LayoutWrapper'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'
import { HashConnectProvider } from '@/context/HashConnect'
import 'react-tooltip/dist/react-tooltip.css'
import '../src/global.css'

export default function App({ Component, pageProps }: AppProps) {
  
  return (
    <>
      <HashConnectProvider>
        <LayoutWrapper>
          <>
            <Component {...pageProps} />
            <Toaster position='bottom-right'/>
          </>
        </LayoutWrapper>
      </HashConnectProvider>
    </>
  )
}
