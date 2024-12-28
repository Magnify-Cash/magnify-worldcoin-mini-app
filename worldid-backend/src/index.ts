/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { createWalletClient, http, custom } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { optimism } from 'viem/chains';

export default {
	async fetch(request, env, ctx): Promise<Response> {
		// Only allow POST requests
		if (request.method !== 'POST') {
			return new Response('Method not allowed', { status: 405 });
		}

		try {
			const body = await request.json();
			const { proof, signal, action } = body;

			if (!proof || !signal || !action) {
				return new Response(JSON.stringify({ error: 'Missing required parameters' }), { status: 400 });
			}

			// 1. Verify World ID proof
			const verifyRes = await fetch('https://developer.worldcoin.org/api/v1/verify', {
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

			if (!verifyRes.ok) {
				const error = await verifyRes.json();
				return new Response(JSON.stringify({ error: 'World ID verification failed', details: error }), { status: 400 });
			}

			// 2. Set up Viem client
			const account = privateKeyToAccount(env.PRIVATE_KEY);
			const client = createWalletClient({
				account,
				chain: optimism,
				transport: http(env.RPC_URL),
			});

			// 3. Mint NFT
			const tier = action === 'mint-device-verified-nft' ? 1 : 3;

			const hash = await client.writeContract({
				address: env.CONTRACT_ADDRESS,
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
				args: [signal, BigInt(tier)],
			});

			return new Response(
				JSON.stringify({
					success: true,
					transaction: hash,
					tier: tier,
				}),
				{
					status: 200,
					headers: {
						'Content-Type': 'application/json',
					},
				},
			);
		} catch (error) {
			console.error('Error:', error);
			return new Response(
				JSON.stringify({
					error: 'Internal server error',
					message: error.message,
				}),
				{
					status: 500,
					headers: {
						'Content-Type': 'application/json',
					},
				},
			);
		}
	},
};
