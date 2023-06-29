import { DocumentData, DocumentReference, doc, getDoc, or, setDoc } from "firebase/firestore";
import Task from "./Task";
import { Config, Result, Tasks } from "./data";
import { db } from "../firebase";
import { User } from "firebase/auth";
import Contemporary from "./data/Contemporary";



export default class UserData {
    isSet: boolean = false;
    user: undefined | User;
    config: Config;
    tasks: Tasks;
    contemporary: Contemporary;
    result: {
        [id: string]: {
            [duration: string]: number;
        }
    }

    constructor(debugMode: boolean) {
        if (debugMode) {
            this.isSet = true;
            this.user = undefined;
            this.config = new Config();
            this.config.initParams("debug", "デバッグユーザー", [2023, 5, 25], [false, -1, -1, -1], [0, 5], false, 5);

            const taskList: Task[] = [
                new Task(this.config.uid, -1, "休憩",            0, 0, false,  [2023, 5, 25], [false, 0, 0, 0], 0, false),
                new Task(this.config.uid, 0, "筋トレ",            30, 15, true,  [2023, 5, 25], [false, 0, 0, 0], 0, false),
                new Task(this.config.uid, 1, "課題",              240, 30, true, [2023, 5, 25], [false, 0, 0, 0], 1, true),
                new Task(this.config.uid, 2, "プログラミング学習", 300, 60, true, [2023, 5, 25], [false, 0, 0, 0], 2, true),
                new Task(this.config.uid, 3, "AR技術の学習",      240, 60, false, [2023, 5, 25], [false, 0, 0, 0], 3, false),
                new Task(this.config.uid, 4, "就活",             240, 30, false, [2023, 5, 25], [false, 0, 0, 0], 4, true),
                new Task(this.config.uid, 5, "趣味",              300, 30, false, [2023, 5, 25], [false, 0, 0, 0], 5, true),
            ]
            this.tasks = new Tasks();
            taskList.forEach(task => {
                this.tasks.add(task);
            })

            this.contemporary = new Contemporary();
            this.result = {};
        } else {
            this.isSet        = false;
            this.user         = undefined;
            this.config       = new Config();
            this.tasks        = new Tasks(this.uploadTask, this.deleteTask);
            this.contemporary = new Contemporary();
            this.result       = {};
        }
    }

    async setInitData(user: User) {
        this.user = user;
        let docRef: DocumentReference;
        let data: DocumentData | undefined;
        docRef = doc(db, "Users", user.uid);
        await getDoc(docRef).then(result => {data = result.data()});
        // 初ログインの場合は初期設定
        if (data === undefined) {
            let newDoc: Object;
            const today: Date = new Date();
            // ユーザー情報の追加
            newDoc = {
                "uid": user.uid,
                "name": user.displayName,
                "registered": [today.getFullYear(), today.getMonth()+1, today.getDate()],
                "deleted": [false, 0, 0, 0],
                "idRange": [0, 0],
                "schedulingByOrder": false,
            }
            await setDoc(docRef, newDoc);
            // Contemporaryの追加
            docRef = doc(db, "Contemporary", user.uid);
            newDoc = {
                "onSection": -1,
            }
            await setDoc(docRef, newDoc);
        }



        // ユーザー情報の取得
        docRef = doc(db, "Users", user.uid);
        await getDoc(docRef).then(result => {data = result.data()});
        this.user = user;
        if (data) {
            this.config.initParams(
                data.uid,
                data.name,
                data.registered,
                data.deleted,
                data.idRange,
                data.schedulingByOrder,
                data.timeStep,
                this.uploadConfig,
            )
        }
        // タスクデータの取得
        for (let i=this.config.idRange[0]; i<=this.config.idRange[1]; i++) {
            docRef = doc(db, "Tasks", user.uid + "_" + i);
            await getDoc(docRef).then(result => {
                let docData = result.data();
                if (docData !== undefined) {
                    const task = new Task(
                        docData.uid,
                        docData.id,
                        docData.title,
                        docData.max,
                        docData.min,
                        docData.isRequired,
                        docData.registered,
                        docData.deleted,
                        docData.order,
                        docData.isExtendable,
                    )
                    this.tasks.add(task);
                }
            });
        }
        // Contemporaryの取得
        docRef = doc(db, "Contemporary", user.uid);
        await getDoc(docRef).then(result => {data = result.data()});
        if (data) {
            if (data["onSection"] !== -1) {
                this.contemporary.onSection = data["onSection"];
                this.contemporary.basis     = data["basis"];
                Object.keys(data).forEach(sectionID => {
                    if (sectionID !== "onSection") {
                        const orderVals: [number, string] = [Number(sectionID.split("_")[0]), sectionID.split("_")[1]];
                        if (orderVals[1] === "start" && data) {
                            const order = orderVals[0];
                            const start = data[order + "_start"];
                            const end   = data[order + "_end"];
                            const id    = data[order + "_id"];
                            this.contemporary.add(this.contemporary.convertFromDBToArray(start, end, id), order);
                        }
                    }
                })
            }
        }
        this.contemporary.uploadFunc = (contemporary: Contemporary) => this.uploadContemporary(contemporary, this.config.uid);
        // リザルトデータの取得
    }

    ////////////////////////////////////////////////////////////////////
    // upload
    ////////////////////////////////////////////////////////////////////
    uploadTask(task: Task): boolean {
        const docRef = doc(db, "Tasks", `${task.uid}_${task.id}`);
        setDoc(docRef, task.getDataAsObject());
        return true;
    }
    uploadConfig(config: Config): boolean {
        const docRef = doc(db, "Users", config.uid);
        setDoc(docRef, config.getDataAsObject());
        return true;
    }
    uploadContemporary(contemporary: Contemporary, uid: string): boolean {
        const docRef = doc(db, "Contemporary", uid);
        setDoc(docRef, contemporary.getDataAsObject());
        return true;
    }
    uploadResult(result: Result, uid: string): boolean {
        const data: Array< {[key: string]: [number, number] | number | string} > = result.getDataAsObjects();
        data.forEach(elem => {
            const docRef = doc(db, "Result", `${uid}_${elem["id"]}`);
            setDoc(docRef, elem);
        })
        return true;
    }
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////////////////
    // delete
    ////////////////////////////////////////////////////////////////////
    deleteTask(task: Task): boolean {
        const docRef = doc(db, "Tasks", `${task.uid}_${task.id}`);
        const data   = task.getDataAsObject();
        const today  = new Date();
        data["deleted"] = [true, today.getFullYear(), today.getMonth()+1, today.getDate()];
        setDoc(docRef, data);
        return true;
    }
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////
}