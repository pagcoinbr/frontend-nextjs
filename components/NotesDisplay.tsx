interface Note {
  pulsos: number;
  valor: number;
  timestamp: string;
}

interface NotesDisplayProps {
  notes: Note[];
}

export default function NotesDisplay({ notes }: NotesDisplayProps) {
  if (notes.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-3">Notas Escaneadas</h2>
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {notes.map((note, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 transition-all hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">💵</div>
              <div>
                <p className="text-2xl font-bold text-green-700">
                  R$ {note.valor.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(note.timestamp).toLocaleTimeString("pt-BR")}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">{note.pulsos} pulsos</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
