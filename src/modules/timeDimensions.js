import { DIMENSION_ID_PERIOD } from '@dhis2/analytics'

export const TIME_DIMENSION_EVENT_DATE = 'eventDate'
export const TIME_DIMENSION_ENROLLMENT_DATE = 'enrollmentDate'
export const TIME_DIMENSION_INCIDENT_DATE = 'incidentDate'
export const TIME_DIMENSION_SCHEDULED_DATE = 'scheduledDate'
export const TIME_DIMENSION_LAST_UPDATED = 'lastUpdated'

export const timeDimensions = {
    [TIME_DIMENSION_EVENT_DATE]: {
        id: TIME_DIMENSION_EVENT_DATE,
        dimensionType: DIMENSION_ID_PERIOD,
        defaultName: 'Date of registration',
        programOrStage: 'stage',
        nameProperty: 'displayExecutionDateLabel',
    },
    [TIME_DIMENSION_ENROLLMENT_DATE]: {
        id: TIME_DIMENSION_ENROLLMENT_DATE,
        dimensionType: DIMENSION_ID_PERIOD,
        defaultName: 'Tracking date',
        programOrStage: 'program',
        nameProperty: 'displayEnrollmentDateLabel',
    },
    [TIME_DIMENSION_INCIDENT_DATE]: {
        id: TIME_DIMENSION_INCIDENT_DATE,
        dimensionType: DIMENSION_ID_PERIOD,
        defaultName: 'Test date',
        programOrStage: 'program',
        nameProperty: 'displayIncidentDateLabel',
        // condition: 'displayIncidentDate'
    },
    [TIME_DIMENSION_SCHEDULED_DATE]: {
        id: TIME_DIMENSION_SCHEDULED_DATE,
        dimensionType: DIMENSION_ID_PERIOD,
        defaultName: 'Due/Scheduled date',
        programOrStage: 'stage',
        nameProperty: 'displayDueDateLabel',
        // condition: 'hideDueDate'
    },
    [TIME_DIMENSION_LAST_UPDATED]: {
        id: TIME_DIMENSION_LAST_UPDATED,
        dimensionType: DIMENSION_ID_PERIOD,
        defaultName: 'Last updated on',
    },
}
