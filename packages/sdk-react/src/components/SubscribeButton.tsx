import { useState } from 'react';
import { Address } from 'viem';
import { useAccount } from 'wagmi';
import { usePolkabill } from '../providers/PolkabillProvider';

export type SubscribeProps = {
  planId: number;
  chainId?: number;
  token?: string;
  onComplete?: () => void;
};

export function SubscribeButton({ planId, chainId, token, onComplete }: SubscribeProps) {
  const [isSubmitting, setSubmitting] = useState(false);
  const pb = usePolkabill();
  const { address } = useAccount();

  async function handleSubscribe() {

    if (!address) {
      alert('Connect wallet');
      return;
    }
    setSubmitting(true);
    console.log('Calling config');

    await pb.subscribe({
      chainId: BigInt(chainId || 0),
      planId: BigInt(planId),
      token: token as Address,
    });
    setSubmitting(false);
    if (onComplete) {
      onComplete();
    }
  }

  return (
    <button
      onClick={handleSubscribe}
      disabled={isSubmitting}
      style={{
        width: '100%',
        padding: '8px 12px',
        borderRadius: '6px',
        background: isSubmitting ? '#222' : '#000',
        color: '#fff',
        fontWeight: 'bold',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        border: 'none',
        cursor: isSubmitting ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.2s',
        outline: 'none',
      }}
      onMouseOver={e => {
        if (!isSubmitting) (e.currentTarget.style.background = '#222');
      }}
      onMouseOut={e => {
        if (!isSubmitting) (e.currentTarget.style.background = '#000');
      }}
    >
      {isSubmitting && (
        <span
          style={{
            width: 16,
            height: 16,
            marginRight: 8,
            border: '2px solid #fff',
            borderTop: '2px solid #888',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'spin 1s linear infinite',
          }}
        />
      )}
      <span style={{ textAlign: 'center' }}>
        {isSubmitting ? 'Submitting...' : 'Subscribe'}
      </span>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
        `}
      </style>
    </button>
  );
}
