import Task from "./Task";
import Time from "./Time";
import { Tasks } from "./data";



// Tasksクラスを時間分配用に拡張
class AllocateTask extends Task {
    timeRange: Array<[Time, Time]>;
    minAllocate: number;
    diffFromIdeal: number;
    constructor(task: Task) {
        super(task.uid, task.id, task.title, task.max, task.min, task.isRequired, task.registered, task.deleted, task.order, task.isExtendable);
        this.timeRange = [];
        this.minAllocate = -1;
        this.diffFromIdeal = 0;
    }
    addTimeRange(start: Time, end: Time): boolean {
        if (start.isSet() && end.isSet() && end.compareTo(start) >= 0) {
            this.timeRange.push([start.copy(), end.copy()]);
            return true;
        } else {
            return false;
        }
    }
    copy(): AllocateTask {
        const taskCopy: Task = super.copy();
        const result: AllocateTask = new AllocateTask(taskCopy);
        this.timeRange.forEach(section => {
            result.addTimeRange(section[0].copy(), section[1].copy());
        })
        result.minAllocate  = this.minAllocate;
        result.diffFromIdeal = this.diffFromIdeal;
        return result;
    }
}
class AllocateTasks extends Tasks {
    data: AllocateTask[];
    constructor(tasks?: Tasks) {
        super();
        this.data = [];
        if (tasks) {
            tasks.data.forEach(task => {
                this.add(new AllocateTask(task));
            })
        }
    }
    add(task: AllocateTask) {
        super.add(task);
    }
    // minAllocateが残っているAllocateTaskインスタンスのうち始めのものを取得する関数
    getFirstTaskHasMin(): AllocateTask | undefined {
        for (let task of this.data) {
            if (task.minAllocate > 0) {
                return task;
            }
        }
        return undefined;
    }
    // パターン(インデックスの配列で与えられる)によってAllocateTasksの配列を並び替える関数
    sortByPattern(pattern: number[]): void {
        const newData: AllocateTask[] = [];
        pattern.forEach(index => {
            newData.push(this.data[index]);
        })
        this.data = newData;
    }
    // 現在のtimeRangeのデータから実際に使用するデータの形を作成する関数
    createSectionsData(): Array<[Time, Time, number]> {
        const result: Array<[Time, Time, number]> = [];
        this.data.forEach(task => {
            task.timeRange.forEach(section => {
                result.push([section[0], section[1], task.id]);
            })
        })
        result.sort((a, b) => {
            return a[0].compareTo(b[0]);
        })
        return result;
    }
    copy(): AllocateTasks {
        const result: AllocateTasks = new AllocateTasks();
        this.data.forEach(task => {
            result.data.push(task.copy());
        })
        return result;
    }
}



export default class TimeAllocater {
    start: Time;
    end: Time;
    breakTask: AllocateTask;
    tasks: AllocateTasks;
    numOfMaxPatterns: number;
    activeTime: number;
    timeStep: number;
    constructor(start: Time, end: Time, breakTimes: Array<[Time, Time]>, tasks: Tasks, timeStep: number) {
        this.start = start;
        this.end   = end;
        this.breakTask = new AllocateTask(new Task(tasks.data[0].uid, -1, "休憩", -1, -1, true, [-1, -1, -1], [false, -1, -1, -1], -1, false));
        breakTimes.forEach(breaksection => {
            this.breakTask.addTimeRange(breaksection[0], breaksection[1]);
        })
        this.tasks = new AllocateTasks(tasks.copy());
        tasks.sortByOrder(true);
        this.numOfMaxPatterns = 1;
        this.activeTime = this.calcActiveTime();
        this.timeStep = timeStep;
    }






    //////////////////////////////////////////////////////////////////////////////
    // calc
    //////////////////////////////////////////////////////////////////////////////
    // 稼働可能な時間を返す関数
    calcActiveTime(): number {
        let result = 0;
        // start ~ endまでの時間(min)
        result += this.end.differFrom(this.start).getValueAsMin();
        // breaktimesの時間(min)
        let breaktimeAsMin = 0;
        this.breakTask.timeRange.forEach(breaksection => {
            breaktimeAsMin += this.getSectionMin(breaksection);
        })
        result -= breaktimeAsMin;
        return result;
    }
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////////////
    // 割り当て用の配列計算関数群
    //////////////////////////////////////////////////////////////////////////////
    listSum(list: Array<number>): number {
        let result = 0;
        list.forEach(elem => result += elem);
        return result;
    }

