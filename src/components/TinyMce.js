import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default class TinyMce extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleEditorChange = (content, editor) => {
        this.props.setarticleContentHandle(content)   //props.父级的方法，自己定义
    }

    setContent = (content) => {
        window.tinymce.activeEditor.setContent(content)
    }
    
    render() {
        return (
            <Editor
                initialValue={this.props.detail}   //父组件传的值
                apiKey="coex6yg7qr4v4niw88ee2e2hh11wty3fydz0zx5iysfvuwkb"   //可以到官网获取自己的
                init={{
                    language: 'zh_CN',
                    height: 500,
                    branding: false,
                    menubar: false,
                    statusbar: false,
                    plugins: 'lists image media table wordcount preview',
                    toolbar: 'undo redo | bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | preview'
                }}
                onEditorChange={this.handleEditorChange}
            />
        )
    }
}