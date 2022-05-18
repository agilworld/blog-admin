import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { STATUSES } from "../actions/types"
import { isString } from "lodash"

const Notifier = () => {
    const dispatch = useDispatch()
    const { status, message } = useSelector( ({notification}) => notification )
    const { enqueueSnackbar } = useSnackbar()

    useEffect(()=>{
        if( status === STATUSES.SUCCESS ) {
            enqueueSnackbar(isString(message)?message:"Success", {variant:"success"})
        }   
    },[status])

    return null
}

export default Notifier