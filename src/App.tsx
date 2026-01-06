import { FrontierSDK } from '@frontiertower/frontier-sdk';
import { isInFrontierApp } from '@frontiertower/frontier-sdk/ui-utils';
import { SponsorPassManager } from './components/SponsorPassManager';
import { Toaster } from '@/ui/toaster';
import './style.css'

const sdk = new FrontierSDK();

function App() {
  // Check if running standalone
  if (!isInFrontierApp()) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Sponsor Pass Manager</h1>
          <p className="text-lg">This app must run inside the Frontier Wallet.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SponsorPassManager sdk={sdk} />
      <Toaster />
    </>
  );
}

export default App;