    // 配列の各要素同士を足す関数
    addEveryElem(main: number[], arr: number[]): number[] {
        const mainArr = [...main];
        const subArr  = [...arr];
        if (mainArr.length >= subArr.length) {
            for (let i=0; i<subArr.length; i++) {
                mainArr[i] += subArr[i];
            }
        } else {
            for (let i=0; i<mainArr.length; i++) {
                mainArr[i] += subArr[i];
            }
        }
        return [...mainArr];
    }

    ceilToJustVal(val: number): number {
        while (val % this.timeStep !== 0) {
            val++;
        }
        return val;
    }
    floorToJustVal(val: number): number {
        while (val % this.timeStep !== 0) {
            val--;
        }
        return val;
    }

    // targetValを配列の要素比に分配して返す関数
    distributeArrByRatio(targetVal: number, ratioSample: number[], maxSample: number[]): Array<number> {
        const result: Array<number> = [];
        let sum = this.listSum(ratioSample);
        ratioSample.forEach(elem => {
            let val: number = Math.floor(targetVal * (elem / sum));
            val = this.floorToJustVal(val);
            result.push(val);
        })
        // 残りの部分を分配(maxに達していないものに分配・もしくは最も少ない物に分配)
        targetVal -= this.listSum(result);
        while (targetVal >= this.timeStep) {
            const targetIndex: number = Math.floor(Math.random()*result.length);
            // 比率が0じゃない かつ maxに達してない
            if (ratioSample[targetIndex] > 0 && result[targetIndex] + this.timeStep <= maxSample[targetIndex]) {
                result[targetIndex] += this.timeStep;
                targetVal -= this.timeStep;
            }
        }
        return result;
    }
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////////////
    // get pattern
    //////////////////////////////////////////////////////////////////////////////
    // すでに存在するパターンかどうかを判定する関数
    isExistPattern(samplePatterns: Array<number[]>, generatedPatterns: number[]) {
        let result: boolean = false;
        samplePatterns.forEach(pattern => {
            let samePattern: boolean = true;
            for (let i=0; i<pattern.length; i++) {
                const sampleIndex    = pattern[i];
                const generatedIndex = generatedPatterns[i];
                if (sampleIndex !== generatedIndex) {
                    samePattern = false;
                    break;
                }
            }
            if (samePattern) {
                result = true;
            }
        })
        return result;
    }
    // 指定された個数だけパターンを返す関数
    getOrderPattern(numberOfPatterns: number): Array< number[] > {
        let sampleModel: Array<number> = [];
        for (let i=0; i<this.tasks.data.length; i++) {
            sampleModel.push(i);
        }
        // 生成(乱数によってランダムに2つの位置を入れ替えて生成する)
        const resultArr: Array< number[] > = [[...sampleModel]];
        let pattern: Array<number>;
        let loopLimit: number = 3000;
        let i = 0;
        while (resultArr.length < numberOfPatterns && resultArr.length < this.numOfMaxPatterns && i < loopLimit) {
            // スワップ位置の決定
            let swapPosition: [number, number] = [Math.floor(Math.random()*sampleModel.length), Math.floor(Math.random()*sampleModel.length)];
            while (swapPosition[0] === swapPosition[1]) {
                swapPosition[1] = Math.floor(Math.random()*sampleModel.length);
            }
            // スワップ操作
            pattern = [...resultArr[resultArr.length-1]];
            let swappedVals:  [number, number] = [pattern[swapPosition[0]], pattern[swapPosition[1]]];
            pattern[swapPosition[0]] = swappedVals[1];
            pattern[swapPosition[1]] = swappedVals[0];
            // 存在の確認とpush
            if (!this.isExistPattern(resultArr, pattern)) {
                resultArr.push([...pattern]);
            }
            i ++;
        }
        return resultArr;
    }
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////////////
    // 各タスクの分単位の分配を決定
    //////////////////////////////////////////////////////////////////////////////
    // 最大時間の合計がactiveTimeを超えない場合
    // maxSumをmaxの割合で分配した後isExtendableで分配
    // isExtendableがなければmaxで分配
    createMinDistributionByMax(maxSum: number): void {
        // 最大時間で分配
        let ratioSample: number[] = [];
        let maxSample:   number[] = [];
        this.tasks.data.forEach(task => {
            ratioSample.push(task.max);
            maxSample.push(task.max);
        })
        let minDistribution: number[] = this.distributeArrByRatio(maxSum, ratioSample, maxSample);
        // 残りの分配
        let remaindMin: number = this.activeTime - maxSum;
        let remaindDistribution: number[];
        // 残りをisExtendableがあればそこで分配
        // isExtendableがなければmaxで分配
        if (this.tasks.hasExtendable()) {
            ratioSample = this.tasks.data.map(task => {
                if (task.isExtendable) {
                    return task.max;
                } else {
                    return 0;
                }
            })
        }
        remaindDistribution = this.distributeArrByRatio(remaindMin, ratioSample, maxSample);
        minDistribution = this.addEveryElem(minDistribution, remaindDistribution);
        this.tasks.data.forEach((task, index) => {
            task.minAllocate = minDistribution[index]
        })
    }



