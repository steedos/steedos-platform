import React from 'react';
import _ from 'underscore';
import moment from 'moment';
import { getRelativeUrl } from '../../utils';
const marked = require('marked/lib/marked.js');

const formatFileSize = function (filesize) {
	var rev, unit;
	rev = filesize / 1024.00;
	unit = 'KB';
	if (rev > 1024.00) {
		rev = rev / 1024.00;
		unit = 'MB';
	}
	if (rev > 1024.00) {
		rev = rev / 1024.00;
		unit = 'GB';
	}
	return rev.toFixed(2) + unit;
};

const getSelectFieldLabel = (field, fieldValue, doc) => {
	var _options, _record_val, _val, _values, ref, self_val, val;
	_options = field.allOptions || field.options;
	_values = doc || {};
	// record_val是grid字段类型传入的，先不考虑
	// _record_val = this.record_val;
	if (_.isFunction(field.options)) {
		_options = field.options(_record_val || _values);
	}
	if (_.isFunction(field.optionsFunction)) {
		_options = field.optionsFunction(_record_val || _values);
	}
	if (_.isArray(fieldValue)) {
		self_val = fieldValue;
		_val = [];
		_.each(_options, function(_o) {
			if (_.indexOf(self_val, _o.value) > -1) {
				return _val.push(_o.label);
			}
		});
		val = _val.join(",");
	} else {
		val = (ref = _.findWhere(_options, {
			value: fieldValue
		})) != null ? ref.label : void 0;
	}

	if (!val) {
		val = fieldValue;
	}
	return val;
}

const getNumberFieldLabel = (field, fieldValue, doc) => {
	var fieldScale, reg, val;
	fieldScale = 0;
	if (field.scale) {
		fieldScale = field.scale;
	} else if (field.scale !== 0) {
		fieldScale = field.type === "currency" ? 2 : 0;
	}
	val = Number(fieldValue).toFixed(fieldScale);
	reg = /(\d)(?=(\d{3})+\.)/g;
	if (fieldScale === 0) {
		reg = /(\d)(?=(\d{3})+\b)/g;
	}
	val = val.replace(reg, '$1,');
	return val;
}

const getUrlFieldLabel = (field, fieldValue, doc) => {
	if(!fieldValue){
		return "";
	}
	var href = fieldValue;
	if (!(href != null ? href.startsWith("http") : void 0)) {
		href = getRelativeUrl(window.encodeURI(href));
	}
	return (<a onClick={(e) => {
		e.preventDefault();
		window.open(href, '_blank', 'width=800, height=600, left=50, top= 50, toolbar=no, status=no, menubar=no, resizable=yes, scrollbars=yes');
		return false;
	}}>
		{fieldValue}
	</a>)
}

const getEmailFieldLabel = (field, fieldValue, doc) => {
	if (!fieldValue) {
		return "";
	}
	let href = `mailto:${fieldValue}`;
	return (<a href={href}>{fieldValue}</a>)
}

const FieldLabel = ({ children, ...props }) => {
	let { field, doc } = props;
	let { onClick, format } = field;

	const Creator = window.Creator;
	if(Creator && _.isFunction(Creator.getTableCellData)){
		if(_.isFunction(format)){
			// 如果有特殊需求，可以在creator中定义format函数，在里面调用Creator.getTableCellData处理显示逻辑
			children = format(children, doc, props.options)
		}
		else{
			let cellData = Creator.getTableCellData({ field, doc, val: children, object_name: props.options.objectName, _id: doc._id });
			children = cellData.map((item)=>{
				return item.value
			}).join(",");
		}
	}
	else{
		if(_.isFunction(format)){
			children = format(children, doc, props.options)
		}
		if(children || _.isBoolean(children) || _.isNumber(children)){
			switch (field.type) {
				case 'datetime':
					if(_.isString(children) && /\d+Z$/.test(children)){
						children = moment(children).format('YYYY-MM-DD H:mm')
					}else{
						let utcOffset = moment().utcOffset() / 60
						children = moment(children).add(utcOffset, "hours").format('YYYY-MM-DD H:mm')
					}
					break;
				case 'date':
					if(_.isString(children) && /\d+Z$/.test(children)){
						children = moment.utc(children).format('YYYY-MM-DD')
					}else{
						children = moment(children).format('YYYY-MM-DD')
					}
					break;
				case 'boolean':
					children = children ? '是' : '否'
					break;
				case 'select':
					children = getSelectFieldLabel(field, children, doc)
					break;
				case 'number':
					children = getNumberFieldLabel(field, children, doc)
					break;
				case 'currency':
					children = getNumberFieldLabel(field, children, doc)
					break;
				case 'lookup':
					if(!_.isArray(children)){
						children = [children]
					}
					children = children.map((item)=>{return item._NAME_FIELD_VALUE}).join(",");
					break;
				case 'master_detail':
					children = children._NAME_FIELD_VALUE
					break;
				case 'filesize':
					children = formatFileSize(children)
					break;
				case 'grid':
					// grid字段显示为空字符
					children = ""
					break;
				case 'location':
					children = children ? children.address : ""
					break;
				case 'image':
					// image字段显示为空字符
					children = ""
					break;
				case 'avatar':
					// avatar字段显示为空字符
					children = ""
					break;
				case 'code':
					children = children ? "..." : ""
					break;
				case 'password':
					children = children ? "******" : ""
					break;
				// case 'url':
				// 	children = getUrlFieldLabel(field, children, doc)
				// 	break;
				// case 'email':
				// 	children = getEmailFieldLabel(field, children, doc)
				// 	break;
				case 'textarea':
					if (children) {
						children = children.replace(/\n/g, '\n<br>');
						children = children.replace(/ /g, '&nbsp;');
					}
					break;
				case 'html':
					// html字段显示为空字符
					children = ""
				case 'markdown':
					children = (<div dangerouslySetInnerHTML={{__html: marked(children)}} />)
					break;
				default:
					break;
			}
		}
	}
	return (
		<React.Fragment>
			{children}
		</React.Fragment>
	)
}

FieldLabel.displayName = "ListItemFieldLabel";

export default FieldLabel;