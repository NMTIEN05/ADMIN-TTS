export interface SoftDeleteService<T, TInput = Partial<T>> {
  getAll(): Promise<T[]>;
  getDeleted(): Promise<T[]>;
  delete(id: string): Promise<void>;
  restore(id: string): Promise<T>;
  forceDelete(id: string): Promise<void>;
}

export const createSoftDeleteActions = <T>(
  service: SoftDeleteService<T>,
  entityName: string
) => ({
  async handleDelete(id: string, onSuccess?: () => void) {
    try {
      await service.delete(id);
      console.log(`${entityName} deleted successfully`);
      onSuccess?.();
    } catch (error) {
      console.error(`Error deleting ${entityName}:`, error);
      throw error;
    }
  },

  async handleRestore(id: string, onSuccess?: () => void) {
    try {
      await service.restore(id);
      console.log(`${entityName} restored successfully`);
      onSuccess?.();
    } catch (error) {
      console.error(`Error restoring ${entityName}:`, error);
      throw error;
    }
  },

  async getDeletedItems() {
    try {
      return await service.getDeleted();
    } catch (error) {
      console.error(`Error fetching deleted ${entityName}s:`, error);
      return [];
    }
  },

  async handleForceDelete(id: string, onSuccess?: () => void) {
    try {
      await service.forceDelete(id);
      console.log(`${entityName} permanently deleted`);
      onSuccess?.();
    } catch (error) {
      console.error(`Error force deleting ${entityName}:`, error);
      throw error;
    }
  }
});