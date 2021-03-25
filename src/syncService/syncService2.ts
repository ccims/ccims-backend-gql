import { log } from "../log";

export class SyncService {

    private timer: NodeJS.Timeout | undefined;

    public constructor() {
        log(10, "Starting sync service");
        this.timer = undefined;
        this.startService();
    }

    public startService(): void {
        if (this.timer === undefined) {
            const that = this;
            this.timer = setInterval(() => {
                that.sync();
            }, 5 * 60 * 1000);
        }
    }

    public stopService(): void {
        if (this.timer !== undefined) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }

    private sync(): void {
        log(10, "Syncing");
    }

}