import React, { Component } from 'react';
import './index.css';
class ReportList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: []
        };
    }

    render() {
        let list = this.state.list;
        var items = list.map(function (item) {
            return (
                <div className="report-list-item" key={item._id}>
                    <a href={item._id}>{item.name}</a>
                    <a href={"/designer/" + item._id}>编辑</a>
                </div>
            );
        }, this);
        return (
            <div className="report-list">
                {items}
            </div>
        );
    }          

    async componentDidMount(){
        let response = await fetch(`/api/report/list`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        let reports = await response.json();
        let list = [];
        for (let key in reports){
            list.push(reports[key]);
        }
        this.setState(state => ({
            list: list
        }));
    }
}


export default ReportList;
