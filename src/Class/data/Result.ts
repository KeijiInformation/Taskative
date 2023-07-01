// データ構造

import Time from "../Time";

// 日付をキー、各タスクの時間をvalueとする辞書型構造
export default class Result {
    data: {[key: string]: Array< [number, number, number] >};
    uploadFunc: ((result: Result) => boolean) | undefined;
    uid: string | undefined;
    // 以下はタスク進行中に使用する変数
    startTime: undefined | Time;    // タスクを始めた時間を保存
    endTime:   undefined | Time;    // タスクを終えた時間を保存
    onTaskID:  number | undefined;  // 進行中のタスクを保存。updateが呼ばれたらundefinedにリセット
    onDate: Date | undefined;       // 進行中の日付を保存。updateが呼ばれたらundefinedにリセット
    constructor(uploadFunc?: (result: Result) => boolean) {
        this.data = {};
        this.uploadFunc = uploadFunc;
        this.uid = undefined;
        this.startTime = undefined;
        this.endTime = undefined;
        this.onTaskID = undefined;
        this.onDate = undefined;
    }

    add(data: {[key: string]: [number, number] | number | string}): void {
        Object.keys(data).forEach(dateStr => {
            if (dateStr !== "uid" && dateStr !== "id") {
                if (!(dateStr in this.data)) {
                    this.data[dateStr] = [];
                }
                const targetData: [number, number] = data[dateStr] as [number, number];
                this.data[dateStr].push([data["id"] as number, targetData[0], targetData[1]]);
            }
        })
    }






    ///////////////////////////////////////////////////////////////////////////////
    // get
    ///////////////////////////////////////////////////////////////////////////////
    // 戻り値は[年月, [データ配列]]となっている
    getYearData(year: number): [string, Array<[number, number, number]>] {
        const targetStr: string = `${year}`;
        if (targetStr in this.data) {
            const result: Array<[number, number, number]> = [];
            this.data[targetStr].forEach(elem => {
                result.push([elem[0], elem[1], elem[2]]);
            })
            return [`${year}`, result];
        } else {
            return [`${year}`, []];
        }
    }
    // 戻り値は[年月, [データ配列]]となっている
    getMonthData(year: number, month: number): [string, Array<[number, number, number]>] {
        const targetStr: string = `${year}/${month}`;
        if (targetStr in this.data) {
            const result: Array<[number, number, number]> = [];
            this.data[targetStr].forEach(elem => {
                result.push([elem[0], elem[1], elem[2]]);
            })
            return [`${year}/${month}`, result];
        } else {
            return [`${year}/${month}`, []];
        }
    }

    // 戻り値は[[週の開始日, 週の最終日], [データ配列]]となっている
    getWeekData(year: number, month: number, day: number): [[string, string], Array<[number, number, number]>] {
        const dateStr: string = `${year}/${month}/${day}`;
        let onDate: Date = new Date(dateStr);
        // その週のdateStrをすべて生成
        const weekStart: Date = new Date();
        weekStart.setDate( onDate.getDate() - onDate.getDay() + 1 );
        const weekEnd:   Date = new Date();
        weekEnd.setDate( onDate.getDate() + (7 - onDate.getDay()) );
        const weekStartStr: string = `${weekStart.getFullYear()}/${weekStart.getMonth()+1}/${weekStart.getDate()}`;
        const weekEndStr:   string = `${weekEnd.getFullYear()}/${weekEnd.getMonth()+1}/${weekEnd.getDate()}`;
        // その週のデータを取得
        const targetStr: string = `${weekStartStr}-${weekEndStr}`;
        if (targetStr in this.data) {
            const result: Array<[number, number, number]> = [];
            this.data[targetStr].forEach(elem => {
                result.push([elem[0], elem[1], elem[2]]);
            })
            return [[weekStartStr, weekEndStr], result];
        } else {
            return [[weekStartStr, weekEndStr], []];
        }
    }
    ///////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////






    ///////////////////////////////////////////////////////////////////////////////
    // タスクを行っている時間をセットする関数
    ///////////////////////////////////////////////////////////////////////////////
    setStartTime(date: Date, taskID: number, start: Time) {
        this.onDate = date;
        this.onTaskID = taskID;
        this.startTime = start;
    }
    setEndTime(end: Time) {
        this.endTime = end;
    }
    ///////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////






