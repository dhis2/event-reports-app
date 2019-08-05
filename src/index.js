import '../extjs/resources/css/ext-all-gray.css';
import './css/style.css';
import './css/meringue.css';
import './css/jquery.calendars.picker.css';
import 'd2-analysis/css/ui/GridHeaders.css';

import { api, table, manager, config, init, ui, override, ux } from 'd2-analysis';

import { Dimension } from './api/Dimension';
import { Layout } from './api/Layout';
import { InstanceManager } from './manager/InstanceManager';
import { AppManager } from './manager/AppManager';

import { AggregateLayoutWindow } from './ui/AggregateLayoutWindow';
import { QueryLayoutWindow } from './ui/QueryLayoutWindow';
import { AggregateOptionsWindow } from './ui/AggregateOptionsWindow';
import { QueryOptionsWindow } from './ui/QueryOptionsWindow';
import { DownloadButtonItems } from './ui/DownloadButtonItems';
import { DataTypeToolbar } from './ui/DataTypeToolbar';

// override
override.extOverrides();

// extend
api.Dimension = Dimension;
api.Layout = Layout;
manager.InstanceManager = InstanceManager;
manager.AppManager = AppManager;

// references
var refs = {
    api,
    table
};

    // dimension config
var dimensionConfig = new config.DimensionConfig();
refs.dimensionConfig = dimensionConfig;

    // option config
var optionConfig = new config.OptionConfig();
refs.optionConfig = optionConfig;

    // period config
var periodConfig = new config.PeriodConfig();
refs.periodConfig = periodConfig;

    // ui config
var uiConfig = new config.UiConfig();
refs.uiConfig = uiConfig;

    // app manager
var appManager = new manager.AppManager(refs);
appManager.sessionName = 'eventreport';
appManager.apiVersion = 29;
refs.appManager = appManager;

    // calendar manager
var calendarManager = new manager.CalendarManager(refs);
refs.calendarManager = calendarManager;

    // request manager
var requestManager = new manager.RequestManager(refs);
refs.requestManager = requestManager;

    // i18n manager
var i18nManager = new manager.I18nManager(refs);
refs.i18nManager = i18nManager;

    // sessionstorage manager
var sessionStorageManager = new manager.SessionStorageManager(refs);
refs.sessionStorageManager = sessionStorageManager;

    // indexeddb manager
// var indexedDbManager = new manager.IndexedDbManager(refs);
// refs.indexedDbManager = indexedDbManager;

    // ui manager
var uiManager = new manager.UiManager(refs);
refs.uiManager = uiManager;

    // instance manager
var instanceManager = new manager.InstanceManager(refs);
instanceManager.apiResource = 'eventReport';
instanceManager.apiEndpoint = 'eventReports';
instanceManager.apiModule = 'dhis-web-event-reports';
instanceManager.dataStatisticsEventType = 'EVENT_REPORT_VIEW';
refs.instanceManager = instanceManager;

    // table manager
var tableManager = new manager.TableManager(refs);
refs.tableManager = tableManager;

// dependencies
uiManager.setInstanceManager(instanceManager);
dimensionConfig.setI18nManager(i18nManager);
optionConfig.setI18nManager(i18nManager);
periodConfig.setI18nManager(i18nManager);
uiManager.setI18nManager(i18nManager);

    // init ux
Object.keys(ux).forEach(key => ux[key](refs));

// requests
appManager.init(() => {
    requestManager.add(new api.Request(refs, init.i18nInit(refs)));
    requestManager.add(new api.Request(refs, init.authViewUnapprovedDataInit(refs)));
    requestManager.add(new api.Request(refs, init.rootNodesInit(refs)));
    requestManager.add(new api.Request(refs, init.organisationUnitLevelsInit(refs)));
    requestManager.add(new api.Request(refs, init.legendSetsInit(refs)));
    // requestManager.add(new api.Request(refs, init.optionSetsInit(refs)));
    requestManager.add(new api.Request(refs, init.dimensionsInit(refs, ['filter=dimensionType:eq:ORGANISATION_UNIT_GROUP_SET'])));
    requestManager.add(new api.Request(refs, init.dataApprovalLevelsInit(refs)));
    requestManager.add(new api.Request(refs, init.categoryOptionGroupSetsInit(refs)));
    requestManager.add(new api.Request(refs, init.userFavoritesInit(refs)));

    requestManager.set(initialize);
    requestManager.run();
});

