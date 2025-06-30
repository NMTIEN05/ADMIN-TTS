import React from 'react';

interface DeletedItem {
  id: string;
  name?: string;
  title?: string;
  deletedAt?: string;
}

interface DeletedItemsModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: DeletedItem[];
  entityName: string;
  onRestore: (id: string) => void;
  onForceDelete: (id: string) => void;
  loading?: boolean;
}

export const DeletedItemsModal: React.FC<DeletedItemsModalProps> = ({
  isOpen,
  onClose,
  items,
  entityName,
  onRestore,
  onForceDelete,
  loading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Deleted {entityName}s</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No deleted {entityName.toLowerCase()}s found
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-3 border rounded-lg"
              >
                <div>
                  <span className="font-medium">
                    {item.name || item.title || `${entityName} #${item.id}`}
                  </span>
                  {item.deletedAt && (
                    <div className="text-sm text-gray-500">
                      Deleted: {new Date(item.deletedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onRestore(item.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => onForceDelete(item.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};