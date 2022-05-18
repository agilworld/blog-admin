import React, {  Component, useState, useEffect } from 'react'
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { makeStyles, withStyles } from '@material-ui/core/styles'
import { EditorState, convertFromRaw, convertToRaw, ContentState, Modifier } from 'draft-js'
import config from "../config"
import Typography from "@material-ui/core/Typography"
import Grid from "@material-ui/core/Grid"
import Paper from '@material-ui/core/Paper'
import Backdrop from '@material-ui/core/Backdrop'
import Modal from '@material-ui/core/Modal'
import Fade from '@material-ui/core/Fade'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import Button from "@material-ui/core/Button"
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import MediaIcon from '@material-ui/icons/PermMedia'
import UploadIcon from "@material-ui/icons/CloudUpload"
import CancelIcon from "@material-ui/icons/CancelOutlined"
import {listGallery,uploadImages} from "../actions/gallery"
import { useDropzone } from 'react-dropzone'
import { useSnackbar } from "notistack"
import { forEach, isEmpty, debounce } from "lodash"
import clsx from "clsx"

const useStyles = makeStyles((theme) => ({
    paper: {
      display: 'flex',
      width:960,
      outline:'none',
      height:550,
      flexDirection: 'column',
    },
    paperHeader:{
        padding: theme.spacing(2),
        borderBottomStyle:'solid',
        borderBottomColor:'#ccc',
        borderBottomWidth:1
    },
    paperBody:{
        maxHeight:400
    },
    paperList:{
        height:400,
        overflowY:'auto',
        padding: theme.spacing(3),
        boxShadow:'inset 0 0 10px rgba(0,0,0,0.2)'
    },
    paperFooter:{
        paddingTop:20,
        borderTopStyle:'solid',
        borderTopColor:'#ccc',
        borderTopWidth:1,
        textAlign:'right',
        padding: theme.spacing(2),
    },
    uploader:{
        height:400,
        overflowY:'auto'
    },
    uploadBtns:{
        marginBottom:10,
        padding:theme.spacing(2)
    },
    upladerFields:{
        padding:theme.spacing(2)
    },
    imgWrapper:{
        textAlign:"center",
        width:'100%',
        background:'#dedede',
        border:'1px solid #ddd',
        marginBottom:7
    },
    fixedHeight: {
      height: 440,
    },
    dropzone:{
      border:"4px dashed #ddd",
      display:"flex",
      flexDirection:"column",
      height:330,
      marginTop:20,
      cursor:'pointer',
      padding:15,
      margin:theme.spacing(3),
      textAlign:"center",
      alignItems:"center",
      justifyContent:"center",
      color:"#aaa"
    },
    mediaItem:{
        maxWidth: 220,
        border:'2px solid transparent'
    },
    mediaItemActive:{
        border:'2px solid blue'
    },
    media:{
        height:140
    },
    // modal styling
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalPaper: {
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    backdrop:{
        backgroundColor:'rgba(0, 0, 0, 0.86)'
    }
}));

function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return false;
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return [
        parseFloat(bytes / Math.pow(1024, i)),
        sizes[i]
    ]
}

