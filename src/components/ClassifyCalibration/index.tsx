import React, {Component} from 'react'
import {Row, Col, Form, Select, Button, Divider} from 'antd'
import './index.less'

const FormItem = Form.Item;
const Option = Select.Option;

class ClassifyCalibration extends Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            cat2: [],
            cat3: []
        };
    }

    cat2: any[] = [];
    cat3: any[] = [];
    canRun: boolean = true;
    timer: any = null;

    componentDidMount() {
        const {data = []} = this.props;
        if (data.length > 0) {
            const cat2 = data[0].children, cat3 = cat2[0].children;
            this.setState({
                cat2, cat3
            });
        }
    }

    handleSubmit = (e: any) => {
        e.preventDefault();
        this.props.form.validateFields((err: any, values: object) => {
            if (!err) {
                // console.log(values);
                this.props.sure(values);
            }
        });
    };

    selectThreeLevelChange = (value: any) => {
        const {data,language} = this.props;
        let cat2 = [], cat3 = [],lang = '';
        for (let i = 0; i < data.length; i++) {
            cat2 = data[i].children;
            for (let j = 0; j < cat2.length; j++) {
                cat3 = cat2[j].children;
                for (let m = 0; m < cat3.length; m++) {
                    if (cat3[m].cat_id === value.key) {
                        lang = `cat_name_${language}`;
                        this.props.form.setFieldsValue({
                            cat1: {key: data[i].cat_id, label: data[i][lang]},
                            cat2: {key: cat2[j].cat_id, label: cat2[j][lang]},
                        });
                        this.setState({
                            cat2: cat2,
                            cat3: cat3,
                        });
                    }
                }
            }
        }
    };

    selectTwoLevelChange = (value: any) => {
        const {data,language} = this.props;
        let cat2 = [], cat3 = [];
        for (let i = 0; i < data.length; i++) {
            cat2 = data[i].children;
            for (let j = 0; j < cat2.length; j++) {
                if (cat2[j].cat_id === value.key) {
                    cat3 = cat2[j].children;
                    this.props.form.setFieldsValue({
                        cat1: {key: data[i].cat_id, label: data[i][`cat_name_${language}`]},
                        cat3: {key: '', label: ''},
                    });
                    this.setState({
                        cat2: cat2,
                        cat3: cat3,
                    });
                    break;
                }
            }
        }


    };

    selectOneLevelChange = (value: any) => {
        const {data} = this.props;
        for (let i = 0; i < data.length; i++) {
            if (data[i].cat_id === value.key) {
                let cat2 = data[i].children, cat3 = (cat2[0] && cat2[0].children) || [];
                this.props.form.setFieldsValue({
                    cat2: {key: '', label: ''},
                    cat3: {key: '', label: ''},
                });
                this.setState({
                    cat2: cat2,
                    cat3: cat3,
                });
                break;
            }
        }
    };
    searchTwoLevel = (value: string) => {
        // this.functionThrottling(value)
    };

    searchThreeLevel = (value: string) => {
        // this.functionThrottling(value, 3)
    };
    functionThrottling = (value: string, type: number = 2) => {//函数节流
        if (!this.canRun) {
            return;
        }
        this.canRun = false;
        this.timer = setTimeout(() => {
            if (value) {
                // @ts-ignore
                this[`cat${type}`] = this.state[`cat${type}`];
                // @ts-ignore
                let value: any = this[`searchCat${type}`];
                this.setState({
                    [`cat${type}`]: value
                })
            }
            this.canRun = true;
        }, 400);
    };

    componentWillUnmount() {
        clearTimeout(this.timer);
    }

    render() {
        const {form: {getFieldDecorator}, open, data = [], language} = this.props;
        const style = {
            marginTB10: {margin: '10px 0'},
        };
        const {cat2, cat3} = this.state;
        return (
            <Form onSubmit={this.handleSubmit} className='classify-wrap'>
                <Row gutter={10}>
                    <Col span={8}>
                        <FormItem label='一级分类'>
                            {getFieldDecorator('cat1')(
                                <Select className='select-opacity' open={open} onChange={this.selectOneLevelChange}
                                        defaultActiveFirstOption={false} placeholder='请选择一级条目'
                                        showSearch
                                        labelInValue={true}
                                        filterOption={(input: any, option: any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {data.map((item: any) => {
                                            return (
                                                <Option key={item.cat_name_cn}
                                                        value={item.cat_id}>{item[`cat_name_${language}`]}</Option>)
                                        }
                                    )
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label='二级分类'>
                            {getFieldDecorator('cat2')(
                                <Select className='select-opacity' open={open} onChange={this.selectTwoLevelChange}
                                        labelInValue={true}
                                        defaultActiveFirstOption={false} placeholder='请选择二级条目'
                                        filterOption={(input: any, option: any) => {
                                            return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        }
                                        onSearch={this.searchTwoLevel}
                                        showSearch>
                                    {cat2.map((item: any) => {
                                        return (<Option key={item.cat_name_cn}
                                                        value={item.cat_id}>{item[`cat_name_${language}`]}</Option>)
                                    })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label='三级分类'>
                            {getFieldDecorator('cat3', {})(
                                <Select className='select-opacity' open={open}
                                        defaultActiveFirstOption={false} placeholder='请选择三级条目'
                                        onChange={this.selectThreeLevelChange}
                                        labelInValue={true}
                                        filterOption={(input: any, option: any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        showSearch
                                        onSearch={this.searchThreeLevel}
                                >
                                    {cat3.map((item: any) => {
                                        return (
                                            <Option key={item.cat_name_cn}
                                                    value={item.cat_id}>{item[`cat_name_${language}`]}</Option>)
                                    })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Divider style={style.marginTB10}/>
                <div className='tr'>
                    <Button className='mr10' onClick={this.props.hide}>取消</Button>
                    <Button type="primary" onClick={this.handleSubmit}>确定</Button>
                </div>
            </Form>
        )
    }
}

export default Form.create()(ClassifyCalibration)