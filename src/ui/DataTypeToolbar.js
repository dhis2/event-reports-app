export var DataTypeToolbar;

DataTypeToolbar = function(refs) {
    var uiManager = refs.uiManager,
        instanceManager = refs.instanceManager,
        dimensionConfig = refs.dimensionConfig,
        optionConfig = refs.optionConfig,
        i18n = refs.i18nManager.get();

    var DATA_TYPE_PIVOT_ID = dimensionConfig.dataType['aggregated_values'];
    var DATA_TYPE_LIST_ID = dimensionConfig.dataType['individual_cases'];

    var OUTPUT_TYPE_EVENT_ID = optionConfig.getOutputType['event'];
    var OUTPUT_TYPE_ENROLLMENT_ID = optionConfig.getOutputType['enrollment'];

    var comboBoxWidth = 224;

    var scrollbarWidth = uiManager.getScrollbarSize().width;

    var onDataTypeSelect = function(value) {
        uiManager.get('accordion').onDataTypeSelect &&
        uiManager.get('accordion').onDataTypeSelect(value || dataType.getValue());
    };

    var onOutputTypeSelect = function(value) {
        uiManager.get('accordion').onOutputTypeSelect &&
        uiManager.get('accordion').onOutputTypeSelect(value || outputType.getValue());
    };

    var dataType = Ext.create('Ext.form.field.ComboBox', {
        editable: false,
        valueField: 'id',
        displayField: 'name',
        fieldLabel: 'Table style',
        labelAlign: 'top',
        labelCls: 'ns-form-item-label-top',
        labelSeparator: '',
        queryMode: 'local',
        lastQuery: '',
        width: comboBoxWidth + (scrollbarWidth / 2),
        listConfig: { loadMask: false },
        style: 'margin:1px 1px 1px 0; padding-bottom:1px',
        value: DATA_TYPE_PIVOT_ID,
        store: {
            fields: ['id', 'name'],
            data: [
                { id: DATA_TYPE_PIVOT_ID, name: 'Pivot table' },
                { id: DATA_TYPE_LIST_ID, name: 'Line list' },
            ],
        },
        listeners: {
            select: cmp => {
                onDataTypeSelect(cmp.getValue());
            },
        },
    });

    uiManager.reg(dataType, 'dataType');

    var outputType = Ext.create('Ext.form.field.ComboBox', {
        editable: false,
        valueField: 'id',
        displayField: 'name',
        fieldLabel: 'Output type',
        labelAlign: 'top',
        labelCls: 'ns-form-item-label-top',
        labelSeparator: '',
        queryMode: 'local',
        lastQuery: '',
        width: comboBoxWidth + (scrollbarWidth / 2),
        listConfig: { loadMask: false },
        style: 'margin:1px 1px 1px 0; padding-bottom:1px',
        value: OUTPUT_TYPE_EVENT_ID,
        store: {
            fields: ['id', 'name'],
            data: [
                { id: OUTPUT_TYPE_EVENT_ID, name: 'Event' },
                { id: OUTPUT_TYPE_ENROLLMENT_ID, name: 'Enrollment' },
            ],
        },
        listeners: {
            select: cmp => {
                onOutputTypeSelect(cmp.getValue());
            },
        },
    });

    uiManager.reg(outputType, 'outputType');

    // var aggregateTypeButton = Ext.create('Ext.button.Button', {
    //     width: caseTypeButtonWidth,
    //     param: dimensionConfig.dataType['aggregated_values'],
    //     text: '<b>' + i18n.aggregated_values + '</b><br/>' + i18n.show_aggregated_event_report,
    //     style: 'margin-right:1px',
    //     pressed: true,
    //     listeners: {
    //         mouseout: function(cmp) {
    //             cmp.addCls('x-btn-default-toolbar-small-over');
    //         }
    //     }
    // });
    // uiManager.reg(aggregateTypeButton, 'aggregateTypeButton');
    // dataTypeButtonParamMap[aggregateTypeButton.param] = aggregateTypeButton;

    // var caseTypeButton = Ext.create('Ext.button.Button', {
    //     width: caseTypeButtonWidth + 1 + scrollbarWidth,
    //     param: dimensionConfig.dataType['individual_cases'],
    //     text: '<b>Events</b><br/>Show individual event overview',
    //     style: 'margin-right:1px',
    //     listeners: {
    //         mouseout: function(cmp) {
    //             cmp.addCls('x-btn-default-toolbar-small-over');
    //         }
    //     }
    // });
    // uiManager.reg(caseTypeButton, 'caseTypeButton');
    // dataTypeButtonParamMap[caseTypeButton.param] = caseTypeButton;

    var dataTypeToolbar = Ext.create('Ext.container.Container', {
        layout: 'column',
        style: 'padding:2px 1px 0; border-top:1px solid #d0d0d0; border-bottom:1px solid #d0d0d0; background-color: #f6f6f6',
        getDataType: function() {
            return dataType.getValue();
        },
        setDataType: function(dataType) {
            dataType.setValue(dataType);
            // var button = dataTypeButtonParamMap[dataType] || aggregateTypeButton;

            // if (button) {
            //     button.toggle(true);
            // }
        },
        getOutputType: function() {
            return outputType.getValue();
        },
        setOutputType: function(outputType) {
            outputType.setValue(outputType);
        },
        // setButtonWidth: function(value, append) {
        //     caseTypeButton.setWidth(value + (append ? caseTypeButtonWidth : 0));
        // },
        items: [
            dataType,
            outputType
        ]
    });

    return dataTypeToolbar;
};
