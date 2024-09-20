import { type EventType, type FormSchema } from '@/types/workflow/form'

/**
 * Hook for using actions of EFK
 * including
 *  1. handler: evaluated function callback for configured widget actions;
 *  2. eventBus: instance methods, which are bound to the exposed `handler`
 *     and can be called via `this` in FormCreator scope
 */
export const useActions = () => {
  const handler = (evt: EventType) => {}

  const eventBus = {
    getFormData: () => {}
  }
}
