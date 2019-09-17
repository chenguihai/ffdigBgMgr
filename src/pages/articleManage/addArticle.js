import 'braft-editor/dist/index.css'
import React, {Component} from 'react';
import {Button, Card, Col, Form, Icon, Input, message, Row, Select, Spin, Upload} from 'antd';
import {Link} from 'react-router-dom'
import axiosHttp from '../../utils/ajax'
import config from '../../config/config'
import Utils from '../../utils/utils'
import PreviewArticleCpn from '../../components/previewArticleCpn'
import CropperCpn from '../../components/CropperCpn'
import PreviewPictureCpn from '../../components/PreviewPictureCpn'
import BraftEditor from 'braft-editor'
import {ContentUtils} from 'braft-utils'
import AddArticleType from "./addArticleType";
import './index.less'

const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;
const formItemLayout = {
    labelCol: {
        sm: {span: 24},
        md: {span: 6},//768
        lg: {span: 5},//992
        xl: {span: 4}, //1200
        xxl: {span: 3}, //1600
    },
    wrapperCol: {
        sm: {span: 24},
        md: {span: 18},
        lg: {span: 19},
        xl: {span: 20},
        xxl: {span: 21},
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        sm: {span: 24, offset: 0},
        md: {span: 18, offset: 6},
        lg: {span: 19, offset: 5},
        xl: {span: 20, offset: 4},
        xxl: {span: 21, offset: 3},
    },
};
// 定义rem基准值
const sizeBase = 50;

// 定义输入转换函数
const unitImportFn = (unit, type, source) => {
    // type为单位类型，例如font-size等
    // source为输入来源，可能值为create或paste
    // 此函数的返回结果，需要过滤掉单位，只返回数值
    if (unit.indexOf('rem')) {
        return parseFloat(unit, 10) * sizeBase
    } else {
        return parseFloat(unit, 10)
    }
};

// 定义输出转换函数
const unitExportFn = (unit, type, target) => {
    if (type === 'line-height') {
        // 输出行高时不添加单位
        return unit
    }
    // target的值可能是html或者editor，对应输出到html和在编辑器中显示这两个场景
    if (target === 'html') {
        // 只在将内容输出为html时才进行转换
        return unit / sizeBase + 'rem'
    } else {
        // 在编辑器中显示时，按px单位展示
        return unit + 'px'
    }
};

//返回一个 promise：检测通过则返回resolve；失败则返回reject，并阻止图片上传
function checkImageWH(file) {
    return new Promise(function (resolve, reject) {
        let filereader = new FileReader();
        filereader.onload = e => {
            let src = e.target.result;
            const image = new Image();
            image.onload = function () {
                // 获取图片的宽高，并存放到file对象中
                // console.log('file width :' + this.width);
                // console.log('file height :' + this.height);
                file.width = this.width;
                file.height = this.height;
                resolve();
            };
            image.onerror = reject;
            image.src = src;
        };
        filereader.readAsDataURL(file);
    });
}

function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
}

function dataURLtoFile(dataurl, filename) {//将base64转换为文件，dataurl为base64字符串，filename为文件名（必须带后缀名，如.jpg,.png）
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
}

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
    // && checkImageWH(file);
}


const excludeControls = ['code'];

class AddArticle extends Component {
    state = {
        loading: false,
        editorState: BraftEditor.createEditorState(null), // 设置编辑器初始内容
        isPreviewArticle: false,
        isAddArticleType: false,
        authorOption: [],
        authorFilter: [],
        authorValue: '火联',
        translatorOption: [],
        translatorFilter: [],
        translatorValue: '',

        articleCategory: [],
        articleDetail: {},
        previewArticle: {},
        isCropper: false,
        isPreviewPicture: false,
        isLoading: false,
        submitLoading: false,
    };
    pageInfo = {
        article_id: 0,
        category_id: 0,
        img_url: '',
    };
    authorization = window.sessionStorage.getItem("authorization") || "";
    isAddArticle = '';
    timer = null;

    componentDidMount() {
        // 异步设置编辑器内容
        let {addArticle = ''} = this.props.match.params;
        this.isAddArticle = addArticle;
        if (addArticle !== 'addArticle') {
            this.getArticleByIdHttp(addArticle)
        }
        this.getArticleCategoryListHttp();
    }


