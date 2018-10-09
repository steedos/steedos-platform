import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'

import './main.html';

BlazeLayout.setRoot('body');

Meteor.startup ->
	if SC.setupBodyClassNames
		SC.setupBodyClassNames()