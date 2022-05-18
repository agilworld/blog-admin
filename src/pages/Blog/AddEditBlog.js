import React, {  Component, useState, useEffect, useRef  } from 'react';
import clsx from 'clsx';
import { useHistory } from "react-router-dom"
import { connect, useDispatch, useSelector } from "react-redux"
import { makeStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { EditorState, convertFromRaw, convertToRaw, ContentState, AtomicBlockUtils, Modifier, Entity } from 'draft-js'
import GalleryEditor, { Media } from "../../components/Editor/LauncherGallery"
import PaperTitle from "../../components/PaperTitle"
import { useDropzone } from 'react-dropzone'
import { useSnackbar } from "notistack"
import { isEmpty, isNil, kebabCase } from "lodash"
import { addNewArticle, updateArticle, uploadImages } from "../../actions/blog"
import SaveIcon from "@material-ui/icons/Save"
import Editor from "../../components/Editor" 
import draftToHtml from "draftjs-to-html"
import { STATUSES } from "../../actions/types" 


const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    marginBottom:20,
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 440,
  },
  fab:{
    position:"absolute", bottom:20, right:20,
    zIndex:1002
  },
  dropzone:{
    border:"4px dashed #ddd",
    display:"flex",
    height:320,
    marginTop:20,
    padding:15,
    cursor:'pointer',
    textAlign:"center",
    alignItems:"center",
    justifyContent:"center",
    color:"#aaa"
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

const AddEditBlog = (props) => {
  const classes = useStyles()
  const history = useHistory()
 
  const { enqueueSnackbar } = useSnackbar()
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const dispatch = useDispatch()
  const { status } = useSelector( ({notification}) => notification )
  const [preload, setPreload] = useState(false)
  const [fab, setFab] = useState(false)
  const [editorState, setEditorState] = useState(null)
  const [image, setImage] = useState(null)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [heading, setHeading] = useState("Add New Blog")
  const [fields, setFields] = useState({
    title:''
  })

  useEffect(() => {
    setPreload(false)
    if( ! isNil(props.location.state) ) {
      let blog = props.location.state
      setData(blog)
      setHeading(`Edit Blog`)
      setFields({
        title:blog.title
      })
      setPreload(true)
    } else {
      setHeading("Add New Blog")
      setPreload(true)
    }

  }, []);

  useEffect(()=>{
    if( status == STATUSES.SUCCESS ) {
      history.push("/")
    }
  },[status])

  const handleScroll = () => {
    const doc = document
    const main = doc.querySelector("main")
   
    const currentScrollY = main.scrollTop;
    
    if (currentScrollY > 130 ) {
      setFab(true)
    } else {
      setFab(false)
    }
  } 

  useEffect(()=>{
    if( typeof window != "undefined" ) {
      const doc = document
      const main = doc.querySelector("main")
      main.addEventListener("scroll", handleScroll);
    }
  },[])

  const handleChange = (ev) => {
    setFields({
      ...fields,
      [ev.target.name]:ev.target.value
    })
  }

  const onSave = () => {
    let params2 = fields
    params2.content = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    let stripedHtml =  params2.content.replace(/<[^>]+>/g, '');

    if( isEmpty(fields.title) || fields.title.length < 10 ) {
      enqueueSnackbar("Article title is required and must be greater than 20 chars",{variant:"error"})
      return;
    }

    setLoading(true)
   
    if( data ) {
      props.updateArticle(data.id, params2)
        .then(res=>{  
            setLoading(true)
            setTimeout(() => {
              history.push('/')
            }, 1000);
        }).catch(err=>{
          enqueueSnackbar(err?.response?err.response.data?.message:"Error update an article",{variant:"error"})
        }).finally(_=>{
          setLoading(false)
        })

    } else {
      props.addNewArticle(params2)
        .then(res=>{  
          setLoading(false)
        }).catch(err=>{
          enqueueSnackbar(err?.response?err.response.data?.message:"Error add new an article",{variant:"error"})
        }).finally(_=>{
          setLoading(false)
        })
    }
  }

  const onUpdatedEditor = (editState) => {
    setEditorState(editState)
  }

  const mediaBlockRenderer = (block) => {
    if (block.getType() === 'atomic') {
      return {
        component: Media,
        editable: true
      };
    }
  }

  return (<Grid container direaction={"row"} justify="space-between" 
          alignItems={"space-between"} spacing={3}>
          {fab && <Fab className={classes.fab} onClick={()=>onSave()} color="primary" aria-label="add">
            <SaveIcon color={"white"} style={{color:"white"}} />
          </Fab>}
         
          <Grid item sm={6}>
              <Typography variant="h5" gutterBottom component="h5">{heading}</Typography>
              <Button onClick={()=>history.push('/')} variant="outlined" color="primary">Back</Button>
          </Grid>
          <Grid item sm={6} style={{textAlign:'right'}}>
              <Button color="primary" 
                  disabled={loading} 
                  disableElevation size="large" 
                  variant="contained" onClick={()=>onSave()}> 
                    {loading?'Saving...' : 'Save'} 
              </Button>
          </Grid>
          <Grid item xs={12} md={8} lg={12}>
              <Paper elevation={3} className={classes.paper}>
                  <Grid container spacing={3}>
                      <Grid item sm={12}>
                        <TextField
                          required
                          id="title"
                          fullWidth
                          name="title"
                          label="Title"
                          variant="outlined"
                          onChange={handleChange}
                          value={fields.title}
                          inputProps={{
                            maxlength:70
                          }}
                          placeholder="Enter a blog title (Max. 70 Chars)"
                        />
                      </Grid>
                      
                  </Grid>
              </Paper>

              <Paper elevation={3} className={classes.paper}>
                  <PaperTitle title="Content" desc="Make it content blog, support HTML tag" />
                  {preload && <Editor initialEditorState={data?.content} onFinishChange={onUpdatedEditor} />}
              </Paper>

          </Grid>
      </Grid>
  );
}


AddEditBlog.propTypes = {
    //auth: PropTypes.object.isRequired
};
  
const mapStateToProps = state => ({
   // auth: state.auth
});

export default connect(mapStateToProps, { addNewArticle, updateArticle, uploadImages })(AddEditBlog)