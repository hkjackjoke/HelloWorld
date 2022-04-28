import { differenceInYears, addYears, differenceInMonths, addMonths, differenceInDays, differenceInWeeks} from 'date-fns';

export class DateAge {
    public years: number;
    public weeks: number;
    public months: number;
    public days: number;
    public constructor(dob: Date, endDate = new Date()) {
        const a = endDate;
        let b = new Date(dob);
        this.years = differenceInYears(a, b);
        this.weeks = differenceInWeeks(a, b);
        b = addYears(b, this.years);
        this.months  = differenceInMonths(a, b);
        b = addMonths(b, this.months);
        this.days = differenceInDays(a, b);
    }
}
