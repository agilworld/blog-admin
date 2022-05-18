import React, { Component } from 'react';
import Editor, {composeDecorators, createEditorStateWithText} from '@draft-js-plugins/editor';
import { withStyles } from '@material-ui/core/styles'
import { isEmpty, isNil, kebabCase, has, isString } from "lodash"
import { EditorState, ContentState, convertToRaw, SelectionState, Modifier, AtomicBlockUtils } from 'draft-js'
import createToolbarPlugin, { Separator,} from '@draft-js-plugins/static-toolbar';
import createInlineToolbarPlugin from '@draft-js-plugins/inline-toolbar';
import {
  ItalicButton,
  BoldButton,
  CodeButton,
  UnderlineButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
} from '@draft-js-plugins/buttons';
import createLinkifyPlugin from "@draft-js-plugins/linkify"
import createUndoPlugin from '@draft-js-plugins/undo';
import createImagePlugin from '@draft-js-plugins/image';
import createAlignmentPlugin from '@draft-js-plugins/alignment';
import createFocusPlugin from '@draft-js-plugins/focus';
import createResizeablePlugin from '@draft-js-plugins/resizeable';
import createLinkPlugin  from '@draft-js-plugins/anchor';
import createBlockDndPlugin from '@draft-js-plugins/drag-n-drop';
import createVideoPlugin from '@draft-js-plugins/video';
import LauncherGallery from "./LauncherGallery"
import htmlToDraft from "html-to-draftjs"

// Load css
import "../../../node_modules/@draft-js-plugins/alignment/lib/plugin.css"
import "../../../node_modules/@draft-js-plugins/undo/lib/plugin.css"
import "../../../node_modules/@draft-js-plugins/focus/lib/plugin.css"
import "../../../node_modules/@draft-js-plugins/anchor/lib/plugin.css"
import "../../../node_modules/@draft-js-plugins/inline-toolbar/lib/plugin.css"
import "../../../node_modules/@draft-js-plugins/static-toolbar/lib/plugin.css"
import "./style.css"

 // Draft js plugins
 const linkPlugin = createLinkPlugin();
 const linkifyPlugin = createLinkifyPlugin();
 const inlineToolbarPlugin = createInlineToolbarPlugin()
 const toolbarPlugin = createToolbarPlugin();

 const { InlineToolbar } = inlineToolbarPlugin
 const { Toolbar } = toolbarPlugin;
 const undoPlugin = createUndoPlugin();
 const focusPlugin = createFocusPlugin();
 const resizeablePlugin = createResizeablePlugin();
 const alignmentPlugin = createAlignmentPlugin();
 const blockDndPlugin = createBlockDndPlugin();

 const { AlignmentTool } = alignmentPlugin;
 const { LinkButton } = linkPlugin
 const decorator = composeDecorators(
   resizeablePlugin.decorator,
   alignmentPlugin.decorator,
   focusPlugin.decorator,
   blockDndPlugin.decorator
 )

 const imagePlugin = createImagePlugin({ decorator, theme:{
    image:'img-wrapper'
} });
 const videoPlugin = createVideoPlugin();
 const { UndoButton, RedoButton } = undoPlugin;

 const plugins = [
    toolbarPlugin,
    inlineToolbarPlugin,
    linkifyPlugin,
    linkPlugin,
    focusPlugin,
    alignmentPlugin,
    resizeablePlugin,
    imagePlugin,
    videoPlugin,
    undoPlugin,
    blockDndPlugin
];

const styles = ({
    editor:{
        boxSizing: 'border-box',
        border: '1px solid #ddd',
        cursor: 'text',
        padding: 14,
        position:"relative",
        borderRadius: 2,
        fontSize:18,
        fontFamily:"Lato, Roboto",
        overflow:'auto',
        marginBottom: '2em',
        boxShadow: 'inset 0px 1px 8px -3px #ABABAB',
        background: '#fefefe',
        minHeight: 300,
        '&:global(.public-DraftEditor-content)':{
          minHeight: 300
        }
    },
    headlineButtonWrapper: {
        display: 'inline-block'
    },
    regularButton:{
        display:'inline-block',
        '& > button':{
            paddingTop:4
        }
    },
    customButton:{
        boxShadow:'0px 1px 3px 0px rgba(220,220,220,1)',
        marginLeft:10,
        lineHeight:'1.6em',
        height:'2em',
        fontSize:'1.6em',
        borderRadius:0,
    },
    headlineButton: {
        background: '#fbfbfb',
        color: '#888',
        fontSize: 18,
        border: 0,
        paddingTop: 5,
        verticalAlign: 'bottom',
        height: 34,
        width: 36,
        '&:hover':{
            background: '#f3f3f3'
        },
        '&:focus':{
            background: '#f3f3f3'
        }
    }
})

function logEditorText(label, editorState) {
	const editorText = editorState.getCurrentContent().getPlainText();
    console.log(label, `"${editorText}"`);
}

function getBlockSelection(block, start, end) {
	const blockKey = block.getKey();
    return new SelectionState({
        anchorKey: blockKey,
        anchorOffset: start,
        focusKey: blockKey,
        focusOffset: end,
    });
}

