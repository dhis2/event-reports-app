import {
    getDefaultUiRepetition,
    getDefaultCurrentRepetition,
    parseCurrentRepetition,
    parseUiRepetition,
} from '../ui.js'

describe('parseCurrentRepetition', () => {
    const defaultUiRepetition = getDefaultUiRepetition()
    const defaultCurrentRepetition = getDefaultCurrentRepetition()

    it('does not modify the input', () => {
        parseCurrentRepetition(defaultCurrentRepetition)

        expect(defaultCurrentRepetition).toEqual(getDefaultCurrentRepetition())
    })

    it('converts from current to ui format', () => {
        // invalid
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
    const defaultUiRepetition = getDefaultUiRepetition()
    const defaultCurrentRepetition = getDefaultCurrentRepetition()

    it('does not modify the input', () => {
        parseUiRepetition(defaultUiRepetition)

        expect(defaultUiRepetition).toEqual(getDefaultUiRepetition())
    })

    it('converts from ui to current format', () => {
        // invalid
        expect(
            parseUiRepetition({
                mostRecent: 0,
                oldest: 0,
            })
        ).toEqual(defaultCurrentRepetition)

        // invalid
        expect(
            parseUiRepetition({
                mostRecent: -1,
                oldest: 1,
            })
        ).toEqual(defaultCurrentRepetition)

        // invalid
        expect(
            parseUiRepetition({
                mostRecent: 1,
                oldest: -1,
            })
        ).toEqual(defaultCurrentRepetition)

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
