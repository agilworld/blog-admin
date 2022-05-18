import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useHistory } from "react-router-dom"
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { DataGrid } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Backdrop from '@material-ui/core/Backdrop'
import Modal from '@material-ui/core/Modal'
import Fade from '@material-ui/core/Fade'
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from "@material-ui/icons/Edit"
import DeleteIcon from "@material-ui/icons/DeleteForeverOutlined"
import StarIcon from "@material-ui/icons/Star"
import { listArticle, removeArticle } from "../../actions/blog"
import { isEmpty, filter, map } from "lodash"
import moment from "moment"

const useStyles = makeStyles((theme) => ({
    paper: {
      padding: theme.spacing(2),
      display: 'flex',
     
      flexDirection: 'column',
      marginBottom: theme.spacing(3)
    },
    fixedHeight: {
      
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

const IndexBlog = (props) => {
    const classes = useStyles();
    const history = useHistory()
    const [rows, setRows] = useState(null)
    const [loading, setLoading] = useState(false)
    const [modalDelete, setModalDelete] = useState(null)
    const [params, setParams] = useState({})

    const columns = [
        { 
            field: 'edit', 
            headerName: '#', 
            width: 75,
            renderCell:({row}) => {
                return <>
                    {row.isFeatured && <StarIcon title="Featured" color="secondary" />}
                    <IconButton onClick={()=>history.push(`/blog/edit/${row.id}`, row)}>
                        <EditIcon />
                    </IconButton>
                </>
            },
            height:100
        },
        { 
            field: 'title', 
            headerName: 'Title', 
            width: 950,
            renderCell:({row}) => {
                return <Grid container alignItems="center" directio="row" spacing={1}>
                    <Grid item sm={9} md={9} lg={9} style={{whiteSpace:"normal"}}>
                        <Typography style={{fontWeight:"bold", textDecoration:"none"}} variant="subtitle1">{row.title}</Typography>
                    </Grid>
                </Grid>
            }
        },
       
        { 
            field: 'published_at', 
            headerName: 'Published Date', 
            width: 150,
            valueFormatter: ({value}) => moment(value).format("ll"),
        },
        { 
            field: 'updated_at', 
            headerName: 'Last Updated', 
            width: 150,
            valueFormatter: ({value}) => moment(value).format("ll"),
        },
        { 
            field: 'remove', 
            headerName: 'Action', 
            width: 100,
            renderCell:({row}) => {
                return <IconButton onClick={()=>onModalDelete(row)}>
                    <DeleteIcon />
                </IconButton>
            }
        },
    ];

    useEffect(() => {
        fetchData()
    }, []);

    const fetchData = () => {
        setLoading(true)
        props.listArticle(params)
            .then(res=>{
                setRows(res.map((item)=>({...item})))
                setLoading(false)
            })
    }

    const onModalDelete = (item) => {
        setModalDelete(item)
    }

    const onModalClose = () => {
        setModalDelete(null)   
    }

    const onDelete = () => {
        setLoading(true)
        props.removeArticle(modalDelete.id)
            .then(res=>{
                setModalDelete(null)   
                fetchData()
            })
            .finally(_=>{
                setLoading(false)
            })
    }

    const onPageChange = (param) => {
        
    }

    return (
        <Grid container spacing={3}>
            <Modal 
                className={classes.modal}
                open={modalDelete}
                onClose={onModalClose}
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
               <Fade in={modalDelete}>
                    <Paper elevation={3} style={{padding:50}} className={classes.paper}>
                        <Typography style={{marginBottom:10}} variant="h5">Are you sure to remove this article?</Typography>
                        {modalDelete && <Typography style={{marginBottom:40}} variant="subtitle1">{modalDelete.title}</Typography>}
                        <Grid container direction="row" justify="center" alignItems="center" spacing={2}>
                            <Button disabled={loading} onClick={onDelete} variant="contained" color="primary">
                                {loading ? 'Removing...' : 'Yes, Remove'}
                            </Button>
                            <Button style={{marginLeft:10}} disabled={loading} onClick={onModalClose} variant="outlined" color="primary">
                                Close
                            </Button>
                        </Grid>
                        
                    </Paper>
                </Fade>
            </Modal>
            <Grid item sm md lg xl>
                <Paper elevation={3} className={classes.paper}>
                    <Grid container direction="row" justify="flex-start" spacing={2}>
                        <Grid item  >
                            <Typography variant="h5" component="h5">Blog List</Typography>
                        </Grid>
                        <Grid item sm={6} lg={6}>
                            <Button disableElevation variant="contained" size="medium" color="primary" onClick={()=>history.push("/blog/new")}>
                                Add New Blog
                            </Button>
                            
                        </Grid>
                    </Grid>
                </Paper>

                    {rows && !isEmpty(rows) ? <div style={{ width: '100%' }}>
                        <DataGrid style={{
                            height:'auto!important',
                            
                        }} pageSize={25} onPageChange={onPageChange} loading={loading} autoHeight={true} rowHeight={100} rows={rows} columns={columns} />
                    </div> : <div style={{textAlign:"center"}}>
                        <Typography style={{marginTop:30}}>--No Data--</Typography>
                    </div>}
            </Grid>
        </Grid>
        
    );
}

IndexBlog.propTypes = {
    auth: PropTypes.object.isRequired,
    blog: PropTypes.object.isRequired
};
  
const mapStateToProps = state => ({
    auth: state.auth,
    blog: state.blog.list
});

export default connect(mapStateToProps, {listArticle, removeArticle })(IndexBlog)