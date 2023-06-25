import Task from "../Task";




export default class Tasks {
    data: Task[];
    deleted: Task[];
    uploadTask: ((task: Task) => boolean) | undefined;
    deleteTask: ((task: Task) => boolean) | undefined;

    constructor(uploadFunc?: ((task: Task) => boolean), deleteFunc?: ((task: Task) => boolean)) {
        this.data = [];
        this.deleted = [];
        this.uploadTask = uploadFunc;
        this.deleteTask = deleteFunc;
    }






    /////////////////////////////////////////////////////////////////////
    // other
    /////////////////////////////////////////////////////////////////////
    copy(target?: "data" | "deleted"): Tasks {
        if (target === undefined) {
            target = "data";
        }
        const tasks = new Tasks();
        if (target === "data") {
            this.data.forEach(task => {
                tasks.add(task.copy());
            })
        } else {
            this.deleted.forEach(task => {
                tasks.add(task.copy());
            })
        }
        return tasks;
    }
    upload(): boolean {
        if (this.uploadTask) {
            this.data.forEach(task => {
                if (this.uploadTask) this.uploadTask(task);
            })
        }
        return true;
    }
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////////////
    // array opetrate, delete
    /////////////////////////////////////////////////////////////////////
    add(task: Task) {
        if (!task.deleted[0]) {
            this.data.push(task);
        } else {
            this.deleted.push(task);
        }
        if (this.uploadTask) {
            this.uploadTask(task);
        }
    }

    delete(taskID: number): boolean {
        const target: Task | undefined = this.getTaskByID(taskID);
        if (!target) {
            return false;
        }
        this.filterByID(taskID);
        this.deleted.push(target);
        this.sortByID(true, "deleted");
        if (this.deleteTask) {
            this.deleteTask(target);
        }
        return true;
    }



    filterByID(taskID: number): void {
        this.data = this.data.filter(task => {
            return taskID !== task.id;
        })
        this.upload();
    }
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////////////
    // sort
    /////////////////////////////////////////////////////////////////////
    sortByOrder(changeData: boolean): Tasks | undefined {
        if (changeData) {
            this.data.sort((a, b) => {return a.compareTo(b)});
            return undefined;
        } else {
            const newData: Tasks = this.copy();
            newData.sortByOrder(true);
            return newData;
        }
    }



    sortByID(changeData: boolean, target?: "deleted" | "data"): Tasks | undefined {
        if (target === undefined) {
            target = "data";
        }
        if (changeData) {
            if (target === "data") {
                this.data.sort((a, b) => {return a.id - b.id});
            } else {
                this.deleted.sort((a, b) => {return a.id - b.id});
            }
            return undefined;
        } else {
            let newData: Tasks;
            if (target === "data") {
                newData = this.copy();
            } else {
                newData = this.copy("deleted");
            }
            newData.sortByID(true);
            return newData;
        }
    }
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////////////
    // get task
    /////////////////////////////////////////////////////////////////////
    getTaskByID(taskID: number): Task | undefined {
        for (let task of this.data) {
            if (task.id === taskID) {
                return task;
            }
        }
        if (taskID === -1) {
            return new Task("", -1, "休憩", 1440, 0, false, [2023, 6, 14], [false, -1, -1, -1], -1, false);
        }
        return undefined;
    }
    getHeigherOrder(order: number): Task | undefined {
        let result: Task | undefined = undefined;
        let onOrder: number          = order - 1;
        const orderLimit: number     = 0;
        while (onOrder >= orderLimit) {
            const getTask: Task | undefined = this.getTaskByOrder(onOrder);
            if (getTask) {
                result = getTask;
                break;
            }
            onOrder--;
        }
        return result;
    }
    getLowerOrder(order: number): Task | undefined {
        let result: Task | undefined = undefined;
        let onOrder: number          = order + 1;
        const orderLimit: number     = this.getMaxOrder();
        while (onOrder <= orderLimit) {
            const getTask: Task | undefined = this.getTaskByOrder(onOrder);
            if (getTask) {
                result = getTask;
                break;
            }
            onOrder++;
        }
        return result;
    }
    getTaskByOrder(order: number): Task | undefined {
        for (let task of this.data) {
            if (task.order === order) {
                return task;
            }
        }
        return undefined;
    }

    getSumValue(target: "max" | "min"): number {
        let result: number = 0;
        this.data.forEach(task => {
            result += task[target];
        })
        return result;
    }
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////////////
    // get value
    /////////////////////////////////////////////////////////////////////
    getMaxID(): number {
        let result: number = -1;
        this.data.forEach(task => {
            if (task.id > result) {
                result = task.id;
            }
        })
        return result;
    }



    getMinID(): number {
        let result: number = this.getMaxID();
        this.data.forEach(task => {
            if (task.id < result && task.id !== -1) {
                result = task.id;
            }
        })
        return result;
    }



    getMaxOrder(): number {
        let result: number = -1;
        this.data.forEach(task => {
            if (task.order > result) {
                result = task.order;
            }
        })
        return result;
    }
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////////////
    // change order
    /////////////////////////////////////////////////////////////////////
    upOrder(targetTask: Task): boolean {
        const higherTask: Task | undefined = this.getHeigherOrder(targetTask.order);
        if (!higherTask) {
            return false;
        }
        const higherOrder: number = higherTask.order;
        higherTask.order = targetTask.order;
        targetTask.order = higherOrder;
        this.upload();
        return true;
    }



    downOrder(targetTask: Task): boolean {
        const lowerTask: Task | undefined = this.getLowerOrder(targetTask.order);
        if (targetTask.order <= 0 || !lowerTask) {
            return false;
        }
        const lowerOrder: number = lowerTask.order;
        lowerTask.order  = targetTask.order;
        targetTask.order = lowerOrder;
        this.upload();
        return true;
    }
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////






    /////////////////////////////////////////////////////////////////////
    // boolean
    /////////////////////////////////////////////////////////////////////
    // isExtendableが含まれているかを判定する関数
    hasExtendable(): boolean {
        let result: boolean = false;
        this.data.forEach(task => {
            if (task.isExtendable) {
                result = true;
            }
        })
        return result;
    }
    // isRequiredが含まれているかを判定する関数
    hasRequired(): boolean {
        let result: boolean = false;
        this.data.forEach(task => {
            if (task.isRequired) {
                result = true;
            }
        })
        return result;
    }
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////
}