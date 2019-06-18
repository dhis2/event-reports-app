import arrayContains from 'd2-utilizr/lib/arrayContains';
import arrayUnique from 'd2-utilizr/lib/arrayUnique';
import isString from 'd2-utilizr/lib/isString';
import isBoolean from 'd2-utilizr/lib/isBoolean';
import isObject from 'd2-utilizr/lib/isObject';
import isEmpty from 'd2-utilizr/lib/isEmpty';

import { Dimension as d2aDimension } from 'd2-analysis';

export var Dimension = function(refs, c, applyConfig, forceApplyConfig) {
    var t = this;

    var _ignoreUrlDimensions = ['dy', 'longitude', 'latitude'];

    c = isObject(c) ? c : {};

    // inherit
    Object.assign(t, new d2aDimension(refs, c, applyConfig));

    // props
    if (isString(c.filter)) {
        t.filter = c.filter;
    }

    if (isString(c.name)) {
        t.name = c.name;
    }

    if (isObject(c.legendSet)) {
        t.legendSet = c.legendSet;
    }

    // force apply
    Object.assign(t, forceApplyConfig);

    t.getIgnoreUrlDimensions = function() {
        return _ignoreUrlDimensions;
    };

    t.getRefs = function() {
        return refs;
    };
};

Dimension.prototype = d2aDimension.prototype;

Dimension.prototype.isIgnoreDimension = function() {
    return arrayContains(this.getIgnoreUrlDimensions(), this.dimension);
};

// dep 1

const stageMap = {
    a3kGcGDCuk6: 'A03MvHHogjR',
    H6uSAMO5WLD: 'A03MvHHogjR',
    UXz7xuGCEhU: 'A03MvHHogjR',
    wQLfBvPrXqq: 'A03MvHHogjR',
    bx6fsa0t90x: 'A03MvHHogjR',
    ebaJjqltK5N: 'A03MvHHogjR',
    X8zyunlgUfM: 'A03MvHHogjR',
    uf3svrmp8Oj: 'A03MvHHogjR',

    GQY2lXrypjO: 'ZzYYXq4fJie',
    X8zyunlgUfM: 'ZzYYXq4fJie',
    FqlgKAG8HOu: 'ZzYYXq4fJie',
    vTUhAUZFoys: 'ZzYYXq4fJie',
    rxBfISxXS2U: 'ZzYYXq4fJie',
    lNNb3truQoi: 'ZzYYXq4fJie',
    pOe0ogW4OWd: 'ZzYYXq4fJie',
    HLmTEmupdX0: 'ZzYYXq4fJie',
    cYGaxwK615G: 'ZzYYXq4fJie',
    hDZbpskhqDd: 'ZzYYXq4fJie',
    sj3j9Hwc7so: 'ZzYYXq4fJie',
    aei1xRjSU2l: 'ZzYYXq4fJie',
    BeynU4L6VCQ: 'ZzYYXq4fJie',
    OuJ6sgPyAbC: 'ZzYYXq4fJie',
};

const getFullId = dim => stageMap[dim] ? stageMap[dim] + '.' + dim : dim;

Dimension.prototype.url = function(isSorted, response, isFilter) {
    if (this.isIgnoreDimension()) {
        return '';
    }

    var url = (isFilter ? 'filter' : 'dimension') + '=' + getFullId(this.dimension);

    if (isObject(this.legendSet)) {
        url += '-' + this.legendSet.id;
    }

    var records = arrayUnique(this.getRecordIds(isSorted, response, true));

    if (records.length) {
        url += ':' + records.join(';');
    }

    if (isString(this.filter)) {
        url += ':' + this.filter;
    }

    return url;
};
