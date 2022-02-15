import i18n from '@dhis2/d2-i18n'
import {
    useSortable,
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import PropTypes from 'prop-types'
import React from 'react'
import { SOURCE_DIMENSIONS } from '../../modules/layout.js'
import { useTimeDimensions } from '../../reducers/ui.js'
import { DimensionItem } from './DimensionItem/index.js'
import { MainSidebarSection } from './MainSidebarSection.js'
import { useSelectedDimensions } from './SelectedDimensionsContext.js'

const DraggableDimensionItem = (props) => {
    const {
        attributes,
        listeners,
        isSorting,
        setNodeRef,
        transform,
        transition,
    } = useSortable({
        id: props.id,
    })

    if (props.disabled || props.selected) {
        return <>{props.children}</>
    }

    const style = transform
        ? {
              transform: isSorting
                  ? undefined
                  : CSS.Translate.toString({
                        x: transform.x,
                        y: transform.y,
                        scaleX: 1,
                        scaleY: 1,
                    }),
              transition,
          }
        : undefined
    return (
        <div {...attributes} {...listeners} ref={setNodeRef} style={style}>
            {props.children}
        </div>
    )
}

DraggableDimensionItem.propTypes = {
    children: PropTypes.node,
    disabled: PropTypes.bool,
    id: PropTypes.string,
    selected: PropTypes.bool,
}

export const TimeDimensions = () => {
    const timeDimensions = useTimeDimensions()
    const { getIsDimensionSelected } = useSelectedDimensions()

    if (!timeDimensions) {
        return null
    }

    return (
        <MainSidebarSection header={i18n.t('Time dimensions')}>
            <SortableContext
                id={SOURCE_DIMENSIONS}
                items={timeDimensions}
                strategy={verticalListSortingStrategy}
            >
                {timeDimensions.map((dimension) => (
                    <DraggableDimensionItem
                        key={dimension.id}
                        {...dimension}
                        selected={getIsDimensionSelected(dimension.id)}
                    >
                        <DimensionItem
                            {...dimension}
                            selected={getIsDimensionSelected(dimension.id)}
                        />
                    </DraggableDimensionItem>
                ))}
            </SortableContext>
        </MainSidebarSection>
    )
}
