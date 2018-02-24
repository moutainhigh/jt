import React from 'react';
import {
  Table,
} from 'antd';
const objectAssign = require('object-assign');
var Tab3 = React.createClass({
  getInitialState() {
    return {
      loading: false,
      data: [],
      pagination: {},
    };
  },
  rowKey(record) {
    return record.id;
  },
  componentWillReceiveProps(nextProps){
    if(nextProps.activeKey == '4'){
      this.fetch();
    }
  },
  componentDidMount(){
    this.fetch();
  },
  handleTableChange(pagination, filters, sorter) {
    const pager = this.state.pagination;
    pager.current = pagination.current;
    pager.userId = this.props.record.userId,
    this.setState({
      pagination: pager,
    });
    this.fetch(pager);
  },
  fetch(params = {}) {
    this.setState({
      loading: true
    });
    if (!params.pageSize) {
      var params = {};
      params = {
        pageSize: 5,
        current: 1,
        userId: this.props.record.userId,
      }
    }
    Utils.ajaxData({
      url: '/modules/manage/msg/listRecords.htm',
      data: params,
      callback: (result) => {
        const pagination = this.state.pagination;
        pagination.current = params.current;
        pagination.pageSize = params.pageSize;
        pagination.total = result.page.total;
        pagination.showTotal = () => `总共 ${result.page.total} 条`;
        if (!pagination.current) {
          pagination.current = 1
        };
        this.setState({
          loading: false,
          data: result.data.list,
          pagination
        });
      }
    });
  },
  render() {
    var columns = [{
      title: '用户号码',
      dataIndex: "phoneNum",
    }, {
      title: '对方号码',
      dataIndex: "voiceToNumber",
    }, {
      title: '通话时间',
      dataIndex: "voiceDate",
    }, {
      title: '通话时长(秒)',
      dataIndex: "voiceDuration",
    }, {
      title: '通话地',
      dataIndex: "voicePlace",
    }, {
      title: '通话状态',
      dataIndex: "voiceStatus",
    }, {
      title: '通话类型',
      dataIndex: "voiceType",
    }];
    return (<div className="block-panel">
              <Table columns={columns} rowKey={this.rowKey}  
              dataSource={this.state.data}
              pagination={this.state.pagination}
              loading={this.state.loading}
              onChange={this.handleTableChange}  />
          </div>
    );
  }
});
export default Tab3;