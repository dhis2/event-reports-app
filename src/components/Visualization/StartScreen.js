import { VisTypeIcon, VIS_TYPE_LINE_LIST } from '@dhis2/analytics'
import { useDataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import { colors } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { GenericError } from '../../assets/ErrorIcons.js'
import { EVENT_TYPE } from '../../modules/dataStatistics.js'
import { VisualizationError, genericErrorTitle } from '../../modules/error.js'
import history from '../../modules/history.js'
import { sGetLoadError } from '../../reducers/loader.js'
import { sGetUsername } from '../../reducers/user.js'
import styles from './styles/StartScreen.module.css'

const mostViewedQuery = {
    mostViewed: {
        resource: 'dataStatistics/favorites',
        params: ({ username }) => ({
            eventType: EVENT_TYPE,
            pageSize: 6,
            ...(username ? { username } : {}),
        }),
    },
}

const visualizationsQuery = {
    visualizations: {
        resource: 'eventVisualizations',
        params: ({ ids }) => ({
            filter: `id:in:[${ids.join(',')}]`,
            fields: ['id', 'displayName~rename(name)', 'type'],
        }),
    },
}

const useMostViewedVisualizations = (username) => {
    const visualizations = useDataQuery(visualizationsQuery, {
        lazy: true,
    })

    const mostViewed = useDataQuery(mostViewedQuery, {
        variables: { username },
        onComplete: (data) => {
            visualizations.refetch({
                ids: data.mostViewed.map((obj) => obj.id),
            })
        },
    })

    return {
        mostViewed: visualizations.data
            ? visualizations.data.visualizations.eventVisualizations
            : undefined,
        loading: mostViewed.loading || visualizations.loading,
        fetching: mostViewed.fetching || visualizations.fetching,
        error: mostViewed.error || visualizations.error,
    }
}

const StartScreen = ({ error, username }) => {
    const data = useMostViewedVisualizations(username)

    const getContent = () =>
        error ? (
            getErrorContent()
        ) : (
            <div data-test="start-screen">
                <div className={styles.section}>
                    <h3
                        className={styles.title}
                        data-test="start-screen-primary-section-title"
                    >
                        {i18n.t('Getting started')}
                    </h3>
                    <ul className={styles.guide}>
                        <li className={styles.guideItem}>
                            {i18n.t(
                                'All dimensions that you can use to build visualizations are shown in the sections in the left sidebar.'
                            )}
                        </li>
                        <li className={styles.guideItem}>
                            {i18n.t('Add dimensions to the layout above.')}
                        </li>
                        <li className={styles.guideItem}>
                            {i18n.t(
                                'Click a dimension to add or remove conditions.'
                            )}
                        </li>
                    </ul>
                </div>
                {/* TODO add a spinner when loading?! */}
                {data?.mostViewed?.length > 0 && (
                    <div className={styles.section}>
                        <h3
                            className={styles.title}
                            data-test="start-screen-secondary-section-title"
                        >
                            {i18n.t('Your most viewed event reports')}
                        </h3>
                        {data.mostViewed
                            .filter((vis) => vis.type === VIS_TYPE_LINE_LIST)
                            .map((vis, index) => (
                                <p
                                    key={index}
                                    className={styles.visualization}
                                    onClick={() => history.push(`/${vis.id}`)}
                                    data-test="start-screen-most-viewed-list-item"
                                >
                                    <span className={styles.visIcon}>
                                        <VisTypeIcon
                                            type={vis.type}
                                            useSmall
                                            color={colors.grey600}
                                        />
                                    </span>
                                    <span>{vis.name}</span>
                                </p>
                            ))}
                    </div>
                )}
            </div>
        )

    const getErrorContent = () => (
        <div
            className={styles.errorContainer}
            data-test="start-screen-error-container"
        >
            {error instanceof VisualizationError ? (
                <>
                    <div className={styles.errorIcon}>{error.icon()}</div>
                    <p className={styles.errorTitle}>{error.title}</p>
                    <p className={styles.errorDescription}>
                        {error.description}
                    </p>
                </>
            ) : (
                <>
                    <div className={styles.errorIcon}>{GenericError()}</div>
                    <p className={styles.errorTitle}>{genericErrorTitle}</p>
                    <p className={styles.errorDescription}>
                        {error.message || error}
                    </p>
                </>
            )}
        </div>
    )

    return (
        <div className={styles.outer}>
            <div className={styles.inner}>{getContent()}</div>
        </div>
    )
}

StartScreen.propTypes = {
    error: PropTypes.object,
    username: PropTypes.string,
}

const mapStateToProps = (state) => ({
    error: sGetLoadError(state),
    username: sGetUsername(state),
})

export default connect(mapStateToProps)(StartScreen)
