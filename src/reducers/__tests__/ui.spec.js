import reducer, { DEFAULT_UI, SET_UI_REPETITION } from '../ui.js'

describe('reducer: ui', () => {
    it('returns the default state when no matching action', () => {
        const actualState = reducer(DEFAULT_UI, { type: 'NO_MATCH' })

        expect(actualState).toEqual(DEFAULT_UI)
    })

    // repetition
    describe('reducer: ui.repetition', () => {
        const getTestRepetition = () => ({
            mostRecent: 2,
            oldest: 1,
        })

        it('adds repetition by dimension id', () => {
            const actualState = reducer(
                {},
                {
                    type: SET_UI_REPETITION,
                    value: {
                        dimensionId: 'abc',
                        repetition: getTestRepetition(),
                    },
                }
            )

            const expectedState = {
                repetitionByDimension: {
                    abc: getTestRepetition(),
                },
            }

            expect(actualState).toEqual(expectedState)
        })

        it('overrides existing repetitions by dimension id', () => {
            const updatedRepetition = {
                ...getTestRepetition(),
                mostRecent: 3,
            }

            const initialState = {
                repetitionByDimension: {
                    abc: getTestRepetition(),
                },
            }

            const actualState = reducer(initialState, {
                type: SET_UI_REPETITION,
                value: {
                    dimensionId: 'abc',
                    repetition: updatedRepetition,
                },
            })

            const expectedState = {
                repetitionByDimension: {
                    abc: updatedRepetition,
                },
            }

            expect(actualState).toEqual(expectedState)
        })
    })
})
