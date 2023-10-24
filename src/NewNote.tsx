import NoteFrom from './NoteFrom'
import { NoteData, Tag } from './App'

type NewNoteProps ={
    onSubmit: (data: NoteData) => void
    onAddTag: (tag:Tag) => void
    availableTags: Tag[]
}

const NewNote = ({onSubmit, onAddTag, availableTags}: NewNoteProps) => {
  return (
    <>
        <h1 className="mb-4">New Note</h1>
        <NoteFrom onSubmit={onSubmit} onAddTag={onAddTag} availableTags={availableTags}/>
    </>
  )
}

export default NewNote