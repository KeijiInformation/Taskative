export default class Time {
    hours:   number;
    minutes: number;
    basis: Time | undefined;
    setFlag: boolean = false;
    constructor(hours?: number, minutes?: number, basis?: Time) {
        if (hours !== undefined && minutes !== undefined) {
            this.hours   = hours;
            this.minutes = minutes;
            this.setFlag = true;
        } else {
            this.hours   = -1;
            this.minutes = -1;
        }
        this.basis = basis;
    }

    ////////////////////////////////////////////////////////
    // set
    ////////////////////////////////////////////////////////
    isSet(): boolean {
        return this.setFlag;
    }
    set(hours: number, minutes: number, basis: Time): void {
        this.hours   = hours;
        this.minutes = minutes;
        this.basis   = basis.copy();
        this.setFlag = true;
    }
    setFromNow() {
        const date: Date = new Date();
        this.hours       = date.getHours();
        this.minutes     = date.getMinutes();
        this.setFlag     = true;
    }
    ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////
    // get
    ////////////////////////////////////////////////////////
    getTimeStr(): string {
        return `${this.getHoursStr()}:${this.getMinStr()}`
    }
    getHoursStr(): string {
        if (String(this.hours).length === 1) {
            return `0${this.hours}`;
        } else {
            return String(this.hours);
        }
    }
    getMinStr(): string {
        if (String(this.minutes).length === 1) {
            return `0${this.minutes}`;
        } else {
            return String(this.minutes);
        }
    }
    getValueAsMin(): number {
        return 60*this.hours + this.minutes;
    }
    getTimeValue(): Time {
        if (this.basis) {
            let hours: number = this.hours - this.basis.hours;
            if (hours < 0) {
                hours += 24;
            }
            let minutes: number = this.minutes - this.basis.minutes;
            if (minutes < 0) {
                hours --;
                minutes += 60;
                if (hours < 0) {
                    hours += 24;
                }
            }
            return new Time(hours, minutes, this.basis);
        } else {
            return new Time();
        }
    }
    copy(): Time {
        const copy: Time = new Time(this.hours, this.minutes, this.basis);
        copy.setFlag = this.setFlag;
        return copy;
    }
    ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////
    // calc
    ////////////////////////////////////////////////////////
    add(minutes: number) {
        this.minutes += minutes;
        while (this.minutes >= 60) {
            this.hours ++;
            if (this.hours >= 24) {
                this.hours = 0;
            }
            this.minutes -= 60;
        }
        while (this.minutes < 0) {
            this.hours --;
            if (this.hours < 0) {
                this.hours = 23;
            }
            this.minutes += 60;
        }
        return this;
    }
    differFrom(time: Time): Time {
        const fromTimeVal: Time = time.getTimeValue();
        const toTimeVal:   Time = this.getTimeValue();
        let hours: number = toTimeVal.hours - fromTimeVal.hours;
        let minutes: number = toTimeVal.minutes - fromTimeVal.minutes;
        if (hours < 0 && minutes > 0) {
            hours ++;
            minutes -= 60;
        } else if (hours >= 0 && minutes < 0) {
            hours --;
            minutes += 60;
        }
        return new Time(hours, minutes, this.basis);
    }
    // 時間をきりの良い数値に切り捨てる関数
    // 戻り値＝切り捨てた分の数値( <= 0)
    floorToJustTime(timeStep: number): number {
        let result = 0;
        while (this.minutes % timeStep !== 0) {
            this.minutes--;
            result--;
        }
        return result;
    }
    // 時間をきりの良い数値に切り上げる関数
    // 戻り値＝きり上げた分の数値( >= 0)
    ceilToJustTime(timeStep: number): number {
        let result = 0;
        while (this.minutes % timeStep !== 0) {
            this.minutes++;
            result++;
        }
        if (this.minutes === 60) {
            this.minutes = 0;
            this.hours++;
            if (this.hours === 24) {
                this.hours = 0;
            }
        }
        return result;
    }
    ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////






    ////////////////////////////////////////////////////////
    // bool
    ////////////////////////////////////////////////////////
    compareTo(time: Time): 1 | 0 | -1 {
        const difference: Time = this.differFrom(time);
        // console.log(`${difference.getTimeStr()}->${difference.getValueAsMin()}`)
        if (difference.getValueAsMin() > 0) {
            return 1;
        } else if (difference.getValueAsMin() < 0) {
            return -1;
        } else {
            return 0;
        }
    }
    isJust(timeStep: number): boolean {
        return this.minutes % timeStep === 0;
    }
    ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////
}