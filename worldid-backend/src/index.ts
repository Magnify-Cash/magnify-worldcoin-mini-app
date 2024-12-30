import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { worldchain } from 'viem/chains';

// Define types for better type safety
interface WorldIDProof {
	verification_level: string;
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
	WORLD_ACTION_DEVICE: string;
	WORLD_ACTION_ORB: string;
	WORLD_APP_ID: string;
	PRIVATE_KEY: string;
	RPC_URL: string;
	CONTRACT_ADDRESS: string;
}

class APIError extends Error {
	constructor(
		public status: number,
		message: string,
		public details?: any,
	) {
		super(message);
		this.name = 'APIError';
	}
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
			// CORS preflight
			if (request.method === 'OPTIONS') {
				return new Response(null, { headers });
			}

			// Validate request method
			if (request.method !== 'POST') {
				throw new APIError(405, 'Method not allowed');
			}

			// Validate content type
			const contentType = request.headers.get('content-type');
			if (!contentType?.includes('application/json')) {
				throw new APIError(415, 'Unsupported Media Type. Please send JSON');
			}

			// Parse and validate request body
			const body = (await request.json()) as RequestBody;
			await validateRequestBody(body);

			// Verify World ID proof
			const verificationResult = await verifyWorldIDProof(body, env);
			if (!verificationResult.ok) {
				throw new APIError(400, 'World ID verification failed', await verificationResult.json());
			}

			// Mint NFT
			const transaction = await mintNFT(body, env);

			return new Response(
				JSON.stringify({
					success: true,
					transaction,
					tier: body.action === 'mint-device-verified-nft' ? 1 : 3,
				}),
				{ status: 200, headers },
			);
		} catch (error) {
			console.error('Error:', error);

			if (error instanceof APIError) {
				return new Response(
					JSON.stringify({
						error: error.message,
						details: error.details,
					}),
					{ status: error.status, headers },
				);
			}

			// Handle parsing errors specifically
			if (error instanceof SyntaxError) {
				return new Response(
					JSON.stringify({
						error: 'Invalid JSON',
						message: 'Please provide valid JSON in the request body',
					}),
					{ status: 400, headers },
				);
			}

			return new Response(
				JSON.stringify({
					error: 'Internal server error',
					message: error instanceof Error ? error.message : 'Unknown error occurred',
				}),
				{ status: 500, headers },
			);
		}
	},
};

async function validateRequestBody(body: RequestBody): Promise<void> {
	const missingParams = [];
	if (!body.proof) missingParams.push('proof');
	if (!body.signal) missingParams.push('signal');
	if (!body.action) missingParams.push('action');

	if (missingParams.length > 0) {
		throw new APIError(400, 'Missing required parameters', { missing: missingParams });
	}

	// Validate action value
	if (!['mint-device-verified-nft', 'mint-orb-verified-nft'].includes(body.action)) {
		throw new APIError(400, 'Invalid action value');
	}
}

async function verifyWorldIDProof(body: RequestBody, env: Env): Promise<Response> {
	const { proof, signal, action } = body;

	return fetch('https://developer.worldcoin.org/api/v1/verify', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			action_id: action === 'mint-device-verified-nft' ? env.WORLD_ACTION_DEVICE : env.WORLD_ACTION_ORB,
			signal,
			proof,
			app_id: env.WORLD_APP_ID,
		}),
	});
}

async function mintNFT(body: RequestBody, env: Env): Promise<`0x${string}`> {
	try {
		const account = privateKeyToAccount(env.PRIVATE_KEY as `0x${string}`);
		const client = createWalletClient({
			account,
			chain: worldchain,
			transport: http(env.RPC_URL),
		});

		const tier = body.action === 'mint-device-verified-nft' ? 1 : 3;

		return await client.writeContract({
			address: env.CONTRACT_ADDRESS as `0x${string}`,
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
	} catch (error) {
		throw new APIError(500, 'NFT minting failed', error instanceof Error ? error.message : 'Unknown error');
	}
}
