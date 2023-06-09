import { useSelector, useDispatch } from 'react-redux';
import { Box, Drawer, List, ListItemButton, IconButton, Typography, ListItem } from '@mui/material';
import assets from '../../assets/index';
import { Link, useNavigate, useParams } from 'react-router-dom'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import boardApi from '../../apis/boardApi';
import authApi from '../../apis/authApi';
import { useEffect, useState } from 'react';
import { setBoards } from '../../redux/features/boardSlice';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import FavoriteList from './FavoriteList';
import LongMenu from '../common/Notification'
import authUtils from '../../utils/authUtils';

const Sidebar = () => {
    const user = useSelector((state) => state.user.value)
    const boards = useSelector((state) => state.board.value);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { boardId } = useParams();
    const sidebarWidth = 250;
    const [activeIndex, setActiveIndex] = useState(0)
    
    useEffect(() => {
        const getBoards = async () => {
            try {
                const res = await boardApi.getAll();
                dispatch(setBoards(res.data));
            } catch (error) {
                alert(error.message);
            }
        }
        getBoards();
    }, [dispatch])
    useEffect(() => {
        const activeItem = boards.findIndex(e => e._id === boardId)
        if (boards.length > 0 && boardId === undefined ) {
            navigate(`boards/${boards[0]._id}`)
        }
        setActiveIndex(activeItem);
    }, [boards, boardId, navigate])

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            alert(error.message);
        }
        dispatch(setBoards([]));
        localStorage.removeItem('token');
        navigate('/login');
    }

    const onDragEnd = async ({source, destination}) => {
        const newList = [...boards];
        const [removed] = newList.splice(source.index, 1);
        newList.splice(destination?.index,0,removed);

        const activeItem = newList.findIndex(e => e._id === boardId)
        setActiveIndex(activeItem);
        dispatch(setBoards(newList));
        try {
            await boardApi.updatePosition({ boards: newList })
        } catch (error) {
            alert(error.message);
        }
    }
    const addBoard = async () => {
        try {
            const res = await boardApi.create();
            const newList = [res.data, ...boards];
            dispatch(setBoards(newList));
            navigate(`/boards/${res.data._id}`)
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <Drawer
            container={window.document.body}
            variant='permanent'
            open={true}
            sx={{
                width: sidebarWidth,
                height: '100%',
                '& > div' : { borderRight: 'none'}
            }}
        >
            <List
                disablePadding
                sx={{
                    width: sidebarWidth,
                    height: '100vh',
                    backgroundColor: assets.colors.bg
                }}
            >
                <ListItem>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <Typography variant='body2' fontWeight='700'>
                            {user.name}
                            <IconButton onClick={logout}>
                                <LogoutOutlinedIcon fontSize='small' />
                            </IconButton>
                        </Typography>
                        <LongMenu />
                        
                    </Box>
                </ListItem>
                <Box sx={{ paddingTop: '10px'}}/>
                <FavoriteList/>
                <Box sx={{ paddingTop: '10px'}}/>
                <ListItem>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                        <Typography variant='body2' fontWeight='700'>
                            Workspace
                        </Typography>
                        <IconButton onClick={addBoard}>
                            <AddBoxOutlinedIcon fontSize='small' />
                        </IconButton>
                    </Box>
                </ListItem>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable key={'list-board-droppable'} droppableId={'list-board-droppable'}>
                        {(provided) => (
                            <div ref={provided.innerRef} {...provided.droppableProps}>
                                {
                                    boards.map((item, index) => { return(
                                        <Draggable key={item._id} draggableId={item._id} index={index}>
                                            {(provided, snapshot) => (
                                                <ListItemButton ref={provided.innerRef}
                                                    {...provided.dragHandleProps}
                                                    {...provided.draggableProps}
                                                    selected={index === activeIndex}
                                                    component={Link}
                                                    to={`/boards/${item._id}`}
                                                    sx={{
                                                        pl: '20px',
                                                        cursor: snapshot.isDragging ? 'grab' : 'pointer!important'
                                                    }}
                                                >
                                                    <Typography variant='body2' fontWeight='700'
                                                    sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                                    >
                                                        {item.title !== "" ? item.title : "Untitled" }
                                                    </Typography>
                                                </ListItemButton>
                                            )}
                                        </Draggable>
                                    )})
                                }
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </List>
        </Drawer>
    )
}

export default Sidebar;
