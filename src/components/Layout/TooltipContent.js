import { ouIdHelper } from '@dhis2/analytics'
import i18n from '@dhis2/d2-i18n'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { sGetMetadata } from '../../reducers/metadata.js'
import { sGetUiItemsByDimension } from '../../reducers/ui.js'
import styles from './styles/Tooltip.module.css'

const labels = {
    noneSelected: () => i18n.t('None selected'),
    onlyOneInUse: (name) => i18n.t("Only '{{- name}}' in use", { name }),
    onlyLimitedNumberInUse: (number) =>
        i18n.t("Only '{{number}}' in use", { number }),
    allItems: () => i18n.t('All items are selected'),
}

export const TooltipContent = ({ dimension, itemIds, metadata }) => {
    const getNameList = (idList, label, metadata) =>
        idList.reduce(
            (levelString, levelId, index) =>
                `${levelString}${index > 0 ? `, ` : ``}${
                    metadata[levelId] ? metadata[levelId].name : levelId
                }`,
            `${label}: `
        )

    const getItemDisplayNames = () => {
        const levelIds = []
        const groupIds = []
        const itemDisplayNames = []

        itemIds.forEach((id) => {
            if (ouIdHelper.hasLevelPrefix(id)) {
                levelIds.push(ouIdHelper.removePrefix(id))
            } else if (ouIdHelper.hasGroupPrefix(id)) {
                groupIds.push(ouIdHelper.removePrefix(id))
            } else {
                itemDisplayNames.push(metadata[id] ? metadata[id].name : id)
            }
        })

        levelIds.length &&
            itemDisplayNames.push(
                getNameList(levelIds, i18n.t('Levels'), metadata)
            )

        groupIds.length &&
            itemDisplayNames.push(
                getNameList(groupIds, i18n.t('Groups'), metadata)
            )

        return itemDisplayNames
    }

    const renderItems = (itemDisplayNames) => {
        const renderLimit = 5

        const itemsToRender = itemDisplayNames
            .slice(0, renderLimit)
            .map((name) => (
                <li key={`${dimension.id}-${name}`} className={styles.item}>
                    {name}
                </li>
            ))

        if (itemDisplayNames.length > renderLimit) {
            itemsToRender.push(
                <li
                    key={`${dimension.id}-render-limit`}
                    className={styles.item}
                >
                    {itemDisplayNames.length - renderLimit === 1
                        ? i18n.t('And 1 other...')
                        : i18n.t('And {{numberOfItems}} others...', {
                              numberOfItems:
                                  itemDisplayNames.length - renderLimit,
                          })}
                </li>
            )
        }

        return itemsToRender
    }

    const renderNoItemsLabel = () => (
        <li
            key={`${dimension.id}-${labels.noneSelected()}`}
            className={styles.item}
        >
            {labels.noneSelected()}
        </li>
    )

    const itemDisplayNames = Boolean(itemIds.length) && getItemDisplayNames()
    const hasNoItemsLabel = !itemDisplayNames.length

    return (
        <ul className={styles.list}>
            {itemDisplayNames && renderItems(itemDisplayNames)}
            {hasNoItemsLabel && renderNoItemsLabel()}
        </ul>
    )
}

TooltipContent.propTypes = {
    dimension: PropTypes.object.isRequired,
    metadata: PropTypes.object.isRequired,
    itemIds: PropTypes.array,
}

const mapStateToProps = (state, ownProps) => ({
    metadata: sGetMetadata(state),
    itemIds: sGetUiItemsByDimension(state, ownProps.dimension.id) || [],
})

export default connect(mapStateToProps)(TooltipContent)