    // 最小時間の合計がactiveTimeを超えない場合
    // minSumをminの割合で分配した後maxの割合で分配
    createMinDistributionByMin(minSum: number): void {
        // 最大時間で分配
        let ratioSample: number[] = [];
        let maxSample:   number[] = [];
        this.tasks.data.forEach(task => {
            ratioSample.push(task.min);
            maxSample.push(task.max);
        })
        let   minDistribution: number[] = this.distributeArrByRatio(minSum, ratioSample, maxSample);
        // 残りの分配(maxの割合で分配)
        let remaindMin: number = this.activeTime - minSum;
        ratioSample = this.tasks.data.map(task => task.max);
        let remaindDistribution: number[] = this.distributeArrByRatio(remaindMin, ratioSample, maxSample);
        minDistribution = this.addEveryElem(minDistribution, remaindDistribution);
        this.tasks.data.forEach((task, index) => {
            task.minAllocate = minDistribution[index];
        })
    }



    // 最小時間ですらactiveTimeを超える場合
    // isRequired = falseがあれば削ってactiveTimeを超えなくなったらOK
    // isRequired = falseがなくなったらminで分配
    createMinDistributionByUnderLimit(): void {
        let minSum: number = this.tasks.getSumValue("min");
        // タスクの削り作業(isRequiredでないかつorderが高い順)
        while (this.activeTime < minSum) {
            let targetOrder: number = this.tasks.getMaxOrder();
            let target: Task | undefined = this.tasks.getTaskByOrder(targetOrder);
            // orderが高くisRequired = falseの物を捜索
            while (target !== undefined && target.isRequired) {
                targetOrder--;
                target = this.tasks.getTaskByOrder(targetOrder);
            }
            // 存在しなければbreak
            if (!target) {
                minSum = this.activeTime;
                break;
            }
            // あれば削る
            this.tasks.filterByID(target.id);
            minSum = this.tasks.getSumValue("min");
        }
        this.createMinDistributionByMin(minSum);
    }



