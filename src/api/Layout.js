import isArray from 'd2-utilizr/lib/isArray';
import isBoolean from 'd2-utilizr/lib/isBoolean';
import isEmpty from 'd2-utilizr/lib/isEmpty';
import isNumber from 'd2-utilizr/lib/isNumber';
import isNumeric from 'd2-utilizr/lib/isNumeric';
import isObject from 'd2-utilizr/lib/isObject';
import isString from 'd2-utilizr/lib/isString';

import { Record, Layout as d2aLayout } from 'd2-analysis';

export var Layout = function(refs, c, applyConfig, forceApplyConfig) {
    var t = this;

    c = isObject(c) ? c : {};

    // TMP: remove 'dy' dimension
    isArray(c.columns) && (c.columns = c.columns.filter(dim => dim.dimension !== 'dy'));
    isArray(c.rows) && (c.rows = c.rows.filter(dim => dim.dimension !== 'dy'));

    // inherit
    Object.assign(t, new d2aLayout(refs, c, applyConfig));

    // program
    t.program = isObject(c.program) ? c.program : null;
    t.programStage = isObject(c.programStage) ? c.programStage : null;

    // data type
    t.dataType = isString(c.dataType) ? c.dataType : refs.dimensionConfig.getDefaultDataType();

    // options
    t.showColTotals = isBoolean(c.colTotals)
        ? c.colTotals
        : isBoolean(c.showColTotals) ? c.showColTotals : true;
    t.showRowTotals = isBoolean(c.rowTotals)
        ? c.rowTotals
        : isBoolean(c.showRowTotals) ? c.showRowTotals : true;
    t.showColSubTotals = isBoolean(c.colSubTotals)
        ? c.colSubTotals
        : isBoolean(c.showColSubTotals) ? c.showColSubTotals : true;
    t.showRowSubTotals = isBoolean(c.rowSubTotals)
        ? c.rowSubTotals
        : isBoolean(c.showRowSubTotals) ? c.showRowSubTotals : true;
    t.showDimensionLabels = isBoolean(c.showDimensionLabels)
        ? c.showDimensionLabels
        : isBoolean(c.showDimensionLabels) ? c.showDimensionLabels : true;
    t.showDataItemPrefix = isBoolean(c.showDataItemPrefix)
        ? c.showDataItemPrefix
        : isBoolean(c.showDataItemPrefix) ? c.showDataItemPrefix : true;
    t.hideEmptyRows = isBoolean(c.hideEmptyRows) ? c.hideEmptyRows : false;
    t.hideNaData = isBoolean(c.hideNaData) ? c.hideNaData : false;
    t.collapseDataDimensions = isBoolean(c.collapseDataDimensions)
        ? c.collapseDataDimensions
        : false;
    t.outputType = isString(c.outputType)
        ? c.outputType
        : refs.optionConfig.getOutputType('event').id;
    t.programStatus = isString(c.programStatus)
        ? c.programStatus
        : refs.optionConfig.getProgramStatus('def').id;
    t.eventStatus = isString(c.eventStatus)
        ? c.eventStatus
        : refs.optionConfig.getEventStatus('def').id;

    t.topLimit = isNumeric(c.topLimit) ? c.topLimit : 0;
    t.sortOrder = isNumber(c.sortOrder) ? c.sortOrder : 0;

    t.completedOnly = isBoolean(c.completedOnly) ? c.completedOnly : false;
    t.showHierarchy = isBoolean(c.showHierarchy) ? c.showHierarchy : false;

    t.displayDensity =
        isString(c.displayDensity) && !isEmpty(c.displayDensity)
            ? c.displayDensity
            : refs.optionConfig.getDisplayDensity('normal').id;
    t.fontSize =
        isString(c.fontSize) && !isEmpty(c.fontSize)
            ? c.fontSize
            : refs.optionConfig.getFontSize('normal').id;
    t.digitGroupSeparator =
        isString(c.digitGroupSeparator) && !isEmpty(c.digitGroupSeparator)
            ? c.digitGroupSeparator
            : refs.optionConfig.getDigitGroupSeparator('space').id;
    t.legendSet = isObject(c.legendSet) ? c.legendSet : null;

    // value, aggregation type
    if (isObject(c.value) && isString(c.value.id)) {
        t.value = c.value;

        if (isString(c.aggregationType)) {
            t.aggregationType = c.aggregationType;
        }
    }

    // timeField
    if (isString(c.timeField)) {
        t.timeField = c.timeField;
    }

    // orgUnitField
    if (isString(c.orgUnitField)) {
        t.orgUnitField = c.orgUnitField;
    }

    // paging
    if (isObject(c.paging) && isNumeric(c.paging.pageSize) && isNumeric(c.paging.page)) {
        t.paging = c.paging;
    }

    // graph map
    t.parentGraphMap = isObject(c.parentGraphMap) ? c.parentGraphMap : null;

    // report table
    t.reportingPeriod =
        isObject(c.reportParams) && isBoolean(c.reportParams.paramReportingPeriod)
            ? c.reportParams.paramReportingPeriod
            : isBoolean(c.reportingPeriod) ? c.reportingPeriod : false;
    t.organisationUnit =
        isObject(c.reportParams) && isBoolean(c.reportParams.paramOrganisationUnit)
            ? c.reportParams.paramOrganisationUnit
            : isBoolean(c.organisationUnit) ? c.organisationUnit : false;
    t.parentOrganisationUnit =
        isObject(c.reportParams) && isBoolean(c.reportParams.paramParentOrganisationUnit)
            ? c.reportParams.paramParentOrganisationUnit
            : isBoolean(c.parentOrganisationUnit) ? c.parentOrganisationUnit : false;

    // data element dimensions
    if (c.dataElementDimensions) {
        t.dataElementDimensions = c.dataElementDimensions;
    }

    // force apply
    Object.assign(t, forceApplyConfig);

    t.getRefs = function() {
        return refs;
    };
};