    ///////////////////////////////////////////////////////////////////////////////
    // 提出関数
    ///////////////////////////////////////////////////////////////////////////////
    upload() {
        if (this.uploadFunc) {
            this.uploadFunc(this);
        }
        return true;
    }



    // 提出用の形式にオブジェクトを作成する関数
    getDataAsObjects(): Array< {[key: string]: [number, number] | number | string} > {
        const result: Array< {[key: string]: [number, number] | number | string} > = [];
        Object.keys(this.data).forEach(dateStr => {
            this.data[dateStr].forEach(taskData => {
                const id: number = taskData[0];
                const data: [number, number] = [taskData[1], taskData[2]];
                // キーが存在しない場合は追加
                let targetIndex: number = result.findIndex(dict => dict["id"] === id);
                if (targetIndex === -1) {
                    result.push({"id": id, "uid": this.uid as string});
                    targetIndex = result.length - 1;
                }
                // データを追加
                result[targetIndex][dateStr] = data;
            })
        })
        return result;
    }



    // 存在しないキーが現れたときに初期値を作成する関数
    initNewKeyData(week: string, month: string, year: string): void {
        if (this.onTaskID) {
            if (!(week in this.data)) {
                this.data[week] = [];
                this.data[week].push([this.onTaskID, 0, 0]);
                if (!(month in this.data)) {
                    this.data[month] = [];
                    this.data[month].push([this.onTaskID, 0, 0]);
                    if (!(year in this.data)) {
                        this.data[year] = [];
                        this.data[year].push([this.onTaskID, 0, 0]);
                    }
                }
            }
        }
    }
    // 割り当て時間を渡してデータを更新する関数(onDate, onTaskID, startTime, endTimeが設定されている状態で使用)
    updateData(allocate: number) {
        if (this.onDate && this.onTaskID && this.startTime && this.endTime) {
            // 対象となるキーの作成(週、月、年)
            const weekEdge: [Date, Date] = [new Date(), new Date()];
            weekEdge[0].setDate(this.onDate.getDate() - this.onDate.getDay() + 1);
            weekEdge[1].setDate(this.onDate.getDate() + (7 - this.onDate.getDay()));
            const targetWeek: string = `${weekEdge[0].getFullYear()}/${weekEdge[0].getMonth()+1}/${weekEdge[0].getDate()}-${weekEdge[1].getFullYear()}/${weekEdge[1].getMonth()+1}/${weekEdge[1].getDate()}`
            const targetMonth: string = `${this.onDate.getFullYear()}/${this.onDate.getMonth()+1}`;
            const targetYear: string = `${this.onDate.getFullYear()}`;
            // 初めて登録する日付であれば新しくデータを追加
            this.initNewKeyData(targetWeek, targetMonth, targetYear);
            // データの更新
            const actualTime: number = this.endTime.differFrom(this.startTime).getValueAsMin();
            let targetIndex;
            // 週
            targetIndex = this.data[targetWeek].findIndex(elem => elem[0] === this.onTaskID);
            if (targetIndex === -1) {
                this.data[targetWeek].push([this.onTaskID, 0, 0]);
                targetIndex = this.data[targetWeek].length - 1;
            }
            this.data[targetWeek][targetIndex][1] += allocate;
            this.data[targetWeek][targetIndex][2] += actualTime;
            // 月
            targetIndex = this.data[targetMonth].findIndex(elem => elem[0] === this.onTaskID);
            if (targetIndex === -1) {
                this.data[targetMonth].push([this.onTaskID, 0, 0]);
                targetIndex = this.data[targetMonth].length - 1;
            }
            this.data[targetMonth][targetIndex][1] += allocate;
            this.data[targetMonth][targetIndex][2] += actualTime;
            // 年
            targetIndex = this.data[targetYear].findIndex(elem => elem[0] === this.onTaskID);
            if (targetIndex === -1) {
                this.data[targetYear].push([this.onTaskID, 0, 0]);
                targetIndex = this.data[targetYear].length - 1;
            }
            this.data[targetYear][targetIndex][1] += allocate;
            this.data[targetYear][targetIndex][2] += actualTime;
            // 進行中データの初期化
            this.startTime = undefined;
            this.endTime = undefined;
            this.onTaskID = undefined;
            this.onDate = undefined;
            this.upload();
        }
    }
    ///////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////

}