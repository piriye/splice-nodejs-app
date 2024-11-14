import { BaseTask, CronTimeV2 } from 'adonis5-scheduler/build/src/Scheduler/Task';
import { Queue } from 'bullmq';
import Env from "@ioc:Adonis/Core/Env";

class GoogleApi extends BaseTask {
    public static get schedule() {
		// Use CronTimeV2 generator:
		return CronTimeV2.everySecond();
		// or just use return cron-style string (simple cron editor: crontab.guru)
    }

    /**
     * Set enable use .lock file for block run retry task
     * Lock file save to `build/tmp/aœdonis5-scheduler/locks/your-class-name`
     */
    public static get useLock() {
      	return false;
    }

    public async handle() {
		this.logger.info('Handled');
    }
}

export default GoogleApi;
