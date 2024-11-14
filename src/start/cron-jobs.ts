import { Queue } from 'bullmq';
import cron from 'node-cron';
import Env from "@ioc:Adonis/Core/Env";
import GoogleApiService from 'App/Services/GoogleApiService';

if (Env.get('RUN_GOOGLE_SPREADSHEET_FEATURE') == 'true') {
	const connection = {
		host: Env.get("REDIS_HOST"),
		port: Env.get("REDIS_PORT"),
	}

	console.log('connection => ', connection);
	const queue = new Queue('google_api', { connection: connection });
	
	const job = cron.schedule('* * * * *', async () => {
		const googleApiService = new GoogleApiService(queue);
		await googleApiService.processMerchantSheets();
	});
	
	job.start();
}