import { useState, useEffect } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

type CardType = { id: string; title: string; editing?: boolean }

export default function Card({
  card,
  columnId,
  deleteCard,
  updateCard,
  setEditing
}: {
  card: CardType
  columnId: string
  deleteCard: (colId: string, cardId: string) => void
  updateCard: (colId: string, cardId: string, title: string) => void
  setEditing: (colId: string, cardId: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: card.id, disabled: card.editing })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const [text, setText] = useState(card.title)

  useEffect(() => {
    setText(card.title)
  }, [card.title])

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="card"
      {...attributes}
      {...(!card.editing ? listeners : {})}
      onDoubleClick={() => setEditing(columnId, card.id)}
    >
      {card.editing ? (
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onBlur={() => updateCard(columnId, card.id, text || "Untitled")}
          autoFocus
        />
      ) : (
        <div>{card.title || "Untitled"}</div>
      )}

      <button
        onClick={e => {
          e.stopPropagation()
          deleteCard(columnId, card.id)
        }}
      >
        ×
      </button>
    </div>
  )
}
