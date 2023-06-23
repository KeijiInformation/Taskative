import Task from "./Task";
import Time from "./Time";



export default class TimeAllocater {
    start: Time;
    end: Time;
    breaktimes: Array<[Time, Time]>;
    tasks: Array<Task>;
    numOfMaxPatterns: number;
    activeTime: number = 0;
    constructor(start: Time, end: Time, breaktimes: Array<[Time, Time]>, tasks: Array<Task>) {
        this.start = start;
        this.end   = end;
        this.breaktimes = breaktimes;
        this.tasks = tasks;
        this.numOfMaxPatterns = 1;
        for (let i=1; i<=tasks.length; i++) this.numOfMaxPatterns *= i;
        this.activeTime = this.calcActiveTime();
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
        this.breaktimes.forEach(breaktime => {
            breaktimeAsMin += breaktime[1].differFrom(breaktime[0]).getValueAsMin();
        })
        result -= breaktimeAsMin;
        return result;
    }
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////////////
    // arr operator
    //////////////////////////////////////////////////////////////////////////////
    // 配列の合計値を返す関数
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

    // targetValを配列の要素比に分配して返す関数
    distributeArrByRatio(targetVal: number, ratioSample: Array<number>): Array<number> {
        const result: Array<number> = [];
        let sum = this.listSum(ratioSample);
        ratioSample.forEach(elem => {
            result.push(Math.floor(targetVal * (elem / sum)));
        })
        // 残りの部分を分配
        targetVal -= this.listSum(result);
        while (targetVal > 0) {
            result[Math.floor(Math.random()*result.length)] ++;
            targetVal --;
        }
        return result;
    }

    // isExtendable === true が存在するかどうかを判定する関数
    hasExtendable(): boolean {
        let result: boolean = false;
        this.tasks.forEach(task => {
            if (task.isExtendable === true) {
                result = true;
            }
        })
        return result;
    }