function removeEditorStyles(editorState) {
	let newEditorState = editorState;
    let newContent = editorState.getCurrentContent();
	const blocks = newContent.getBlocksAsArray();
    for (let block of blocks) {
        block.findStyleRanges(() => true, function(start, end) {
            newContent = Modifier.removeInlineStyle(
                newContent,
                getBlockSelection(block, start, end),
                block.getInlineStyleAt(start),
            );
        });
        newEditorState = EditorState.push(newEditorState, newContent, 'change-inline-style');
    }
  
  return newEditorState;
}

class EditorJS extends Component {
    constructor(props) {
        super(props)
        this.state = {
            editorState:null
        }
        this.onChange = this.onChange.bind(this)
        this.onFocus = this.onFocus.bind(this)
        this.onBlur = this.onBlur.bind(this)
        this.onPaste = this.onPaste.bind(this)
        this.onInsert = this.onInsert.bind(this)
        this.editor = null
    }

    onChange(state) {
        this.setState({
            editorState:state
        })
        //this.props.onFinishChange(state)
    }

    componentDidMount() {
        if( this.props.initialEditorState ) {
            const contentBlock = htmlToDraft(this.props.initialEditorState);
            const content2 = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const defaultContent = EditorState.createWithContent(content2);

            this.setState({
                editorState:defaultContent
            })
            this.props.onFinishChange(defaultContent)
        } else {
            
            this.setState({
                editorState:EditorState.createEmpty()
            })
            this.props.onFinishChange(EditorState.createEmpty())
        }
    }

    onInsert = (item, event) => {
        const editorState = this.state.editorState
        const newContentState = imagePlugin.addImage(editorState, item.url, {
            title:item.title, alt:isEmpty(item.description)?item.title:item.description, height:'auto', width:'912px'
        })
        this.setState({
            editorState:newContentState
        })
        console.log( convertToRaw(newContentState.getCurrentContent()) )
        logEditorText('setState@onInsert', newContentState);
    }

    onPaste(event) {
        const newEditorState = removeEditorStyles(this.state.editorState);
        this.setState({
            editorState: newEditorState
        })
        logEditorText('setState@onPaste', newEditorState);
    }

    onFocus() {
        this.editor.focus();
    }

    onBlur() {
        this.props.onFinishChange(this.state.editorState)
    }

    toolbarComponents = (externalProps) => {
        const { classes } = this.props
        return <div style={{zIndex:2000, marginTop:4}}>
            <BoldButton {...externalProps} />
            <ItalicButton {...externalProps} />
            <UnderlineButton {...externalProps} />
            <CodeButton {...externalProps} />
            <Separator {...externalProps} />
            <HeadlinesButtonsContainer {...externalProps} />
            <UnorderedListButton {...externalProps} />
            <OrderedListButton {...externalProps} />
            <BlockquoteButton {...externalProps} />
            <CodeBlockButton {...externalProps} />
            <LinkButton {...externalProps} />
        </div>
    }

    render() {
        const { classes } = this.props
        return(<div style={{flexDirection:"row", justifyContent:"flex-start"}}>
            
            {this.state.editorState && <div className={classes.editor} onBlur={this.onBlur} onClick={this.onFocus}>
                <div style={{marginBottom:20, display:'inline-flex'}}>
                    <Toolbar>
                        {this.toolbarComponents}
                    </Toolbar> 
                    <UndoButton className={classes.customButton} /> 
                    <RedoButton className={classes.customButton} /> 
                </div>
                
                <AlignmentTool />
                
                <Editor
                    editorState={this.state.editorState}
                    onChange={this.onChange}
                    plugins={plugins}
                    ref={(element)=>this.editor=element}
                />

                <InlineToolbar>
                    {this.toolbarComponents}
                </InlineToolbar>
            </div>}
            </div>
        )
    }
}


class HeadlinesPicker extends Component {
    componentDidMount() {
      setTimeout(() => {
        window.addEventListener('click', this.onWindowClick);
      });
    }
  
    componentWillUnmount() {
      window.removeEventListener('click', this.onWindowClick);
    }
  
    onWindowClick = () =>
      // Call `onOverrideContent` again with `undefined`
      // so the toolbar can show its regular content again.
      this.props.onOverrideContent(undefined);
  
    render() {
      //const buttons = [HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton];
      const buttons = [HeadlineTwoButton, HeadlineThreeButton];
      return (
        <div>
          {buttons.map((Button, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <Button key={i} {...this.props} />
          ))}
        </div>
      );
    }
}


class HeadlinesButton extends Component {
    onMouseDown = (event) => event.preventDefault();
    onClick = () => this.props.onOverrideContent(HeadlinesPicker);
    render() {
        const { classes } = this.props
        return (
            <div onMouseDown={this.onMouseDown} className={classes.headlineButtonWrapper}>
                <button onClick={this.onClick} className={classes.headlineButton}>
                    H
                </button>
            </div>
        );
    }
}
  
const HeadlinesButtonsContainer = withStyles(styles, {withTheme:true})(HeadlinesButton)

export default withStyles(styles, {withTheme:true})(EditorJS)