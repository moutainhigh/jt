import React from 'react';
import {
    Button,
    Form,
    Input,
    Modal,
    Select,
    Tree,
    TreeSelect,
    Row,
    Col
} from 'antd';
const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;
const objectAssign = require('object-assign');
let treeData = [];
// var roleList = [];
// Utils.ajaxData({
//     url: '/modules/manage/system/role/list.htm',
//     method: 'get',
//     type: 'json',
//     callback: (result) => {
//         roleList = result.data;
//     }
// });

var UpView = React.createClass({
    getInitialState() {
        return {
            status: {},
            formData: {}
        };
    },
    handleCancel() {
        this.props.form.resetFields();
        this.props.hideModal();
    },
    handleOk(e) {
        e.preventDefault();
        var me = this;
        var props = me.props;
        var record = props.record;
        var title = props.title;
        //console.log(record)
        var url = "/modules/manage/cl/cluser/save.htm";
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                //console.log('Errors in form!!!');
                return;
            }
            if (title == "新增") {
                var data = objectAssign({}, {
                    json: JSON.stringify(objectAssign({}, values, {

                    }, {
                        isDelete: values.isDelete
                    }))
                }, {
                    status: 'create'
                });
            }
          else  {
                var data = objectAssign({}, {
                    form: JSON.stringify(values)
                }, {
                    status: 'update'
                });
            }

            Utils.ajaxData({
                url: url,
                data: data,
                callback: (result) => {
                    if (result.code == 200) {
                        Modal.success({
                            title: result.msg,
                            onOk: () => {
                                this.handleCancel();
                                props.hideModal();
                            }
                        });
                    }
                }
            });
        })
    },
    getRoleList() {
        return roleList.map((item, index) => {
            return <Option key={item.id} >{item.name}</Option>
        })
    },
    render() {
        const {
            getFieldProps
        } = this.props.form;
        var props = this.props;
        var state = this.state;
        var modalBtns = [
            <button key="back" className="ant-btn" onClick={this.handleCancel}>返 回</button>,
    <button key="button" className="ant-btn ant-btn-primary"  onClick={this.handleOk}>
        提 交
        </button>
    ];
        const formItemLayout = {
            labelCol: {
                span: 8
            },
            wrapperCol: {
                span: 15
            },
        };
        var optionItem = [],index;
        // for(let i = 0; i < props.condition.length; i++){
        //     // if(props.condition[i].systemType == props.record.type){
        //     //     index = i;
        //     // }
        //     optionItem.push(<Option  key={props.condition[i].systemType} value={props.condition[i].systemType}>{props.condition[i].systemTypeName}</Option>)
        // }
        return (
            <Modal title={props.title} visible={props.visible} onCancel={this.handleCancel} width="700"  footer={modalBtns} >
            <Form horizontal  form={this.props.form}>
            <Input  {...getFieldProps('id', { initialValue: '' }) } type="hidden"   />
            <Input  {...getFieldProps('baseInfoId', { baseInfoId: '' }) } type="hidden"   />
            <Input  {...getFieldProps('userId', { userId: '' }) } type="hidden"   />
            <Row>
            <Col span="22">
            <FormItem  {...formItemLayout} label="身份证号码: ">
            <Input style={{width:'100%'}} disabled={props.canEdit}  {...getFieldProps('idNo', { rules: [{ required: true, message: '必填' }] }) } type="text"  />
            </FormItem>
            </Col>
            </Row>
            <Row>
            <Col span="22">
            <FormItem  {...formItemLayout} label="姓名: ">
            <Input style={{width:'100%'}} disabled={props.canEdit}  {...getFieldProps('realName', { rules: [{ required: true, message: '必填' }] }) } type="text"  />
            </FormItem>
            </Col>
            </Row>
            <Row>
            <Col span="22">

        </Col>


        </Row>
            </Form>
            </Modal>
    );
    }
});
UpView = createForm()(UpView);
export default UpView;
