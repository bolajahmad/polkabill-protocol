import { viem } from 'hardhat';
import MERCHANT_REGISTRY_ABI from '../artifacts/contracts/MerchantRegistry.sol/MerchantRegistry.json';

const MERCHANT_REGISTRY_ADDRESS = '0x8499CBBCf79239Bf38E1056580C2020CA12C1cBa';

export async function registerMerchant(
    merchantName: string,
    merchantAddress: `0x${string}`,
    merchantEmail: string
) {
    const publicClient = await viem.getPublicClient();
    const merchantContract = await viem.getContractAt("MerchantRegistry", MERCHANT_REGISTRY_ADDRESS);

    const hash = await merchantContract.write.createMerchant([
        
    ]);

    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    return receipt;
}
