import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { worldchain } from 'viem/chains';
import { type IVerifyResponse, type VerificationLevel, verifyCloudProof } from '@worldcoin/idkit';

interface WorldIDProof {
	verification_level: VerificationLevel;
	merkle_root: string;
	nullifier_hash: string;
	proof: string;
	credential_type: string;
}

interface RequestBody {
	proof: WorldIDProof;
	signal: string;
	action: string;
}

interface Env {
	PRIVATE_KEY: string;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const headers = {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
			'Content-Type': 'application/json',
		};

		try {
			// Parsing
			if (request.method === 'OPTIONS') {
				return new Response(null, { headers });
			}
			if (request.method !== 'POST') {
				return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers });
			}
			const rawBody = await request.text();
			let body;
			try {
				body = JSON.parse(rawBody) as RequestBody;
			} catch (e) {
				return new Response(
					JSON.stringify({
						error: 'Invalid JSON',
						message: 'Please provide valid JSON in the request body',
						details: e instanceof Error ? e.message : 'Unknown parsing error',
						receivedBody: rawBody,
					}),
					{ status: 400, headers },
				);
			}

			// Validation
			const missingParams = [];
			if (!body.proof) missingParams.push('proof');
			if (!body.signal) missingParams.push('signal');
			if (!body.action) missingParams.push('action');

			if (missingParams.length > 0) {
				return new Response(
					JSON.stringify({
						error: 'Missing required parameters',
						missing: missingParams,
					}),
					{ status: 400, headers },
				);
			}

			// Verify World ID proof
			console.log('Attempting World ID verification...');
			const verifyRes = (await verifyCloudProof(
				body.proof,
				'app_cfd0a40d70419e3675be53a0aa9b7e10' as `app_${string}`,
				body.action,
				body.action,
			)) as IVerifyResponse;
			if (!verifyRes.success) {
				const error = await verifyRes.json();
				console.error('World ID verification failed:', error);
				return new Response(JSON.stringify({ error: 'World ID verification failed', details: error }), { status: 400, headers });
			}
			console.log('World ID verification successful');

			// NFT Minting
			const account = privateKeyToAccount(env.PRIVATE_KEY as `0x${string}`);
			const client = createWalletClient({
				account,
				chain: worldchain,
				transport: http('https://worldchain-mainnet.g.alchemy.com/public'),
			});
			const tier = body.action === 'mint-device-verified-nft' ? 1 : 3;
			console.log('Attempting to mint NFT with tier:', tier);
			const hash = await client.writeContract({
				address: '0x8E8dd09a64D8dd357e749b9574ac5018864D80C7' as `0x${string}`,
				abi: [
					{
						name: 'mintNFT',
						type: 'function',
						stateMutability: 'nonpayable',
						inputs: [
							{ name: 'to', type: 'address' },
							{ name: 'tierId', type: 'uint256' },
						],
						outputs: [],
					},
				],
				functionName: 'mintNFT',
				args: [body.signal as `0x${string}`, BigInt(tier)],
			});
			console.log('NFT minted successfully, hash:', hash);
			return new Response(
				JSON.stringify({
					success: true,
					transaction: hash,
					tier: tier,
				}),
				{ status: 200, headers },
			);
		} catch (error) {
			// General Error
			console.error('General error:', error);
			return new Response(
				JSON.stringify({
					error: 'Internal server error',
					message: error instanceof Error ? error.message : 'Unknown error',
					stack: error instanceof Error ? error.stack : undefined,
				}),
				{ status: 500, headers },
			);
		}
	},
};
