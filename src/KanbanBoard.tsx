import { useEffect, useState } from "react"
import { DndContext, closestCenter } from "@dnd-kit/core"
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import Column from "./Column"

type CardType = { id: string; title: string; editing?: boolean }
type ColumnType = { id: string; title: string; cards: CardType[] }

const defaultData: ColumnType[] = [
  { id: "todo", title: "Todo", cards: [{ id: "1", title: "Learn React" }] },
  { id: "progress", title: "In Progress", cards: [{ id: "2", title: "Build Kanban" }] },
  { id: "done", title: "Done", cards: [{ id: "3", title: "Setup Project" }] }
]

export default function KanbanBoard() {
  const [columns, setColumns] = useState<ColumnType[]>(() => {
    const saved = localStorage.getItem("kanban")
    return saved ? JSON.parse(saved) : defaultData
  })

  useEffect(() => {
    localStorage.setItem("kanban", JSON.stringify(columns))
  }, [columns])

  function addCard(columnId: string) {
    setColumns(cols =>
      cols.map(c =>
        c.id === columnId
          ? {
              ...c,
              cards: [
                ...c.cards,
                { id: Date.now().toString(), title: "", editing: true }
              ]
            }
          : c
      )
    )
  }

  function deleteCard(columnId: string, cardId: string) {
    setColumns(cols =>
      cols.map(c =>
        c.id === columnId
          ? { ...c, cards: c.cards.filter(card => card.id !== cardId) }
          : c
      )
    )
  }

  function updateCard(columnId: string, cardId: string, title: string) {
    setColumns(cols =>
      cols.map(c =>
        c.id === columnId
          ? {
              ...c,
              cards: c.cards.map(card =>
                card.id === cardId
                  ? { ...card, title, editing: false }
                  : card
              )
            }
          : c
      )
    )
  }

  function setEditing(columnId: string, cardId: string) {
    setColumns(cols =>
      cols.map(c =>
        c.id === columnId
          ? {
              ...c,
              cards: c.cards.map(card =>
                card.id === cardId ? { ...card, editing: true } : card
              )
            }
          : c
      )
    )
  }

  function onDragEnd(event: any) {
    const { active, over } = event
    if (!over) return

    const fromColumn = columns.find(c => c.cards.some(card => card.id === active.id))
    const toColumn = columns.find(c => c.cards.some(card => card.id === over.id))

    if (!fromColumn || !toColumn) return

    if (fromColumn.id === toColumn.id) {
      const oldIndex = fromColumn.cards.findIndex(c => c.id === active.id)
      const newIndex = toColumn.cards.findIndex(c => c.id === over.id)
      const newCards = arrayMove(fromColumn.cards, oldIndex, newIndex)

      setColumns(cols =>
        cols.map(c =>
          c.id === fromColumn.id ? { ...c, cards: newCards } : c
        )
      )
    } else {
      const activeCard = fromColumn.cards.find(c => c.id === active.id)!
      setColumns(cols =>
        cols.map(c => {
          if (c.id === fromColumn.id)
            return { ...c, cards: c.cards.filter(card => card.id !== active.id) }
          if (c.id === toColumn.id)
            return { ...c, cards: [...c.cards, activeCard] }
          return c
        })
      )
    }
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <div className="board">
        {columns.map(col => (
          <SortableContext
            key={col.id}
            items={col.cards.map(c => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <Column
              column={col}
              addCard={addCard}
              deleteCard={deleteCard}
              updateCard={updateCard}
              setEditing={setEditing}
            />
          </SortableContext>
        ))}
      </div>
    </DndContext>
  )
}
