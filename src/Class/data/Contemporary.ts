import Time from "../Time";

export default class Contemporary {
    data: Array<[[number, number, number, number, number], [number, number, number, number, number], number]>;
    onSection: number;
    uploadFunc: ((contemporary: Contemporary) => boolean) | undefined;
    constructor(uploadFunc?: (contemporary: Contemporary) => boolean) {
        this.data = [];
        this.onSection = -1;
        this.uploadFunc = uploadFunc;
    }

    add(newData: [[number, number, number, number, number], [number, number, number, number, number], number], order: number) {
        this.data.splice(order, 0, newData);
        this.sort();
    }

    convertFromDBToArray(start: [number, number, number, number, number], end: [number, number, number, number, number], id: number): [[number, number, number, number, number], [number, number, number, number, number], number] {
        return [start, end, id];
    }

    delete() {
        this.data = [];
        this.onSection = -1;
        this.upload();
    }

    upload() {
        if (this.uploadFunc) {
            this.uploadFunc(this);
        }
    }

    sort() {
        this.data.sort((a, b) => {
            const aTime: Time = new Time(a[0][3], a[0][4]);
            const bTime: Time = new Time(b[0][3], b[0][4]);
            return aTime.compareTo(bTime);
        })
    }

    getDataAsObject(): Object {
        let result: Object = {onSection: this.onSection};
        this.data.forEach((section, index) => {
            const newDict: {[order: string]: [number, number, number, number, number] | number} = {};
            const startKey: string = index + "_start";
            const endKey: string = index + "_end";
            const idKey: string = index + "_id";
            newDict[startKey] = section[0];
            newDict[endKey] = section[1];
            newDict[idKey] = section[2];
            result = {
                ...result,
                ...newDict,
            }
        })
        return result;
    }
}