const MediaGallery = (props) =>  {
    const classes = useStyles()
    const [expanded, setExpanded] = useState(props.expanded)
    const { enqueueSnackbar } = useSnackbar()
    const [data, setData] = useState([])
    const [meta, setMeta] = useState(null)
    const [image, setImage] = useState(null)
    const [pick, setPick] = useState(null)
    const [loading, setLoading] = useState(false)
    const [params, setParams] = useState({
        limit:20,
        page:0
    })
    const [fields, setFields] = useState({
        title:'',
        desc:'',
        keyword:''
    })

    useEffect(() => {
        fetching()
    }, []);

    useEffect(() => {
        setExpanded(props.expanded)
    }, [props.expanded]);

    const fetching = () => {
        props.listGallery(params)
            .then(res=>{
                setData(res.data)
                setMeta(res.meta)
            })
    }

    const { getRootProps, getInputProps, open } = useDropzone({
        accept: 'image/*',
        minSize:config.uploadImage.minSize,
        maxSize:config.uploadImage.maxSize,
        multiple:false,
        maxFiles:1,
        resizeQuality:0.7,
        onDropRejected:(files2, event)=> {
            files2.map(file=>{
                file.errors.map(err=>{
                    if( err.code === 'file-too-small') {
                        enqueueSnackbar("Gagal Upload! file gambar tidak boleh kecil dari 5KB", {variant:"warning"})
                    } else {
                        enqueueSnackbar(err.message, {variant:"info"})
                    }
                })
            })
        },
        onDrop: acceptedFiles => {
            let a = acceptedFiles.map(file => {
                let reader = new FileReader();
                reader.readAsDataURL(file)
                reader.onloadend = async () => {
                  let c = Object.assign(file, {
                      preview: URL.createObjectURL(file),
                  })
                  setImage(c)
                }
            })
        }
    })

    const doUpload = () => {
        if( isEmpty(fields.title) ) {
            enqueueSnackbar('You must enter image title', {variant:"error"})
            return
        }

        setLoading(true)
        let images = {
            title:fields.title,
            description:fields.desc,
            image:image
        }

        props.uploadImages(images)
            .then(va=>{
                setLoading(false)
                setImage(null)
                enqueueSnackbar('Image uploaded', {variant:"info"})
                setTimeout(()=>fetching(),800)
            })
            .catch(err=>{
                setLoading(false)
            })
    }

    const handleChange = (ev) => {
        setFields({
            ...fields,
            [ev.target.name]:ev.target.value
        })
    }

    const setItem = (img) => {
        setPick(img)
        setImage(null)
        setFields({
            title:img.title,
            desc:img.description,
            keyword:img.keyword
        })
    }

    const doExpand = () => {
        setExpanded(true)
    }

    const doCollapse = () => {
        props.doCollapse()
    }

    const insertAdd = () => {
        let data2 = {
            ...pick,
            title:fields.title,
            description:fields.description,
        }
        if( isEmpty(data2) ) {
            enqueueSnackbar('You must select image first', {variant:"error"})
            return
        }
        props.pushItem(data2)
    }

    const startUpload = () => {
        setPick(null)
        setImage(null)
    }
    
    const cancelUpload = () => {
        console.log("Remove")
        setImage(null)
    }

    const sizeInfo = () => {
        if( image ) {
            let a = bytesToSize(image.size)
            return 'Image size:' + Math.round(a[0]) + ' ' + a[1]
        }
        return null
    }
    return (
        <Modal 
            className={classes.modal}
            open={expanded}
            onClose={doCollapse}
            disableBackdropClick={false}
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
                classes:{
                    root:classes.backdrop
                }
            }}
            disableScrollLock={false}
        >
            <Fade in={expanded}>
                <Paper elevation={2} className={classes.paper}>
                    <Grid container direction={"column"}>
                        <Grid item xs sm md lg style={{height:70}}>
                            <div className={classes.paperHeader}>
                                <Grid container direction="row" justify="space-between">
                                    <Grid item sm={6}>
                                        <Typography variant="h5" component="h5">Media Gallery</Typography>
                                    </Grid>
                                    <Grid item sm={3} style={{textAlign:"right"}}>
                                        
                                        {pick && <Button startIcon={<UploadIcon />} variant="outlined" onClick={startUpload} color="primary">
                                            {loading? 'Uploading...' : 'Start Upload'}
                                        </Button>}

                                        {image ? <Button disabled={loading} startIcon={<UploadIcon />} variant="contained" onClick={doUpload} color="primary">
                                            {loading? 'Uploading...' : 'Upload'}
                                        </Button> : (!pick && <Button startIcon={<UploadIcon />} variant="outlined" onClick={()=>open()} color="primary">
                                            Open File
                                        </Button>)}
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>
                        <Grid item xs sm md lg>
                            <Grid container direction="row">
                                <Grid item sm={8}>
                                    <div className={classes.paperList}>
                                        {meta && <Grid container spacing={2} direction="row" justify="space-between">
                                            <Grid item>
                                                Showing {meta.sizeTotal} images
                                            </Grid>
                                            <Grid item>
                                                
                                            </Grid>
                                        </Grid>}
                                        <Grid container spacing={2} direction="row" justify="flex-start">
                                            {!isEmpty(data) && data.map(img=><Grid item sm={4}><Card className={clsx(classes.mediaItem, {
                                                [classes.mediaItemActive]:(pick && pick._id==img._id)
                                            })} onClick={()=>setItem(img)}>
                                                    <CardActionArea>
                                                        <img height={140} src={img.url} alt={img.title} />
                                                    </CardActionArea>
                                                </Card></Grid>
                                            )}
                                        </Grid>
                                    </div>
                                </Grid>
                                <Grid item className={classes.uploader} sm={4}>
                                    {pick ? <div>
                                        {pick.url && <div className={classes.imgWrapper}><img src={pick.url} style={{maxWidth:"100%", maxHeight:200, backgroundSize:"100% auto"}} /></div>}

                                        <div className={classes.upladerFields}>
                                            
                                            <TextField
                                                id="title"
                                                fullWidth
                                                name="title"
                                                inputProps={{
                                                    maxLength:70
                                                }}
                                                label="Image Title"
                                                variant="outlined"
                                                margin="normal"
                                                onChange={handleChange}
                                                value={fields.title}
                                                placeholder="Enter image title"
                                            />

                                            <TextField
                                                id="desc"
                                                fullWidth
                                                multiline
                                                inputProps={{
                                                    rows:3,
                                                    maxLength:100
                                                }}
                                                name="desc"
                                                label="Image Description"
                                                variant="outlined"
                                                margin="normal"
                                                onChange={handleChange}
                                                value={fields.desc}
                                                helperText={()=><p>{fields.desc.length}/100</p>}
                                                placeholder="Enter image description"
                                            />

                                            <TextField 
                                                type={"text"}
                                                label={"URL"}
                                                fullWidth={true}
                                                variant="outlined"
                                                size={"small"}
                                                margin="normal" 
                                                readOnly={true}
                                                color="secondary"
                                                value={pick.url} 
                                                InputProps={{readOnly:true}} 
                                            />
                                            
                                            
                                        </div>

                                    </div> : <>{!image ? (<div {...getRootProps({className:classes.dropzone})}>
                                        <UploadIcon size={"large"} style={{fontSize:60}} />
                                        <input {...getInputProps()} />
                                        
                                        <p>Drag 'n' drop some files here, or <br /> click to select files</p>
                                    </div>) : <div>
                                        {image && <div className={classes.imgWrapper}><img src={image.preview} style={{maxWidth:"100%", maxHeight:200, backgroundSize:"100% auto"}} /></div>}

                                        <div className={classes.upladerFields}>
                                            {sizeInfo() && <Typography variant="caption">{sizeInfo()}</Typography>}
                                            <TextField
                                                id="title"
                                                fullWidth
                                                name="title"
                                                inputProps={{
                                                    maxLength:70
                                                }}
                                                label="Image Title"
                                                variant="outlined"
                                                margin="normal"
                                                onChange={handleChange}
                                                value={fields.title}
                                                placeholder="Enter image title"
                                            />

                                            <TextField
                                                id="desc"
                                                fullWidth
                                                multiline
                                                inputProps={{
                                                    rows:3,
                                                    maxLength:100
                                                }}
                                                name="desc"
                                                label="Image Description"
                                                variant="outlined"
                                                margin="normal"
                                                onChange={handleChange}
                                                value={fields.desc}
                                                helperText={()=><p>{fields.desc.length}/100</p>}
                                                placeholder="Enter image description"
                                            />

                                            <Button onClick={cancelUpload} color="default" variant="outlined">
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>}</>}
                                    
                                </Grid>
                            </Grid>
                            
                        </Grid>
                        <Grid item xs sm md lg>
                            <div className={classes.paperFooter}>
                                <Button disableElevation color="primary" variant="outlined" size="medium" onClick={doCollapse}>
                                    Close
                                </Button>
                                {!props.disableInsert && <Button style={{marginLeft:20}} disableElevation color="primary" variant="contained" size="medium" onClick={insertAdd}>
                                    {props.title ? props.title : 'Insert Editor'}
                                </Button>}
                            </div>
                        </Grid>
                    </Grid>
                </Paper>
            </Fade>
        </Modal>
    ) 
}

MediaGallery.propTypes = {
    expanded: PropTypes.bool.isRequired,
    doCollapse:PropTypes.func,
    pushItem:PropTypes.func.isRequired,
    title:PropTypes.string,
    disableInsert:PropTypes.bool,
};

MediaGallery.defaultProps = {
    doCollapse:null,
    expanded:false,
    pushItem:null,
    disableInsert:false,
    title:''
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { listGallery, uploadImages })(MediaGallery)