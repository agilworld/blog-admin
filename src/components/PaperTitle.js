import React from "react"
import Typography from '@material-ui/core/Typography';

export default function PaperTitle(props) {
    return(
        <div style={{
            padding:10,
            borderBottom:'1px solid #eee'
        }}>
            <Typography variant="h6" component="h6">{props.title}</Typography>
            {props.desc && <Typography style={{color:"#999"}} variant="body2" gutterBottom component="p">{props.desc}</Typography>}
        </div>
    )
}