import React from 'react'
import {
    Table,
    Modal,
    Popover
} from 'antd';
import Lookdetails from './Lookdetails'
import AddFlowInfo from './AddFlowInfo'
import AssignPermissions from './AssignPermissions'
var confirm = Modal.confirm;

var typeList = [];

Utils.ajaxData({
    url: '/act/flowControl/getMutilCheckBox.htm',
    method: 'get',
    type: 'json',
    data : {
        "typeCode":"COM_PROD_SON_TYPE"
    },
    callback: (result) => {
        typeList = result.data;
    }
});

export default React.createClass({
    getInitialState() {
        return {
            selectedRowKeys: [], // 这里配置默认勾选列
            loading: false,
            data: [],
            pagination: {},
            canEdit: true,
            visible: false,
            visibleLook: false,
            assignVisible: false,
        };
    },
    hideModal() {
        this.setState({
            visible: false,
            visibleLook: false,
            assignVisible: false
        });
        var pagination = this.state.pagination;
        this.fetch();
    },
    //新窗口
    showModal(title, record, canEdit) {
        var record = record;
        var data ='';
        if(title=="修改"){
            data = record;
        }

        this.refs.AddFlowInfo.setFieldsValue(record);
        this.setState({
            canEdit: canEdit,
            visible: true,
            title: title,
            record: data
        });
    },
    getTypeList(){
        return typeList;
    },
    deleteRecord(title, record, canEdit){
        var me = this;
        confirm({
            title:"删除后不可恢复,确定要删除吗?",
            onOk:function(){
                Utils.ajaxData({
                    url:"/act/categoryimage/delete.htm",
                    data:{
                        id:record.id,
                        imgPath:record.type_img_path
                    },
                    method:"post",
                    callback:function(result){
                        Modal.success({
                            title:result.msg
                        });
                        me.refreshList();
                    }
                })
            },
            onCancel:function(){}
        });
    },
    rowKey(record) {
        return record.id;
    },
    componentWillReceiveProps(nextProps, nextState) {
        this.setState({
            params: nextProps.params,
        });
        this.fetch(nextProps.params);
    },
    componentDidMount() {
        this.fetch();

    },
    //分页
    handleTableChange(pagination, filters, sorter) {
        const pager = this.state.pagination;
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
    },
    //获取数据
    fetch(params = {
        pageSize: 10,
        current: 1
    }) {
        this.setState({
            loading: true
        });
        Utils.ajaxData({
            url: '/act/model/categoryimage/getall.htm',
            data: params,
            callback: (result) => {
                const pagination = this.state.pagination;
                pagination.total = result.totalCount;
                if (!pagination.current) {
                    pagination.current = 1
                };
                this.setState({
                    loading: false,
                    data: result.data,
                    pagination,
                });
                this.clearList();
            }
        });
    },
    //清空列表
    clearList() {
        this.setState({
            selectedRowKeys: [],
        });
    },
    //刷新列表
    refreshList() {
        this.fetch();
    },
    render() {
        var me = this;
        var columns = [{
            title: '位置',
            dataIndex: "big_type",
            render:function(value,record){
                if(value === 1){
                    return "金融圈子导航栏";
                }else if(value === 2){
                    return "金融圈子大分类";
                }
            }
        },{
            title: '图片',
            dataIndex: 'type_img_path',
            render:function(value,record){
                return <img src={value} alt=""  style={{width: '50px',marginLeft:'1px'}}/>
            }
        },{
            title: '标题',
            dataIndex: "type_name",
        }/*,{
            title: '二级分类',
            dataIndex: "type",
            render:function(value,record){
                for(var index=0;index<typeList.length;index++){
                    var code = typeList[index].itemCode.substring(0,2);
                    if( code == value){
                        return typeList[index].itemValue;
                    }
                }
            }
        }*/,{
            title: '排序',
            dataIndex: "sort",
        },{
            title: '操作',
            dataIndex: "",
            render(text, record) {
                return <div style={{ textAlign: "left" }}>
                    <a href="#" onClick={me.showModal.bind(null, '修改', record, true)}>修改</a>
                    <span className="ant-divider"></span>
                    <a href="#" onClick={me.deleteRecord.bind(null, '删除', record, true)}>删除</a>
                </div>
            }}];

        var state = this.state;
        return (
            <div className="block-panel">
                <div className="actionBtns" style={{ marginBottom: 16 }}>
                    <button className="ant-btn" onClick={this.showModal.bind(this, '新增', null, true) }>
                        新增
                    </button>
                </div>
                <Table columns={columns} rowKey={this.rowKey}  size="middle"  params ={this.props.params}
                       dataSource={this.state.data}
                       pagination={this.state.pagination}
                       loading={this.state.loading}
                       onChange={this.handleTableChange}  />
                <AddFlowInfo ref="AddFlowInfo"  visible={state.visible}    title={state.title} hideModal={me.hideModal} record={state.record}
                             canEdit={state.canEdit}/>
                <Lookdetails ref="Lookdetails" visible={state.visibleLook} title={state.title} hideModal={me.hideModal} record={state.rowRecord}
                             canEdit={state.canEdit} detail={state.detail} />
                <AssignPermissions ref="AssignPermissions"  visible={state.assignVisible}    title={state.title} hideModal={me.hideModal} selectRecord={state.record}
                                   canEdit={state.canEdit}/>
            </div>
        );
    }
})