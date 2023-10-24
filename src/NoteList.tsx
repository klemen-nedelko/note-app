import { useMemo, useState } from "react";
import { Badge, Button, Card, Col, Form, Modal, Row, Stack } from "react-bootstrap"
import { Link } from "react-router-dom"
import ReactSelect from "react-select"
import { Note, Tag } from "./App";
import styles from './NoteList.module.css';

type NoteListProps={
    availableTags: Tag[]
    notes: Note[]
    onDeleteTag: (id:string) => void
    onUpdateTag: (id:string, label:string) => void
}
type SimplifiedNotes = {
    tags: Tag[]
    title: string
    id:string
}
type EditTagsModalProps ={
    show: boolean,
    availableTags: Tag[]
    handleClose: () => void
    onDeleteTag: (id:string) => void
    onUpdateTag: (id:string, label:string) => void
}

const NoteList = ({
                availableTags, 
                notes,
                onDeleteTag, 
                onUpdateTag}
                :NoteListProps) => {

    
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [title, setTitle] = useState("");
    const [editTagsIsOpen, setEditTagsIsOpen] = useState(false)

    const filteredNotes = useMemo(() =>{
        return notes.filter(note =>{
            return(
                (title === "" || note.title.toLowerCase().includes(title.toLowerCase())) &&
                (selectedTags.length === 0 || selectedTags.every(tag => note.tags.some(noteTag => noteTag.id == tag.id)))
            )
        })
    },[notes, selectedTags, title])
  return (
    <>
        <Row className="align-items-center mb-4">
            <Col>
                <h1>Notes</h1>
            </Col>
            <Col xs='auto'>
                <Stack gap={2} direction="horizontal">
                    <Link to="/new">
                        <Button variant="primary">
                            Create
                        </Button>
                    </Link>
                        <Button onClick={() => setEditTagsIsOpen(true)} variant="outline-secondary">
                            Edit Tags
                        </Button>
                </Stack>
            </Col>
        </Row>
        <Form>
            <Row class="mb-4">
                <Col>
                    <Form.Group>
                        <Form.Label>
                            Title
                        </Form.Label>
                        <Form.Control 
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                        />
                    </Form.Group>
                    
                </Col>
                <Col>
                 <Form.Group controlId='tags'>
                        <Form.Label>
                            Tags
                        </Form.Label>
                        <ReactSelect 
                            options={availableTags.map(tag=>{
                                return {label:tag.label, value: tag.id}
                            })}
                            value={selectedTags.map(tag=>{
                                return {label: tag.label, value: tag.id}
                            })} 
                            onChange={tags => {
                                setSelectedTags(tags.map(tag =>{
                                    return {label:tag.label, id:tag.value}
                                }))
                            }}
                            isMulti
                        />
                    </Form.Group>
                    </Col>
            </Row>
        </Form>
        <Row xs={1} sm={2} lg={3} xl={4} className="g-3">
            {
                filteredNotes.map(note=>(
                    <Col key={note.id}>
                        <NoteCard id={note.id} title={note.title} tags={note.tags}/>
                    </Col>
                ))
            }
        </Row>
        <EditTagsModal
            show={editTagsIsOpen} 
            handleClose={()=> setEditTagsIsOpen(!editTagsIsOpen)}
            availableTags={availableTags} 
            onDeleteTag={onDeleteTag} 
            onUpdateTag={onUpdateTag}/>
    </>
  )
}

export default NoteList;

function NoteCard ({id, title, tags}: SimplifiedNotes){
    return <Card as={Link} to={`/${id}`} className={`h-100 text-reset text-decoration-none ${styles.card}`}>
        <Card.Body>
            <Stack gap={2} className="align-items-center justify-content-center h-100">
                <span className="fs-5">{title}</span>
                {tags.length > 0 && (
                    <Stack
                        gap={1} 
                        direction="horizontal"
                        className="justify-content-center flex-wrap"
                    >
                        {tags.map(tag =>(
                            <Badge key={tag.id} className="text-truncates">{tag.label}</Badge>
                        )
                            )}
                    </Stack>
                )}
            </Stack>
        </Card.Body>
    </Card>
}

function EditTagsModal ({availableTags, show, handleClose, onDeleteTag, onUpdateTag}: EditTagsModalProps){
    return <Modal show={show} onHide={handleClose}>
        <Modal.Header>
            <Modal.Title>
                Edit Tags
            </Modal.Title>
                  <Button variant="outline" onClick={handleClose}>&times;</Button>
                          
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Stack gap={2}>
                    {availableTags.map(tag => (
                        <Row key={tag.id}>
                            <Col>
                                <Form.Control 
                                    type="text"
                                    value={tag.label}
                                     onChange={e => onUpdateTag(tag.id, e.target.value)}
                                />
                            </Col>
                            <Col xs="auto">
                                <Button 
                                    variant="outline-danger"
                                    onClick={() => onDeleteTag(tag.id)}
                                >&times;</Button>
                            </Col>
                        </Row>
                    ))}
                </Stack>
            </Form>
        </Modal.Body>
    </Modal>
}