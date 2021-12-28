import {
    getDefaultUiRepetition,
    getDefaultCurrentRepetition,
    parseCurrentRepetition,
    parseUiRepetition,
} from '../ui.js'

describe('parseCurrentRepetition', () => {
    it('converts from current to ui format', () => {
        const defaultUiRepetition = getDefaultUiRepetition()
        const defaultCurrentRepetition = getDefaultCurrentRepetition()

        expect(parseCurrentRepetition([])).toEqual(defaultUiRepetition)

        expect(parseCurrentRepetition(defaultCurrentRepetition)).toEqual(
            defaultUiRepetition
        )

        expect(parseCurrentRepetition([1])).toEqual({
            mostRecent: 0,
            oldest: 1,
        })

        expect(parseCurrentRepetition([0, 1])).toEqual({
            mostRecent: 1,
            oldest: 1,
        })

        expect(parseCurrentRepetition([0, -1])).toEqual({
            mostRecent: 2,
            oldest: 0,
        })

        expect(parseCurrentRepetition([-1, 0, 1])).toEqual({
            mostRecent: 2,
            oldest: 1,
        })

        expect(parseCurrentRepetition([0, 1, 2])).toEqual({
            mostRecent: 1,
            oldest: 2,
        })

        expect(parseCurrentRepetition([1, 2, -1, 0])).toEqual({
            mostRecent: 2,
            oldest: 2,
        })
    })
})

describe('parseUiRepetition', () => {
    it('converts from ui to current format', () => {
        const defaultUiRepetition = getDefaultUiRepetition()
        const defaultCurrentRepetition = getDefaultCurrentRepetition()

        const invalidUiRepetition = {
            mostRecent: 0,
            oldest: 0,
        }

        expect(parseUiRepetition(invalidUiRepetition)).toEqual(
            defaultCurrentRepetition
        )

        expect(parseUiRepetition(defaultUiRepetition)).toEqual(
            defaultCurrentRepetition
        )

        expect(
            parseUiRepetition({
                mostRecent: 0,
                oldest: 1,
            })
        ).toEqual([1])

        expect(
            parseUiRepetition({
                mostRecent: 1,
                oldest: 1,
            })
        ).toEqual([1, 0])

        expect(
            parseUiRepetition({
                mostRecent: 2,
                oldest: 0,
            })
        ).toEqual([-1, 0])

        expect(
            parseUiRepetition({
                mostRecent: 2,
                oldest: 1,
            })
        ).toEqual([1, -1, 0])

        expect(
            parseUiRepetition({
                mostRecent: 1,
                oldest: 2,
            })
        ).toEqual([1, 2, 0])

        expect(
            parseUiRepetition({
                mostRecent: 2,
                oldest: 2,
            })
        ).toEqual([1, 2, -1, 0])
    })
})