function initialize() {

    // i18n init
    var i18n = i18nManager.get();

    optionConfig.init();
    dimensionConfig.init();
    periodConfig.init();

    // ui config
    uiConfig.checkout('tracker');

    // app manager
    appManager.appName = i18n.event_reports || 'Event Reports';

    // instance manager
    instanceManager.setFn(function(layout) {

        let tableOptions = { renderLimit: 100000 }
        let sortingId = layout.sorting ? layout.sorting.id : null;
        let response = layout.getResponse();

        let afterLoad = function() {

            // mask
            uiManager.unmask();

            // statistics
            instanceManager.postDataStatistics();
        };

        let createPivotTable = function(layout, response) {

            let statusBar = uiManager.get('statusBar');

            let tableOptions = { renderLimit: 100000, unclickable: true }
            let sortingId = layout.sorting ? layout.sorting.id : null;

            if (statusBar) {
                statusBar.reset();
            }

            // pre-sort if id
            if (sortingId && sortingId !== 'total') {
                layout.sort();
            }

            let _table = new table.PivotTable(refs, layout, response, tableOptions);

            if (_table.doClipping()) {
                uiManager.confirmRender(
                    `Table size warning`,
                    () => renderTable(_table, layout, sortingId),
                    () =>  {
                        uiManager.update();
                        uiManager.unmask();
                    }
                );
            } else {
                renderTable(_table, layout, sortingId);
            }

            afterLoad();
        };

        var createEventDataTable = function(layout, response) {
            var _table = new table.EventDataTable(refs, layout, response);
            var statusBar = uiManager.get('statusBar');

            if (_table) {

                // render
                uiManager.update(_table.html);

                var _layout = refs.instanceManager.getStateCurrent();
                _layout.sorting = layout.sorting;
                _layout.setResponse(null);

                // events
                tableManager.setColumnHeaderMouseHandlers(_layout, _table);

                if (statusBar) {
                    statusBar.setStatus(layout, response);
                }

                afterLoad();
            }
        };

        if (layout.dataType === 'AGGREGATED_VALUES') {
            createPivotTable(layout, response);
        }
        else if (layout.dataType === 'EVENTS') {
            createEventDataTable(layout, response);
        }
    });

    function renderTable(_table, layout, sortingId) {

        // initialize table values
        _table.initialize();

        // bind mouse events
        let bindMouseHandlers = () => {
            tableManager.setColumnHeaderMouseHandlers(layout, _table);
        }

       // sort if total
       if (sortingId && sortingId === 'total') {

            // sort pivot table based on totals
            layout.sort(pivotTable);

            // reinitialize pivot table values due to sorting
            _table.initialize();
        }

        // set viewport dimensions (used for clipping)
        _table.setViewportSize(
            uiManager.get('centerRegion').getWidth(),
            uiManager.get('centerRegion').getHeight()
        );

        // build table
        _table.build();

        // render
        uiManager.update(_table.render());

        // events
        bindMouseHandlers();

        // mask
        uiManager.unmask();

        // statistics
        instanceManager.postDataStatistics();

        if (_table.doClipping()) {

            uiManager.setScrollFn('centerRegion', ({ target: { scrollTop, scrollLeft } }) => {
                _table.scrollHandler(uiManager.update, scrollTop, scrollLeft, () => {
                    bindMouseHandlers();
                });
            });

            uiManager.setResizeFn('centerRegion', (newWidth, newHeight) => {
                _table.resizeHandler(uiManager.update, newWidth, newHeight, () => {
                    bindMouseHandlers();
                });
            });

        } else {
            uiManager.removeScrollFn('centerRegion');
            uiManager.removeResizeFn('centerRegion');
        }

        uiManager.scrollTo("centerRegion", 0, 0);
    }

    // ui manager
    uiManager.disableRightClick();
    uiManager.enableConfirmUnload();

    // intro
    uiManager.introHtmlIsAsync = true;

    const introHtml = function() {
        var html = '<div class="ns-viewport-text" style="padding:20px">';

        html += '<h3>' + i18nManager.get('example1') + '</h3>' +
            '<div>- ' + i18nManager.get('example2') + '</div>' +
            '<div>- ' + i18nManager.get('example3') + '</div>' +
            '<div>- ' + i18nManager.get('example4') + '</div>' +
            '<h3 style="padding-top:20px">' + i18nManager.get('example5') + '</h3>' +
            '<div>- ' + i18nManager.get('example6') + '</div>' +
            '<div>- ' + i18nManager.get('example7') + '</div>' +
            '<div>- ' + i18nManager.get('example8') + '</div>';

        if (appManager.userFavorites.length > 0) {
            html += '<div id="top-favorites" style="margin-top: 20px; padding: 0">';
            html += `<h3>${ i18nManager.get('example9') }</h3>`;


            appManager.userFavorites.forEach(function(favorite) {
                html += '<div>- <a href="javascript:void(0)" class="favorite favorite-li" id="favorite-' + favorite.id + '">' + favorite.name + '</a></div>';
            });

            html += '</div>';
        }

        return html;
    };

    uiManager.setIntroHtml(introHtml());

    uiManager.setUpdateIntroHtmlFn(function() {
        return new api.Request(refs, init.userFavoritesInit(refs)).run()
            .then(() => uiManager.setIntroHtml(introHtml()));
    });

    // windows
    uiManager.reg(AggregateLayoutWindow(refs), 'aggregateLayoutWindow').hide();

    uiManager.reg(QueryLayoutWindow(refs), 'queryLayoutWindow').hide();

    uiManager.reg(AggregateOptionsWindow(refs), 'aggregateOptionsWindow').hide();

    uiManager.reg(QueryOptionsWindow(refs), 'queryOptionsWindow').hide();

    uiManager.reg(ui.FavoriteWindow(refs), 'favoriteWindow').hide();

    // viewport
    var northRegion = uiManager.reg(ui.NorthRegion(refs), 'northRegion');

    var eastRegion = uiManager.reg(ui.EastRegion(refs), 'eastRegion');

    var westRegionItems = uiManager.reg(ui.WestRegionTrackerItems(refs), 'accordion');

    var dataTypeToolbar = uiManager.reg(DataTypeToolbar(refs), 'dataTypeToolbar');

    var statusBar = uiManager.reg(Ext.create('Ext.ux.toolbar.StatusBar', {
        height: 27,
        listeners: {
            render: function() {
                this.reset();
            }
        }
    }), 'statusBar');

    var defaultIntegrationButton = uiManager.reg(ui.IntegrationButton(refs, {
        isDefaultButton: true,
        btnText: i18n.table,
        btnIconCls: 'ns-button-icon-table'
    }), 'defaultIntegrationButton');

    var chartIntegrationButton = ui.IntegrationButton(refs, {
        objectName: 'event-chart',
        moduleName: 'dhis-web-event-visualizer',
        btnIconCls: 'ns-button-icon-chart',
        btnText: i18n.chart,
        menuItem1Text: i18n.go_to_event_charts,
        menuItem2Text: i18n.open_this_table_as_chart,
        menuItem3Text: i18n.open_last_chart
    });

    var getWindowByDataType = function(aggName, queryName) {
        var dataType = uiManager.get('dataTypeToolbar').getDataType(),
            window;

        if (dataType === dimensionConfig.dataType['aggregated_values']) {
            window = uiManager.get(aggName);
        }
        else if (dataType === dimensionConfig.dataType['individual_cases']) {
            window = uiManager.get(queryName);
        }

        return window;
    };

    // viewport
    uiManager.reg(ui.Viewport(refs, {
        northRegion: northRegion,
        eastRegion: eastRegion,
        westRegionItems: westRegionItems,
        dataTypeToolbar: dataTypeToolbar,
        statusBar: statusBar,
        integrationButtons: [
            defaultIntegrationButton,
            chartIntegrationButton
        ],
        DownloadButtonItems: DownloadButtonItems,
    }, {
        getLayoutWindow: function() {
            return getWindowByDataType('aggregateLayoutWindow', 'queryLayoutWindow');
        },
        getOptionsWindow: function() {
            return getWindowByDataType('aggregateOptionsWindow', 'queryOptionsWindow');
        },
    }), 'viewport');

    // subscribe functions to viewport regions to update ui on renew
    uiManager.subscribe('centerRegion', () => {
        if (appManager.userFavorites.length) {
            appManager.userFavorites.forEach(function(favorite) {
                Ext.get('favorite-' + favorite.id).addListener('click', function() {
                    instanceManager.getById(favorite.id, null, true);
                });
            });
        }
    });

    //uiManager.update();
}

global.refs = refs;