    // 分単位でタスクの時間分配を決定する関数
    descideMinDistribution(): void {
        const maxSum = this.tasks.getSumValue("max");
        const minSum = this.tasks.getSumValue("min");
        // 最大時間の合計がactiveTimeを超えない場合
        if (this.activeTime >= maxSum) {
            this.createMinDistributionByMax(maxSum);
        } else if (this.activeTime < maxSum && this.activeTime >= minSum) {
            this.createMinDistributionByMin(minSum);
        } else {
            this.createMinDistributionByUnderLimit();
        }
    }
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////////////
    // 時間のセクションに関する関数
    //////////////////////////////////////////////////////////////////////////////
    // 戻り値＝開始時間, 終了時間, 休憩識別用の値(-1なら休憩) を要素とする配列
    createTimeSection(): Array<[Time, Time, number]> {
        const result: Array<[Time, Time, number]> = [];
        let onTime: Time = this.start;
        this.breakTask.timeRange.forEach(breaksection => {
            result.push([onTime.copy(), breaksection[0].copy(), 0]);
            result.push([breaksection[0].copy(), breaksection[1].copy(), -1]);
            onTime = breaksection[1];
        })
        result.push([onTime.copy(), this.end.copy(), 0]);
        return result;
    }
    getSectionMin(section: [Time, Time]): number {
        return section[1].differFrom(section[0]).getValueAsMin();
    }
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////////////
    // 時刻への割り当て
    //////////////////////////////////////////////////////////////////////////////
    descideTaskTime(task: AllocateTask, section: [Time, Time]): void {
        // 最大まで割り当ててもオーバーしない場合
        if (task.minAllocate < this.getSectionMin(section)) {
            // 割り当て
            let taskStart: Time = section[0].copy();
            let taskEnd:   Time = section[0].copy();
            taskEnd.add(task.minAllocate);
            task.addTimeRange(taskStart, taskEnd);
            task.minAllocate = 0;
            // 残りが(timeStep + 5)分未満ならばsectionの終わりまで割り当て
            if (this.getSectionMin([taskEnd, section[1]]) < this.timeStep + 5) {
                task.addTimeRange(taskStart, section[1].copy());
                task.diffFromIdeal += this.getSectionMin([taskEnd, section[1]]);
            }
        // 割り当てるとオーバーする場合
        } else {
            task.addTimeRange(section[0].copy(), section[1].copy());
            task.minAllocate -= this.getSectionMin(section);
            // タスクに残された分配がtimeStep以下なら切り捨て
            if (task.minAllocate <= this.timeStep) {
                task.diffFromIdeal -= task.minAllocate;
                task.minAllocate = 0;
            }
        }
    }



    descideTimeAllocationByPattern(pattern: number[]): AllocateTasks {
        // 並び替え
        const tasks: AllocateTasks = this.tasks.copy();
        tasks.sortByPattern(pattern);
        // 時刻の割り当て
        let onTime: Time;
        let onTask: AllocateTask | undefined;
        let sectionMin: number;
        const timeSection: Array<[Time, Time, number]> = this.createTimeSection();
        timeSection.forEach(section => {
            if (section[2] !== -1) {
                onTime = section[0].copy();
                sectionMin = this.getSectionMin([section[0], section[1]]);
                while (sectionMin > 0) {
                    onTask = tasks.getFirstTaskHasMin();
                    if (onTask) {
                        this.descideTaskTime(onTask, [onTime, section[1]]);
                        if (onTask.timeRange) {
                            onTime = onTask.timeRange[onTask.timeRange.length-1][1];
                            sectionMin = this.getSectionMin([onTime, section[1]]);
                        }
                    } else {
                        break;
                    }
                }
            }
        })
        tasks.add(this.breakTask.copy());
        return tasks;
    }
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////////////
    // 決定
    //////////////////////////////////////////////////////////////////////////////
    // 理想に対する距離(絶対値の合計)を計算する関数
    calcDifferenceFromIdeal(tasks: AllocateTasks): number {
        let result: number = 0;
        tasks.data.forEach(task => {
            result += Math.abs(task.diffFromIdeal);
        })
        return result;
    }



    // 実際に割り当てを実行する関数
    allocate(schedulingByOrder: boolean): Array<[Time, Time, number]> {
        // 分単位の分配
        this.descideMinDistribution();
        // 最大パターン数の計算
        for (let i=1; i<=this.tasks.data.length; i++) {
            this.numOfMaxPatterns *= i
        }
        // パターンの作成
        let patterns: Array<number[]>;
        if (schedulingByOrder) {
            patterns = [[]];
            for (let i=0; i<this.tasks.data.length; i++) {
                patterns[0].push(i)
            }
        } else {
            patterns = this.getOrderPattern(100);
        }
        // パターンの検証
        let idealPatternDiff:  number;
        let idealTasksPattern: AllocateTasks = new AllocateTasks();
        patterns.forEach((pattern, index) => {
            const allocateTasks: AllocateTasks = this.descideTimeAllocationByPattern(pattern);
            if (index === 0) {
                idealPatternDiff  = this.calcDifferenceFromIdeal(allocateTasks);
                idealTasksPattern = allocateTasks;
            } else {
                const onDiff: number = this.calcDifferenceFromIdeal(allocateTasks);
                if (onDiff < idealPatternDiff) {
                    idealPatternDiff  = onDiff;
                    idealTasksPattern = allocateTasks;
                }
            }
        })
        // 決定されたパターンから結果配列を作成
        return idealTasksPattern.createSectionsData();
    }
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////////////
    // 時刻の割り当て
    //////////////////////////////////////////////////////////////////////////////
    // // start ~ end に対してminutesを割り当て、割り当て結果の時刻と割り当てきれなかった時間を返す関数
    // allocateMinutes(start: Time, end: Time, minutes: number): [Time, Time, number] {
    //     let onTime: Time = new Time(start.hours, start.minutes, this.start);
    //     onTime.add(minutes);
    //     // endを過ぎる場合
    //     if (onTime.compareTo(end) > 0) {
    //         const duration = minutes - end.differFrom(start).getValueAsMin();
    //         return [start, end, duration];
    //     // endをすぎない場合
    //     } else {
    //         return [start, onTime, 0];
    //     }
    // }

