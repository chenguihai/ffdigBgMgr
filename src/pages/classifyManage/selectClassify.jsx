import React, {Component} from 'react'
import {Select, Divider} from 'antd'
import ClassifyCalibration from '../../components/ClassifyCalibration'
import {http} from "../../utils/ajax";

const Option = Select.Option;

export default class selectClassify extends Component {
    state = {
        selectItem: '全部',
        popupLoading: false,
        classifyCalFlag: false,
        selectData: [],
        languageType: 'cn'
    }
    pageInfo = {
        "cat1": null,
        "cat2": null,
        "cat3": null
    }
    params = {};

    componentDidMount() {
        http.get('api/AdminSite/BackstageCat/GetAllBackstageCat').then((res) => {

            this.setState({
                selectData: res
            })

        })
    }

    selectFocus = () => {
        const {classifyCalFlag} = this.state;
        this.setState({
            classifyCalFlag: !classifyCalFlag,
        });
    }
    handleChange = (value) => {
        this.setState({
            languageType: value == 1 ? 'cn' : 'en'
        })
    }
    cancelPopup = () => {
        this.setState({
            editClassifyFlag: false,
            classifyCalFlag: false
        })
    }
    _handleSureClassifyCal = (values) => {
        const {selectItem} = this.state;
        const {cat1 = '', cat2 = '', cat3 = ''} = values;
        if (selectItem === "全部" && cat1 === '') {
            this.setState({
                classifyCalFlag: false
            });
            return;
        }
        this.pageInfo.cat1 = cat1.key || null;
        this.pageInfo.cat2 = cat2.key || null;
        this.pageInfo.cat3 = cat3.key || null;
        let data = this.pageInfo;
        this.params = {cat1: data.cat1, cat2: data.cat2, cat3: data.cat3};
        let value = `${cat1.label}${cat2.label ? '/' + cat2.label : ''}${cat3.label ? '/' + cat3.label : ''}`;
        this.setState({
            selectItem: value === 'undefined' ? '全部' : value
        }, () => {
            if (this.props.onSelect) {
                this.props.onSelect(this.params)
            }
        });
        this.cancelPopup();

    }

    render() {
        const {
            selectItem,
            popupLoading,
            classifyCalFlag,
            selectData,
            languageType
        } = this.state
        const style = {
            width_120: {width: 120},
            width_200: {width: 200},
            width_auto: {width: 'auto'},
            marginTB10: {margin: '10px 0'},
            scroll: {y: this.scrollY, x: 1000},
            dropdownStyle: {width: 700, height: 465, padding: 10}
        };
        return (
            <Select loading={popupLoading} open={classifyCalFlag}
                    dropdownMatchSelectWidth={false} value={selectItem}
                    onFocus={this.selectFocus} allowClear
                    className="dropdownClassName"
                    dropdownStyle={style.dropdownStyle}
                    style={style.width_auto} dropdownRender={() => (
                <div className="selectBox">
                    <div className='select-title'><span>分类校准</span>
                        <div className='fr'><span className='mr10'>分类语言:</span>
                            <Select defaultValue='1' onChange={this.handleChange}
                                    style={style.width_120}>
                                <Option value='1'>中文</Option>
                                <Option value='0'>英文</Option>
                            </Select></div>
                    </div>
                    <Divider style={style.marginTB10}/>
                    <ClassifyCalibration open={classifyCalFlag}
                                         hide={this.cancelPopup}
                                         data={selectData}
                                         language={languageType}
                                         sure={this._handleSureClassifyCal}
                    />
                </div>

            )}
            />
        )
    }
}
