import i18n from '@dhis2/d2-i18n'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import React from 'react'
import { TIME_DIMENSIONS } from '../../modules/layout.js'
import { useTimeDimensions } from '../../reducers/ui.js'
import { DraggableDimensionItem } from './DimensionItem/index.js'
import { MainSidebarSection } from './MainSidebarSection.js'
import { useSelectedDimensions } from './SelectedDimensionsContext.js'

export const TimeDimensions = () => {
    const timeDimensions = useTimeDimensions()
    const { getIsDimensionSelected } = useSelectedDimensions()

    if (!timeDimensions) {
        return null
    }

    const draggableDimensions = timeDimensions.map((dimension) => ({
        draggableId: `time-${dimension.id}`,
        ...dimension,
    }))

    return (
        <MainSidebarSection header={i18n.t('Time dimensions')}>
            <SortableContext
                id={TIME_DIMENSIONS}
                items={draggableDimensions.map((dim) => dim.draggableId)}
                strategy={verticalListSortingStrategy}
            >
                {draggableDimensions.map((dimension) => (
                    <DraggableDimensionItem
                        key={dimension.id}
                        {...dimension}
                        selected={getIsDimensionSelected(dimension.id)}
                    />
                ))}
            </SortableContext>
        </MainSidebarSection>
    )
}
