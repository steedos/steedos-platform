import './grid.html';
import GridContainer from './containers/GridContainer.jsx'

Template.reactIndex.helpers({
	SteedosGrid: function(){
		return GridContainer
	}
})

