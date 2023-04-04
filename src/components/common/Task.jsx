import { Backdrop, Fade, IconButton, Modal, Box, TextField, Typography, Divider } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import Moment from 'moment'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import taskApi from '../../apis/taskApi'

const modalStyle = {
    outline: 'none',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',
    border: '0px solid #000',
    boxShadow: 24,
    p: 1,
    height: '80%'
}

const Task = props => {
    const boardId = props.boardId
    const [task, setTask] = useState(props.task)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    useEffect(() => {
        setTask(props.task)
        setTitle(props.task !== undefined ? props.task.title : '')
        setDescription(props.task !== undefined ? props.task.description : '')
    }, [props.task])
    
    const onClose = () => {
        props.onUpdate(task);
        props.onClose();
    }
    const deleteTask = async () => {
        try {
            await taskApi.delete(task._id);
            props.onDelete(task);
            setTask(undefined);
        } catch (error) {
            alert(error);
        }
    }

    const updateTitle = async () => {
        
    }

    return (
        <Modal
            open={task !== undefined}
            onClose={onClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{ timeout: 500 }}
        >
            <Fade in={task !== undefined}>
                <Box sx={modalStyle}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        width: '100%'
                    }}>
                        <IconButton variant='outlined' color='error' onClick={deleteTask}>
                            <DeleteOutlinedIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        height: '100%',
                        flexDirection: 'column',
                        padding: '2rem 5rem 5rem'
                    }}>
                        <TextField
                            value={title}
                            onChange={updateTitle}
                            placeholder='Untitled'
                            variant='outlined'
                            fullWidth
                            sx={{
                                width: '100%',
                                '& .MuiOutlinedInput-input': { padding: 0 },
                                '& .MuiOutlinedInput-notchedOutline': { border: 'unset ' },
                                '& .MuiOutlinedInput-root': { fontSize: '2.5rem', fontWeight: '700' },
                                marginBottom: '10px'
                            }}
                        />
                        <Typography variant='body2' fontWeight='700'>
                            {task !== undefined ? Moment(task.createdAt).format('YYYY-MM-DD') : ''}
                        </Typography>
                        <Divider sx={{ margin: '1.5rem 0' }} />
                        <Box
                            // ref={editorWrapperRef}
                            sx={{
                                position: 'relative',
                                height: '80%',
                                overflowX: 'hidden',
                                overflowY: 'auto'
                            }}
                        >
                            <CKEditor
                                editor={ClassicEditor}
                                data={description}
                                // onChange={updateContent}
                                // onFocus={updateEditorHeight}
                                // onBlur={updateEditorHeight}
                            />
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    )
}

export default Task