    // // 指定された順序でタスクの時刻を決定する関数
    // descideTimeAllocation(minAllocation: number[], order: number[]): [Array<[Time, Time, number]>, number[]] {
    //     // 各時刻セクションの配列を作成 Array< [Time, Time, boolean] > 休憩時間にはfalseを格納する
    //     const timeSections: Array< [Time, Time, boolean] > = [];
    //     let onTime: Time = this.start;
    //     this.breakTasks.forEach(breaktime => {
    //         let beforeBreak: Time = new Time(breaktime[0].hours, breaktime[0].minutes, this.start);
    //         timeSections.push( [onTime, beforeBreak, true] );
    //         timeSections.push( [breaktime[0], breaktime[1], false] );
    //         onTime = new Time(breaktime[1].hours, breaktime[1].minutes, this.start);
    //     })
    //     timeSections.push( [onTime, this.end, true] );


    //     // 割り当ての開始
    //     const result: [Array<[Time, Time, number]>, number[]] = [[], []];
    //     let timeSectionIndex: number = 0;
    //     let onTimeSection: [Time, Time, boolean] = timeSections[timeSectionIndex];
    //     onTime = onTimeSection[0].copy();
    //     order.forEach(target => {
    //         // let task: Task = this.tasks[target];
    //         let minutes: number = minAllocation[target];

    //         while (minutes > 0 && timeSectionIndex <= timeSections.length-1) {
    //             // 割り当て時刻の取得
    //             let allocateResult: [Time, Time, number] = this.allocateMinutes(onTime, onTimeSection[1], minutes);
    //             // 結果の格納・onTimeをとminutesを更新
    //             result[0].push([allocateResult[0], allocateResult[1], target]);
    //             let dataIndex: number = result[0].length-1;
    //             onTime  = allocateResult[1];
    //             minutes = allocateResult[2];

    //             // onTimeが時刻セクションのendと一致するとき、セクションの移動を行う
    //             if (onTime.compareTo(onTimeSection[1]) === 0) {
    //                 timeSectionIndex++;
    //                 onTimeSection = timeSections[timeSectionIndex];
    //                 if (!onTimeSection) {
    //                     break;
    //                 }
    //                 while (!onTimeSection[2]) {
    //                     result[0].push([onTimeSection[0], onTimeSection[1], -1]);
    //                     timeSectionIndex++;
    //                     onTimeSection = timeSections[timeSectionIndex];
    //                 }
    //                 onTime = onTimeSection[0].copy();
    //             }

    //             // 残り時間が5分以下の時、切り捨てて次のタスクに付加する
    //             if (minutes <= 5) {
    //                 if (target+1 < minAllocation.length) {
    //                     minAllocation[target+1] += minutes;
    //                 }
    //                 minutes = 0;
    //             // セクションの残りが5分以下のとき、残りを現在のタスクのものとしセクションを移動する
    //             } else if (onTimeSection[1].differFrom(onTime).getValueAsMin() <= 5) {
    //                 result[0][dataIndex][1] = onTimeSection[1];
    //                 timeSectionIndex++;
    //                 onTimeSection = timeSections[timeSectionIndex];
    //                 if (!onTimeSection) {
    //                     break;
    //                 }
    //                 while (!onTimeSection[2]) {
    //                     result[0].push([onTimeSection[0], onTimeSection[1], -1]);
    //                     timeSectionIndex++;
    //                     onTimeSection = timeSections[timeSectionIndex];
    //                 }
    //                 onTime = onTimeSection[0].copy();
    //                 if (target+1 < minAllocation.length) {
    //                     minAllocation[target+1] -= onTimeSection[1].differFrom(onTime).getValueAsMin();
    //                     if (minAllocation[target+1] < 0) {
    //                         minAllocation[target+1] = 0;
    //                     }
    //                 }
    //             }
    //         }
    //     })


