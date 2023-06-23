import Tasks from "./Tasks";

export default class Config {
    uid:               string;
    name:              string;
    registered:        [number, number, number];
    deleted:           [boolean, number, number, number];
    idRange:           [number, number];
    schedulingByOrder: boolean;
    upload:            ((config: Config) => boolean) | undefined;
    constructor() {
        this.uid               = "";
        this.name              = "";
        this.registered        = [-1, -1, -1];
        this.deleted           = [false, -1, -1, -1];
        this.idRange           = [0, -1];
        this.schedulingByOrder = false;
        this.upload            = undefined;
    }

    initParams(uid: string, name: string, registered: [number, number, number], deleted: [boolean, number, number, number], idRange: [number, number], schedulingByOrder: boolean, uploadFunc?: (config: Config) => boolean) {
        this.uid               = uid;
        this.name              = name;
        this.registered        = registered;
        this.deleted           = deleted;
        this.idRange           = idRange;
        this.schedulingByOrder = schedulingByOrder;
        this.upload            = uploadFunc;
    }

    updateIdRange(tasks: Tasks) {
        const sample: Tasks = tasks.copy();
        sample.filterByID(-1);
        if (sample.data.length === 0) {
            this.idRange = [0, -1];
            return;
        } else {
            this.idRange = [tasks.getMinID(), tasks.getMaxID()];
        }
        if (this.upload) {
            this.upload(this);
        }
    }

    getDataAsObject(): Object {
        return {
            uid               : this.uid,
            name              : this.name,
            registered        : this.registered,
            deleted           : this.deleted,
            idRange           : this.idRange,
            schedulingByOrder : this.schedulingByOrder,
        }
    }
}