    getArticleByIdHttp = (id) => {  // 通过id获取文章详细信息
        this.setState({
            isLoading: true
        });
        axiosHttp(`api/AdminSite/Article/GetArticleById?article_id=${id}`, '', 'get').then((res) => {
            if (res.code === 200) {
                const data = res.data;
                this.setState({
                    articleDetail: data,
                    editorState: BraftEditor.createEditorState(data.content_hrml_pc), // 设置编辑器初始内容
                });
                this.pageInfo.article_id = data.article_id;
                this.pageInfo.category_id = data.category_id;
                this.pageInfo.img_url = data.img_url;
                this.props.form.setFieldsValue({
                    // "article_id": data.article_id,
                    "title": data.title,
                    "author": data.author,
                    "author_translate": data.author_translate,
                    // "category_id": data.category_id,
                    "category_name": data.category_name,
                    "summary": data.summary,
                    "keyword": data.keyword.split(','),
                    "img_url": data.img_url,
                    // "content": BraftEditor.createEditorState(data.content),
                    // "content_hrml_pc": data.content_hrml_pc,
                    // "content_hrml_h5": data.content_hrml_h5,
                })
            }
            this.setState({
                isLoading: false
            });
        }).catch(e => {
            console.log(e)
            this.setState({
                isLoading: false
            });
        })
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                // console.log(values);
                this.saveArticleHttp(values);
            }
        });
    };
    _handleArticleTitleRules = (rule, value, callback) => { //验证文章title
        value = value.trim();
        if (this.state.articleDetail.title === value) {
            callback();
            return
        }
        if (!value) {
            callback('文章title不能为空');
        } else if (!Utils.wordBlankSpaceReg(value)) {
            callback('限输入300个字，英文字按空格计，其他不限制');
        } else {
            this.existsArticleInfoHttp(value).then(res => {
                if (res.code === 200) {
                    callback();
                } else {
                    callback('文章title已存在');
                }
            }).catch(e => {
                callback(e);
            });
        }
    };
    existsArticleInfoHttp = (content) => {  // 判断文章信息是否存在
        let param = {
            type: 1, //1.标题是否存在 2.作者是否存在 3.译者是否存在 4.文章类型是否存在
            type_name: content, //具体需要判断重复的文本信息
        };
        return new Promise((resolve, reject) => {
            axiosHttp(`api/AdminSite/Article/ExistsActicleInfo`, Utils.obj2FormData(param)).then((res) => {
                resolve(res);
            }).catch(e => {
                reject(e)
            })
        });
    };
    _handleAuthorRules = (rule, value, callback) => { //验证昵称
        if (!value) {
            callback('作者不能为空');
        } else if (!Utils.wordBoundsReg(value)) {
            callback('16个字以内');
        } else {
            callback();
        }
    };
    _handleTranslatorRules = (rule, value, callback) => { //验证昵称
        console.log(value, Utils.wordBoundsReg(value));
        if (value && !Utils.wordBoundsReg(value)) {
            callback('16个字以内');
        } else {
            callback();
        }
    };

    handleContentChange = (editorState) => {
        this.setState({
            editorState: editorState,
        });
    };

    _handlePreviewText = () => {
        this.setState({
            isPreviewArticle: true,
            previewArticle: this.props.form.getFieldsValue()
        });
    };
    handleAvatarChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }
        if (info.file.status === 'done') {
            let data = info.file.response;
            if (data.code === 200) {
                this.pageInfo.img_url = data.data[0];
                this.props.form.setFieldsValue({
                    "img_url": data.data[0]
                });
                this.setState({
                    loading: false,
                    isCropper: true
                })
            } else {
                message.error('图片上传失败')
            }
        }
    };
    uploadImgToServer = (url) => {
        this.uploadImageHttp(url);
    };
    _handleAuthorChange = (e) => {
        let input = e.target.value || '';
        this.timer = setTimeout(() => {
            this.getDistinctAuthorHttp(input);
            clearTimeout(this.timer);
        }, 200);
    };
    _handleAuthorClickItem = (item) => {
        this.props.form.setFieldsValue({
            author: item
        });
        this.setState({
            authorValue: item
        })
    };
    _handleTranslatorChange = (e) => {
        let input = e.target.value || '';
        this.timer = setTimeout(() => {
            this.getDistinctAuthorHttp(input, 2);
            clearTimeout(this.timer);
        }, 200);
    };
    _handleTranslatorClickItem = (item) => {
        this.props.form.setFieldsValue({
            author_translate: item
        });
        this.setState({
            translatorValue: item
        })
    };
    showAddArticleType = () => {
        this.setState({
            isAddArticleType: true,
        })
    };
    addArticleType = (value) => {
        this.addArticleCategoryHttp(value);
    };
    addArticleCategoryHttp = (item) => { //新增文章类型
        axiosHttp('api/AdminSite/Article/AddAcricleCategory', Utils.obj2FormData(item)).then((res) => {
            if (res.code === 200) {
                message.success(res.msg);
                this.props.form.setFieldsValue({
                    "category_name": item.category_name
                });
                this.pageInfo.category_id = res.data;
                this.getArticleCategoryListHttp();
                this.setState({
                    isAddArticleType: false,
                });
            } else {
                message.error(res.msg)
            }
        }).catch(e => {
            console.log(e);
        })
    };


    getDistinctAuthorHttp = (keyword, type = 1) => { //通过关键词获取作者或者译者集合
        let param = {
            type: type, //type=1:获取作者集合 type=2:获取译者集合
            keywokd: keyword,
        };
        axiosHttp('api/AdminSite/Article/GetDistinctAuthor', Utils.obj2FormData(param)).then((res) => {
            if (res.code === 200) {
                if (type === 1) {
                    this.setState({
                        authorOption: res.data,
                        authorFilter: res.data.filter((item, index) => item.toLowerCase().indexOf(keyword.toLowerCase()) >= 0)
                    });
                } else {
                    this.setState({
                        translatorOption: res.data,
                        translatorFilter: res.data.filter((item, index) => item.toLowerCase().indexOf(keyword.toLowerCase()) >= 0)
                    })
                }
            } else {
                message.error(res.msg)
            }
        }).catch(e => {
            console.log(e);
            this.setState({
                authorOption: [],
                translatorOption: []
            })
        })
    };


    getArticleCategoryListHttp = () => { //获取文章分类列表
        axiosHttp('api/AdminSite/Article/GetArticleCategoryList', {}).then((res) => {
            if (res.code === 200) {
                this.setState({
                    articleCategory: res.data.reverse()
                })
            } else {
                message.error(res.msg)
            }
        }).catch(e => {
            console.log(e);
        })
    };
    uploadImageHttp = (img) => { //获取文章分类列表
        var fileURL = dataURLtoBlob(img);
        var file = new FormData();
        file.append("avatar", fileURL);
        axiosHttp(`api/AdminSite/Article/UploadImage`, file).then((res) => {
            if (res.code === 200) {
                this.props.form.setFieldsValue({
                    "img_url": res.data[0],
                });
                this.pageInfo.img_url = res.data[0];
                this.setState({
                    isCropper: false
                })
            } else {
                message.error(res.msg)
            }
        }).catch(e => {
            console.log(e);
        })
    };


    saveArticleHttp = (value) => { //保存文章信息
        const {keyword, ...props} = value;
        const {editorState} = this.state;
        this.setState({
            submitLoading: true
        });
        axiosHttp('api/AdminSite/Article/SaveActicle', {
            ...props, ...this.pageInfo,
            content: editorState.toText(),
            content_hrml_pc: editorState.toHTML(),
            content_hrml_h5: editorState.toHTML(unitExportFn),
            keyword: keyword.toString(),
        }).then((res) => {
            if (res.code === 200) {
                this.pageInfo.article_id = res.data || 0;
                // this.props.history.push('/columnArticle/articleManage');
                message.success('文章保存成功');
            } else {
                message.error(res.msg)
            }
            this.setState({
                submitLoading: false
            });
        }).catch(e => {
            this.setState({
                submitLoading: false
            });
        })
    };
    selectArticleType = (value) => {
        let data = this.state.articleCategory.filter((item, index) => item.category_name === value);
        this.pageInfo.category_id = data[0].category_id;
    };
    uploadHandler = (info) => {
        if (!info.file) {
            return false
        }
        if (info.file.status === 'uploading') {
            this.setState({loading: true});
            return;
        }
        if (info.file.status === 'done') {
            let data = info.file.response;
            if (data.code === 200) {
                this.setState({
                    loading: false,
                    editorState: ContentUtils.insertMedias(this.state.editorState, [{
                        type: 'IMAGE',
                        url: info.file.response.data[0] || URL.createObjectURL
                    }])
                })
            } else {
                message.error('图片上传失败');
            }

        }
    };
    cancelPopup = () => {
        this.setState({
            isPreviewArticle: false,
            isAddArticleType: false,
            isPreviewPicture: false,
        });
    };
    cancelCropperPopup = () => {
        const {articleDetail = {}} = this.state;
        this.props.form.setFieldsValue({
            "img_url": articleDetail.img_url || '',
        });
        this.pageInfo.img_url = articleDetail.img_url || '';
        this.setState({
            isCropper: false,
        })
    };
    handleLabelChange = (value) => {
        this.props.form.setFieldsValue({
            "keyword": value.splice(8),
        })
    };
    previewCover = (value) => {
        // this.props.form.setFieldsValue({
        //     "keyword": value.splice(8),
        // })
        this.setState({
            isPreviewPicture: true
        })
    };

    myUploadFn = (param) => {
        console.log(param);

        const serverURL = `${config.baseUrl}api/AdminSite/Article/UploadImage`;
        const xhr = new XMLHttpRequest;
        const fd = new FormData();

        const successFn = (response) => {
            console.log(response, JSON.parse(xhr.responseText).data[0]);
            // 假设服务端直接返回文件上传后的地址
            // 上传成功后调用param.success并传入上传后的文件地址
            param.success({
                url: JSON.parse(xhr.responseText).data[0],
                meta: {
                    id: 'xxx',
                    title: 'xxx',
                    alt: 'xxx',
                    loop: true, // 指定音视频是否循环播放
                    autoPlay: true, // 指定音视频是否自动播放
                    controls: true, // 指定音视频是否显示控制栏
                    poster: 'http://xxx/xx.png', // 指定视频播放器的封面
                }
            })
        };

        const progressFn = (event) => {
            // 上传进度发生变化时调用param.progress
            param.progress(event.loaded / event.total * 100)
        };

        const errorFn = (response) => {
            // 上传发生错误时调用param.error
            param.error({
                msg: 'unable to upload.'
            })
        };

        xhr.upload.addEventListener("progress", progressFn, false);
        xhr.addEventListener("load", successFn, false);
        xhr.addEventListener("error", errorFn, false);
        xhr.addEventListener("abort", errorFn, false);

        fd.append('file', param.file);
        xhr.open('POST', serverURL, true);
        xhr.setRequestHeader("Authorization", "bearer " + this.authorization);
        xhr.send(fd)

    };

    componentWillUnmount() {
        clearTimeout(this.timer);
        this.timer = null;
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const style = {
            width_300: {width: 300}
        };
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'}/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        let {editorState, isPreviewArticle, isAddArticleType, authorFilter, authorValue, translatorFilter, translatorValue, articleCategory, previewArticle, isCropper, isPreviewPicture, isLoading, submitLoading} = this.state;
        const props = {
            // accept: 'png,jpg,jpeg,bmp,gif,ico,PNG,JPG,JPEG,BMP,GIF,ICO',
            accept: 'image/*',
            action: `${config.baseUrl}api/AdminSite/Article/UploadImage`,
            showUploadList: false,
            withCredentials: true,
            headers: {
                // authorization: 'authorization-text',
                "Authorization": "bearer " + this.authorization,
            },
        };
        const extendControls = [
            {
                key: 'antd-uploader',
                type: 'component',
                component: (
                    <Upload {...props}
                            onChange={this.uploadHandler}
                        // customRequest={this.uploadHandler}
                    >
                        {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
                        <button type="button" className="control-item button upload-button" data-title="插入图片">
                            <Icon type="picture" theme="filled"/>
                        </button>
                    </Upload>
                )
            }
        ];
        const {img_url} = this.pageInfo;
        return (
            <Spin spinning={isLoading}>
                <Card style={{width: '100%'}} title="文章管理">
                    <h3 className="titleBox" onClick={() => {
                        this.props.history.push('/columnArticle/articleManage');
                    }}><Icon type="left-circle" theme="filled"/><span
                        className="title">{this.isAddArticle !== 'addArticle' ? '编辑文章' : '新增文章'}</span></h3>
                    <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                        <FormItem label="文章title" colon={false}>
                            {getFieldDecorator('title', {
                                rules: [
                                    {
                                        required: true,
                                        message: '不能为空',
                                    },
                                    {
                                        validator: this._handleArticleTitleRules
                                    }
                                ],
                                validateTrigger: 'onBlur',
                            })(<TextArea
                                placeholder="限300个字以内"
                                autosize={{minRows: 2, maxRows: 6}}
                            />)}
                        </FormItem>
                        <FormItem label="作者" className="authorWrap" colon={false}>
                            {getFieldDecorator('author', {
                                initialValue: '火联',
                                rules: [{
                                    required: true,
                                    message: '不能为空',
                                }, {
                                    validator: this._handleAuthorRules
                                }],
                                validateTrigger: 'onBlur',
                            })(
                                <Input style={style.width_300} placeholder="请输入作者" allowClear
                                       onChange={this._handleAuthorChange}/>
                            )}
                            {/*作者的下拉选项*/}
                            <ul className="authorUl ant-select-dropdown">
                                {
                                    authorFilter.map((item, index) => {
                                        return (
                                            <li key={index} onClick={this._handleAuthorClickItem.bind(this, item)}
                                                className={`ant-select-dropdown-menu-item ${authorValue === item ? 'ant-select-dropdown-menu-item-selected' : ''}`}>{item}</li>)
                                    })
                                }
                            </ul>
                        </FormItem>
                        <FormItem label="译者" className="authorWrap" colon={false}>
                            {getFieldDecorator('author_translate', {
                                initialValue: '',
                                rules: [{
                                    validator: this._handleTranslatorRules
                                }],
                                validateTrigger: 'onBlur',
                            })(
                                <Input style={style.width_300} placeholder="请输入译者" allowClear
                                       onChange={this._handleTranslatorChange}/>
                            )}
                            {/*译者的下拉选项*/}
                            <ul className="authorUl ant-select-dropdown">
                                {
                                    translatorFilter.map((item, index) => {
                                        return (
                                            <li key={index} onClick={this._handleTranslatorClickItem.bind(this, item)}
                                                className={`ant-select-dropdown-menu-item ${translatorValue === item ? 'ant-select-dropdown-menu-item-selected' : ''}`}>{item}</li>)
                                    })
                                }
                            </ul>
                        </FormItem>
                        <FormItem label="文章类型" help="* 用于在前台供用户筛选文章" className="authorWrap" colon={false}>
                            {getFieldDecorator('category_name', {
                                initialValue: '',
                                rules: [{required: true, message: '文章类型不能为空', whitespace: true}],
                                validateTrigger: 'onBlur',
                            })(
                                <Select style={style.width_300} onChange={this.selectArticleType}>
                                    <Option value="">--选择类型--</Option>
                                    {
                                        articleCategory.map((item, index) => {
                                            return (
                                                <Option key={index}
                                                        value={item.category_name}>{item.category_name}</Option>
                                            )
                                        })
                                    }
                                </Select>
                            )}&nbsp;&nbsp;&nbsp;
                            <Icon type="plus-circle" className="plusCircleIcon" onClick={this.showAddArticleType}/>
                        </FormItem>
                        <FormItem label="摘要（descrition）" colon={false}>
                            {getFieldDecorator('summary', {
                                rules: [{required: true, message: '摘要（descrition）不能为空'}],
                                validateTrigger: 'onBlur',
                            })(
                                <TextArea
                                    placeholder="限300个字以内"
                                    autosize={{minRows: 2, maxRows: 6}}
                                />
                            )}
                        </FormItem>
                        <FormItem label="标签（keyword）" help="* 同时添加多个标签用逗号隔开" colon={false}>
                            {getFieldDecorator('keyword', {
                                rules: [{required: true, message: '标签（keyword）不能为空'}],
                            })(
                                <Select mode="tags" style={{width: '100%'}} placeholder="Tags Mode" allowClear
                                        onChange={this.handleLabelChange}
                                        tokenSeparators={[',', '，']}/>
                            )}
                        </FormItem>
                        <FormItem label="封面（cover）" colon={false}>
                            {getFieldDecorator('img_url', {
                                rules: [{required: true, message: '封面（cover）不能为空'}],
                            })(
                                <Upload name="avatar" {...props}
                                        listType="picture-card"
                                        className="avatar-uploader"
                                    // action={`${config.baseUrl}api/AdminSite/Article/UploadImage`}
                                        beforeUpload={beforeUpload}
                                        onChange={this.handleAvatarChange}
                                >
                                    {img_url ?
                                        <img src={img_url} alt="avatar" style={{width: '100%'}}/>
                                        : uploadButton}
                                </Upload>
                            )}
                            <Button onClick={this.previewCover}>预览</Button>
                        </FormItem>
                        <Row>
                            <Col {...formItemLayout.labelCol} className="uEditorLeft">
                                正文内容&nbsp;&nbsp;&nbsp;&nbsp;</Col>
                            <Col {...formItemLayout.wrapperCol}>
                                <p className="tips mb10">* Shift + Enter 实现换行效果（&lt;br/&gt;），Enter 开启一个新段落</p>
                                <div className="editor-wrapper">
                                    <BraftEditor placeholder="shift+enter实现换行效果"
                                                 excludeControls={excludeControls}
                                                 value={editorState}
                                        // converts={{unitImportFn, unitExportFn}}
                                                 media={{uploadFn: this.myUploadFn}}
                                                 extendControls={extendControls}
                                                 onBlur={this.handleContentChange}
                                    />
                                </div>
                            </Col>
                        </Row>
                        {/*<FormItem {...formItemLayout} label="文章正文">*/}
                        {/*{getFieldDecorator('content', {*/}
                        {/*// initialValue: '<p/>',*/}
                        {/*rules: [{*/}
                        {/*required: true,*/}
                        {/*validator: (_, value, callback) => {*/}
                        {/*if (value.isEmpty()) {*/}
                        {/*callback('请输入正文内容')*/}
                        {/*} else {*/}
                        {/*callback()*/}
                        {/*}*/}
                        {/*}*/}
                        {/*}, {*/}
                        {/*validator: this.handleContentChange*/}
                        {/*}],*/}
                        {/*validateTrigger: 'onBlur',*/}
                        {/*})(*/}
                        {/*// value={editorState}*/}
                        {/*<BraftEditor className="editor-wrapper" placeholder="请输入正文内容"/>*/}
                        {/*)}*/}
                        {/*</FormItem>*/}
                        <FormItem {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" loading={submitLoading}>保存</Button>
                            <Button onClick={this._handlePreviewText}>预览</Button>
                            <Link to="/columnArticle/articleManage">
                                <Button>取消</Button>
                            </Link>
                        </FormItem>
                    </Form>
                </Card>
                {
                    isPreviewArticle ?
                        <PreviewArticleCpn data={previewArticle} content={editorState.toHTML()}
                                           title='预览文章'
                                           onCancelPopup={this.cancelPopup}/> : null
                }

                <AddArticleType visible={isAddArticleType} title='添加文章类型'
                                onCancelPopup={this.cancelPopup} sure={this.addArticleType}/>
                {
                    // visible={isCropper}
                    isCropper ? <CropperCpn title="裁切图片" content={img_url}
                                            sure={this.uploadImgToServer}
                                            onCancelPopup={this.cancelCropperPopup}/> : null
                }

                <PreviewPictureCpn title="预览图片" visible={isPreviewPicture} content={img_url}
                                   onCancelPopup={this.cancelPopup}/>
            </Spin>
        );
    }
}

export default Form.create()(AddArticle);