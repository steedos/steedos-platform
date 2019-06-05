import React, { Component } from 'react';

class ReportList extends Component {
    render() {
        return <div id="report-list"></div>;
    }          

    async componentDidMount(){
        let response = await fetch(`/api/report/list`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let reportList = await response.json();
    }
}


export default ReportList;
