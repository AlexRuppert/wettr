import * as time from "../../../src/logic/time"

// @ponicode
describe("time.getSunriseSunset", () => {
    test("0", () => {
        let param1: any = new Date("32-01-2020")
        let callFunction: any = () => {
            time.getSunriseSunset(param1, 380, 1)
        }
    
        expect(callFunction).toThrow('Invalid time value')
    })

    test("1", () => {
        let param1: any = new Date("01-01-2020")
        let result: any = time.getSunriseSunset(param1, 30, 410)
        expect(result).toEqual({ sunrise: new Date("2019-12-30T03:36:15.951Z"), sunset: new Date("2019-12-30T13:50:15.068Z") })
    })
})
