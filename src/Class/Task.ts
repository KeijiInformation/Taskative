interface TaskObject {
    uid:        string;
    id:         number;
    title:      string;
    max:        number;
    min:        number;
    isRequired: boolean;
    registered: [number, number, number];
    deleted:    [boolean, number, number, number];
    order: number;
    isExtendable: boolean;
}



export default class Task {
    uid:          string
    id:           number
    title:        string
    max:          number
    min:          number
    isRequired:   boolean
    registered:   [number, number, number]
    deleted:      [boolean, number, number, number]
    order:        number
    isExtendable: boolean

    constructor(uid: string, id: number, title: string, max: number, min: number, isRequired: boolean, registered: [number, number, number], deleted: [boolean, number, number, number], order: number, isExtendable: boolean) {
        this.uid          = uid;
        this.id           = id;
        this.title        = title;
        this.max          = max;
        this.min          = min;
        this.isRequired   = isRequired;
        this.registered   = registered;
        this.deleted      = deleted;
        this.order        = order;
        this.isExtendable = isExtendable;
    }

    compareTo(task: Task): number {
        if (this.order > task.order) {
            return 1;
        } else if (this.order < task.order) {
            return -1;
        } else {
            if (this.id > task.id) {
                return 1;
            } else {
                return -1;
            }
        }
    }

    getDataAsObject(): TaskObject {
        return {
            "uid": this.uid,
            "id":  this.id,
            "title": this.title,
            "max": this.max,
            "min": this.min,
            "isRequired": this.isRequired,
            "registered": this.registered,
            "deleted": this.deleted,
            "order": this.order,
            "isExtendable": this.isExtendable
        }
    }

    copy(): Task {
        return new Task(this.uid, this.id, this.title, this.max, this.min, this.isRequired, [...this.registered], [...this.deleted], this.order, this.isExtendable)
    }
}