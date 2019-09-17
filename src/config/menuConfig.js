const menuList = [
    {
        title: '产品管理',
        key: '/productManage',
        icon: 'crown',
        children: [
            {
                title: '分类管理',
                key: '/productManage/classifyManage',
                icon: 'table'
            },
            // {
            //     title: '标签分类校准',
            //     key: '/productManage/labelClassifyCalibration',
            // },
            // {
            //     title: '标签管理',
            //     key: '/productManage/labelManage',
            // },
            {
                title: '产品资料管理',
                key: '/productManage/goodsDataManage',
                icon: 'file'
            },
        ]
    },
    {
        title: '前台管理',
        key: '/ffManage',
        icon: 'desktop',
        children: [
            // {
            //     title: '前台分类管理',
            //     key: '/ffManage/classifyManage',
            //     icon: ''
            // },
            // {
            //     title: '前台标签管理',
            //     key: '/ffManage/labelManage',
            // },
            {
                title: '前台平台管理',
                key: '/ffManage/platformManage',
                icon: 'book'
            },
            {
                title: '前台首页管理',
                key: '/ffManage/homeManage',
                icon: 'home'
            }
        ]
    },
    {
        title: '专栏文章',
        key: '/columnArticle',
        icon: 'folder-add',
        children: [
            {
                title: '文章管理',
                key: '/columnArticle/articleManage',
                icon: 'book'
            }
        ]
    },
];
export default menuList;