Layout.prototype = d2aLayout.prototype;

Layout.prototype.val = function() {
    var t = this;

    return t.program && t.programStage && (t.columns || t.rows) ? this : null;
};

Layout.prototype.clone = function() {
    var t = this,
        refs = this.getRefs();

    var { Layout } = refs.api;

    var layout = new Layout(refs, JSON.parse(JSON.stringify(t)));

    layout.setResponse(t.getResponse());
    layout.setAccess(t.getAccess());
    layout.setDataDimensionItems(t.getDataDimensionItems());

    return layout;
};

Layout.prototype.toPost = function() {
    var t = this,
        refs = t.getRefs();

    var optionConfig = refs.optionConfig;

    t.toPostSuper();

    if (t.programStatus === optionConfig.getProgramStatus('def').id) {
        delete t.programStatus;
    }

    if (t.eventStatus === optionConfig.getEventStatus('def').id) {
        delete t.eventStatus;
    }
};

Layout.prototype.getDataTypeUrl = function() {
    var t = this,
        refs = t.getRefs();

    var { dimensionConfig, optionConfig } = refs;

    var DATA_TYPE_AGG = dimensionConfig.dataType['aggregated_values'];
    var DATA_TYPE_EVENT = dimensionConfig.dataType['individual_cases'];
    var OUTPUT_TYPE_EVENT = optionConfig.getOutputType('event').id;
    var OUTPUT_TYPE_ENROLLMENT = optionConfig.getOutputType('enrollment').id;

    var url = this.dataType === DATA_TYPE_AGG ? '/events/aggregate' :
              this.outputType === OUTPUT_TYPE_EVENT ? '/events/query' :
              '/enrollments/query';

    return url || dimensionConfig.dataTypeUrl[dimensionConfig.getDefaultDataType()] || '';
};

Layout.prototype.getDefaultSortParam = function() {
    var t = this,
        refs = t.getRefs();

    var { optionConfig } = refs;

    var OUTPUT_TYPE_EVENT = optionConfig.getOutputType('event').id;
    var OUTPUT_TYPE_ENROLLMENT = optionConfig.getOutputType('enrollment').id;

    return 'desc=' + (this.outputType === OUTPUT_TYPE_EVENT ?
        'eventdate' : this.outputType === OUTPUT_TYPE_ENROLLMENT ?
        'enrollmentdate' : ''
    );
}

Layout.prototype.getProgramUrl = function() {
    return isObject(this.program) ? '/' + this.program.id : '';
};

Layout.prototype.getDataElementName = function(dataElementId) {
    return isArray(this.dataElementDimensions) ?
        this.dataElementDimensions.find(obj => obj.dataElement.id === dataElementId).dataElement.name : null;
}

// dep 1

