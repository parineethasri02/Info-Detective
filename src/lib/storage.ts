import { Investigation, ChecklistItem, Question } from '../types';
import sampleInvestigation from '../data/sampleInvestigation.json';

const STORAGE_KEYS = {
  ACTIVE_INVESTIGATION: 'info_detective_active_inv',
  SAVED_INVESTIGATIONS: 'info_detective_saved_list',
  RECENT_COUNT: 'info_detective_stats_completed',
};

/**
 * Loads the active investigation from LocalStorage, falling back to the sample investigation.
 */
export function getActiveInvestigation(): Investigation {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_INVESTIGATION);
    if (raw) {
      return JSON.parse(raw) as Investigation;
    }
  } catch (err) {
    console.error('Failed to load active investigation from localStorage', err);
  }
  // Initialize with the sample investigation
  const demo = sampleInvestigation as unknown as Investigation;
  saveActiveInvestigation(demo);
  return demo;
}

/**
 * Saves the active investigation to LocalStorage.
 */
export function saveActiveInvestigation(inv: Investigation): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_INVESTIGATION, JSON.stringify(inv));
  } catch (err) {
    console.error('Failed to save active investigation to localStorage', err);
  }
}

/**
 * Retrieves all saved investigations from LocalStorage.
 */
export function getSavedInvestigations(): Investigation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_INVESTIGATIONS);
    if (raw) {
      return JSON.parse(raw) as Investigation[];
    }
  } catch (err) {
    console.error('Failed to load saved investigations from localStorage', err);
  }
  // Return sample investigation as the default in list
  return [sampleInvestigation as unknown as Investigation];
}

/**
 * Saves or updates an investigation in the saved list.
 */
export function saveInvestigationToList(inv: Investigation): void {
  try {
    const list = getSavedInvestigations();
    const existingIndex = list.findIndex((item) => item.id === inv.id);
    if (existingIndex >= 0) {
      list[existingIndex] = { ...inv, updatedAt: new Date().toISOString() };
    } else {
      list.unshift({ ...inv, updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEYS.SAVED_INVESTIGATIONS, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save investigation to list in localStorage', err);
  }
}

/**
 * Toggles a checklist item's completed state.
 */
export function toggleChecklistItem(inv: Investigation, checklistId: string): Investigation {
  const updatedChecklist = inv.checklist.map((item) => {
    if (item.id === checklistId) {
      return { ...item, completed: !item.completed };
    }
    return item;
  });

  const updatedInv: Investigation = {
    ...inv,
    checklist: updatedChecklist,
    updatedAt: new Date().toISOString(),
  };

  saveActiveInvestigation(updatedInv);
  saveInvestigationToList(updatedInv);
  return updatedInv;
}

/**
 * Deletes an investigation by ID from saved list.
 */
export function deleteSavedInvestigation(id: string): Investigation[] {
  try {
    const list = getSavedInvestigations().filter((i) => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.SAVED_INVESTIGATIONS, JSON.stringify(list));
    return list;
  } catch (err) {
    console.error('Failed to delete investigation from localStorage', err);
    return [];
  }
}

/**
 * Resets back to clean demo investigation.
 */
export function resetToDemoInvestigation(): Investigation {
  const demo = sampleInvestigation as unknown as Investigation;
  saveActiveInvestigation(demo);
  saveInvestigationToList(demo);
  return demo;
}
