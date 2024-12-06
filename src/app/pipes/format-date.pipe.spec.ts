import { FormatDatePipe } from "./format-date.pipe";

describe('FormatDayPipe', () => {
    let pipe: FormatDatePipe;

    beforeEach(() => {
        pipe = new FormatDatePipe();
    });

    it('should display Sun if date is 2024-12-15', () => {        
        let val = pipe.transform('2024-12-15');
        expect(val).toEqual('Sun');
    });

    it('should return the input value with invalid input', () => {
         let val = pipe.transform('Main Stage');
         expect(val).toEqual('Main Stage');
    });
});