    //     // 実際に割り当てた時間(min)を計算しresultに格納
    //     const actualMinutes: number[] = [];
    //     for (let i=0; i<minAllocation.length; i++) {
    //         actualMinutes.push(0);
    //     }
    //     result[0].forEach(timeDist => {
    //         if (timeDist[2] !== -1) {
    //             actualMinutes[timeDist[2]] += timeDist[1].differFrom(timeDist[0]).getValueAsMin();
    //         }
    //     })
    //     result[1] = [...actualMinutes];
    //     return result;
    // }
    // //////////////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////////////






    // //////////////////////////////////////////////////////////////////////////////
    // // 分単位の割り当て
    // //////////////////////////////////////////////////////////////////////////////
    // // 分単位での時間を割り当てを決定する関数
    // descideMinAllocation(): number[] {
    //     let result:  number[] = [];
    //     let minutes: number   = this.activeTime;

    //     // 最大時間と最小時間の配列定義
    //     const maxMinutesList: number[] = this.tasks.map(task => {
    //         return task.max;
    //     })
    //     const minMinutesList: number[] = this.tasks.map(task => {
    //         return task.min;
    //     })

    //     // 最大時間の分配が可能な場合
    //     if (this.listSum(maxMinutesList) <= this.activeTime) {
    //         result = [...maxMinutesList];
    //         minutes -= this.listSum(maxMinutesList);
    //         let remaindDist: number[] = [];
    //         if (this.hasExtendable()) {
    //             this.tasks.forEach(task => {
    //                 if (task.isExtendable) {
    //                     remaindDist.push(task.max);
    //                 } else {
    //                     remaindDist.push(0);
    //                 }
    //             })
    //             remaindDist = this.distributeArrByRatio(minutes, remaindDist);
    //         } else {
    //             remaindDist = this.distributeArrByRatio(minutes, maxMinutesList);
    //         }
    //         result = this.addEveryElem(result, remaindDist);

    //     // 最大時間は無理だが最小時間の分配が可能な場合
    //     } else if (this.listSum(maxMinutesList) > this.activeTime && this.listSum(minMinutesList) <= this.activeTime) {
    //         result = [...minMinutesList];
    //         minutes -= this.listSum(minMinutesList);
    //         let remaindDist: number[] = [];
    //         if (this.hasRequired()) {
    //             this.tasks.forEach(task => {
    //                 if (task.isRequired) {
    //                     remaindDist.push(task.min);
    //                 } else {
    //                     remaindDist.push(0);
    //                 }
    //             })
    //             remaindDist = this.distributeArrByRatio(minutes, remaindDist);
    //         } else {
    //             remaindDist = this.distributeArrByRatio(minutes, minMinutesList);
    //         }
    //         result = this.addEveryElem(result, remaindDist);
    //         // isExtendableがfalseのやつは最大を超えないようにする
    //         minutes -= this.listSum(remaindDist);
    //         this.tasks.forEach((task, index) => {
    //             if (task.max < result[index]) {
    //                 minutes += result[index] - task.max;
    //                 result[index] = task.max;
    //             }
    //             // if (!task.isExtendable && task.max < result[index]) {
    //             //     minutes += result[index] - task.max;
    //             //     result[index] = task.max;
    //             // }
    //         })
    //         remaindDist = [];
    //         // 残ったものの分配
    //         if (this.hasExtendable()) {
    //             this.tasks.forEach(task => {
    //                 if (task.isExtendable) {
    //                     remaindDist.push(task.min);
    //                 } else {
    //                     remaindDist.push(0);
    //                 }
    //             })
    //             remaindDist = this.distributeArrByRatio(minutes, remaindDist);
    //         } else {
    //             if (this.hasRequired()) {
    //                 this.tasks.forEach(task => {
    //                     if (task.isExtendable) {
    //                         remaindDist.push(task.min);
    //                     } else {
    //                         remaindDist.push(0);
    //                     }
    //                 })
    //                 remaindDist = this.distributeArrByRatio(minutes, remaindDist);
    //             } else {
    //                 remaindDist = this.distributeArrByRatio(minutes, minMinutesList);
    //             }
    //         }
    //         result = this.addEveryElem(result, remaindDist);