Layout.prototype.req = function(source, format, isSorted, isTableLayout, isFilterAsDimension) {
    var t = this,
        refs = this.getRefs();

    var { Request } = refs.api;

    var { optionConfig, appManager, instanceManager, dimensionConfig } = refs;

    var request = new Request(refs);

    var defAggTypeId = optionConfig.getAggregationType('def').id,
        displayProperty = this.displayProperty || appManager.getAnalyticsDisplayProperty();

    var src =
        source || instanceManager.analyticsEndpoint + this.getDataTypeUrl() + this.getProgramUrl();

    var isPivotTable = t.dataType === dimensionConfig.dataType['aggregated_values'];
    var isLineList = t.dataType === dimensionConfig.dataType['individual_cases'];

    // dimensions
    this.getDimensions(false, isSorted).forEach(function(dimension) {
        request.add(dimension.url(isSorted));
    });

    // filters
    if (this.filters) {
        this.filters.forEach(function(dimension) {
            var isFilter = !(isFilterAsDimension && dimension.isRequired());

            request.add(dimension.url(isSorted, null, isFilter));
        });
    }

    // stage
    if (isObject(this.programStage)) {
        request.add('stage=' + this.programStage.id);
    }

    // dates
    if (isString(this.startDate) && isString(this.endDate)) {
        request.add('startDate=' + this.startDate);
        request.add('endDate=' + this.endDate);
    }

    // display property
    request.add('displayProperty=' + displayProperty.toUpperCase());

    // completed only
    if (this.completedOnly) {
        request.add('completedOnly=true');
    }

    // normal request only
    if (!isTableLayout) {
        // hierarchy
        if (this.showHierarchy) {
            request.add('hierarchyMeta=true');
        }

        // outputType type
        if (isString(this.outputType)) {
            request.add('outputType=' + this.outputType);
        }

        // program status
        if (
            isString(this.programStatus) &&
            this.programStatus !== optionConfig.getProgramStatus('def').id
        ) {
            request.add('programStatus=' + this.programStatus);
        }

        // event status
        if (
            isString(this.eventStatus) &&
            this.eventStatus !== optionConfig.getEventStatus('def').id
        ) {
            request.add('eventStatus=' + this.eventStatus);
        }

        // limit, sortOrder
        if (
            isNumber(this.topLimit) &&
            this.topLimit &&
            isPivotTable
        ) {
            request.add('limit=' + this.topLimit);

            var sortOrder = isNumber(this.sortOrder) ? this.sortOrder : 1;

            request.add('sortOrder=' + (sortOrder < 0 ? 'ASC' : 'DESC'));
        }

        // value, aggregationType
        if (this.value) {
            request.add(
                'value=' +
                    (isString(this.value)
                        ? this.value
                        : isObject(this.value) ? this.value.id : null)
            );

            if (isString(this.aggregationType)) {
                request.add('aggregationType=' + this.aggregationType);
            }
        }

        // timeField
        if (this.timeField) {
            request.add('timeField=' + this.timeField);
        }

        if (this.orgUnitField) {
            request.add('orgUnitField=' + this.orgUnitField);
        }

        // collapse data items
        if (this.collapseDataDimensions) {
            request.add('collapseDataDimensions=true');
        }

        // user org unit
        if (isArray(this.userOrgUnit) && this.userOrgUnit.length) {
            request.add(this.getUserOrgUnitUrl());
        }

        // relative period date
        if (this.relativePeriodDate) {
            request.add('relativePeriodDate=' + this.relativePeriodDate);
        }

        // sorting
        if (isLineList) {
            if (
                isObject(this.sorting) &&
                isString(this.sorting.direction) &&
                isString(this.sorting.id)
            ) {
                request.add(this.sorting.direction.toLowerCase() + '=' + this.sorting.id);
            } else {
                request.add(this.getDefaultSortParam()); // default sort by event date
            }
        }

        // paging
        if (isLineList) {
            var paging = this.paging || {};

            request.add('pageSize=' + (paging.pageSize || 100));
            request.add('page=' + (paging.page || 1));
        }
    } else {
        // table layout
        request.add('tableLayout=true');

        // id scheme
        request.add('dataIdScheme=NAME');

        // columns
        //request.add('columns=' + this.getDimensionNames(false, false, this.columns).join(';'));
        request.add(
            'columns=' +
                this.getDimensions(false, false, this.columns)
                    .filter(function(dim) {
                        return dim.dimension !== 'dy';
                    })
                    .map(function(dim) {
                        return dim.dimension;
                    })
                    .join(';')
        );

        // rows
        //request.add('rows=' + this.getDimensionNames(false, false, this.rows).join(';'));
        request.add(
            'rows=' +
                this.getDimensions(false, false, this.rows)
                    .filter(function(dim) {
                        return dim.dimension !== 'dy';
                    })
                    .map(function(dim) {
                        return dim.dimension;
                    })
                    .join(';')
        );

        // hide empty columns
        if (this.hideEmptyColumns) {
            request.add('hideEmptyColumns=true');
        }

        // hide empty rows
        if (this.hideEmptyRows) {
            request.add('hideEmptyRows=true');
        }

        // show hierarchy
        if (this.showHierarchy) {
            request.add('showHierarchy=true');
        }

        // paging
        if (isLineList) {
            request.add('paging=false');
        }
    }

    // relative orgunits / user
    if (this.hasRecordIds(appManager.userIdDestroyCacheKeys, true)) {
        request.add('user=' + appManager.userAccount.id);
    }

    // base
    request.setBaseUrl(this.getRequestPath(src, format));

    return request;
};

// dep 2

Layout.prototype.data = function(source, format) {
    var t = this,
        refs = this.getRefs();

    var uiManager = refs.uiManager;

    var request = t.req(source, format);

    request.setType(t.getDefaultFormat());

    request.setError(function(r) {
        // 409
        // DHIS2-2020: 503 error (perhaps analytics maintenance mode)
        if (isObject(r) && (r.status == 409 || r.status == 503)) {
            uiManager.unmask();

            if (isString(r.responseText)) {
                uiManager.alert(JSON.parse(r.responseText));
            }
        }
    });

    return request.run();
};
