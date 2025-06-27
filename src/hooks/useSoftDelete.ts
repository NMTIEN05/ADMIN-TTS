import { useState, useCallback } from 'react';
import { createSoftDeleteActions, SoftDeleteService } from '../utils/softDelete.util';

export const useSoftDelete = <T>(
  service: SoftDeleteService<T>,
  entityName: string,
  onRefresh?: () => void
) => {
  const [deletedItems, setDeletedItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDeletedModal, setShowDeletedModal] = useState(false);

  const actions = createSoftDeleteActions(service, entityName);

  const handleDelete = useCallback(async (id: string) => {
    await actions.handleDelete(id, onRefresh);
  }, [actions, onRefresh]);

  const handleRestore = useCallback(async (id: string) => {
    await actions.handleRestore(id, () => {
      onRefresh?.();
      loadDeletedItems();
    });
  }, [actions, onRefresh]);

  const handleForceDelete = useCallback(async (id: string) => {
    await actions.handleForceDelete(id, () => {
      loadDeletedItems();
    });
  }, [actions]);

  const loadDeletedItems = useCallback(async () => {
    setLoading(true);
    try {
      const items = await actions.getDeletedItems();
      setDeletedItems(items);
    } finally {
      setLoading(false);
    }
  }, [actions]);

  const openDeletedModal = useCallback(async () => {
    setShowDeletedModal(true);
    await loadDeletedItems();
  }, [loadDeletedItems]);

  const closeDeletedModal = useCallback(() => {
    setShowDeletedModal(false);
  }, []);

  return {
    deletedItems,
    loading,
    showDeletedModal,
    handleDelete,
    handleRestore,
    handleForceDelete,
    openDeletedModal,
    closeDeletedModal,
    loadDeletedItems
  };
};