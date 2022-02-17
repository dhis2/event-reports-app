import i18n from '@dhis2/d2-i18n'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import React from 'react'
import { MAIN_DIMENSIONS } from '../../modules/layout.js'
import { useMainDimensions } from '../../reducers/ui.js'
import { DraggableDimensionItem } from './DimensionItem/index.js'
import { MainSidebarSection } from './MainSidebarSection.js'
import { useSelectedDimensions } from './SelectedDimensionsContext.js'

export const MainDimensions = () => {
    const mainDimensions = useMainDimensions()
    const { getIsDimensionSelected } = useSelectedDimensions()

    const draggableDimensions = mainDimensions.map((dimension) => ({
        draggableId: `main-${dimension.id}`,
        ...dimension,
    }))

    return (
        <MainSidebarSection header={i18n.t('Main dimensions')}>
            <SortableContext
                id={MAIN_DIMENSIONS}
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
