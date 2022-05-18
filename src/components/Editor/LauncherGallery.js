import React, {  Component, useState, useEffect } from 'react'
import PropTypes from "prop-types"
import { Entity } from 'draft-js'
import IconButton from '@material-ui/core/IconButton'
import MediaIcon from '@material-ui/icons/PermMedia'
import MediaGallery from "../MediaGallery"

class LauncherGallery extends Component {
    static propTypes = {
      onChange: PropTypes.func,
      editorState: PropTypes.object,
    };

    constructor(props) {
        super(props)
        this.state = {
            expanded: false,
        };
        //modalHandler.registerCallBack(this.expandCollapse);
    }
   
    doExpand() {
        this.setState({
            expanded: true,
        })
    }

    doCollapse = () => {
        console.log("collapsed")
        this.setState({
            expanded: false,
        })
    }

    render() {
        const { expanded } = this.state
        return (
            <>
                <IconButton onClick={this.doExpand.bind(this)}>
                    <MediaIcon />
                </IconButton>
                <MediaGallery 
                    expanded={this.state.expanded} 
                    doCollapse={this.doCollapse.bind(this)} 
                    pushItem={(item)=>{
                        this.setState({
                            expanded: false,
                        })
                        this.props.onInsert(item)
                    }}
                />
            </>
        )
    }
}

const Image = (props) => {
   
	return <div class="img-style">
        <img src={props.src} aria-desc={props.desc} width={'auto'} alt={props.title} />
    </div>;
};

export function Media(props) {
	const entity = Entity.get(props.block.getEntityAt(0));
	const {src,title} = entity.getData();
	const type = entity.getType();

	let media = null;
	if (type === 'IMAGE') {
		media = <Image title={title} desc={entity.getData()?.desc} src={src} />;
	}

	return media;
};

export default LauncherGallery