    //     // 最小時間の分配も不可能な場合
    //     } else {
    //         // isRequred === trueだけに分配
    //         let remaindDist: number[] = [];
    //         this.tasks.forEach(task => {
    //             if (!task.isRequired) {
    //                 remaindDist.push(0);
    //             } else {
    //                 remaindDist.push(task.min);
    //             }
    //         })
    //         // 稼働可能時間を超えなければ残りをminの比で分配
    //         if (this.listSum(remaindDist) <= this.activeTime) {
    //             result = [...remaindDist];
    //             minutes -= this.listSum(result);
    //             remaindDist = [];
    //             this.tasks.forEach(task => {
    //                 if (!task.isRequired) {
    //                     remaindDist.push(task.min);
    //                 } else {
    //                     remaindDist.push(0);
    //                 }
    //             })
    //             remaindDist = this.distributeArrByRatio(minutes, remaindDist);
    //             result =  this.addEveryElem(result, remaindDist);
    //         // それでも稼働可能時間を超える場合はすべてをminの比で分配
    //         } else {
    //             result = this.distributeArrByRatio(this.activeTime, minMinutesList);
    //         }
    //     }
    //     return result;
    // }
    // //////////////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////////////






    // //////////////////////////////////////////////////////////////////////////////
    // // allocator
    // //////////////////////////////////////////////////////////////////////////////
    // // 理想的な時間配分に対して実際の時間配分のずれを計算する関数
    // distanceFromIdeal(ideal: Array<number>, actual: Array<number>): number {
    //     let result = 0;
    //     ideal.forEach((idealVal, index) => {
    //         let actualVal = actual[index];
    //         result += Math.abs(actualVal - idealVal);
    //     })
    //     return result;
    // }

    // // 実際に時間を割り当てる関数
    // allocateTasks(schedulingByOrder: boolean): Array<[Time, Time, number]> {
    //     let result: Array<[Time, Time, number]>;
    //     // 分単位の割り当てを決定
    //     const minutesAllocation: number[] = this.descideMinAllocation();


    //     // 時刻の割り当て
    //     const allocationPatterns: Array< [Array<[Time, Time, number]>, number] > = [];  // 各要素は[割り当て時刻と対応するタスクインデックス(休憩は-1), 理想値とのずれ]となっている
    //     // 順番通りに割り当てる場合
    //     if (schedulingByOrder) {
    //         // 順番配列の作成
    //         let order: number[] = [];
    //         for (let i=0; i<this.tasks.length; i++) {
    //             order.push(-1);
    //         }
    //         this.tasks.forEach((task, index) => {
    //             order[task.order] = index;
    //         })
    //         // 割り当てと結果の格納
    //         let allocationResult: [Array<[Time, Time, number]>, number[]] = this.descideTimeAllocation(minutesAllocation, order);
    //         result = allocationResult[0];
    //         return result;


    //     // 順番が指定されていない場合
    //     } else {
    //         this.getOrderPattern(100).forEach(order => {
    //             let allocationResult: [Array<[Time, Time, number]>, number[]] = this.descideTimeAllocation(minutesAllocation, order);
    //             allocationPatterns.push([allocationResult[0], this.distanceFromIdeal(minutesAllocation, allocationResult[1])]);
    //         })

    //         result = allocationPatterns[0][0];
    //         let minDistance = allocationPatterns[0][1];
    //         allocationPatterns.forEach(allocationPattern => {
    //             if (minDistance > allocationPattern[1]) {
    //                 minDistance = allocationPattern[1];
    //                 result = allocationPattern[0];
    //             }
    //         })
    //         return result;
    //     }
    // }
    // //////////////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////////////
    // //////////////////////////////////////////////////////////////////////////////
}