    // isRequired === true が存在するかどうかを判定する関数
    hasRequired(): boolean {
        let result: boolean = false;
        this.tasks.forEach(task => {
            if (task.isRequired === true) {
                result = true;
            }
        })
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
        for (let i=0; i<this.tasks.length; i++) {
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
    // 時刻の割り当て
    //////////////////////////////////////////////////////////////////////////////
    // start ~ end に対してminutesを割り当て、割り当て結果の時刻と割り当てきれなかった時間を返す関数
    allocateMinutes(start: Time, end: Time, minutes: number): [Time, Time, number] {
        let onTime: Time = new Time(start.hours, start.minutes, this.start);
        onTime.add(minutes);
        // endを過ぎる場合
        if (onTime.compareTo(end) > 0) {
            const duration = minutes - end.differFrom(start).getValueAsMin();
            return [start, end, duration];
        // endをすぎない場合
        } else {
            return [start, onTime, 0];
        }
    }

    // 指定された順序でタスクの時刻を決定する関数
    descideTimeAllocation(minAllocation: number[], order: number[]): [Array<[Time, Time, number]>, number[]] {
        // 各時刻セクションの配列を作成 Array< [Time, Time, boolean] > 休憩時間にはfalseを格納する
        const timeSections: Array< [Time, Time, boolean] > = [];
        let onTime: Time = this.start;
        this.breaktimes.forEach(breaktime => {
            let beforeBreak: Time = new Time(breaktime[0].hours, breaktime[0].minutes, this.start);
            timeSections.push( [onTime, beforeBreak, true] );
            timeSections.push( [breaktime[0], breaktime[1], false] );
            onTime = new Time(breaktime[1].hours, breaktime[1].minutes, this.start);
        })
        timeSections.push( [onTime, this.end, true] );


        // 割り当ての開始
        const result: [Array<[Time, Time, number]>, number[]] = [[], []];
        let timeSectionIndex: number = 0;
        let onTimeSection: [Time, Time, boolean] = timeSections[timeSectionIndex];
        onTime = onTimeSection[0].copy();
        order.forEach(target => {
            // let task: Task = this.tasks[target];
            let minutes: number = minAllocation[target];

            while (minutes > 0 && timeSectionIndex <= timeSections.length-1) {
                // 割り当て時刻の取得
                let allocateResult: [Time, Time, number] = this.allocateMinutes(onTime, onTimeSection[1], minutes);
                // 結果の格納・onTimeをとminutesを更新
                result[0].push([allocateResult[0], allocateResult[1], target]);
                let dataIndex: number = result[0].length-1;
                onTime  = allocateResult[1];
                minutes = allocateResult[2];

                // onTimeが時刻セクションのendと一致するとき、セクションの移動を行う
                if (onTime.compareTo(onTimeSection[1]) === 0) {
                    timeSectionIndex++;
                    onTimeSection = timeSections[timeSectionIndex];
                    if (!onTimeSection) {
                        break;
                    }
                    while (!onTimeSection[2]) {
                        result[0].push([onTimeSection[0], onTimeSection[1], -1]);
                        timeSectionIndex++;
                        onTimeSection = timeSections[timeSectionIndex];
                    }
                    onTime = onTimeSection[0].copy();
                }

                // 残り時間が5分以下の時、切り捨てて次のタスクに付加する
                if (minutes <= 5) {
                    if (target+1 < minAllocation.length) {
                        minAllocation[target+1] += minutes;
                    }
                    minutes = 0;
                // セクションの残りが5分以下のとき、残りを現在のタスクのものとしセクションを移動する
                } else if (onTimeSection[1].differFrom(onTime).getValueAsMin() <= 5) {
                    result[0][dataIndex][1] = onTimeSection[1];
                    timeSectionIndex++;
                    onTimeSection = timeSections[timeSectionIndex];
                    if (!onTimeSection) {
                        break;
                    }
                    while (!onTimeSection[2]) {
                        result[0].push([onTimeSection[0], onTimeSection[1], -1]);
                        timeSectionIndex++;
                        onTimeSection = timeSections[timeSectionIndex];
                    }
                    onTime = onTimeSection[0].copy();
                    if (target+1 < minAllocation.length) {
                        minAllocation[target+1] -= onTimeSection[1].differFrom(onTime).getValueAsMin();
                        if (minAllocation[target+1] < 0) {
                            minAllocation[target+1] = 0;
                        }
                    }
                }
            }
        })


        // 実際に割り当てた時間(min)を計算しresultに格納
        const actualMinutes: number[] = [];
        for (let i=0; i<minAllocation.length; i++) {
            actualMinutes.push(0);
        }
        result[0].forEach(timeDist => {
            if (timeDist[2] !== -1) {
                actualMinutes[timeDist[2]] += timeDist[1].differFrom(timeDist[0]).getValueAsMin();
            }
        })
        result[1] = [...actualMinutes];
        return result;
    }
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////////////
    // 分単位の割り当て
    //////////////////////////////////////////////////////////////////////////////
    // 分単位での時間を割り当てを決定する関数
    descideMinAllocation(): number[] {
        let result:  number[] = [];
        let minutes: number   = this.activeTime;

        // 最大時間と最小時間の配列定義
        const maxMinutesList: number[] = this.tasks.map(task => {
            return task.max;
        })
        const minMinutesList: number[] = this.tasks.map(task => {
            return task.min;
        })

        // 最大時間の分配が可能な場合
        if (this.listSum(maxMinutesList) <= this.activeTime) {
            result = [...maxMinutesList];
            minutes -= this.listSum(maxMinutesList);
            let remaindDist: number[] = [];
            if (this.hasExtendable()) {
                this.tasks.forEach(task => {
                    if (task.isExtendable) {
                        remaindDist.push(task.max);
                    } else {
                        remaindDist.push(0);
                    }
                })
                remaindDist = this.distributeArrByRatio(minutes, remaindDist);
            } else {
                remaindDist = this.distributeArrByRatio(minutes, maxMinutesList);
            }
            result = this.addEveryElem(result, remaindDist);

        // 最大時間は無理だが最小時間の分配が可能な場合
        } else if (this.listSum(maxMinutesList) > this.activeTime && this.listSum(minMinutesList) <= this.activeTime) {
            result = [...minMinutesList];
            minutes -= this.listSum(minMinutesList);
            let remaindDist: number[] = [];
            if (this.hasRequired()) {
                this.tasks.forEach(task => {
                    if (task.isRequired) {
                        remaindDist.push(task.min);
                    } else {
                        remaindDist.push(0);
                    }
                })
                remaindDist = this.distributeArrByRatio(minutes, remaindDist);
            } else {
                remaindDist = this.distributeArrByRatio(minutes, minMinutesList);
            }
            result = this.addEveryElem(result, remaindDist);
            // isExtendableがfalseのやつは最大を超えないようにする
            minutes -= this.listSum(remaindDist);
            this.tasks.forEach((task, index) => {
                if (task.max < result[index]) {
                    minutes += result[index] - task.max;
                    result[index] = task.max;
                }
                // if (!task.isExtendable && task.max < result[index]) {
                //     minutes += result[index] - task.max;
                //     result[index] = task.max;
                // }
            })
            remaindDist = [];
            // 残ったものの分配
            if (this.hasExtendable()) {
                this.tasks.forEach(task => {
                    if (task.isExtendable) {
                        remaindDist.push(task.min);
                    } else {
                        remaindDist.push(0);
                    }
                })
                remaindDist = this.distributeArrByRatio(minutes, remaindDist);
            } else {
                if (this.hasRequired()) {
                    this.tasks.forEach(task => {
                        if (task.isExtendable) {
                            remaindDist.push(task.min);
                        } else {
                            remaindDist.push(0);
                        }
                    })
                    remaindDist = this.distributeArrByRatio(minutes, remaindDist);
                } else {
                    remaindDist = this.distributeArrByRatio(minutes, minMinutesList);
                }
            }
            result = this.addEveryElem(result, remaindDist);

        // 最小時間の分配も不可能な場合
        } else {
            // isRequred === trueだけに分配
            let remaindDist: number[] = [];
            this.tasks.forEach(task => {
                if (!task.isRequired) {
                    remaindDist.push(0);
                } else {
                    remaindDist.push(task.min);
                }
            })
            // 稼働可能時間を超えなければ残りをminの比で分配
            if (this.listSum(remaindDist) <= this.activeTime) {
                result = [...remaindDist];
                minutes -= this.listSum(result);
                remaindDist = [];
                this.tasks.forEach(task => {
                    if (!task.isRequired) {
                        remaindDist.push(task.min);
                    } else {
                        remaindDist.push(0);
                    }
                })
                remaindDist = this.distributeArrByRatio(minutes, remaindDist);
                result =  this.addEveryElem(result, remaindDist);
            // それでも稼働可能時間を超える場合はすべてをminの比で分配
            } else {
                result = this.distributeArrByRatio(this.activeTime, minMinutesList);
            }
        }
        return result;
    }
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////






    //////////////////////////////////////////////////////////////////////////////
    // allocator
    //////////////////////////////////////////////////////////////////////////////
    // 理想的な時間配分に対して実際の時間配分のずれを計算する関数
    distanceFromIdeal(ideal: Array<number>, actual: Array<number>): number {
        let result = 0;
        ideal.forEach((idealVal, index) => {
            let actualVal = actual[index];
            result += Math.abs(actualVal - idealVal);
        })
        return result;
    }

    // 実際に時間を割り当てる関数
    allocateTasks(schedulingByOrder: boolean): Array<[Time, Time, number]> {
        let result: Array<[Time, Time, number]>;
        // 分単位の割り当てを決定
        const minutesAllocation: number[] = this.descideMinAllocation();


        // 時刻の割り当て
        const allocationPatterns: Array< [Array<[Time, Time, number]>, number] > = [];  // 各要素は[割り当て時刻と対応するタスクインデックス(休憩は-1), 理想値とのずれ]となっている
        // 順番通りに割り当てる場合
        if (schedulingByOrder) {
            // 順番配列の作成
            let order: number[] = [];
            for (let i=0; i<this.tasks.length; i++) {
                order.push(-1);
            }
            this.tasks.forEach((task, index) => {
                order[task.order] = index;
            })
            // 割り当てと結果の格納
            let allocationResult: [Array<[Time, Time, number]>, number[]] = this.descideTimeAllocation(minutesAllocation, order);
            result = allocationResult[0];
            return result;


        // 順番が指定されていない場合
        } else {
            this.getOrderPattern(100).forEach(order => {
                let allocationResult: [Array<[Time, Time, number]>, number[]] = this.descideTimeAllocation(minutesAllocation, order);
                allocationPatterns.push([allocationResult[0], this.distanceFromIdeal(minutesAllocation, allocationResult[1])]);
            })

            result = allocationPatterns[0][0];
            let minDistance = allocationPatterns[0][1];
            allocationPatterns.forEach(allocationPattern => {
                if (minDistance > allocationPattern[1]) {
                    minDistance = allocationPattern[1];
                    result = allocationPattern[0];
                }
            })
            return result;
        }
    }
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////
}