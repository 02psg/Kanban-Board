import { useDroppable } from "@dnd-kit/core"
import Card from "./Card"

type CardType = { id: string; title: string; editing?: boolean }
type ColumnType = { id: string; title: string; cards: CardType[] }

export default function Column({
  column,
  addCard,
  deleteCard,
  updateCard,
  setEditing
}: {
  column: ColumnType
  addCard: (id: string) => void
  deleteCard: (colId: string, cardId: string) => void
  updateCard: (colId: string, cardId: string, title: string) => void
  setEditing: (colId: string, cardId: string) => void
}) {
  const { setNodeRef } = useDroppable({ id: column.id })

  return (
    <div ref={setNodeRef} className="column">
      <h2>{column.title}</h2>
      <div className="cards">
        {column.cards.map(card => (
          <Card
            key={card.id}
            card={card}
            columnId={column.id}
            deleteCard={deleteCard}
            updateCard={updateCard}
            setEditing={setEditing}
          />
        ))}
      </div>
      <button className="add-btn" onClick={() => addCard(column.id)}>
        + Add
      </button>
    </div>
  )
}
