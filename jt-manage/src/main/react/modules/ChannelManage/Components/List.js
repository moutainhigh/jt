import React from 'react'
import {
    Table,
    Modal
} from 'antd';
import AddWin from './AddWin'
var confirm = Modal.confirm;
const objectAssign = require('object-assign');
export default React.createClass({
    getInitialState() {
        return {
            selectedRowKeys: [], // 这里配置默认勾选列
            loading: false,
            data: [],
            pagination: {},
            canEdit: true,
            visible: false,
            record:"",
            dataRecord:[],
            title:""
        };
    },
    componentWillReceiveProps(nextProps, nextState) {
        this.clearSelectedList();
        this.fetch(nextProps.params);
    },
    hideModal() {
        this.setState({
            visible: false,
            visibleDetails: false,
            title:"",
            dataRecord:[],
            record:""
        });
     this.refreshList();
    },
    //新增跟编辑弹窗
    showModal(title, record, canEdit) {
       var record = record;
       var me = this;
        this.setState({
            canEdit: canEdit,
            visible: true,
            title: title,
            record: record
        }, () => {
        if(title == '编辑'){
            Utils.ajaxData({
                url: '/modules/manage/promotion/channel/getUrl.htm',
                data: { code: record.code},
                method: 'post',
                callback: (result) => {
                    document.getElementById("apkUrl").value=result.apkUrl
                }
            });




            me.refs.AddWin.setFieldsValue(me.state.record);
        }
        
        });
    },
    rowKey(record) {
        return record.id;
    },
    //分页
    handleTableChange(pagination, filters, sorter) {
        const pager = this.state.pagination;
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        this.refreshList();
    },
    fetch(params) {
        this.setState({
            loading: true
        });
        if (!params.pageSize) {
            var params = {};
            params = {
                pageSize: 10,
                current: 1,
                searchParams:JSON.stringify({code:'',linker:'',name: '',phone:''})
            }
        }
        Utils.ajaxData({
            url: '/modules/manage/promotion/channel/page.htm',
            data:params,
            method: 'post',
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
                    data: result.data,
                    pagination
                });
            }
        });
    },
    clearSelectedList() {
        this.setState({
            selectedRowKeys: [],
        });
    },
    refreshList() {
        var pagination = this.state.pagination;
        var params = objectAssign({}, this.props.params, {
                current: pagination.current,
                pageSize: pagination.pageSize,
        });
        this.fetch(params);
    },

    componentDidMount() {
        var pagination = this.state.pagination;
        var params = objectAssign({}, this.props.params, {
            current: pagination.current,
            pageSize: pagination.pageSize
        });
        this.fetch(params);
    },
    onRowClick(record) {
        var id = record.id;
        this.setState({
            selectedRowKeys: [id],
            record: record
        });
    },
    changeStatus(record,title) {
        var record=record;
        var me = this;
        var msg = "";
        var tips = "";
        var state = "";
        var trueurl = "/modules/manage/promotion/channel/updateState.htm";
        if (title == '启用') {
            msg = '启用成功';
            tips = '您是否启用';
            state = 10;
        } else if (title == '禁用') {
            msg = '禁用成功';
            tips = '您是否禁用';
            state = 20;
        }

        confirm({
            title: tips,
            onOk: function() {
                Utils.ajaxData({
                    url: trueurl,
                    data: {
                        id:record.id,
                        state:state,
                    },
                    method: 'post',
                    callback: (result) => {
                        if (result.code == 200) {
                            Modal.success({
                                title: result.msg,
                            });
                            me.refreshList();
                        } else {
                           Modal.error({
                                title: result.msg,
                            });
                        }
                        
                    }
                });
            },
            onCancel: function() { }
        });
    },
   
    render() {
        var me = this;
        const {
            loading,
            selectedRowKeys
        } = this.state;
        const rowSelection = {
            selectedRowKeys,
        };
        const hasSelected = selectedRowKeys.length > 0;
        var columns = [{
            title: '渠道编码',
            dataIndex: "code"
        },{
            title: '渠道名称',
            dataIndex: "name"
        },{
            title: '联系人',
            dataIndex: "linker"
        },{
            title: '联系方式',
            dataIndex: "phone"
        },{
            title: '创建时间',
            dataIndex: "createTime"
        },{
            title:"状态",
            dataIndex:"stateStr",
        },{
            title:"操作",
            width:100,
            dataIndex:"",
            render(text,record){
                return  (
                    <div style={{ textAlign: "left" }}>
                        <a href="#" onClick={me.showModal.bind(me, '编辑',record, true)}>编辑</a>
                          <span className="ant-divider"></span>       
                         {record.state=="20"?(<a href="#" onClick={me.changeStatus.bind(me ,record,'启用')}>启用</a>):(<a href="#" onClick={me.changeStatus.bind(me,record,'禁用')}>禁用</a>)}            
                   </div>
                )
            }
        }];

        var state = this.state;
        var record = state.record;
        return (
            <div className="block-panel">
                <div className="actionBtns" style={{ marginBottom: 16 }}>
                    <button className="ant-btn" onClick={this.showModal.bind(this, '新增', record, true)}>
                        新增
                    </button>    
                </div>
                <Table columns={columns} rowKey={this.rowKey} size="middle"
                    onRowClick={this.onRowClick}
                    dataSource={this.state.data}
                    pagination={this.state.pagination}
                    loading={this.state.loading}
                    onChange={this.handleTableChange} />
             <AddWin ref="AddWin" visible={state.visible} title={state.title} hideModal={me.hideModal} record={state.record} canEdit={state.canEdit} dataRecord={state.dataRecord} />
            </div>
        );
    }
})